/**
 * Strapi 5 write-body sanitizer.
 *
 * Reads go through withStableId, which stamps `entityId` onto every nested
 * content-type row. Sending that fat object back as a relation value 400s
 * ("Invalid key entityId at <relation>").
 *
 * Shape rules (must match formatResponseRA on the read path):
 *
 * - Content-type relations (oneToOne / manyToOne) carry `documentId`.
 *   Collapse the object to that documentId string.
 * - oneToMany / manyToMany are arrays of those rows → array of documentIds.
 * - Media entries have mime/url/formats. Keep the numeric upload id.
 * - Components / repeaters / dynamic zones do NOT have `documentId`.
 *   Keep them as objects. Preserve component instance `id` (Strapi uses it
 *   to update vs create). Recurse so nested relations inside a repeater
 *   still collapse.
 * - `{ set | connect | disconnect }` operator objects are left as operators;
 *   their contents are sanitized recursively.
 */

import dayjs from "dayjs";

const TOP_LEVEL_SYSTEM_FIELDS = new Set([
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

/** Stripped from component/JSON objects. `id` is kept (component instance PK). */
const NESTED_SYSTEM_FIELDS = new Set([
  "entityId",
  "documentId",
  "createdAt",
  "updatedAt",
  "publishedAt",
  "createdBy",
  "updatedBy",
  "locale",
]);

const RELATION_OPS = ["set", "connect", "disconnect"] as const;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  value != null && typeof value === "object" && !Array.isArray(value);

const isMediaRecord = (obj: Record<string, unknown>): boolean =>
  obj.mime != null || obj.url != null || obj.formats != null;

/** Populated content-type row (not media, not a dynamic-zone component). */
const isContentTypeRelation = (obj: Record<string, unknown>): boolean =>
  typeof obj.documentId === "string" &&
  obj.documentId.length > 0 &&
  !isMediaRecord(obj) &&
  obj.__component == null;

const isRelationOperator = (obj: Record<string, unknown>): boolean => {
  const keys = Object.keys(obj);
  if (keys.length === 0) return false;
  return keys.every((k) =>
    RELATION_OPS.includes(k as (typeof RELATION_OPS)[number])
  );
};

const mediaNumericId = (obj: Record<string, unknown>): unknown => {
  const id = obj.id;
  if (typeof id === "number") return id;
  if (typeof id === "string" && /^\d+$/.test(id)) return parseInt(id, 10);
  return id;
};

export const sanitizeWriteValue = (value: unknown): unknown => {
  if (value === "") return null;
  if (value == null) return value;
  if (typeof value !== "object") return value;

  // Date must be handled before any object branch: react-hook-form submits
  // untouched `defaultValue={new Date()}` as a raw Date, which the component
  // branch would collapse to {} (Object.entries(Date) is empty) → Strapi 400
  // "Invalid format, expected yyyy-MM-dd".
  //
  // Use LOCAL time parts WITHOUT a Z/offset — never toISOString(). Strapi
  // truncates a Z-suffixed value to the UTC date, so an evening save (UTC-5)
  // would silently land on the NEXT calendar day. A no-offset string keeps
  // the local date part on any server timezone (probed against Strapi:
  // "…T23:30:00.000" → 2026-08-18, "…T04:30:00.000Z" → 2026-08-19).
  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? null
      : dayjs(value).format("YYYY-MM-DDTHH:mm:ss.SSS");
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeWriteValue(item));
  }

  const obj = value as Record<string, unknown>;

  if (isRelationOperator(obj)) {
    const out: Record<string, unknown> = {};
    for (const op of RELATION_OPS) {
      if (obj[op] !== undefined) {
        out[op] = sanitizeWriteValue(obj[op]);
      }
    }
    return out;
  }

  if (isMediaRecord(obj)) {
    return mediaNumericId(obj);
  }

  if (isContentTypeRelation(obj)) {
    return obj.documentId;
  }

  // withStableId leftover that lost documentId: `{ id, entityId }` is a
  // content-type row, not a repeater. A bare `{ id }` is a component
  // instance PK and must stay an object so Strapi updates that row.
  const keys = Object.keys(obj);
  if (
    obj.entityId != null &&
    obj.id != null &&
    keys.every((k) => k === "id" || k === "entityId" || k === "documentId")
  ) {
    return obj.documentId ?? obj.id;
  }

  // Component, repeater item, dynamic zone, or JSON blob.
  const out: Record<string, unknown> = {};
  for (const [key, nested] of Object.entries(obj)) {
    if (NESTED_SYSTEM_FIELDS.has(key)) continue;
    out[key] = sanitizeWriteValue(nested);
  }
  return out;
};

/** Top-level record body for POST/PUT `data`. */
export const sanitizeStrapiWritePayload = (
  record: Record<string, unknown>
): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    if (TOP_LEVEL_SYSTEM_FIELDS.has(key)) continue;
    out[key] = sanitizeWriteValue(value === "" ? null : value);
  }
  return out;
};
