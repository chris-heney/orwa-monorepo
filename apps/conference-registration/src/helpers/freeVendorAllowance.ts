/**
 * Booth-bundled complimentary Vendor tickets.
 * 1 booth → 2 free; 2+ booths → 3 free; otherwise none.
 */
export const freeVendorAllowance = (boothCount: number): number => {
  if (boothCount === 1) return 2;
  if (boothCount >= 2) return 3;
  return 0;
};

export const vendorOrdinalAtIndex = (
  tickets: { type?: string }[],
  absoluteIndex: number
): number => {
  let ordinal = 0;
  for (let i = 0; i < absoluteIndex && i < tickets.length; i++) {
    if (tickets[i]?.type === "Vendor") ordinal += 1;
  }
  return ordinal;
};
