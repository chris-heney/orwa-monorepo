import { describe, expect, it } from 'vitest';
import { HISTORICAL_YEARS, buildYearRows } from './membership-year-report';

/** Most cases isolate the transaction logic by passing no history. */
const noHistory: [] = [];

describe('buildYearRows', () => {
  it('pairs the two resources into one row per year', () => {
    expect(
      buildYearRows(
        [
          { year: 2024, resource: 'watersystems', members: 412 },
          { year: 2024, resource: 'associates', members: 98 },
          { year: 2025, resource: 'watersystems', members: 431 },
          { year: 2025, resource: 'associates', members: 105 },
        ],
        noHistory,
      ),
    ).toEqual([
      { year: 2024, systems: 412, associates: 98 },
      { year: 2025, systems: 431, associates: 105 },
    ]);
  });

  it('fills the missing side with zero when only one resource transacted', () => {
    expect(
      buildYearRows(
        [{ year: 2023, resource: 'associates', members: 12 }],
        noHistory,
      ),
    ).toEqual([{ year: 2023, systems: 0, associates: 12 }]);
  });

  it('sorts years ascending regardless of row order', () => {
    const years = buildYearRows(
      [
        { year: 2026, resource: 'watersystems', members: 1 },
        { year: 2021, resource: 'watersystems', members: 2 },
        { year: 2024, resource: 'watersystems', members: 3 },
      ],
      noHistory,
    ).map((row) => row.year);

    expect(years).toEqual([2021, 2024, 2026]);
  });

  it("coerces the driver's string counts", () => {
    // MySQL returns COUNT() as a string through some drivers.
    expect(
      buildYearRows(
        [{ year: '2024', resource: 'watersystems', members: '7' }],
        noHistory,
      ),
    ).toEqual([{ year: 2024, systems: 7, associates: 0 }]);
  });

  it('drops rows with no usable year', () => {
    expect(
      buildYearRows(
        [
          { year: null, resource: 'watersystems', members: 5 },
          { year: 2024, resource: 'watersystems', members: 5 },
        ],
        noHistory,
      ),
    ).toEqual([{ year: 2024, systems: 5, associates: 0 }]);
  });

  it('ignores resources that are not memberships', () => {
    expect(
      buildYearRows(
        [
          { year: 2024, resource: 'conference-registrations', members: 300 },
          { year: 2024, resource: 'watersystems', members: 4 },
        ],
        noHistory,
      ),
    ).toEqual([{ year: 2024, systems: 4, associates: 0 }]);
  });

  it('returns nothing when there is neither history nor transactions', () => {
    expect(buildYearRows([], noHistory)).toEqual([]);
  });

  describe('pre-ledger history', () => {
    it('carries the historical years when there are no transactions', () => {
      expect(buildYearRows([])).toEqual(HISTORICAL_YEARS);
    });

    it('keeps history alongside years that do have transactions', () => {
      expect(
        buildYearRows([{ year: 2024, resource: 'watersystems', members: 412 }]),
      ).toEqual([
        ...HISTORICAL_YEARS,
        { year: 2024, systems: 412, associates: 0 },
      ]);
    });

    it('lets real transactions replace a historical year outright', () => {
      // 2023 is carried as 458/104. A year with any real data must not blend
      // the two — the live associate count of 0 has to stand.
      expect(
        buildYearRows([{ year: 2023, resource: 'watersystems', members: 11 }]),
      ).toContainEqual({ year: 2023, systems: 11, associates: 0 });
    });
  });
});
