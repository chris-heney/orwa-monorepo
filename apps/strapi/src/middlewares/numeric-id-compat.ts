import type { Core } from '@strapi/strapi';

/**
 * Strapi v4 -> v5 URL + body compatibility.
 *
 * Strapi 5 content API routes address entries by `documentId`, but every
 * pre-migration client (member-manager, grant apps, external integrations)
 * still calls `/api/<plural>/<numericId>`. This middleware transparently
 * rewrites numeric-id detail URLs to the entry's documentId so those clients
 * keep working unchanged. For Draft & Publish types it also pins
 * `status=draft|published` from the resolved row so the returned numeric id
 * matches the one requested (draft/published siblings share a documentId).
 *
 * It also rewrites numeric relation ids inside POST/PUT bodies to documentIds,
 * but only for relations targeting draft-and-publish content types. Strapi 5's
 * relation transform passes raw `{ id: n }` values straight to the db layer,
 * which links only that single row. For D&P targets (which since the migration
 * have BOTH a draft and a published row per document) the correct behavior —
 * which Strapi only applies on the documentId path — is to link both rows.
 * Half-linked relations come back null from document-service reads that
 * default to draft status (e.g. lifecycle hooks), causing 500s and rollbacks.
 *
 * NOTE: must be registered AFTER `strapi::body` so ctx.request.body is parsed.
 */
