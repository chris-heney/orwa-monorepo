// Currency formatting options
export const CurrencyOptions: Intl.NumberFormatOptions = {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
}

// Format number as currency
export const formatNumber = (value: number | null): string => {
  if (value === null || isNaN(value)) {
    return '' // Return an empty string if value is null or invalid
  }

  const formattedNumber = value.toLocaleString('en-US', CurrencyOptions)

  // Remove ".00" from the end of the string if it's a whole number
  return formattedNumber.replace(/\.00$/, '')
}

// Capitalize the first letter of each word in a string
export const tocapitalize = (str: string): string => {
  if (!str) return '' // Handle null or undefined strings
  return str.replace(/\b\w/g, (l) => l.toUpperCase())
}