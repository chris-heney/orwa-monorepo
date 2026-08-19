import { describe, expect, it } from "vitest";
import { buildAwardMetrics } from "./metrics";

describe("buildAwardMetrics", () => {
  const nominations = [
    {
      id: 1,
      nomination_status: "Winner" as const,
      award_type: "Excellence in Operations",
      award_year: 2026,
      system_name: "RWD #1",
    },
    {
      id: 2,
      nomination_status: "Submitted" as const,
      award_type: "Excellence in Management",
      award_year: 2026,
      system_name: "City of Edmond",
    },
    {
      id: 3,
      nomination_status: "Not Selected" as const,
      award_type: "Excellence in Operations",
      award_year: 2025,
      system_name: "RWD #1",
    },
  ];

  it("counts winners and types for a year", () => {
    const metrics = buildAwardMetrics(nominations, 2026);
    expect(metrics.total).toBe(2);
    expect(metrics.byStatus.map((row) => row.status)).toEqual([
      "Submitted",
      "Winner",
    ]);
    expect(metrics.byType["Excellence in Operations"]).toBe(1);
  });
});
