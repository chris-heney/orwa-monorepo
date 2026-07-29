
export const formatNumber = (value: number) => {
  const formattedNumber = value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  // Remove ".00" from the end of the string
  const withoutDecimal = formattedNumber.replace(/\.00$/, '')

  return withoutDecimal
}