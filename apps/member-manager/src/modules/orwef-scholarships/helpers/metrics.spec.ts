import { describe, expect, it } from "vitest";
import { buildScholarshipMetrics, resolveScholarshipYear, yearOf } from "./metrics";

describe("buildScholarshipMetrics", () => {
  const applications = [
    {
      id: 1,
      application_status: "Submitted" as const,
      submission_date: "2026-03-01",
      system_name: "RWD #1",
      relationship: "Self",
    },
    {
      id: 2,
      application_status: "Approved" as const,
      submission_date: "2026-04-01",
      system_name: "RWD #1",
      relationship: "DependentChild",
    },
    {
      id: 3,
      application_status: "Denied" as const,
      submission_date: "2025-04-01",
      system_name: "City of Edmond",
      relationship: "Self",
    },
  ];

  it("counts statuses and hides zeros", () => {
    const metrics = buildScholarshipMetrics(applications, "all");
    expect(metrics.total).toBe(3);
    expect(metrics.byStatus.map((row) => row.status)).toEqual([
      "Submitted",
      "Approved",
      "Denied",
    ]);
    expect(metrics.bySystem["RWD #1"]).toBe(2);
  });

  it("filters to a single year", () => {
    const metrics = buildScholarshipMetrics(applications, 2026);
    expect(metrics.total).toBe(2);
    expect(metrics.byYear[2026]).toBe(2);
    expect(metrics.byYear[2025]).toBeUndefined();
  });

  it("files a stamped scholarship_year ahead of the submission date", () => {
    expect(yearOf({ id: 4, scholarship_year: 2027, submission_date: "2026-10-15" })).toBe(2027);
    expect(yearOf({ id: 5, scholarship_year: "2027", submission_date: "2026-10-15" })).toBe(2027);
    expect(yearOf({ id: 7, scholarship_year: 2025, submission_date: "2026-10-15" })).toBe(2025);
    const metrics = buildScholarshipMetrics(
      [...applications, { id: 4, application_status: "Submitted" as const, scholarship_year: 2027, submission_date: "2026-10-15" }],
      2027
    );
    expect(metrics.total).toBe(1);
    expect(metrics.byYear[2027]).toBe(1);
  });

  it("legacy rows (null scholarship_year) derive the cycle year from the submission date", () => {
    // Same May rollover as the list filter and the Strapi stamp.
    expect(yearOf({ id: 6, scholarship_year: null, submission_date: "2026-10-15" })).toBe(2027);
    expect(yearOf({ id: 8, scholarship_year: null, submission_date: "2025-11-12T15:00:00" })).toBe(2026);
    expect(yearOf({ id: 9, scholarship_year: null, submission_date: "2026-01-20T09:00:00" })).toBe(2026);
    expect(yearOf({ id: 10, scholarship_year: null, submission_date: "2026-04-30" })).toBe(2026);
    expect(yearOf({ id: 11, scholarship_year: null, submission_date: "2026-05-01" })).toBe(2027);
    expect(yearOf({ id: 12, submission_date: null, createdAt: "2026-08-19T12:00:00.000Z" })).toBe(2027);
    expect(yearOf({ id: 13, scholarship_year: null, submission_date: "garbage" })).toBeNull();
    expect(yearOf({ id: 14 })).toBeNull();
  });

  it("reports whether the year was derived so the Show page can hint at it", () => {
    expect(resolveScholarshipYear({ scholarship_year: 2027 })).toEqual({ year: 2027, derived: false });
    expect(resolveScholarshipYear({ scholarship_year: null, submission_date: "2026-08-27" })).toEqual({
      year: 2027,
      derived: true,
    });
    expect(resolveScholarshipYear({})).toEqual({ year: null, derived: true });
  });
});
