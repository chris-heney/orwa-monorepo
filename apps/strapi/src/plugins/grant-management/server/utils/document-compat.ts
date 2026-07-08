/**
 * Strapi v4 -> v5 compatibility helpers.
 *
 * The Document Service API keys entries by `documentId`, but most of this
 * codebase (and external callers) still passes numeric entity ids around.
 * These helpers resolve a numeric id to its documentId and delegate.
 */

type AnyParams = Record<string, any>;

const docs = (uid: string) => (strapi as any).documents(uid);

const hasDraftAndPublish = (uid: string): boolean =>
  Boolean((strapi as any).contentTypes?.[uid]?.options?.draftAndPublish);

/**
 * v4 entityService.findOne(uid, id, opts) equivalent.
 *
 * For draft-and-publish content types the migration keeps TWO rows per
 * document (draft + published) with different numeric ids, and the Document
 * Service defaults to status "draft" — so looking up a published-row id with
 * the default status silently returns null. Search published first (REST ids
 * that callers hold are usually published rows), then fall back to draft.
 */
export const findOneById = async (uid: string, id: number | string, opts: AnyParams = {}) => {
  if (id === null || id === undefined) return null;
  const params = {
    ...opts,
    filters: { ...(opts.filters ?? {}), id },
  };

  if (!hasDraftAndPublish(uid)) {
    return docs(uid).findFirst(params);
  }

  return (
    (await docs(uid).findFirst({ ...params, status: "published" })) ??
    (await docs(uid).findFirst({ ...params, status: "draft" }))
  );
};

/** Resolve a numeric entity id to its v5 documentId. */
export const resolveDocumentId = async (uid: string, id: number | string): Promise<string | null> => {
  if (id === null || id === undefined) return null;
  const doc = await findOneById(uid, id);
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
