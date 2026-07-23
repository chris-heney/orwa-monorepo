/**
 * Booth base price by index.
 * - Index 0 always uses the primary booth price.
 * - Index ≥ 1 uses booth_price_2 only when it is a positive number;
 *   otherwise falls back to the primary booth price (null/0/NaN → reuse).
 */
export const boothBasePrice = (
  conference: {
    booth_price?: number | null;
    booth_price_2?: number | null;
  } | null | undefined,
  boothIndex: number
): number => {
  const primary = Number(conference?.booth_price);
  const primaryPrice = Number.isFinite(primary) ? primary : 0;

  if (boothIndex <= 0) {
    return primaryPrice;
  }

  const secondary = Number(conference?.booth_price_2);
  if (Number.isFinite(secondary) && secondary > 0) {
    return secondary;
  }

  return primaryPrice;
};
