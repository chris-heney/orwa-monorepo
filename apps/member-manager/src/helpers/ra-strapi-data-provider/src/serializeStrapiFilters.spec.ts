import { describe, expect, it } from "vitest";
import {
  appendFilterQuery,
  convertRaParamsToStrapiParams,
  documentIdFilterPath,
  isDocumentId,
} from "./serializeStrapiFilters";
import { contestantChoicesFilter } from "../../../modules/conference/helpers/listQueryFilters";

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

describe("relation filters", () => {
  // Water Systems "Contact Title" filter: Strapi's oneToMany relation filter is
  // existential, so this keeps systems where ANY contact holds ANY of the
  // selected titles. A dropped nested `$in` returns every row instead of none,
  // so assert the emitted path rather than trusting the recursion.
  it("looks through a oneToMany relation for an $in on a text field", () => {
    const out: string[] = [];
    appendFilterQuery(out, "contacts", {
      title: { $in: ["Manager", "Vice-Chairman"] },
    });

    expect(out).toEqual([
      "filters[contacts][title][$in][]=Manager",
      "filters[contacts][title][$in][]=Vice-Chairman",
    ]);
  });

  it("keeps the relation filter alongside the list's other filters", () => {
    const qs = convertRaParamsToStrapiParams({
      filter: {
        region: "Region 1",
        contacts: { title: { $in: ["Operator"] } },
      },
      pagination: { page: 1, perPage: 25 },
    });

    expect(qs).toContain("filters[region]=Region%201");
    expect(qs).toContain("filters[contacts][title][$in][]=Operator");
    expect(qs).not.toContain("object Object");
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

  it("never treats a text-search term as a documentId (Settings tab search)", () => {
    const out: string[] = [];
    // 18 lowercase alphanumerics — shaped like a documentId, but it is a name.
    appendFilterQuery(out, "contact", {
      first: { $containsi: "christopherjohnson" },
    });
    appendFilterQuery(out, "instructor", {
      email: { $startsWithi: "sustainabilityspec" },
    });
    expect(out).toEqual([
      "filters[contact][first][$containsi]=christopherjohnson",
      "filters[instructor][email][$startsWithi]=sustainabilityspec",
    ]);
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

  // A boolean group nested inside another one used to fall through to the
  // array-leaf branch and serialize as `[$in][]=[object Object]`, which Strapi
  // silently matches nothing for.
  it("serializes an $or group nested inside $and", () => {
    const qs = convertRaParamsToStrapiParams({
      filter: {
        conference: 3,
        $and: [
          { $or: [{ first: { $contains: "ann" } }] },
          { $or: [{ status: { $eq: "active" } }, { status: { $null: true } }] },
        ],
      },
      pagination: page,
    });

    expect(qs).not.toContain("object Object");
    expect(qs).toContain("filters[$and][0][$or][0][first][$contains]=ann");
    expect(qs).toContain("filters[$and][1][$or][0][status][$eq]=active");
    expect(qs).toContain("filters[$and][1][$or][1][status][$null]=true");
    expect(qs).toContain("filters[conference]=3");
  });

  it("serializes a nested group reached through appendFilterQuery directly", () => {
    const out: string[] = [];
    appendFilterQuery(out, "$or", [{ status: { $eq: "active" } }], "filters[$and][0]");

    expect(out).toEqual(["filters[$and][0][$or][0][status][$eq]=active"]);
  });
  // The contestant pickers offer active-or-legacy contestants plus whatever is
  // already linked, so a cancelled contestant stays visible where it is used
  // without becoming assignable anywhere new.
  it("serializes the contestant picker's active-or-linked choice filter", () => {
    const qs = convertRaParamsToStrapiParams({
      filter: contestantChoicesFilter([{ documentId: DOC }, { id: 99 }]),
      pagination: page,
    });

    expect(qs).not.toContain("object Object");
    expect(qs).toContain("filters[$or][0][status][$eq]=active");
    expect(qs).toContain("filters[$or][1][status][$null]=true");
    expect(qs).toContain(`filters[$or][2][documentId][$in][]=${DOC}`);
    expect(qs).toContain("filters[$or][3][id][$in][]=99");
    expect(qs).not.toContain("cancelled");
  });
});

describe("documentIdFilterPath", () => {
  // `documentId` already addresses the row, so looking through it for another
  // documentId asks Strapi for a field that does not exist.
  it("does not look through a key that is already documentId", () => {
    expect(documentIdFilterPath("filters", "documentId")).toBe(
      "filters[documentId]"
    );
    expect(documentIdFilterPath("filters", "id")).toBe("filters[documentId]");
    expect(documentIdFilterPath("filters", "team")).toBe(
      "filters[team][documentId]"
    );
  });

  it("keeps a documentId equality on the documentId field itself", () => {
    const out: string[] = [];
    appendFilterQuery(out, "documentId", { $eq: DOC });

    expect(out).toEqual([`filters[documentId][$eq]=${DOC}`]);
  });
});
