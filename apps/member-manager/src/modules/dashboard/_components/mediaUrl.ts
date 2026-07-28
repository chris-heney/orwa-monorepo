/** Resolve a Strapi media field (object or array) to an absolute URL. */
export const mediaUrl = (media: unknown): string | undefined => {
  if (media == null) return undefined;
  const file = Array.isArray(media) ? media[0] : media;
  const url = (file as { url?: string } | null)?.url;
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${import.meta.env.VITE_API_ENDPOINT}${url}`;
};
