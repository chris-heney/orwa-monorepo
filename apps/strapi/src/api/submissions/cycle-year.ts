/**
 * Award / scholarship cycle year = the calendar year of the next ORWA Annual
 * Conference. The conference is held in April; nominations and scholarship
 * applications for it are collected from the preceding fall through the
 * January deadline. So: Jan–Apr → this calendar year, May–Dec → next.
 *
 * Keep in sync with `nextConferenceYear.ts` in apps/awards and
 * apps/scholarship-application. The public forms show the same value, but it
 * is display-only there: the submissions controller stores
 * `nextAnnualConferenceYear()` from the server clock and ignores whatever
 * `award_year` / `scholarship_year` the client sent (stale drafts, tampering).
 */

/** First month (0-based) that belongs to the NEXT conference cycle. */
export const CYCLE_ROLLOVER_MONTH = 4; // May

export const nextAnnualConferenceYear = (now: Date = new Date()): number =>
  now.getMonth() >= CYCLE_ROLLOVER_MONTH
    ? now.getFullYear() + 1
    : now.getFullYear();

/**
 * Display helper for email variables (`form-email.ts`): echo a sane year from
 * the payload, else the computed cycle year. NOT used for storage — the
 * controller stamps the authoritative year into the payload before building
 * emails, so for created records this echoes the stored value.
 */
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
