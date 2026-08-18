/**
 * Award-balance math for grant applications.
 *
 * Strapi decimal fields serialize as strings ("71715.00"). Using `+` on those
 * concatenates after the first payout (`"0" + "71715.00" + "20280.00"` → NaN).
 * The Applications list used to treat that NaN as a $0 remaining balance and
 * silently mark the application Paid in Full.
 *
 * Administrative payouts are ORWA overhead, not draws against an application's
 * award, even when a row happens to be linked to an application.
 */

export type PayoutLike = {
  amount?: unknown;
  type?: unknown;
  payout_status?: unknown;
  status?: unknown;
};

const REJECTED_PAYOUT_STATUSES = new Set(["Not Approved", "Denied"]);

export const toMoney = (value: unknown): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }
  if (typeof value === "string") {
    const n = parseFloat(value.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

export const payoutStatusName = (payout: PayoutLike): string => {
  const rel = payout.payout_status;
  if (rel && typeof rel === "object" && "name" in rel) {
    return String((rel as { name?: unknown }).name ?? "");
  }
  if (typeof payout.status === "string") return payout.status;
  return "";
};

export const isAdministrativePayout = (payout: PayoutLike): boolean =>
  payout.type === "Administrative";

/** Counts toward the application's remaining award (reimbursements that are not rejected). */
export const isCountableTowardAward = (payout: PayoutLike): boolean => {
  if (isAdministrativePayout(payout)) return false;
  return !REJECTED_PAYOUT_STATUSES.has(payoutStatusName(payout));
};

export const isPaidReimbursement = (payout: PayoutLike): boolean =>
  !isAdministrativePayout(payout) && payoutStatusName(payout) === "Paid";

export const sumPayoutAmounts = (
  payouts: PayoutLike[] | null | undefined,
  predicate: (payout: PayoutLike) => boolean = () => true
): number =>
  (payouts ?? []).reduce((sum, payout) => {
    if (!predicate(payout)) return sum;
    return sum + toMoney(payout.amount);
  }, 0);

/** Remaining award after countable reimbursements. Never returns NaN. */
export const computeBalance = (
  application?: {
    award_amount?: unknown;
    payouts?: PayoutLike[] | null;
  } | null
): number =>
  toMoney(application?.award_amount) -
  sumPayoutAmounts(application?.payouts, isCountableTowardAward);

/**
 * True only when Paid reimbursements cover the award. Admin draws, Requested /
 * Not Approved rows, missing award, and empty payout lists do not qualify.
 */
export const isAwardPaidInFull = (application?: {
  award_amount?: unknown;
  payouts?: PayoutLike[] | null;
} | null): boolean => {
  const award = toMoney(application?.award_amount);
  if (award <= 0) return false;
  const paid = sumPayoutAmounts(application?.payouts, isPaidReimbursement);
  if (paid <= 0) return false;
  return Math.abs(award - paid) < 0.005;
};
