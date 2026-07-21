const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD", // You can change the currency code to match your requirements
});

/** Format a money value without ever rendering "$NaN". */
export const formatCurrency = (
  value: number | string | null | undefined
): string => {
  const amount =
    typeof value === "string" && value.trim() !== ""
      ? Number(value)
      : typeof value === "number"
        ? value
        : 0;

  if (!Number.isFinite(amount)) {
    return currencyFormatter.format(0);
  }

  return currencyFormatter.format(amount);
};

export default currencyFormatter;
