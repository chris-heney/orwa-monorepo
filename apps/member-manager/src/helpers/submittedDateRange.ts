/**
 * "Submitted from / to" list filter on a Strapi `datetime` attribute.
 *
 * The drawer inputs are `<input type="date">` values (`YYYY-MM-DD`). Records
 * store the submit instant in UTC, and the grid's `DateField` renders it in
 * the browser's local zone — so the range is interpreted as LOCAL calendar
 * days (start of `from` … end of `to`) and converted to ISO instants, which
 * the data provider serialises to `filters[<field>][$gte]` / `[$lte]`.
 */

export interface SubmittedDateRange {
  from?: string | null;
  to?: string | null;
}

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

const isDateOnly = (value: unknown): value is string =>
  typeof value === "string" && DATE_ONLY.test(value);

/** Local midnight at the start of a `YYYY-MM-DD` day, as an ISO instant. */
export const localDayStartIso = (day: string): string =>
  new Date(`${day}T00:00:00`).toISOString();

/** Last millisecond of a `YYYY-MM-DD` local day, as an ISO instant. */
export const localDayEndIso = (day: string): string =>
  new Date(`${day}T23:59:59.999`).toISOString();

export const hasSubmittedDateRange = (range: SubmittedDateRange | undefined): boolean =>
  Boolean(range && (isDateOnly(range.from) || isDateOnly(range.to)));

/**
 * `{ $gte, $lte }` operators for the range (either bound optional). Blank or
 * malformed bounds are ignored; a reversed range is swapped so staff never get
 * an empty list from typing the dates in the wrong order.
 */
export const submittedDateRangeOperators = (
  range: SubmittedDateRange | undefined
): Record<string, string> => {
  if (!range) return {};
  let from = isDateOnly(range.from) ? range.from : undefined;
  let to = isDateOnly(range.to) ? range.to : undefined;
  if (from && to && from > to) [from, to] = [to, from];
  const operators: Record<string, string> = {};
  if (from) operators.$gte = localDayStartIso(from);
  if (to) operators.$lte = localDayEndIso(to);
  return operators;
};

/**
 * Merge the range into an existing filter object under `field`, keeping any
 * operators already there (e.g. a year `$between`) — Strapi ANDs operators on
 * the same attribute.
 */
export const applySubmittedDateRange = (
  filter: Record<string, unknown>,
  field: string,
  range: SubmittedDateRange | undefined
): Record<string, unknown> => {
  const operators = submittedDateRangeOperators(range);
  if (Object.keys(operators).length === 0) return filter;
  const existing = filter[field];
  const base =
    existing && typeof existing === "object" && !Array.isArray(existing)
      ? (existing as Record<string, unknown>)
      : {};
  return { ...filter, [field]: { ...base, ...operators } };
};
