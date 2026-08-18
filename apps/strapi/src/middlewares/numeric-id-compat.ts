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
 * Fat relation objects (withStableId `{ id, documentId, entityId, name, … }`)
 * are collapsed to documentId before Strapi validates the body. Strapi 5 400s
 * on client-only nested keys ("Invalid key entityId at payout_status").
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

  // Per-uid list of relation attributes (all targets, plus which are D&P).
  const relationAttrs = new Map<
    string,
    { key: string; target: string; draftAndPublish: boolean }[]
  >();

  const getRelationAttrs = (uid: string) => {
    if (!relationAttrs.has(uid)) {
      const attrs: { key: string; target: string; draftAndPublish: boolean }[] = [];
      const contentType = (strapi.contentTypes as any)[uid];
      for (const [key, attr] of Object.entries(contentType?.attributes ?? {}) as [string, any][]) {
        if (attr.type === 'relation' && attr.target) {
          const target = (strapi.contentTypes as any)[attr.target];
          attrs.push({
            key,
            target: attr.target,
            draftAndPublish: Boolean(target?.options?.draftAndPublish),
          });
        }
      }
      relationAttrs.set(uid, attrs);
    }
    return relationAttrs.get(uid)!;
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

  /**
   * withStableId / raw list records are fat `{ id, documentId, entityId, name, … }`.
   * Strapi 5 400s on client-only keys nested in relation values
   * ("Invalid key entityId at payout_status"). Collapse to documentId (or id).
   */
  const collapseFatRelation = (value: any): any => {
    if (value == null || typeof value === 'string' || typeof value === 'number') {
      return value;
    }
    if (Array.isArray(value)) {
      return value.map((item) => collapseFatRelation(item));
    }
    if (typeof value !== 'object') return value;

    if ('set' in value || 'connect' in value || 'disconnect' in value) {
      const mapped: Record<string, any> = { ...value };
      for (const op of ['set', 'connect', 'disconnect'] as const) {
        if (mapped[op] !== undefined && mapped[op] !== null) {
          mapped[op] = collapseFatRelation(mapped[op]);
        }
      }
      return mapped;
    }

    if (typeof value.documentId === 'string' && value.documentId) {
      return value.documentId;
    }
    if (value.id != null && (typeof value.id === 'string' || typeof value.id === 'number')) {
      const extra = Object.keys(value).filter(
        (k) => k !== 'id' && k !== 'documentId' && k !== 'entityId'
      );
      if (extra.length > 0 || 'entityId' in value) {
        return value.id;
      }
    }
    return value;
  };

  const rewriteBodyRelations = async (uid: string, data: Record<string, any>) => {
    for (const { key, target, draftAndPublish } of getRelationAttrs(uid)) {
      if (data[key] === undefined) continue;
      data[key] = collapseFatRelation(data[key]);
      if (draftAndPublish) {
        data[key] = await mapRelationValue(target, data[key]);
      }
    }
  };

  /**
   * Auto timestamps / document ids appear on content-type attributes but
   * Strapi 5 still 400s them on write ("Invalid key createdAt"). Drop them
   * along with unknown keys so EditableDatagrid / legacy clients match v4.
   */
  const NON_WRITABLE_KEYS = new Set([
    "id",
    "documentId",
    "entityId",
    "createdAt",
    "updatedAt",
    "publishedAt",
    "createdBy",
    "updatedBy",
    "locale",
  ]);

  /**
   * Strapi 4 silently stripped unknown body keys; Strapi 5 rejects the whole
   * request with a 400 ("Invalid key <k>"). Legacy clients still send extra
   * keys (e.g. member-manager sends `denial_reason` on grant-payout updates),
   * so restore the v4 behavior by dropping keys not present in the schema.
   */
  const stripUnknownKeys = (uid: string, data: Record<string, any>) => {
    const attributes = (strapi.contentTypes as any)[uid]?.attributes ?? {};
    for (const key of Object.keys(data)) {
      if (NON_WRITABLE_KEYS.has(key) || !(key in attributes)) {
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
