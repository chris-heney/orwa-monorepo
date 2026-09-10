import { describe, expect, it } from "vitest";
import {
  activeMetricContestants,
  buildContestantMetricsFilter,
  deriveConferenceRevenueBreakdown,
} from "./conferenceMetricContestants";
import { summarizeContestSports } from "./contestSport";

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

  it("keeps cancelled golfers and their teams out of the Contest Corner totals", () => {
    const contestants = [
      {
        id: "a",
        status: "active",
        conference_ticket: { id: 1, name: "Golfer" },
        team: { id: 7, name: "Aqua" },
      },
      {
        id: "b",
        status: "cancelled",
        conference_ticket: { id: 1, name: "Golfer" },
        team: { id: 9, name: "Wells" },
      },
      {
        id: "c",
        status: "active",
        conference_ticket: { id: 2, name: "Fishing Tournament" },
      },
    ];

    expect(
      summarizeContestSports(activeMetricContestants(contestants))
    ).toEqual({ fishers: 1, golfers: 1, golfTeams: 1, total: 2 });
  });
});
