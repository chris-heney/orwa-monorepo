export const formatCurrency = (value: number) => {

    if (value === null) {
      return ''
    }
    const formattedNumber = value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })
  
    // Remove ".00" from the end of the string
    const withoutDecimal = formattedNumber.replace(/\.00$/, '')
  
    return withoutDecimal
  }

// format a number 10000 to 10k always round up to the nearest whole number

export const formatNumberCompact = (value: number) => {
    if (value === null) return 0
    if (value >= 1e6) {
      return (value / 1e6).toFixed(1) + 'M'
    } else if (value >= 1e3) {
      return (value / 1e3).toFixed(1) + 'K'
    }
    return value.toString()
  }
  