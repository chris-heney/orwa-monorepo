/**
 * Server-side "active membership" rule for watersystems.
 *
 * This is the SAME definition the public forms use to filter their
 * watersystem selects (`activeMembershipWatersystemsQuery.ts` in
 * apps/awards and apps/scholarship-application) and that Membership
 * Reporting uses for "Member" / active (`useMembershipMetrics.ts` +
 * `getRollingOneYearAgoForFilters`):
 *
 *   payment_last_date IS NOT NULL AND payment_last_date >= (today - 1 year)
 *
 * Watersystem has no `active` column and no `memberships` collection, so the
 * last payment date within a rolling one-year window is the whole model.
 * Keep this in one place — the public forms' client filter is UX only; the
 * submissions controller is authoritative.
 */

export const WATERSYSTEM_UID = "api::watersystem.watersystem" as const;

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/** YYYY-MM-DD one year before `now`. Recompute per request, never cache. */
export const rollingOneYearAgo = (now = new Date()): string => {
  const cutoff = new Date(now.getTime());
  cutoff.setFullYear(cutoff.getFullYear() - 1);
  return formatDate(cutoff);
};

/**
 * Pure predicate: does this `payment_last_date` (DATE column, YYYY-MM-DD or
 * Date) count as an active membership as of `now`? Mirrors Member Manager's
 * `payment_last_date && payment_last_date >= rollingOneYearAgo`.
 */
export const isActiveMembershipPaymentDate = (
  paymentLastDate: string | Date | null | undefined,
  now = new Date()
): boolean => {
  if (paymentLastDate == null || paymentLastDate === "") return false;
  const asString =
    paymentLastDate instanceof Date
      ? formatDate(paymentLastDate)
      : String(paymentLastDate).slice(0, 10);
  return asString >= rollingOneYearAgo(now);
};

/** `where` fragment equivalent to the public forms' REST filter. */
export const activeMembershipWhere = (now = new Date()) => ({
  payment_last_date: { $notNull: true, $gte: rollingOneYearAgo(now) },
});

export type WatersystemMembershipRow = {
  id: number;
  documentId: string;
  name: string | null;
  county?: string | null;
  payment_last_date: string | null;
};

/**
 * Look up a watersystem by documentId and return it only if it satisfies the
 * active-membership rule (same filter the public selects use). Returns null
 * when the system does not exist OR its membership is not active; callers
 * that need to distinguish should fetch the row first.
 */
export const findActiveMembershipWatersystem = async (
  documentId: string,
  now = new Date()
): Promise<WatersystemMembershipRow | null> => {
  if (!documentId) return null;
  const row = await (strapi as any).db.query(WATERSYSTEM_UID).findOne({
    where: { documentId, ...activeMembershipWhere(now) },
    select: ["id", "documentId", "name", "county", "payment_last_date"],
  });
  return (row as WatersystemMembershipRow | null) ?? null;
};
