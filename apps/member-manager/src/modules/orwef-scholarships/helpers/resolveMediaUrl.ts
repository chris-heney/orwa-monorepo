/** Absolute URL for Strapi media (same pattern as MediaLink). */
export const resolveMediaUrl = (url?: string | null): string | null => {
  if (url == null || url === "") return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const host = (import.meta.env.VITE_API_ENDPOINT || "").replace(/\/api$/, "");
  return `${host}${url.startsWith("/") ? url : `/${url}`}`;
};
