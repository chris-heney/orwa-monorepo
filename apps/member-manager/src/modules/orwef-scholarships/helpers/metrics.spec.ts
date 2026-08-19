import { describe, expect, it } from "vitest";
import { buildScholarshipMetrics } from "./metrics";

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
});
