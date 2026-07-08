/**
 * Strapi 4 silently coerced write-payload primitives to the schema types
 * (boolean -> "false" for string fields, "12" -> 12 for integers, ...) and
 * silently dropped unknown attribute keys. Strapi 5 validates strictly and
 * throws ValidationError ("X must be a `string` type ...", "Invalid key X")
 * instead, which broke several public intake forms that send loosely-typed
 * JSON or spread fetched entities / whole form payloads back into writes.
 *
 * This helper restores the v4 behavior:
 *  - drops system fields (documentId, createdAt, ...) and keys that are not
 *    attributes of the target schema,
 *  - coerces scalar values to the schema type (string/number/boolean),
 *  - normalizes relation/media values (full entity objects -> ids) while
 *    passing through documents-API syntax ({ set / connect / disconnect }),
 *  - coerces scalars inside component values (without stripping component
 *    keys such as `id`, which the admin panel needs to update entries).
 *
 * It mutates `data` in place and returns it. It is applied globally to every
 * api:: create/update via a Document Service middleware (see src/index.ts);
 * custom controllers/services also call it directly for clarity.
 */

const SYSTEM_FIELDS = [
  "id",
  "documentId",
  "createdAt",
  "updatedAt",
  "publishedAt",
  "createdBy",
  "updatedBy",
  "locale",
  "localizations",
];

const STRING_TYPES = ["string", "text", "richtext", "email", "password", "uid"];
const NUMBER_TYPES = ["integer", "biginteger", "float", "decimal"];

type Attribute = {
  type?: string;
  component?: string;
  repeatable?: boolean;
  multiple?: boolean;
};

const coerceScalar = (schemaType: string, value: unknown): unknown => {
  if (typeof value === "object") return value;

  if (STRING_TYPES.includes(schemaType) && typeof value !== "string") {
    return String(value);
  }

  if (NUMBER_TYPES.includes(schemaType) && typeof value !== "number") {
    const numeric = Number(value);
    return Number.isNaN(numeric) ? (value === true ? 1 : 0) : numeric;
  }

  if (schemaType === "boolean" && typeof value !== "boolean") {
    const v = typeof value === "string" ? value.trim().toLowerCase() : value;
    return v === "true" || v === "1" || v === 1 || v === "yes" || v === "on";
  }

  return value;
};

/** Normalize relation/media values: full entity objects -> ids. */
const normalizeRelation = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map((v) => normalizeRelation(v));
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    // Pass through documents-API relation syntax untouched.
    if ("set" in obj || "connect" in obj || "disconnect" in obj) return value;
    if (obj.id !== undefined) return obj.id;
  }
  return value;
};

/** Coerce scalar attrs inside a component entry (keeps unknown keys and id). */
const coerceComponentValue = (componentUid: string, value: unknown): unknown => {
  const attributes = (strapi as any).components?.[componentUid]?.attributes as
    | Record<string, Attribute>
    | undefined;
  if (!attributes) return value;

  const coerceEntry = (entry: unknown) => {
    if (!entry || typeof entry !== "object") return entry;
    const obj = entry as Record<string, unknown>;
    for (const key of Object.keys(obj)) {
      const attr = attributes[key];
      const v = obj[key];
      if (!attr?.type || v === null || v === undefined) continue;
      if (attr.type === "relation" || attr.type === "media") {
        obj[key] = normalizeRelation(v);
      } else {
        obj[key] = coerceScalar(attr.type, v);
      }
    }
    return obj;
  };

  return Array.isArray(value) ? value.map(coerceEntry) : coerceEntry(value);
};

export const coerceToSchema = <T extends Record<string, unknown>>(
  uid: string,
  data: T | undefined | null
): T => {
  if (!data || typeof data !== "object") return data as T;

  const contentType = (strapi as any).contentTypes?.[uid];
  if (!contentType) return data;

  const attributes = contentType.attributes as Record<string, Attribute>;

  for (const key of SYSTEM_FIELDS) {
    if (key in data) delete (data as Record<string, unknown>)[key];
  }

  for (const key of Object.keys(data)) {
    const attribute = attributes[key];

    // Unknown attribute key: v4 dropped these silently, v5 throws "Invalid key".
    if (!attribute) {
      delete (data as Record<string, unknown>)[key];
      continue;
    }

    const value = (data as Record<string, unknown>)[key];
    const schemaType = attribute.type;
    if (value === null || value === undefined || !schemaType) continue;

    if (schemaType === "relation" || schemaType === "media") {
      (data as Record<string, unknown>)[key] = normalizeRelation(value);
    } else if (schemaType === "component" && attribute.component) {
      (data as Record<string, unknown>)[key] = coerceComponentValue(
        attribute.component,
        value
      );
    } else {
      (data as Record<string, unknown>)[key] = coerceScalar(schemaType, value);
    }
  }

  return data;
};