export default (_config: unknown, { strapi }: { strapi: Core.Strapi }) => {
  let pluralToUid: Record<string, string> | null = null;

  const getPluralMap = () => {
    if (!pluralToUid) {
      pluralToUid = {};
      for (const [uid, contentType] of Object.entries(strapi.contentTypes) as [string, any][]) {
        if (uid.startsWith('api::') && contentType.kind === 'collectionType') {
          pluralToUid[contentType.info.pluralName] = uid;
        }
      }
    }
    return pluralToUid;
  };

  // Per-uid list of relation attributes whose target has draftAndPublish.
  const dpRelationAttrs = new Map<string, { key: string; target: string }[]>();

  const getDpRelationAttrs = (uid: string) => {
    if (!dpRelationAttrs.has(uid)) {
      const attrs: { key: string; target: string }[] = [];
      const contentType = (strapi.contentTypes as any)[uid];
      for (const [key, attr] of Object.entries(contentType?.attributes ?? {}) as [string, any][]) {
        if (attr.type === 'relation' && attr.target) {
          const target = (strapi.contentTypes as any)[attr.target];
          if (target?.options?.draftAndPublish) {
            attrs.push({ key, target: attr.target });
          }
        }
      }
      dpRelationAttrs.set(uid, attrs);
    }
    return dpRelationAttrs.get(uid)!;
  };

  const isNumericId = (value: unknown): boolean =>
    (typeof value === 'number' && Number.isInteger(value) && value > 0) ||
    (typeof value === 'string' && /^\d+$/.test(value));

  const toDocumentId = async (targetUid: string, id: number | string): Promise<string | null> => {
    try {
      const row = await strapi.db
        .query(targetUid as any)
        .findOne({ where: { id: Number(id) }, select: ['documentId'] });
      return row?.documentId ?? null;
    } catch {
      return null;
    }
  };

  /**
   * Rewrite every supported relation value shape:
   *   2 | "2"                  -> "<documentId>"
   *   [2, "3", "<docId>"]      -> ["<documentId>", ...]
   *   { id: 2, ... }           -> { documentId: "...", ... }
   *   { set|connect|disconnect: <any of the above> } -> mapped recursively
   * Unresolvable ids are left as-is so Strapi reports them like before.
   */
  const mapRelationValue = async (targetUid: string, value: any): Promise<any> => {
    if (isNumericId(value)) {
      return (await toDocumentId(targetUid, value)) ?? value;
    }
    if (Array.isArray(value)) {
      return Promise.all(value.map((item) => mapRelationValue(targetUid, item)));
    }
    if (value && typeof value === 'object') {
      if ('id' in value && !('documentId' in value) && isNumericId(value.id)) {
        const documentId = await toDocumentId(targetUid, value.id);
        if (documentId) {
          const { id: _id, ...rest } = value;
          return { ...rest, documentId };
        }
        return value;
      }
      const mapped = { ...value };
      for (const op of ['set', 'connect', 'disconnect'] as const) {
        if (mapped[op] !== undefined && mapped[op] !== null) {
          mapped[op] = await mapRelationValue(targetUid, mapped[op]);
        }
      }
      return mapped;
    }
    return value;
  };

  const rewriteBodyRelations = async (uid: string, data: Record<string, any>) => {
    for (const { key, target } of getDpRelationAttrs(uid)) {
      if (data[key] !== undefined) {
        data[key] = await mapRelationValue(target, data[key]);
      }
    }
  };

  /**
   * Strapi 4 silently stripped unknown body keys; Strapi 5 rejects the whole
   * request with a 400 ("Invalid key <k>"). Legacy clients still send extra
   * keys (e.g. member-manager sends `denial_reason` on grant-payout updates),
   * so restore the v4 behavior by dropping keys not present in the schema.
   */
  const stripUnknownKeys = (uid: string, data: Record<string, any>) => {
    const attributes = (strapi.contentTypes as any)[uid]?.attributes ?? {};
    for (const key of Object.keys(data)) {
      if (!(key in attributes)) {
        delete data[key];
      }
    }
  };

  /**
   * Draft & Publish content types have TWO rows per document (draft + published)
   * with different numeric `id`s but the same `documentId`. Rewriting
   * `/api/foo/7` → `/api/foo/<documentId>` without a `status` makes Strapi's
   * Content API return the published sibling by default — so a request for
   * draft id 7 comes back as published id 17. react-admin's useEditController
   * then throws: "Fetched record's id attribute (17) must match requested id (7)".
   *
   * Pin `status` from the row we resolved so the returned numeric id matches
   * what the client asked for. Leave an explicit caller-supplied status alone.
   */
  const withStatusFromRow = (search: string, publishedAt: unknown): string => {
    const params = new URLSearchParams(
      search.startsWith('?') ? search.slice(1) : search
    );
    if (!params.has('status')) {
      params.set('status', publishedAt ? 'published' : 'draft');
    }
    const qs = params.toString();
    return qs ? `?${qs}` : '';
  };

  return async (ctx: any, next: () => Promise<void>) => {
    const match = ctx.path.match(/^\/api\/([a-z0-9-]+)(?:\/([^/?]+))?(\/.*)?$/i);

    if (match) {
      const [, plural, entryId, rest = ''] = match;
      const uid = getPluralMap()[plural];

      if (uid) {
        // 1) Rewrite numeric detail-route ids to documentIds.
        if (entryId && /^\d+$/.test(entryId)) {
          try {
            const row = await strapi.db
              .query(uid as any)
              .findOne({
                where: { id: Number(entryId) },
                select: ['documentId', 'publishedAt'],
              });

            if (row?.documentId) {
              const search = withStatusFromRow(ctx.search || '', row.publishedAt);
              ctx.url = `/api/${plural}/${row.documentId}${rest}${search}`;
            }
          } catch {
            // Fall through with the original URL; the router will 404 as before.
          }
        }

        // 2) Rewrite numeric relation ids in create/update payloads.
        if (
          (ctx.method === 'POST' || ctx.method === 'PUT') &&
          ctx.request.body &&
          typeof ctx.request.body === 'object' &&
          ctx.request.body.data &&
          typeof ctx.request.body.data === 'object' &&
          !Array.isArray(ctx.request.body.data)
        ) {
          try {
            stripUnknownKeys(uid, ctx.request.body.data);
            await rewriteBodyRelations(uid, ctx.request.body.data);
          } catch {
            // Leave the body untouched; Strapi will validate it as before.
          }
        }
      }
    }

    await next();
  };
};
