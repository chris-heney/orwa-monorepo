export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Member Status filter values, shared by the watersystem and associate
 * sidebars so both tabs mean the same thing by "Member".
 *
 * These select on the stored `expiration_date` — the same rule
 * `isMembershipActiveByExpiration` uses for the Active/Inactive chip — rather
 * than the old "paid within the last 12 months" approximation, which
 * disagreed with the chip for anyone owed early-renewal overlap credit.
 *
 * The `$now` tokens are expanded server-side on every request (see
 * apps/strapi/src/utils/relative-dates.ts). Storing the token rather than a
 * concrete date is what lets a saved query keep meaning "expiring within a
 * month" instead of freezing on the day it was saved.
 */
export const MEMBER_STATUS_FILTERS = {
  member: { expiration_date: { $gte: '$now' } },
  nonMember: {
    $or: [
      { expiration_date: { $lt: '$now' } },
      { expiration_date: { $null: true } },
    ],
  },
  expiringWithinAMonth: {
    expiration_date: { $between: ['$now', '$now+1M'] },
  },
} as const;
