/**
 * Award cycle year = calendar year of the next ORWA Annual Conference. The
 * conference is held in April; nominations for it are collected from the
 * preceding fall through the January deadline. So: Jan–Apr → this calendar
 * year, May–Dec → next.
 *
 * Keep in sync with apps/scholarship-application `helpers/nextConferenceYear.ts`
 * and Strapi `api/submissions/cycle-year.ts` (server-side default for
 * `award_year`).
 */
export const CYCLE_ROLLOVER_MONTH = 4; // May (0-based)

export const nextConferenceYear = (now: Date = new Date()): number =>
  now.getMonth() >= CYCLE_ROLLOVER_MONTH
    ? now.getFullYear() + 1
    : now.getFullYear();
