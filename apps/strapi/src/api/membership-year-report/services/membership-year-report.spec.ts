import { describe, expect, it } from 'vitest';
import {
  HISTORICAL_YEARS,
  TRANSACTION_TRACKING_START_YEAR,
  buildYearRows,
} from './membership-year-report';

/**
 * Most cases isolate the reshaping logic: no carried history, and no tracking
 * cutoff so the fixture years are free to be whatever reads clearest.
 */
const reshapeOnly = (
  rows: { year: unknown; resource: string; members: unknown }[],
) => buildYearRows(rows, [], 0);

describe('buildYearRows', () => {
  it('pairs the two resources into one row per year', () => {
    expect(
      reshapeOnly([
        { year: 2024, resource: 'watersystems', members: 412 },
        { year: 2024, resource: 'associates', members: 98 },
        { year: 2025, resource: 'watersystems', members: 431 },
        { year: 2025, resource: 'associates', members: 105 },
      ]),
    ).toEqual([
      { year: 2024, systems: 412, associates: 98 },
      { year: 2025, systems: 431, associates: 105 },
    ]);
  });

  it('fills the missing side with zero when only one resource transacted', () => {
    expect(
      reshapeOnly([{ year: 2023, resource: 'associates', members: 12 }]),
    ).toEqual([{ year: 2023, systems: 0, associates: 12 }]);
  });

  it('sorts years ascending regardless of row order', () => {
    const years = reshapeOnly([
      { year: 2026, resource: 'watersystems', members: 1 },
      { year: 2021, resource: 'watersystems', members: 2 },
      { year: 2024, resource: 'watersystems', members: 3 },
    ]).map((row) => row.year);

    expect(years).toEqual([2021, 2024, 2026]);
  });

  it("coerces the driver's string counts", () => {
    // MySQL returns COUNT() as a string through some drivers.
    expect(
      reshapeOnly([{ year: '2024', resource: 'watersystems', members: '7' }]),
    ).toEqual([{ year: 2024, systems: 7, associates: 0 }]);
  });

  it('drops rows with no usable year', () => {
    expect(
      reshapeOnly([
        { year: null, resource: 'watersystems', members: 5 },
        { year: 2024, resource: 'watersystems', members: 5 },
      ]),
    ).toEqual([{ year: 2024, systems: 5, associates: 0 }]);
  });

  it('ignores resources that are not memberships', () => {
    expect(
      reshapeOnly([
        { year: 2024, resource: 'conference-registrations', members: 300 },
        { year: 2024, resource: 'watersystems', members: 4 },
      ]),
    ).toEqual([{ year: 2024, systems: 4, associates: 0 }]);
  });

  it('returns nothing when there is neither history nor transactions', () => {
    expect(reshapeOnly([])).toEqual([]);
  });

  describe('tracking start year', () => {
    it('drops transaction years from before tracking began', () => {
      // The ledger coming online mid-2024 left a couple of rows that would
      // otherwise plot as a collapse in membership.
      expect(
        buildYearRows(
          [
            { year: 2024, resource: 'watersystems', members: 3 },
            { year: 2025, resource: 'watersystems', members: 431 },
          ],
          [],
          2025,
        ),
      ).toEqual([{ year: 2025, systems: 431, associates: 0 }]);
    });

    it('keeps the first tracked year itself', () => {
      expect(
        buildYearRows(
          [{ year: 2025, resource: 'associates', members: 105 }],
          [],
          2025,
        ),
      ).toEqual([{ year: 2025, systems: 0, associates: 105 }]);
    });

    it('defaults to the configured start year', () => {
      const years = buildYearRows(
        [
          {
            year: TRANSACTION_TRACKING_START_YEAR - 1,
            resource: 'watersystems',
            members: 3,
          },
          {
            year: TRANSACTION_TRACKING_START_YEAR,
            resource: 'watersystems',
            members: 400,
          },
        ],
        [],
      ).map((row) => row.year);

      expect(years).toEqual([TRANSACTION_TRACKING_START_YEAR]);
    });
  });

  describe('pre-ledger history', () => {
    it('carries the historical years when there are no transactions', () => {
      expect(buildYearRows([])).toEqual(HISTORICAL_YEARS);
    });

    it('keeps history alongside years that do have transactions', () => {
      expect(
        buildYearRows([{ year: 2025, resource: 'watersystems', members: 431 }]),
      ).toEqual([
        ...HISTORICAL_YEARS,
        { year: 2025, systems: 431, associates: 0 },
      ]);
    });

    it('does not let a dropped year resurrect as history', () => {
      // 2024 is both before tracking and absent from HISTORICAL_YEARS, so it
      // must not appear at all.
      const years = buildYearRows([
        { year: 2024, resource: 'watersystems', members: 3 },
      ]).map((row) => row.year);

      expect(years).not.toContain(2024);
    });

    it('lets real transactions replace a historical year outright', () => {
      // A carried year only gets replaced if it is also a tracked year, so
      // this uses an explicit cutoff to exercise the replacement itself.
      expect(
        buildYearRows(
          [{ year: 2023, resource: 'watersystems', members: 11 }],
          HISTORICAL_YEARS,
          0,
        ),
      ).toContainEqual({ year: 2023, systems: 11, associates: 0 });
    });
  });
});
