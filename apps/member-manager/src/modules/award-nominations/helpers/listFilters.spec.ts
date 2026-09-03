import { describe, expect, it } from "vitest";
import {
  buildAwardListFilter,
  calendarYearChoices,
  nominationCycleYear,
} from "./listFilters";

describe("nominationCycleYear", () => {
  it("is the next conference year (calendar year + 1)", () => {
    expect(nominationCycleYear(new Date("2026-08-27T12:00:00"))).toBe(2027);
  });
});

describe("calendarYearChoices", () => {
  it("lists All years, current+1, current year, then the same lookback as before", () => {
    expect(calendarYearChoices(new Date("2026-08-27T12:00:00"))).toEqual([
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

describe("buildAwardListFilter", () => {
  it("filters by award_year unless All years is selected", () => {
    expect(buildAwardListFilter("", 2027)).toEqual({ award_year: 2027 });
    expect(buildAwardListFilter("", "all")).toEqual({});
  });

  it("does not apply a nomination_status filter", () => {
    expect(buildAwardListFilter("", "all", "all", "all")).not.toHaveProperty(
      "nomination_status"
    );
  });

  it("nests region on the linked watersystem (enum string, not an id)", () => {
    expect(buildAwardListFilter("", "all", "Region 4")).toEqual({
      watersystem: { region: "Region 4" },
    });
  });

  it("filters award_type by the catalog name", () => {
    expect(buildAwardListFilter("", "all", "all", "System of the Year")).toEqual(
      {
        award_type: "System of the Year",
      }
    );
  });
});
