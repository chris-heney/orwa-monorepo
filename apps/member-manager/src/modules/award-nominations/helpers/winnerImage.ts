export type WinnerPhoto = {
  id?: number | string;
  url?: string;
  formats?: Record<string, { url?: string } | undefined>;
};

export type AwardWinnerRecord = {
  id?: string | number;
  documentId?: string;
  award_year?: number;
  title?: string;
  recipient?: string | null;
  photo_url?: string | null;
  thumbnail_url?: string | null;
  sort_order?: number | null;
  is_published?: boolean;
  /** Populated upload (raw reads) or a bare upload id (RA-formatted reads). */
  photo?: WinnerPhoto | number | string | null;
  /** Populated nomination (raw reads) or its documentId (RA-formatted reads). */
  award_nomination?:
    | {
        id?: string | number;
        documentId?: string;
        nominee_name?: string | null;
        system_name?: string | null;
        award_type?: string | null;
        watersystem?: { name?: string | null } | null;
      }
    | string
    | number
    | null;
  watersystem?: { id?: string | number; name?: string | null } | string | number | null;
};

/** `AwardWinnerRecord` with the `id` react-admin's record hooks require. */
export type AwardWinnerRow = Omit<AwardWinnerRecord, "id"> & { id: string | number };

/** Strapi returns upload paths relative to the API host. */
const absolute = (url: string): string => {
  if (/^https?:\/\//i.test(url)) return url;
  const endpoint = String(import.meta.env.VITE_API_ENDPOINT || "");
  const origin = endpoint.replace(/\/api\/?$/, "").replace(/\/$/, "");
  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
};

const photoObject = (record: AwardWinnerRecord): WinnerPhoto | null =>
  record.photo && typeof record.photo === "object" ? record.photo : null;

/**
 * Prefer the image uploaded into Strapi; fall back to the orwa.org URL for
 * winners that have not been migrated into the media library yet.
 */
export const winnerImageUrl = (
  record: AwardWinnerRecord | undefined,
  size: "thumbnail" | "full" = "full"
): string | null => {
  if (!record) return null;
  const photo = photoObject(record);

  if (size === "thumbnail") {
    const format =
      photo?.formats?.thumbnail?.url ||
      photo?.formats?.small?.url ||
      photo?.formats?.medium?.url;
    if (format) return absolute(format);
    if (photo?.url) return absolute(photo.url);
    if (record.thumbnail_url) return absolute(record.thumbnail_url);
  }

  if (photo?.url) return absolute(photo.url);
  if (record.photo_url) return absolute(record.photo_url);
  return record.thumbnail_url ? absolute(record.thumbnail_url) : null;
};
