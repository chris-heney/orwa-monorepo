/**
 * True when an id/index selection is present.
 * Treats `0` as selected (cart person index) — do not use truthiness.
 */
export function hasSelectedId(id: unknown): boolean {
  return id !== undefined && id !== null && id !== "";
}
