import { describe, expect, it } from "vitest";
import {
  buildScholarshipListFilter,
  calendarYearChoices,
  scholarshipCycleYear,
  scholarshipYearFilter,
  watersystemRegion,
} from "./listFilters";
import {
  localDayEndIso,
  localDayStartIso,
} from "../../../helpers/submittedDateRange";

describe("scholarshipCycleYear", () => {
  it("is the next conference year (May–Dec → next calendar year)", () => {
    expect(scholarshipCycleYear(new Date("2026-10-15T12:00:00"))).toBe(2027);
  });

  it("stays on the conference year through its April (same rule as the public form / Strapi)", () => {
    expect(scholarshipCycleYear(new Date("2027-02-10T12:00:00"))).toBe(2027);
  });
});

describe("calendarYearChoices", () => {
  it("lists All years, the upcoming cycle, the current year, then 7 prior years", () => {
    expect(calendarYearChoices(new Date("2026-10-15T12:00:00"))).toEqual([
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
});

/** Cycle window: May 1 of the prior year (local 00:00) → Apr 30 (local end of day). */
const yearWindow = (year: number) => ({
  $or: [
    { scholarship_year: year },
    {
      scholarship_year: { $null: true },
      submission_date: {
        $between: [
          localDayStartIso(`${year - 1}-05-01`),
          localDayEndIso(`${year}-04-30`),
        ],
      },
    },
  ],
});

const inWindow = (year: number, iso: string) => {
  const [start, end] = yearWindow(year).$or[1].submission_date!.$between;
  return iso >= start && iso <= end;
};

describe("buildScholarshipListFilter", () => {
  it("filters by stamped scholarship_year, falling back to the submission cycle window for legacy rows", () => {
    expect(buildScholarshipListFilter("", 2027)).toEqual(yearWindow(2027));
    expect(scholarshipYearFilter(2026)).toEqual(yearWindow(2026));
    expect(buildScholarshipListFilter("", "all")).toEqual({});
  });

  it("legacy rows: a Nov 2025 submission and a Jan 2026 submission both file under 2026", () => {
    const nov2025 = new Date(2025, 10, 12, 15, 0).toISOString();
    const jan2026 = new Date(2026, 0, 20, 9, 0).toISOString();
    expect(inWindow(2026, nov2025)).toBe(true);
    expect(inWindow(2026, jan2026)).toBe(true);
    expect(inWindow(2027, nov2025)).toBe(false);
    expect(inWindow(2027, jan2026)).toBe(false);
  });

  it("legacy rows: the window keeps the whole of Apr 30 and starts at May 1 00:00 local", () => {
    const apr30Late = new Date(2026, 3, 30, 23, 59, 59, 999).toISOString();
    const may1Early = new Date(2026, 4, 1, 0, 0, 0, 0).toISOString();
    expect(inWindow(2026, apr30Late)).toBe(true);
    expect(inWindow(2026, may1Early)).toBe(false);
    expect(inWindow(2027, may1Early)).toBe(true);
  });

  it("does not apply an application_status filter", () => {
    expect(buildScholarshipListFilter("", "all", "all")).not.toHaveProperty(
      "application_status"
    );
  });

  it("nests region on the linked watersystem (enum string, not an id)", () => {
    expect(buildScholarshipListFilter("", "all", "Region 4")).toEqual({
      watersystem: { region: "Region 4" },
    });
  });

  it("keeps search as q", () => {
    expect(buildScholarshipListFilter("  Skye  ", "all")).toEqual({ q: "Skye" });
  });

  it("adds a submitted from/to range on submission_date", () => {
    expect(
      buildScholarshipListFilter("", "all", "all", {
        from: "2026-08-19",
        to: "2026-08-26",
      })
    ).toEqual({
      submission_date: {
        $gte: localDayStartIso("2026-08-19"),
        $lte: localDayEndIso("2026-08-26"),
      },
    });
  });

  it("ANDs the submitted range with the year window", () => {
    expect(
      buildScholarshipListFilter("", 2026, "all", { from: "2026-08-19" })
    ).toEqual({
      ...yearWindow(2026),
      submission_date: { $gte: localDayStartIso("2026-08-19") },
    });
  });
});

describe("watersystemRegion", () => {
  it("reads region from the populated watersystem", () => {
    expect(
      watersystemRegion({ watersystem: { region: "Region 4" } })
    ).toBe("Region 4");
    expect(watersystemRegion({ watersystem: null })).toBe("");
  });
});
