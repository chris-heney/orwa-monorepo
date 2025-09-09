const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD' // You can change the currency code to match your requirements
})

export default currencyFormatter