import { describe, expect, it } from "vitest";
import {
  CYCLE_ROLLOVER_MONTH,
  cycleYearChoices,
  cycleYearOf,
  cycleYearWindow,
  formatScholarshipYear,
  nextAnnualConferenceYear,
} from "./conferenceCycleYear";

describe("cycleYearOf", () => {
  it("rolls over in May (same rule as Strapi cycle-year.ts)", () => {
    expect(CYCLE_ROLLOVER_MONTH).toBe(4);
    expect(cycleYearOf(new Date(2026, 3, 30, 23, 59, 59))).toBe(2026);
    expect(cycleYearOf(new Date(2026, 4, 1, 0, 0, 0))).toBe(2027);
  });

  it("files legacy fall/winter submissions under the next conference year", () => {
    expect(cycleYearOf("2025-11-12T15:00:00")).toBe(2026);
    expect(cycleYearOf("2026-01-20T09:00:00")).toBe(2026);
    expect(cycleYearOf(new Date(2026, 9, 15))).toBe(2027);
  });

  it("reads bare dates as local days and accepts epoch numbers", () => {
    expect(cycleYearOf("2026-04-30")).toBe(2026);
    expect(cycleYearOf("2026-05-01")).toBe(2027);
    expect(cycleYearOf(new Date(2026, 4, 1).getTime())).toBe(2027);
  });

  it("returns NaN for unparseable input instead of throwing", () => {
    expect(Number.isNaN(cycleYearOf("not a date"))).toBe(true);
    expect(Number.isNaN(cycleYearOf(""))).toBe(true);
  });
});

describe("cycleYearWindow", () => {
  it("spans May 1 of the prior year through Apr 30 of the cycle year", () => {
    expect(cycleYearWindow(2027)).toEqual({ start: "2026-05-01", end: "2027-04-30" });
    expect(cycleYearWindow(2026)).toEqual({ start: "2025-05-01", end: "2026-04-30" });
  });

  it("is the inverse of cycleYearOf at both edges", () => {
    const { start, end } = cycleYearWindow(2026);
    expect(cycleYearOf(start)).toBe(2026);
    expect(cycleYearOf(end)).toBe(2026);
    expect(cycleYearOf("2025-04-30")).toBe(2025);
    expect(cycleYearOf("2026-05-01")).toBe(2027);
  });
});

describe("nextAnnualConferenceYear", () => {
  it("rolls to next year from May onward (fall collection for April conference)", () => {
    expect(nextAnnualConferenceYear(new Date("2026-10-15T12:00:00"))).toBe(2027);
    expect(nextAnnualConferenceYear(new Date("2026-05-01T12:00:00"))).toBe(2027);
  });

  it("stays on the current year Jan–Apr (deadline through the conference)", () => {
    expect(nextAnnualConferenceYear(new Date("2027-02-10T12:00:00"))).toBe(2027);
    expect(nextAnnualConferenceYear(new Date("2027-04-30T12:00:00"))).toBe(2027);
  });
});

describe("cycleYearChoices", () => {
  it("offers the upcoming cycle ahead of the calendar lookback", () => {
    expect(cycleYearChoices(new Date("2026-10-15T12:00:00"))).toEqual([
      "all",
      2027,
      2026,
      2025,
      2024,
      2023,
      2022,
      2021,
      2020,
      2019,
    ]);
  });

  it("does not duplicate the year when cycle === current (Jan–Apr)", () => {
    const choices = cycleYearChoices(new Date("2027-02-10T12:00:00"));
    expect(choices.slice(0, 3)).toEqual(["all", 2027, 2026]);
    expect(new Set(choices).size).toBe(choices.length);
  });
});

describe("formatScholarshipYear (ORWEF split academic year)", () => {
  it("renders the stored start year as START-END", () => {
    expect(formatScholarshipYear(2027)).toBe("2027-2028");
    expect(formatScholarshipYear(1999)).toBe("1999-2000");
    expect(formatScholarshipYear("2027")).toBe("2027-2028");
  });

  it("echoes non-integer input instead of NaN-NaN", () => {
    expect(formatScholarshipYear("abc")).toBe("abc");
    expect(formatScholarshipYear("")).toBe("");
  });
});
