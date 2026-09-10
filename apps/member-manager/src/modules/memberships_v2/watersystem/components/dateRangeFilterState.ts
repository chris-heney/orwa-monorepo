/**
 * Pure filter-state helpers for the Date range filter section.
 *
 * The section's on/off state is *derived* from the list's filter values rather
 * than held in local state: a saved filter restoring a range, or another
 * control clearing the filters, has to move the toggle too. Local state would
 * let the switch disagree with the query, which is the exact ambiguity this
 * toggle exists to remove.
 */

export type DateRangeFilters = Record<string, any>;

export type DateRange = { start: string; end: string };

/** A `$between` filter on one of `fields`, if any is currently applied. */
export const getActiveDateField = (
  fields: string[],
  filters: DateRangeFilters | undefined | null
): string | undefined =>
  fields.find((field) => Array.isArray(filters?.[field]?.$between));

/** The applied range for `field`, or undefined when it carries no `$between`. */
export const getDateRange = (
  field: string | undefined,
  filters: DateRangeFilters | undefined | null
): DateRange | undefined => {
  if (!field) return undefined;
  const between = filters?.[field]?.$between;
  if (!Array.isArray(between)) return undefined;
  const [start, end] = between;
  if (typeof start !== "string" || typeof end !== "string") return undefined;
  return { start, end };
};

/**
 * Strip every date-range key this section owns, leaving the drawer's other
 * filters (Region, Contact Title, Member Status …) untouched.
 */
export const withoutDateFields = (
  fields: string[],
  filters: DateRangeFilters | undefined | null
): DateRangeFilters => {
  const next = { ...(filters ?? {}) };
  fields.forEach((field) => {
    delete next[field];
  });
  return next;
};

/**
 * Apply `start`–`end` to `field`, clearing any range on the section's other
 * fields so switching the field never leaves two date filters ANDed together.
 */
export const withDateRange = (
  fields: string[],
  filters: DateRangeFilters | undefined | null,
  field: string,
  start: string,
  end: string
): DateRangeFilters => ({
  ...withoutDateFields(fields, filters),
  [field]: { $between: [start, end] },
});
