const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD", // You can change the currency code to match your requirements
});

const toAmount = (
  value: number | string | null | undefined
): number => {
  const amount =
    typeof value === "string" && value.trim() !== ""
      ? Number(value)
      : typeof value === "number"
        ? value
        : 0;

  return Number.isFinite(amount) ? amount : 0;
};

/** Format a money value without ever rendering "$NaN". */
export const formatCurrency = (
  value: number | string | null | undefined
): string => {
  return currencyFormatter.format(toAmount(value));
};

/**
 * Line-item display: free / null amounts read as "Included" instead of "$0.00".
 * Use for extras and included ticket lines — not cart/step subtotals.
 */
export const formatMoneyOrIncluded = (
  value: number | string | null | undefined
): string => {
  const amount = toAmount(value);
  if (amount === 0) return "Included";
  return currencyFormatter.format(amount);
};

export default currencyFormatter;
