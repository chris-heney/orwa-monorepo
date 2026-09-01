import dayjs, { Dayjs } from 'dayjs';

/**
 * The single definition of when a membership ends.
 *
 * This mirrors `getExpirationDate` in member-manager
 * (src/modules/_helpers/getExpirationDate.ts), which is what the UI has always
 * shown in the Renewal column and the Active/Inactive chip. Storing the result
 * on the record lets filters, saved queries and scheduled emails select on the
 * same rule the UI displays, instead of the "paid within the last 12 months"
 * approximation they used to use — the two disagree for anyone who renews
 * early and is owed overlap credit.
 */

/** Treat missing, empty, or unparseable values as "no date" (not today). */
const parsePaymentDate = (
  d: string | Date | null | undefined,
): Dayjs | null => {
  if (d == null || d === '') {
    return null;
  }
  const parsed = dayjs(d);
  return parsed.isValid() ? parsed : null;
};

/**
 * Expiration = last payment + 1 year, plus the days still unused from the
 * previous period when the member renewed early. Returns null when there is no
 * payment history to derive an end from.
 */
export const getMembershipExpiration = (
  previousPayment: string | Date | null | undefined,
  lastPayment: string | Date | null | undefined,
): Dayjs | null => {
  const currentPaymentDate = parsePaymentDate(lastPayment);
  const previousPaymentDate = parsePaymentDate(previousPayment);

  if (!currentPaymentDate) {
    return previousPaymentDate ? previousPaymentDate.add(1, 'year') : null;
  }

  if (!previousPaymentDate) {
    return currentPaymentDate.add(1, 'year');
  }

  const newPaymentEnd = currentPaymentDate.add(1, 'year');
  const previousPeriodEnd = previousPaymentDate.add(1, 'year');

  if (currentPaymentDate.isBefore(previousPeriodEnd)) {
    const overlapDays = previousPeriodEnd.diff(currentPaymentDate, 'day');
    return newPaymentEnd.add(overlapDays, 'day');
  }

  return newPaymentEnd;
};

/** `YYYY-MM-DD` for the stored `expiration_date` column, or null. */
export const getMembershipExpirationDate = (
  previousPayment: string | Date | null | undefined,
  lastPayment: string | Date | null | undefined,
): string | null =>
  getMembershipExpiration(previousPayment, lastPayment)?.format('YYYY-MM-DD') ??
  null;

/** True when the membership has not expired yet. */
export const isMembershipActive = (
  previousPayment: string | Date | null | undefined,
  lastPayment: string | Date | null | undefined,
  now: Date = new Date(),
): boolean => {
  const expiration = getMembershipExpiration(previousPayment, lastPayment);
  return expiration != null && expiration.isAfter(now);
};
