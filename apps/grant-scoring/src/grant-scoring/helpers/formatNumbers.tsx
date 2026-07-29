
export const CurrencyOptions = {
    style: 'currency',
    currency: 'USD',
}

export const formatNumber = (value: number) => {
  const formattedNumber = value.toLocaleString('en-US', CurrencyOptions as any)

  // Remove ".00" from the end of the string
  const withoutDecimal = formattedNumber.replace(/\.00$/, '')

  return withoutDecimal
}