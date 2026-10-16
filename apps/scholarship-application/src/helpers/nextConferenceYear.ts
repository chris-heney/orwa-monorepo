/**
 * Scholarship cycle year = calendar year of the next ORWA Annual Conference.
 * The conference is held in April; applications for it are collected from the
 * preceding fall through the winter deadline. So: Jan–Apr → this calendar
 * year, May–Dec → next.
 *
 * Keep in sync with apps/awards `helpers/nextConferenceYear.ts` and Strapi
 * `api/submissions/cycle-year.ts` (server-side default for `scholarship_year`).
 */
export const CYCLE_ROLLOVER_MONTH = 4; // May (0-based)

export const nextConferenceYear = (now: Date = new Date()): number =>
  now.getMonth() >= CYCLE_ROLLOVER_MONTH
    ? now.getFullYear() + 1
    : now.getFullYear();

/**
 * ORWEF scholarships span an academic year: the stored START year
 * (`scholarship_year` = 2027, still an integer in the payload) is displayed
 * as "2027-2028" everywhere — Eligibility box, success screen, emailed PDF.
 * Mirrors `formatScholarshipYear` in Strapi `cycle-year.ts` and member-manager
 * `conferenceCycleYear.ts`. Non-integer input is echoed rather than "NaN-NaN".
 */
export const formatScholarshipYear = (start: number | string): string => {
  const text = String(start ?? "").trim();
  const year = Number(text);
  if (!text || !Number.isInteger(year)) return text;
  return `${year}-${year + 1}`;
};
