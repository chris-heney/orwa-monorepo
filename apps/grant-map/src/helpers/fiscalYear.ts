import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import IGrantApplication from "../types/IGrantApplication";

dayjs.extend(utc);

/**
 * Fiscal-year attribution, ported from member-manager
 * grant-manager/grants/helpers/previousFyRollover.ts so both apps report the
 * same numbers.
 */

/** Statuses that count as "the committee committed money to this application". */
export const APPROVED_STATUSES = [
  "Grant Agreement Signed/Sealed/Returned",
  "Paid in Full",
  "Revised per COR",
  "Authorized by DEQ",
  "Authorized by ORWA",
  "Committee Approved",
  "Award Letter Sent",
];

export const isPfy = (app: IGrantApplication) =>
  app.status?.name?.includes("PFY") ?? false;

export const isApproved = (app: IGrantApplication) =>
  !isPfy(app) && APPROVED_STATUSES.includes(app.status?.name ?? "");

/** Fiscal years run July 1 – June 30 and are identified by their starting year. */
export const fiscalYearOf = (date: string | Date): number => {
  const d = dayjs(date.toString()).utc();
  return d.month() >= 6 ? d.year() : d.year() - 1;
};

/**
 * Financial reporting attributes an application to the fiscal year of its
 * committee approval date; applications not yet decided fall back to the
 * fiscal year they were submitted.
 */
export const fiscalYearOfApplication = (
  app: IGrantApplication
): number | null => {
  const date = app.committee_date || app.application_date;
  return date != null ? fiscalYearOf(date) : null;
};

export const fyLabel = (fy: number): string =>
  `FY ${fy}–${String(fy + 1).slice(2)}`;

/**
 * Grant funds carried into the selected fiscal year from every earlier year:
 *
 *   + allocation that was never awarded (annual grant amount − approved awards)
 *   + funds returned by closed-out applications that under-spent their award
 *
 * A year that over-committed contributes negatively, so surpluses and
 * deficits chain correctly across years. Open-but-unpaid awards remain
 * committed and are NOT treated as rollover.
 */
export const computePreviousFyRollover = (
  applications: IGrantApplication[],
  annualGrantAmount: number,
  selectedFyYear: number
): number => {
  const perFy = new Map<number, { approved: number; closeoutReturns: number }>();

  for (const app of applications) {
    if (!isApproved(app)) continue;
    const date = app.committee_date;
    if (!date) continue;
    const fy = fiscalYearOf(date);
    if (fy >= selectedFyYear) continue;

    const entry = perFy.get(fy) ?? { approved: 0, closeoutReturns: 0 };
    const award = app.award_amount || 0;
    entry.approved += award;
    if (app.closed_out) {
      const paid = (app.payouts ?? []).reduce(
        (sum, payout) => sum + (payout.amount || 0),
        0
      );
      entry.closeoutReturns += award - paid;
    }
    perFy.set(fy, entry);
  }

  let rollover = 0;
  for (const { approved, closeoutReturns } of perFy.values()) {
    rollover += annualGrantAmount - approved + closeoutReturns;
  }
  return rollover;
};
