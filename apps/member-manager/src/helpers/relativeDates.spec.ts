import { describe, expect, it } from 'vitest';
import {
  RELATIVE_DATE_CHOICES,
  hasRelativeDates,
  isRelativeDateToken,
} from './relativeDates';

describe('isRelativeDateToken', () => {
  it('accepts the token forms the server expands', () => {
    expect(isRelativeDateToken('$now')).toBe(true);
    expect(isRelativeDateToken('$now-1y')).toBe(true);
    expect(isRelativeDateToken('$now-1y+1M')).toBe(true);
  });

  it('rejects concrete dates and near-misses', () => {
    expect(isRelativeDateToken('2026-08-19')).toBe(false);
    expect(isRelativeDateToken('$nowish')).toBe(false);
    expect(isRelativeDateToken('$now-1')).toBe(false);
    expect(isRelativeDateToken('$now-1h')).toBe(false);
    expect(isRelativeDateToken(null)).toBe(false);
    expect(isRelativeDateToken(42)).toBe(false);
  });

  it('accepts every choice the builder offers', () => {
    for (const choice of RELATIVE_DATE_CHOICES) {
      expect(isRelativeDateToken(choice.id)).toBe(true);
    }
  });
});

describe('hasRelativeDates', () => {
  it('finds a token nested in a filter tree', () => {
    expect(
      hasRelativeDates({
        $and: [
          { orwaag: true },
          { expiration_date: { $between: ['$now', '$now+1M'] } },
        ],
      })
    ).toBe(true);
  });

  it('is false for a query frozen on concrete dates', () => {
    // The shape the renewal queries used to have, which stopped matching.
    expect(
      hasRelativeDates({
        orwaag: true,
        payment_last_date: { $between: ['2024-07-01', '2024-08-01'] },
      })
    ).toBe(false);
  });

  it('is false for filters with no dates at all', () => {
    expect(hasRelativeDates({ orwaag: true, region: 'Region 1' })).toBe(false);
  });

  it('handles empty and missing filters', () => {
    expect(hasRelativeDates({})).toBe(false);
    expect(hasRelativeDates(null)).toBe(false);
    expect(hasRelativeDates(undefined)).toBe(false);
  });
});
