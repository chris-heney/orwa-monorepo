/**
 * Strapi 5 media fields accept a file id (or documents-API connect syntax).
 * Conference checkout sometimes posts the FileInput leftover
 * `{ src: "blob:...", title, rawFile: {} }` when the browser upload failed.
 * Passing that object makes the sponsor create throw "Invalid key".
 */
export const toMediaId = (value: unknown): number | string | null => {
  if (value == null || value === "") return null;

  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed || trimmed.startsWith("blob:")) return null;
    if (/^\d+$/.test(trimmed)) return Number(trimmed);
    return trimmed;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const id = toMediaId(item);
      if (id != null) return id;
    }
    return null;
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if ("set" in obj || "connect" in obj || "disconnect" in obj) {
      return value as unknown as string;
    }
    if (obj.id != null) return toMediaId(obj.id);
    if (typeof obj.documentId === "string" && obj.documentId.trim()) {
      return obj.documentId;
    }
  }

  return null;
};
