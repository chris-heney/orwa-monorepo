const validCardNumber = (cardNumber: string): boolean  => {
  // Remove any non-digit characters
  const cleanedCardNumber = cardNumber.replace(/\D/g, '')

  // Check if the card number is empty or not a string of digits
  if (!cleanedCardNumber || !/^\d+$/.test(cleanedCardNumber)) {
      return false
  }

  let sum = 0
  let isSecondDigit = false

  // Iterate over each digit of the card number from right to left
  for (let i = cleanedCardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanedCardNumber.charAt(i), 10)

      // Double every second digit
      if (isSecondDigit) {
          digit *= 2
          if (digit > 9) {
              digit -= 9
          }
      }

      // Add the digit to the sum
      sum += digit

      // Toggle flag for next digit
      isSecondDigit = !isSecondDigit
  }

  // The card number is valid if the sum is a multiple of 10
  return sum % 10 === 0
}

export default validCardNumber