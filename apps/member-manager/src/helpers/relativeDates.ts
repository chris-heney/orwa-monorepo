/**
 * Relative date tokens in stored filters.
 *
 * A filter can hold `$now-1y` / `$now+1M` instead of a concrete date; the
 * server expands them on every read, so the query keeps meaning the same thing
 * as time passes. This module is the frontend's half: the vocabulary the query
 * builder offers, and the check that tells the UI whether a saved query will
 * keep itself current.
 *
 * The grammar is defined by the server in
 * apps/strapi/src/utils/relative-dates.ts — keep the pattern below in step
 * with it. Detection is deliberately the only thing done here; expansion stays
 * server-side so there is exactly one implementation of the arithmetic.
 */

const RELATIVE_DATE_TOKEN = /^\$now(?:[+-]\d+[dwMy])*$/;

/** The relative dates the query builder offers, in the order they read best. */
export const RELATIVE_DATE_CHOICES = [
  { id: '$now', name: 'today' },
  { id: '$now-1w', name: 'a week ago' },
  { id: '$now-1M', name: 'a month ago' },
  { id: '$now-1y', name: 'a year ago' },
  { id: '$now+1w', name: 'a week from now' },
  { id: '$now+1M', name: 'a month from now' },
  { id: '$now+1y', name: 'a year from now' },
];

export const isRelativeDateToken = (value: unknown): value is string =>
  typeof value === 'string' && RELATIVE_DATE_TOKEN.test(value);

/**
 * True when a filter tree contains at least one relative date — i.e. the query
 * recalculates itself rather than meaning fixed dates forever.
 */
export const hasRelativeDates = (filters: unknown): boolean => {
  if (Array.isArray(filters)) {
    return filters.some(hasRelativeDates);
  }
  if (filters !== null && typeof filters === 'object') {
    return Object.values(filters as Record<string, unknown>).some(
      hasRelativeDates
    );
  }
  return isRelativeDateToken(filters);
};
