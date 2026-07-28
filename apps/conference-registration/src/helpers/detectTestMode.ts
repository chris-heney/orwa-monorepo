/**
 * Presence-only `&test` flag (value ignored), same pattern as `&admin`.
 */
export function detectTestMode(
  search = typeof window !== "undefined" ? window.location.search : ""
): boolean {
  return new URLSearchParams(search).has("test");
}
