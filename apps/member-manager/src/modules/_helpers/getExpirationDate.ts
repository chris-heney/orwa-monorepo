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

import dayjs, { Dayjs } from "dayjs";

// Expiration = new payment end (current + 1 year) plus overlap days when they paid early.

/** Treat missing, empty, or unparseable values as "no date" (not `dayjs()` / today). */
const parsePaymentDate = (
  d: string | null | undefined
): Dayjs | null => {
  if (d == null || d === "") {
    return null;
  }
  const parsed = dayjs(d);
  return parsed.isValid() ? parsed : null;
};

/**
 * @param previousPayment - Previous payment date (e.g. 04/08/2024)
 * @param lastPayment - Current payment date (e.g. 02/10/2025)
 * @returns Expiration = lastPayment + 1 year. If current payment was before previous period end, adds those overlap days (e.g. 02/10/2026 + 57 days → 04/08/2026). Invalid dayjs if no valid payment to derive an end from.
 */
const getExpirationDate = (
  previousPayment: string | null | undefined,
  lastPayment: string | null | undefined
) => {
  const currentPaymentDate = parsePaymentDate(lastPayment);
  const previousPaymentDate = parsePaymentDate(previousPayment);

  if (!currentPaymentDate) {
    if (previousPaymentDate) {
      return previousPaymentDate.add(1, "year");
    }
    return dayjs("");
  }

  if (!previousPaymentDate) {
    return currentPaymentDate.add(1, "year");
  }

  const newPaymentEnd = currentPaymentDate.add(1, "year");
  const previousPeriodEnd = previousPaymentDate.add(1, "year");

  if (currentPaymentDate.isBefore(previousPeriodEnd)) {
    const overlapDays = previousPeriodEnd.diff(currentPaymentDate, "day");
    return newPaymentEnd.add(overlapDays, "day");
  }

  return newPaymentEnd;
};

/** True when membership expiration (last payment + overlap rules) is still in the future. */
export const isMembershipActiveByExpiration = (
  paymentPreviousDate: string | null | undefined,
  paymentLastDate: string | null | undefined
): boolean => {
  const expirationDate = getExpirationDate(
    paymentPreviousDate,
    paymentLastDate
  );
  return expirationDate.isValid() && expirationDate.isAfter(new Date());
};

export default getExpirationDate;
