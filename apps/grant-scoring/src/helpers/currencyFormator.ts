const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0, // No decimals if not needed
   maximumFractionDigits: 2, // Allow decimals if present
  })
  
  export default currencyFormatter