/**
 * Strapi v4 -> v5 compatibility helpers.
 *
 * The Document Service API keys entries by `documentId`, but most of this
 * codebase (and external callers) still passes numeric entity ids around.
 * These helpers resolve a numeric id to its documentId and delegate.
 */

type AnyParams = Record<string, any>;

const docs = (uid: string) => (strapi as any).documents(uid);

/** v4 entityService.findOne(uid, id, opts) equivalent. */
export const findOneById = async (uid: string, id: number | string, opts: AnyParams = {}) => {
  if (id === null || id === undefined) return null;
  return docs(uid).findFirst({
    ...opts,
    filters: { ...(opts.filters ?? {}), id },
  });
};

/** Resolve a numeric entity id to its v5 documentId. */
export const resolveDocumentId = async (uid: string, id: number | string): Promise<string | null> => {
  if (id === null || id === undefined) return null;
  const doc = await docs(uid).findFirst({ filters: { id } });
  return doc?.documentId ?? null;
};

/** v4 entityService.update(uid, id, { data, ...opts }) equivalent. */
export const updateById = async (uid: string, id: number | string, params: AnyParams = {}) => {
  const documentId = await resolveDocumentId(uid, id);
  if (!documentId) return null;
  return docs(uid).update({ ...params, documentId });
};

/** v4 entityService.delete(uid, id) equivalent. */
export const deleteById = async (uid: string, id: number | string) => {
  const documentId = await resolveDocumentId(uid, id);
  if (!documentId) return null;
  return docs(uid).delete({ documentId });
};
