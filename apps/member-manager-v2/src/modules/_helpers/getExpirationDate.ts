// import dayjs from 'dayjs'

// const getExpirationDate = (previousPayment: string, lastPayment: string) => {

//   //previous = last payment
//   //last = current payment
//   const paymentLastDate = dayjs(lastPayment)
//   const paymentPreviousDate = previousPayment ? dayjs(previousPayment) : null
//   const daysToAdd = (
//     paymentPreviousDate !== null
//     && paymentPreviousDate !== undefined && paymentPreviousDate.add(1, 'year').isAfter(lastPayment)
//      && !paymentPreviousDate.isSame(lastPayment)
//       &&  dayjs(paymentPreviousDate).diff(dayjs(paymentLastDate).subtract(1, 'year'), 'day') < 31
//   )
//     ? dayjs(paymentPreviousDate).diff(dayjs(paymentLastDate).subtract(1, 'year'), 'day')
//     : 0

//   return daysToAdd > 0
//     ? paymentLastDate.add(1, 'year').add(daysToAdd, 'day')
//     : paymentLastDate.add(1, 'year')
// }

// export default getExpirationDate

// Previous Logic ^^^

//  New logic

import dayjs from "dayjs";

const getExpirationDate = (previousPayment: string, lastPayment: string) => {
  const paymentLastDate = dayjs(lastPayment);
  const paymentPreviousDate = previousPayment ? dayjs(previousPayment) : null;

  if (!paymentPreviousDate) {
    // If no previous payment, simply add 1 year to the last payment
    return paymentLastDate.add(1, "year");
  }

  // Calculate 1-year expiration for the previous payment
  const previousExpiration = paymentPreviousDate.add(1, "year");

  if (!paymentLastDate.isValid()) {
    return previousExpiration;
  }

  if (paymentLastDate.isBefore(previousExpiration)) {
    // Calculate remaining days from the current payment date to the previous expiration
    const remainingDays = previousExpiration.diff(paymentLastDate, "day");

    // Add 1 year to the current payment date + remaining days
    return paymentLastDate.add(1, "year").add(remainingDays, "day");
  }
  
  // If no overlap, simply add 1 year to the current payment date
  return paymentLastDate.add(1, "year");
};

export default getExpirationDate;
