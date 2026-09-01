import { describe, expect, it } from 'vitest';
import {
  hasRelativeDates,
  isRelativeDateToken,
  resolveRelativeDates,
  resolveRelativeDateToken,
} from './relative-dates';

const NOW = new Date('2026-08-19T12:00:00.000Z');

describe('resolveRelativeDateToken', () => {
  it('resolves $now to today', () => {
    expect(resolveRelativeDateToken('$now', NOW)).toBe('2026-08-19');
  });

  it('subtracts and adds offsets', () => {
    expect(resolveRelativeDateToken('$now-1y', NOW)).toBe('2025-08-19');
    expect(resolveRelativeDateToken('$now+30d', NOW)).toBe('2026-09-18');
    expect(resolveRelativeDateToken('$now-2w', NOW)).toBe('2026-08-05');
  });

  it('applies chained offsets left to right', () => {
    expect(resolveRelativeDateToken('$now-1y+1M', NOW)).toBe('2025-09-19');
  });

  it('returns null for anything that is not a token', () => {
    expect(resolveRelativeDateToken('2026-08-19', NOW)).toBeNull();
    expect(resolveRelativeDateToken('$nowish', NOW)).toBeNull();
    expect(resolveRelativeDateToken('$now-1', NOW)).toBeNull();
    expect(resolveRelativeDateToken('$now-1h', NOW)).toBeNull();
    expect(resolveRelativeDateToken(42, NOW)).toBeNull();
    expect(resolveRelativeDateToken(null, NOW)).toBeNull();
  });
});

describe('resolveRelativeDates', () => {
  it('expands tokens nested in a filter tree', () => {
    const filters = {
      $and: [
        { payment_last_date: { $notNull: true } },
        { payment_last_date: { $gte: '$now-1y' } },
      ],
    };

    expect(resolveRelativeDates(filters, NOW)).toEqual({
      $and: [
        { payment_last_date: { $notNull: true } },
        { payment_last_date: { $gte: '2025-08-19' } },
      ],
    });
  });

  it('expands tokens inside arrays such as $between', () => {
    const filters = {
      expiration_date: { $between: ['$now', '$now+1M'] },
    };

    expect(resolveRelativeDates(filters, NOW)).toEqual({
      expiration_date: { $between: ['2026-08-19', '2026-09-19'] },
    });
  });

  it('leaves absolute dates and non-date values untouched', () => {
    const filters = {
      name: 'ORWAAG',
      active: true,
      count: 3,
      payment_last_date: { $gte: '2020-01-01' },
      nothing: null,
    };

    expect(resolveRelativeDates(filters, NOW)).toEqual(filters);
  });

  it('does not mutate the input', () => {
    const filters = { payment_last_date: { $gte: '$now-1y' } };
    const copy = JSON.parse(JSON.stringify(filters));

    resolveRelativeDates(filters, NOW);

    expect(filters).toEqual(copy);
  });

  it('resolves against the supplied clock, so the same filter moves with time', () => {
    const filters = { payment_last_date: { $gte: '$now-1y' } };

    // Local-noon clocks: a bare 'YYYY-MM-DD' parses as UTC midnight and would
    // format back a day earlier west of Greenwich.
    expect(resolveRelativeDates(filters, new Date(2026, 7, 19, 12))).toEqual({
      payment_last_date: { $gte: '2025-08-19' },
    });
    expect(resolveRelativeDates(filters, new Date(2026, 11, 25, 12))).toEqual({
      payment_last_date: { $gte: '2025-12-25' },
    });
  });
});

describe('hasRelativeDates', () => {
  it('detects tokens anywhere in the tree', () => {
    expect(hasRelativeDates({ a: { b: ['$now-1y'] } })).toBe(true);
    expect(hasRelativeDates({ a: { b: ['2025-08-19'] } })).toBe(false);
  });
});

describe('isRelativeDateToken', () => {
  it('accepts only well-formed tokens', () => {
    expect(isRelativeDateToken('$now')).toBe(true);
    expect(isRelativeDateToken('$now-1y+1M')).toBe(true);
    expect(isRelativeDateToken('now-1y')).toBe(false);
  });
});
