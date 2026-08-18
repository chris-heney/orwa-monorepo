import { describe, expect, it } from "vitest";
import {
  buildApplicationFiscalYearFilter,
  buildApplicationListFilter,
  buildScoreFiscalYearFilter,
} from "./fiscalYearFilters";

const START = "2026-07-01";
const END = "2027-06-30";

describe("buildApplicationFiscalYearFilter", () => {
  it("returns null when FY is unset so Reset shows the unscoped list", () => {
    expect(buildApplicationFiscalYearFilter(null, null)).toBeNull();
    expect(buildApplicationFiscalYearFilter(START, null)).toBeNull();
    expect(buildApplicationFiscalYearFilter(null, END)).toBeNull();
    expect(buildApplicationFiscalYearFilter("", END)).toBeNull();
  });

  it("matches Summary: pending apps by createdAt, others by committee_date", () => {
    expect(buildApplicationFiscalYearFilter(START, END)).toEqual({
      $or: [
        {
          status: {
            name: { $in: ["New Application", "Awaiting Committee"] },
          },
          createdAt: { $between: [START, END] },
        },
        {
          status: {
            name: { $notIn: ["New Application", "Awaiting Committee"] },
          },
          committee_date: { $between: [START, END] },
        },
      ],
    });
  });
});

describe("buildScoreFiscalYearFilter", () => {
  it("returns null when FY is unset", () => {
    expect(buildScoreFiscalYearFilter(null, null)).toBeNull();
  });

  it("nests the same application FY rule under grant_application", () => {
    expect(buildScoreFiscalYearFilter(START, END)).toEqual({
      grant_application: buildApplicationFiscalYearFilter(START, END),
    });
  });
});

describe("buildApplicationListFilter", () => {
  it("keeps grant + status and omits FY when Reset", () => {
    expect(buildApplicationListFilter(4, ["3"], null, null)).toEqual({
      grant: 4,
      status: ["3"],
    });
  });

  it("omits status when none are selected", () => {
    expect(buildApplicationListFilter(4, [], START, END)).toEqual({
      grant: 4,
      ...buildApplicationFiscalYearFilter(START, END),
    });
  });

  it("combines grant, selected statuses, and FY without dropping siblings", () => {
    expect(
      buildApplicationListFilter("grantdocumentidxxx", ["s1", "s2"], START, END)
    ).toEqual({
      grant: "grantdocumentidxxx",
      status: ["s1", "s2"],
      ...buildApplicationFiscalYearFilter(START, END),
    });
  });
});
