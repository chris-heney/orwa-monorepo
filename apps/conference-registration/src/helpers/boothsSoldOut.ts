/**
 * True when the conference has no booths left to sell. `booths_available`
 * is undefined until the conference query lands — unknown is *not* sold out,
 * otherwise a restored Vendor draft would be wiped before data loads.
 *
 * Sold out hides the *Booths* step — it does not hide the Vendor registration
 * type. Vendor stays on the menu so an organization that already holds a booth
 * can come back and add another rep to that existing registration.
 */
export function boothsSoldOut(
  boothsAvailable: number | null | undefined
): boolean {
  return typeof boothsAvailable === "number" && boothsAvailable <= 0;
}
