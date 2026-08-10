/**
 * Numeric DB id for Strapi relation filters.
 *
 * The member-manager data provider remaps record `id` to Strapi 5's
 * `documentId`. Bare `filters[relation]=<documentId>` returns 0 rows;
 * `filters[relation]=<numericId>` (and `filters[relation][id]=…`) work.
 * Prefer `entityId` (preserved numeric PK) for list filters.
 */
export function getRelationFilterId(record: {
  id?: unknown;
  entityId?: unknown;
} | null | undefined): number | undefined {
  if (!record) return undefined;
  const entity = record.entityId;
  if (typeof entity === "number" && !Number.isNaN(entity)) return entity;
  if (typeof entity === "string" && /^\d+$/.test(entity)) {
    return parseInt(entity, 10);
  }
  const id = record.id;
  if (typeof id === "number" && !Number.isNaN(id)) return id;
  if (typeof id === "string" && /^\d+$/.test(id)) return parseInt(id, 10);
  return undefined;
}

/** Keep only numeric status filter values (drop stale documentIds from localStorage). */
export function sanitizeNumericFilterIds(ids: string[]): string[] {
  return ids.filter((id) => /^\d+$/.test(String(id)));
}
