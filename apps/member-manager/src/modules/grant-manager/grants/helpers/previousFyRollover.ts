import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { IGrantApplication } from "../../grant-application/GrantApplicationTypes";
import { isCountableTowardAward, sumPayoutAmounts } from "../../payouts/helpers/payoutAmounts";

dayjs.extend(utc);

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

/** Fiscal years run July 1 – June 30 and are identified by their starting year. */
export const fiscalYearOf = (date: string | Date): number => {
  const d = dayjs(date.toString()).utc();
  return d.month() >= 6 ? d.year() : d.year() - 1;
};

const isApproved = (app: IGrantApplication) =>
  APPROVED_STATUSES.includes(app.status.name) &&
  !app.status.name.includes("PFY");

/**
 * Grant funds carried into the selected fiscal year from every earlier year:
 *
 *   + allocation that was never awarded (annual grant amount − approved awards)
 *   + funds returned by closed-out applications that under-spent their award
 *
 * Applications are attributed to the fiscal year of their approval (committee)
 * date, matching the rest of the financial reporting. A year that
 * over-committed contributes negatively, so surpluses and deficits chain
 * correctly across years. Awards that are still open but unpaid remain
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
    const date = app.committee_date || app.createdAt;
    if (!date) continue;
    const fy = fiscalYearOf(date);
    if (fy >= selectedFyYear) continue;

    const entry = perFy.get(fy) ?? { approved: 0, closeoutReturns: 0 };
    const award = app.award_amount || 0;
    entry.approved += award;
    if (app.closed_out) {
      const paid = sumPayoutAmounts(app.payouts, isCountableTowardAward);
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
