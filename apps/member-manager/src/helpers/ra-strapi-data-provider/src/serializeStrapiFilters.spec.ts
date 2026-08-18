import { describe, expect, it } from "vitest";
import {
  appendFilterQuery,
  convertRaParamsToStrapiParams,
  documentIdFilterPath,
  isDocumentId,
} from "./serializeStrapiFilters";

const DOC = "w3wzeuycgq136zyx3pzp9vnu";
const DOC2 = "b2dssimoi6cw2ttcf7zj43da";

describe("isDocumentId", () => {
  it("accepts Strapi nanoid-like documentIds", () => {
    expect(isDocumentId(DOC)).toBe(true);
  });
  it("rejects numerics, enums, and labels", () => {
    expect(isDocumentId("20320")).toBe(false);
    expect(isDocumentId(20320)).toBe(false);
    expect(isDocumentId("Reimbursement")).toBe(false);
    expect(isDocumentId("Administrative")).toBe(false);
    expect(isDocumentId("Paid in Full")).toBe(false);
  });
});

describe("documentIdFilterPath", () => {
  it("rewrites id → documentId", () => {
    expect(documentIdFilterPath("filters", "id")).toBe("filters[documentId]");
  });
  it("rewrites relation keys to [key][documentId]", () => {
    expect(documentIdFilterPath("filters", "application")).toBe(
      "filters[application][documentId]"
    );
  });
});

describe("appendFilterQuery", () => {
  it("keeps bare numeric relation filters", () => {
    const out: string[] = [];
    appendFilterQuery(out, "application", 20320);
    expect(out).toEqual(["filters[application]=20320"]);
  });

  it("rewrites documentId relation filters", () => {
    const out: string[] = [];
    appendFilterQuery(out, "application", DOC);
    expect(out).toEqual([`filters[application][documentId]=${DOC}`]);
  });

  it("rewrites documentId primary-key filters", () => {
    const out: string[] = [];
    appendFilterQuery(out, "id", DOC);
    expect(out).toEqual([`filters[documentId]=${DOC}`]);
  });

  it("rewrites documentIds inside $in", () => {
    const out: string[] = [];
    appendFilterQuery(out, "status", { $in: [DOC, DOC2] });
    expect(out).toEqual([
      `filters[status][documentId][$in][]=${DOC}`,
      `filters[status][documentId][$in][]=${DOC2}`,
    ]);
  });

  it("keeps numeric $in unchanged", () => {
    const out: string[] = [];
    appendFilterQuery(out, "status", { $in: [1, 3] });
    expect(out).toEqual([
      "filters[status][$in][]=1",
      "filters[status][$in][]=3",
    ]);
  });

  it("preserves nested $between under a relation", () => {
    const out: string[] = [];
    appendFilterQuery(out, "application", {
      committee_date: { $between: ["2025-07-01", "2026-06-30"] },
    });
    expect(out).toEqual([
      "filters[application][committee_date][$between][0]=2025-07-01",
      "filters[application][committee_date][$between][1]=2026-06-30",
    ]);
  });

  it("drops NaN / 'NaN' filter leaves (parseInt(documentId) footgun)", () => {
    const out: string[] = [];
    appendFilterQuery(out, "conference_ticket", Number.NaN);
    appendFilterQuery(out, "conference_ticket", "NaN");
    expect(out).toEqual([]);
  });
});

describe("convertRaParamsToStrapiParams", () => {
  const page = { page: 1, perPage: 100 };

  it("builds full query with documentId rewrite", () => {
    const qs = convertRaParamsToStrapiParams({
      sort: { field: "id", order: "ASC" },
      filter: { application: DOC, type: "Reimbursement" },
      pagination: page,
    });
    expect(qs).toContain("sort=id:asc");
    expect(qs).toContain(`filters[application][documentId]=${DOC}`);
    expect(qs).toContain("filters[type]=Reimbursement");
    expect(qs).toContain("pagination[start]=0&pagination[limit]=100");
  });

  it("rewrites $or branches", () => {
    const qs = convertRaParamsToStrapiParams({
      filter: { $or: [{ grant: DOC }, { grant: 4 }] },
      pagination: page,
    });
    expect(qs).toContain(`filters[$or][0][grant][documentId]=${DOC}`);
    expect(qs).toContain("filters[$or][1][grant]=4");
  });

  it("keeps grant/status siblings when $or is also present", () => {
    const qs = convertRaParamsToStrapiParams({
      filter: {
        grant: 4,
        status: ["3"],
        $or: [
          { createdAt: { $between: ["2026-07-01", "2027-06-30"] } },
          { committee_date: { $between: ["2026-07-01", "2027-06-30"] } },
        ],
      },
      pagination: page,
    });
    expect(qs).toContain("filters[grant]=4");
    expect(qs).toContain("filters[status][$in][]=3");
    expect(qs).toContain(
      "filters[$or][0][createdAt][$between][0]=2026-07-01"
    );
    expect(qs).toContain(
      "filters[$or][1][committee_date][$between][1]=2027-06-30"
    );
  });

  it("serializes nested $or under a relation (scores → application FY)", () => {
    const qs = convertRaParamsToStrapiParams({
      filter: {
        grant_application: {
          $or: [
            {
              status: { name: { $in: ["New Application"] } },
              createdAt: { $between: ["2026-07-01", "2027-06-30"] },
            },
            {
              committee_date: { $between: ["2026-07-01", "2027-06-30"] },
            },
          ],
        },
      },
      pagination: page,
    });
    expect(qs).toContain(
      "filters[grant_application][$or][0][status][name][$in][]=New%20Application"
    );
    expect(qs).toContain(
      "filters[grant_application][$or][0][createdAt][$between][0]=2026-07-01"
    );
    expect(qs).toContain(
      "filters[grant_application][$or][1][committee_date][$between][1]=2027-06-30"
    );
  });

  it("serializes $notIn the same way as $nin", () => {
    const out: string[] = [];
    appendFilterQuery(out, "name", {
      $notIn: ["New Application", "Awaiting Committee"],
    });
    expect(out).toEqual([
      "filters[name][$notIn][]=New%20Application",
      "filters[name][$notIn][]=Awaiting%20Committee",
    ]);
  });

  it("rewrites bare id arrays as documentId $in", () => {
    const qs = convertRaParamsToStrapiParams({
      filter: { id: [DOC, DOC2] },
      pagination: page,
    });
    expect(qs).toContain(`filters[documentId][$in][]=${DOC}`);
    expect(qs).toContain(`filters[documentId][$in][]=${DOC2}`);
  });
});
