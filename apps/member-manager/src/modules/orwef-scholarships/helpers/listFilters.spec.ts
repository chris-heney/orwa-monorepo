import { describe, expect, it } from "vitest";
import {
  buildScholarshipListFilter,
  watersystemRegion,
} from "./listFilters";

describe("buildScholarshipListFilter", () => {
  it("filters by submission year unless All years is selected", () => {
    expect(buildScholarshipListFilter("", 2026)).toEqual({
      submission_date: { $between: ["2026-01-01", "2026-12-31"] },
    });
    expect(buildScholarshipListFilter("", "all")).toEqual({});
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
});

describe("watersystemRegion", () => {
  it("reads region from the populated watersystem", () => {
    expect(
      watersystemRegion({ watersystem: { region: "Region 4" } })
    ).toBe("Region 4");
    expect(watersystemRegion({ watersystem: null })).toBe("");
  });
});
