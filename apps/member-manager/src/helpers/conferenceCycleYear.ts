/**
 * Award / scholarship cycle year = the calendar year of the next ORWA Annual
 * Conference. The conference is held in April; nominations and scholarship
 * applications for it are collected from the preceding fall through the
 * January deadline. So: Jan–Apr → this calendar year, May–Dec → next.
 *
 * Mirrors `apps/strapi/src/api/submissions/cycle-year.ts` (the server-side
 * default stamped into `award_year` / `scholarship_year` on public submit) so
 * the Manager's default year is the one new submissions arrive under.
 *
 * This file is the ONLY body of that rule in member-manager. The review-packet
 * barrel (`modules/_components/review-packet`) re-exports `cycleYearOf` /
 * `CYCLE_ROLLOVER_MONTH` from here for the print paths.
 */

/** First month (0-based) that belongs to the NEXT conference cycle (May). */
export const CYCLE_ROLLOVER_MONTH = 4;

const BARE_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Cycle year a submission on `dateLike` files under. Accepts a Date, ISO
 * string or epoch; returns NaN for unparseable input instead of throwing.
 * A bare `YYYY-MM-DD` is read as a local date (not UTC midnight) so the day
 * cannot slip across the May 1 boundary in US time zones.
 */
export const cycleYearOf = (dateLike: Date | string | number): number => {
  const date =
    dateLike instanceof Date
      ? dateLike
      : typeof dateLike === "string" && BARE_DATE.test(dateLike)
        ? new Date(`${dateLike}T00:00:00`)
        : new Date(dateLike);
  const time = date.getTime();
  if (!Number.isFinite(time)) return Number.NaN;
  return date.getMonth() >= CYCLE_ROLLOVER_MONTH
    ? date.getFullYear() + 1
    : date.getFullYear();
};

/**
 * ORWEF scholarships span an academic year: the stored START year
 * (`scholarship_year` = 2027, still an integer everywhere it is stored,
 * filtered or sorted) is displayed as "2027-2028". ORWA Awards are a single
 * conference year and must NOT use this. The only body of that label rule in
 * member-manager; mirrors Strapi `cycle-year.ts` and the public form.
 * Non-integer input is echoed untouched rather than rendering "NaN-NaN".
 */
export const formatScholarshipYear = (start: number | string): string => {
  const text = String(start ?? "").trim();
  const year = Number(text);
  if (!text || !Number.isInteger(year)) return text;
  return `${year}-${year + 1}`;
};

/** Cycle year new submissions arrive under right now. */
export const nextAnnualConferenceYear = (now: Date = new Date()): number =>
  cycleYearOf(now);

const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * Inclusive local-day bounds (`YYYY-MM-DD`) of the submission window that
 * files under cycle `year`: the first day of the rollover month of the prior
 * calendar year through the day before it in `year` (May 1 → Apr 30).
 * The inverse of `cycleYearOf`; feed the strings to the local-day instant
 * helpers in `submittedDateRange.ts` when building a Strapi filter.
 */
export const cycleYearWindow = (
  year: number
): { start: string; end: string } => {
  const start = new Date(year - 1, CYCLE_ROLLOVER_MONTH, 1);
  const end = new Date(year, CYCLE_ROLLOVER_MONTH, 0); // day 0 = last day of prior month
  const day = (d: Date) =>
    `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  return { start: day(start), end: day(end) };
};

/**
 * Year choices for a cycle-year select: All years, the upcoming cycle, the
 * current calendar year, then `lookback` prior years (deduplicated).
 */
export const cycleYearChoices = (
  now: Date = new Date(),
  lookback = 8
): ("all" | number)[] => {
  const current = now.getFullYear();
  const cycle = nextAnnualConferenceYear(now);
  const prior = Array.from({ length: lookback }, (_, i) => current - i);
  const years = [cycle, ...prior.filter((year) => year !== cycle)];
  return ["all", ...years];
};
