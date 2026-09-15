/**
 * True when the conference has no booths left to sell. `booths_available`
 * is undefined until the conference query lands — unknown is *not* sold out,
 * otherwise a restored Vendor draft would be wiped before data loads.
 */
export function boothsSoldOut(
  boothsAvailable: number | null | undefined
): boolean {
  return typeof boothsAvailable === "number" && boothsAvailable <= 0;
}

/**
 * True when the "Vendor" registration type should be offered.
 *
 * Online/public registrants only get Vendor while booths remain. Kiosk is the
 * on-site add-a-rep-to-an-existing-booth flow (it never sells booths), and a
 * logged-in admin can override sold-out booths, so both keep Vendor.
 */
export function offerVendorRegistration(
  boothsAvailable: number | null | undefined,
  source: string,
  isAdmin: boolean
): boolean {
  if (source === "kiosk") return true;
  if (isAdmin) return true;
  return !boothsSoldOut(boothsAvailable);
}
