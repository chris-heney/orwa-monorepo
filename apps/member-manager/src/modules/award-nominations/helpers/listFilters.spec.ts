import { describe, expect, it } from "vitest";
import {
  AWARD_STATUSES,
  buildAwardListFilter,
  calendarYearChoices,
  NOMINATION_STATUS_VALUES,
  nominationCycleYear,
} from "./listFilters";
import {
  localDayEndIso,
  localDayStartIso,
} from "../../../helpers/submittedDateRange";

describe("nominationCycleYear", () => {
  it("is the next conference year (May–Dec → next calendar year)", () => {
    expect(nominationCycleYear(new Date("2026-08-27T12:00:00"))).toBe(2027);
  });

  it("stays on the conference year through its April (same rule as the public form / Strapi)", () => {
    expect(nominationCycleYear(new Date("2027-02-10T12:00:00"))).toBe(2027);
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

  // Previously asserted the drawer could NOT filter by status; the Status
  // multi-select now maps to `nomination_status: { $in }`. Empty = no filter.
  it("omits nomination_status when no status is selected", () => {
    expect(buildAwardListFilter("", "all", "all", "all")).not.toHaveProperty(
      "nomination_status"
    );
    expect(
      buildAwardListFilter("", "all", "all", "all", undefined, [])
    ).not.toHaveProperty("nomination_status");
  });

  it("filters a single status with $in", () => {
    expect(
      buildAwardListFilter("", "all", "all", "all", undefined, ["Winner"])
    ).toEqual({ nomination_status: { $in: ["Winner"] } });
  });

  it("ORs several statuses with $in, alongside the year", () => {
    expect(
      buildAwardListFilter("", 2027, "all", "all", undefined, [
        "Submitted",
        "Under Review",
      ])
    ).toEqual({
      award_year: 2027,
      nomination_status: { $in: ["Submitted", "Under Review"] },
    });
  });

  it("drops values that are not in the schema enum (stale prefs)", () => {
    expect(
      buildAwardListFilter("", "all", "all", "all", undefined, [
        "Approved",
        "Winner",
      ])
    ).toEqual({ nomination_status: { $in: ["Winner"] } });
    expect(
      buildAwardListFilter("", "all", "all", "all", undefined, ["Approved"])
    ).toEqual({});
  });

  it("exposes the schema enum once, in schema order", () => {
    expect(NOMINATION_STATUS_VALUES).toEqual([
      "Draft",
      "Submitted",
      "Under Review",
      "Winner",
      "Runner Up",
      "Not Selected",
    ]);
    expect(AWARD_STATUSES.map((choice) => choice.id)).toEqual([
      ...NOMINATION_STATUS_VALUES,
    ]);
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

  it("adds a submitted from/to range on submission_date", () => {
    expect(
      buildAwardListFilter("", 2027, "all", "all", {
        from: "2026-08-19",
        to: "2026-08-26",
      })
    ).toEqual({
      award_year: 2027,
      submission_date: {
        $gte: localDayStartIso("2026-08-19"),
        $lte: localDayEndIso("2026-08-26"),
      },
    });
  });

  it("ignores an empty submitted range", () => {
    expect(
      buildAwardListFilter("", "all", "all", "all", { from: "", to: "" })
    ).toEqual({});
  });
});
