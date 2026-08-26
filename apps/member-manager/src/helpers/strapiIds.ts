/**
 * Shared Strapi 5 id helpers for member-manager.
 *
 * The data provider remaps record `id` → `documentId` and preserves the
 * numeric PK as `entityId`. Prefer `record.id` in list filters — the data
 * provider rewrites documentId leaves to `filters[rel][documentId]=…`.
 *
 * Use `getRelationFilterId` when you intentionally need a numeric bare
 * `filters[rel]=<n>` value (or when feeding non-filter APIs).
 */

/** Strapi 5 documentId shape (nanoid-like); see serializeStrapiFilters. */
export function isDocumentId(id: unknown): id is string {
  return typeof id === "string" && /^[a-z0-9]{16,64}$/.test(id);
}

/**
 * Numeric DB id for Strapi relation filters / legacy numeric APIs.
 * Prefer `entityId` (preserved numeric PK) over remapped `id`.
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

/**
 * Integer PK for visible ID columns. Same rules as getRelationFilterId —
 * never parseInt(documentId). Routing/CRUD keep using record.id (documentId).
 */
export const getDisplayEntityId = getRelationFilterId;

/**
 * Safe filter value for a relation: numeric entityId, else documentId string.
 * Never returns NaN (the classic parseInt(documentId) footgun).
 */
export function getFilterRelationValue(record: {
  id?: unknown;
  entityId?: unknown;
} | null | undefined): number | string | undefined {
  const numeric = getRelationFilterId(record);
  if (numeric != null) return numeric;
  if (record && isDocumentId(record.id)) return record.id;
  return undefined;
}

/** Keep only numeric status filter values (drop stale documentIds from localStorage). */
export function sanitizeNumericFilterIds(ids: string[]): string[] {
  return ids.filter((id) => /^\d+$/.test(String(id)));
}

/**
 * Scalar to send for a Strapi 5 relation write.
 *
 * withStableId records are fat objects `{ id: documentId, entityId, name, … }`.
 * Putting that object in a PUT/POST body 400s ("Invalid key entityId at <rel>").
 * Prefer documentId; fall back to id when it is already a scalar.
 */
export function toRelationWriteId(
  record:
    | { documentId?: unknown; id?: unknown }
    | string
    | number
    | null
    | undefined
): string | number | undefined {
  if (record == null || record === "") return undefined;
  if (typeof record === "string" || typeof record === "number") return record;
  if (typeof record.documentId === "string" && record.documentId) {
    return record.documentId;
  }
  if (typeof record.id === "string" || typeof record.id === "number") {
    return record.id;
  }
  return undefined;
}

/** oneToMany / manyToMany write value: array of documentIds (or numeric ids). */
export function toRelationWriteIds(value: unknown): Array<string | number> {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => toRelationWriteId(item as { documentId?: unknown; id?: unknown }))
    .filter((id): id is string | number => id != null && id !== "");
}
