import type { Core } from '@strapi/strapi';

/**
 * Strapi v4 -> v5 URL compatibility.
 *
 * Strapi 5 content API routes address entries by `documentId`, but every
 * pre-migration client (member-manager, grant apps, external integrations)
 * still calls `/api/<plural>/<numericId>`. This middleware transparently
 * rewrites numeric-id detail URLs to the entry's documentId so those clients
 * keep working unchanged.
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

  return async (ctx: any, next: () => Promise<void>) => {
    const match = ctx.path.match(/^\/api\/([a-z0-9-]+)\/(\d+)(\/.*)?$/i);

    if (match) {
      const [, plural, numericId, rest = ''] = match;
      const uid = getPluralMap()[plural];

      if (uid) {
        try {
          const row = await strapi.db
            .query(uid)
            .findOne({ where: { id: Number(numericId) }, select: ['documentId'] });

          if (row?.documentId) {
            const search = ctx.search || '';
            ctx.url = `/api/${plural}/${row.documentId}${rest}${search}`;
          }
        } catch {
          // Fall through with the original URL; the router will 404 as before.
        }
      }
    }

    await next();
  };
};
