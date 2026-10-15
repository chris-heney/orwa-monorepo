/**
 * Award / scholarship cycle year = the calendar year of the next ORWA Annual
 * Conference. The conference is held in April; nominations and scholarship
 * applications for it are collected from the preceding fall through the
 * January deadline. So: Jan–Apr → this calendar year, May–Dec → next.
 *
 * Keep in sync with `nextConferenceYear.ts` in apps/awards and
 * apps/scholarship-application (the public forms stamp the same value into
 * `award_year` / `scholarship_year`; this is the server-side default when a
 * client omits it).
 */

/** First month (0-based) that belongs to the NEXT conference cycle. */
export const CYCLE_ROLLOVER_MONTH = 4; // May

export const nextAnnualConferenceYear = (now: Date = new Date()): number =>
  now.getMonth() >= CYCLE_ROLLOVER_MONTH
    ? now.getFullYear() + 1
    : now.getFullYear();

/** Coerce a client-sent year; fall back to the computed cycle year. */
export const resolveCycleYear = (
  raw: unknown,
  now: Date = new Date()
): number => {
  if (raw != null && raw !== "") {
    const numeric = Number(raw);
    if (Number.isInteger(numeric) && numeric >= 2000 && numeric <= 2100) {
      return numeric;
    }
  }
  return nextAnnualConferenceYear(now);
};
