import { describe, expect, it } from "vitest";
import {
  activeMetricContestants,
  buildContestantMetricsFilter,
  deriveConferenceRevenueBreakdown,
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

  it("separates cancelled pending-refund contestant fees from tickets and extras", () => {
    expect(
      deriveConferenceRevenueBreakdown({
        registrations: [{ total: 2000 }],
        booths: [],
        sponsors: [],
        contestants: [
          { fee: 400, status: "active" },
          {
            fee: 1600,
            status: "cancelled",
            cancelled_reason: "2026 Fall golf overage — pending card refund",
          },
        ],
      })
    ).toEqual({
      total: 2000,
      booths: 0,
      sponsorships: 0,
      activeContestants: 400,
      cancelledPendingRefundContestants: 1600,
      ticketsExtras: 0,
    });
  });
});
