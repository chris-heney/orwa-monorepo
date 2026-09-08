import { describe, expect, it } from "vitest";
import {
  activeMetricContestants,
  buildContestantMetricsFilter,
} from "./conferenceMetricContestants";

describe("conferenceMetricContestants", () => {
  it("does not add a brittle status filter to the scoped metrics fetch", () => {
    expect(buildContestantMetricsFilter({ conference: 3, year: 2026 })).toEqual({
      conference: 3,
      year: 2026,
    });
  });

  it("keeps legacy missing and null statuses active while excluding cancelled rows", () => {
    expect(
      activeMetricContestants([
        { id: "active", status: "active" },
        { id: "missing" },
        { id: "null", status: null },
        { id: "cancelled", status: "cancelled" },
      ])
    ).toEqual([
      { id: "active", status: "active" },
      { id: "missing" },
      { id: "null", status: null },
    ]);
  });
});
