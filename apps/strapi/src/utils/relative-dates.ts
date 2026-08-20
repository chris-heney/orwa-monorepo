import dayjs from 'dayjs';

/**
 * Relative date tokens for stored filters.
 *
 * Saved queries and scheduled-email-task conditions are JSON blobs that live
 * for months. Baking absolute dates into them means the window they describe
 * ("expiring within a month") silently stops being true the day after it is
 * saved. A token records the *intent* instead, and is expanded to a concrete
 * date every time the filter is evaluated.
 *
 * Grammar: `$now` followed by any number of offsets, e.g.
 *   `$now`            → today
 *   `$now-1y`         → one year ago
 *   `$now-1y+1M`      → one year ago plus a month
 *   `$now+30d`        → thirty days out
 *
 * Units are dayjs units: `d` day, `w` week, `M` month (capital), `y` year.
 */
const TOKEN_PATTERN = /^\$now((?:[+-]\d+[dwMy])*)$/;
const OFFSET_PATTERN = /([+-])(\d+)([dwMy])/g;

const UNITS: Record<string, dayjs.ManipulateType> = {
  d: 'day',
  w: 'week',
  M: 'month',
  y: 'year',
};

export const isRelativeDateToken = (value: unknown): value is string =>
  typeof value === 'string' && TOKEN_PATTERN.test(value);

/**
 * Expands one token to `YYYY-MM-DD`. Returns null when the value is not a
 * token, so callers can leave non-token values untouched.
 */
export const resolveRelativeDateToken = (
  value: unknown,
  now: Date = new Date(),
): string | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const match = TOKEN_PATTERN.exec(value);
  if (!match) {
    return null;
  }

  let date = dayjs(now);
  for (const [, sign, amount, unit] of match[1].matchAll(OFFSET_PATTERN)) {
    const quantity = Number(amount);
    date =
      sign === '-'
        ? date.subtract(quantity, UNITS[unit])
        : date.add(quantity, UNITS[unit]);
  }

  return date.format('YYYY-MM-DD');
};

/**
 * Deep-copies a filter tree, expanding every relative date token it contains.
 * Anything that is not a token is returned as-is.
 */
export const resolveRelativeDates = <T>(
  input: T,
  now: Date = new Date(),
): T => {
  if (Array.isArray(input)) {
    return input.map((item) => resolveRelativeDates(item, now)) as unknown as T;
  }

  if (input !== null && typeof input === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      out[key] = resolveRelativeDates(value, now);
    }
    return out as unknown as T;
  }

  const resolved = resolveRelativeDateToken(input, now);
  return (resolved ?? input) as T;
};

/** True when the tree contains at least one relative date token. */
export const hasRelativeDates = (input: unknown): boolean => {
  if (Array.isArray(input)) {
    return input.some(hasRelativeDates);
  }
  if (input !== null && typeof input === 'object') {
    return Object.values(input).some(hasRelativeDates);
  }
  return isRelativeDateToken(input);
};
