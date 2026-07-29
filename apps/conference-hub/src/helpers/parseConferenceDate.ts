/**
 * Parse conference API dates as calendar days in the user's local timezone.
 *
 * `new Date("2026-04-22")` and ISO midnight Z are interpreted as UTC, so
 * `toLocaleString` in US timezones shows the previous calendar day. Strapi
 * date / datetime fields for conferences represent an all-day date, not an
 * instant — use local year/month/day instead.
 */
export function parseConferenceDate(value: string): Date {
  if (!value?.trim()) return new Date(NaN);
  const trimmed = value.trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
  if (m) {
    const y = parseInt(m[1], 10);
    const month = parseInt(m[2], 10);
    const d = parseInt(m[3], 10);
    return new Date(y, month - 1, d);
  }
  return new Date(trimmed);
}
