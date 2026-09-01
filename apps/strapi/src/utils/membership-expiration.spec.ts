import { describe, expect, it } from 'vitest';
import {
  getMembershipExpirationDate,
  isMembershipActive,
} from './membership-expiration';

const NOW = new Date(2026, 7, 19, 12); // 2026-08-19, local noon

describe('getMembershipExpirationDate', () => {
  it('is one year after the last payment when there is no prior period', () => {
    expect(getMembershipExpirationDate(null, '2026-03-01')).toBe('2027-03-01');
  });

  it('credits unused days when the member renewed early', () => {
    // Previous period ran to 2026-04-08; they paid again on 2026-02-10,
    // 57 days early, so those days carry over.
    expect(getMembershipExpirationDate('2025-04-08', '2026-02-10')).toBe(
      '2027-04-08',
    );
  });

  it('does not credit anything when they renewed after the period ended', () => {
    expect(getMembershipExpirationDate('2024-01-01', '2026-03-01')).toBe(
      '2027-03-01',
    );
  });

  it('falls back to the previous period when the last payment is missing', () => {
    // An invoice renewal that has not been confirmed yet must not read as
    // expired: the member is still inside the period they already paid for.
    expect(getMembershipExpirationDate('2026-03-01', null)).toBe('2027-03-01');
  });

  it('is null when there is no payment history at all', () => {
    expect(getMembershipExpirationDate(null, null)).toBeNull();
    expect(getMembershipExpirationDate('', '')).toBeNull();
    expect(getMembershipExpirationDate(undefined, 'not-a-date')).toBeNull();
  });
});

describe('isMembershipActive', () => {
  it('is active while the expiration is in the future', () => {
    expect(isMembershipActive(null, '2026-03-01', NOW)).toBe(true);
  });

  it('is inactive once the expiration has passed', () => {
    expect(isMembershipActive(null, '2025-03-01', NOW)).toBe(false);
  });

  it('keeps an early renewer active past the naive twelve-month cutoff', () => {
    // Paid 2025-08-01 — more than 12 months before "now", so the old
    // "payment within the last year" rule called this Non Member — but the
    // previous period had 40 unused days, which carry the membership past it.
    expect(isMembershipActive('2024-09-10', '2025-08-01', NOW)).toBe(true);
  });

  it('is inactive with no payment history', () => {
    expect(isMembershipActive(null, null, NOW)).toBe(false);
  });
});
