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
  photo?: {
    url?: string;
    formats?: Record<string, { url?: string } | undefined>;
  } | null;
};

/** Strapi returns upload paths relative to the API host. */
const absolute = (url: string): string => {
  if (/^https?:\/\//i.test(url)) return url;
  const endpoint = String(import.meta.env.VITE_API_ENDPOINT || "");
  const origin = endpoint.replace(/\/api\/?$/, "").replace(/\/$/, "");
  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
};

/**
 * Prefer the image uploaded into Strapi; fall back to the orwa.org URL for
 * winners that have not been migrated into the media library yet.
 */
export const winnerImageUrl = (
  record: AwardWinnerRecord | undefined,
  size: "thumbnail" | "full" = "full"
): string | null => {
  if (!record) return null;

  if (size === "thumbnail") {
    const format =
      record.photo?.formats?.thumbnail?.url ||
      record.photo?.formats?.small?.url ||
      record.photo?.formats?.medium?.url;
    if (format) return absolute(format);
    if (record.thumbnail_url) return absolute(record.thumbnail_url);
  }

  if (record.photo?.url) return absolute(record.photo.url);
  if (record.photo_url) return absolute(record.photo_url);
  return record.thumbnail_url ? absolute(record.thumbnail_url) : null;
};
