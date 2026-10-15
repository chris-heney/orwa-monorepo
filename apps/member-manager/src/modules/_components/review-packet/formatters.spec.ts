import { describe, expect, it } from "vitest";
import { CYCLE_ROLLOVER_MONTH, cycleYearOf, formatPacketYear } from "./formatters";

describe("cycleYearOf", () => {
  it("rolls over in May (same rule as Strapi cycle-year.ts)", () => {
    expect(CYCLE_ROLLOVER_MONTH).toBe(4);
  });

  it("Apr 30 belongs to the same calendar year; May 1 to the next", () => {
    expect(cycleYearOf(new Date(2026, 3, 30, 23, 59, 59))).toBe(2026);
    expect(cycleYearOf(new Date(2026, 4, 1, 0, 0, 0))).toBe(2027);
    expect(cycleYearOf(new Date(2025, 3, 30))).toBe(2025);
    expect(cycleYearOf(new Date(2025, 4, 1))).toBe(2026);
  });

  it("January deadline submissions stay in that year's conference cycle", () => {
    expect(cycleYearOf(new Date(2027, 0, 15))).toBe(2027);
    expect(cycleYearOf(new Date(2027, 0, 31, 23, 59))).toBe(2027);
    expect(cycleYearOf(new Date(2027, 1, 1))).toBe(2027);
    expect(cycleYearOf(new Date(2027, 2, 31))).toBe(2027);
  });

  it("Oct–Dec submissions file under next year's conference", () => {
    expect(cycleYearOf(new Date(2026, 9, 15))).toBe(2027);
    expect(cycleYearOf(new Date(2026, 11, 31, 23, 59))).toBe(2027);
  });

  it("accepts ISO strings and epoch numbers (local-time month, like Strapi's getMonth)", () => {
    expect(cycleYearOf("2026-10-15T04:22:58.000Z")).toBe(2027);
    expect(cycleYearOf("2026-04-30")).toBe(2026);
    // Bare dates are local, so May 1 never slips back to Apr 30 in US zones.
    expect(cycleYearOf("2026-05-01")).toBe(2027);
    expect(cycleYearOf(new Date(2026, 4, 1).getTime())).toBe(2027);
  });

  it("returns NaN for unparseable input instead of throwing", () => {
    expect(Number.isNaN(cycleYearOf("not a date"))).toBe(true);
    expect(Number.isNaN(cycleYearOf(""))).toBe(true);
  });
});

describe("formatPacketYear", () => {
  it("prefixes with Year: and blanks a missing value", () => {
    expect(formatPacketYear(2027)).toBe("Year: 2027");
    expect(formatPacketYear("2027")).toBe("Year: 2027");
    expect(formatPacketYear(null)).toMatch(/^Year: /);
  });
});
