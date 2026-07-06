// Strapi v5 populated relations are flat and include id/documentId.
// Strip them before reusing the record as a form/POST payload, matching the
// old v4 behavior of spreading only `.attributes`.
export const stripStrapiIds = <T extends { id?: unknown; documentId?: unknown }>(
  record: T
): Omit<T, "id" | "documentId"> => {
  const { id: _id, documentId: _documentId, ...rest } = record;
  return rest;
};
