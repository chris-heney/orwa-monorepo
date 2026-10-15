import { describe, expect, it } from "vitest";
import {
  applySubmittedDateRange,
  hasSubmittedDateRange,
  localDayEndIso,
  localDayStartIso,
  submittedDateRangeOperators,
} from "./submittedDateRange";

describe("submittedDateRangeOperators", () => {
  it("is empty without a usable bound", () => {
    expect(submittedDateRangeOperators(undefined)).toEqual({});
    expect(submittedDateRangeOperators({ from: "", to: null })).toEqual({});
    expect(submittedDateRangeOperators({ from: "not-a-date" })).toEqual({});
  });

  it("maps from/to onto local-day $gte/$lte instants", () => {
    expect(
      submittedDateRangeOperators({ from: "2026-08-19", to: "2026-08-26" })
    ).toEqual({
      $gte: localDayStartIso("2026-08-19"),
      $lte: localDayEndIso("2026-08-26"),
    });
    expect(localDayStartIso("2026-08-19")).toBe(
      new Date("2026-08-19T00:00:00").toISOString()
    );
    expect(localDayEndIso("2026-08-26")).toBe(
      new Date("2026-08-26T23:59:59.999").toISOString()
    );
  });

  it("accepts a single bound", () => {
    expect(submittedDateRangeOperators({ from: "2026-08-19" })).toEqual({
      $gte: localDayStartIso("2026-08-19"),
    });
    expect(submittedDateRangeOperators({ to: "2026-08-19" })).toEqual({
      $lte: localDayEndIso("2026-08-19"),
    });
  });

  it("swaps a reversed range instead of returning nothing", () => {
    expect(
      submittedDateRangeOperators({ from: "2026-08-26", to: "2026-08-19" })
    ).toEqual({
      $gte: localDayStartIso("2026-08-19"),
      $lte: localDayEndIso("2026-08-26"),
    });
  });
});

describe("hasSubmittedDateRange", () => {
  it("is true only when a bound is a real date", () => {
    expect(hasSubmittedDateRange(undefined)).toBe(false);
    expect(hasSubmittedDateRange({ from: "", to: "" })).toBe(false);
    expect(hasSubmittedDateRange({ to: "2026-01-01" })).toBe(true);
  });
});

describe("applySubmittedDateRange", () => {
  it("leaves the filter untouched without a range", () => {
    const filter = { award_year: 2027 };
    expect(applySubmittedDateRange(filter, "submission_date", {})).toBe(filter);
  });

  it("keeps existing operators on the same attribute (year $between)", () => {
    expect(
      applySubmittedDateRange(
        { submission_date: { $between: ["2026-01-01", "2026-12-31"] } },
        "submission_date",
        { from: "2026-08-19" }
      )
    ).toEqual({
      submission_date: {
        $between: ["2026-01-01", "2026-12-31"],
        $gte: localDayStartIso("2026-08-19"),
      },
    });
  });
});
