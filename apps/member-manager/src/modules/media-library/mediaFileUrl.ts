/**
 * Build a public URL for a Strapi upload `url` field (usually `/uploads/...`).
 */
export function getPublicFileUrl(relativeOrAbsolute: string): string {
  if (!relativeOrAbsolute) return "";
  if (/^https?:\/\//i.test(relativeOrAbsolute)) return relativeOrAbsolute;
  const apiBase = import.meta.env.VITE_API_ENDPOINT ?? "";
  const origin = apiBase.replace(/\/api\/?$/, "");
  const path = relativeOrAbsolute.startsWith("/")
    ? relativeOrAbsolute
    : `/${relativeOrAbsolute}`;
  return `${origin}${path}`;
}
