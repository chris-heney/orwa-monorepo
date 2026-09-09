import { describe, expect, it, vi } from "vitest";

import createConferenceSummaryService from "./conference-summary";

describe("conference-summary service", () => {
  it("requests not-cancelled contestants when building head counts so legacy null rows stay visible", async () => {
    const attendeeFindMany = vi.fn(async () => []);
    const contestantFindMany = vi.fn(async () => []);

    const strapi = {
      documents: vi.fn((uid: string) => {
        if (uid === "api::conference-attendee.conference-attendee") {
          return { findMany: attendeeFindMany };
        }
        if (uid === "api::conference-contestant.conference-contestant") {
          return { findMany: contestantFindMany };
        }
        throw new Error(`Unexpected UID ${uid}`);
      }),
    };

    const service = createConferenceSummaryService({ strapi });

    await service.getHeadCounts("3", "2026");

    expect(contestantFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        filters: {
          conference: "3",
          year: "2026",
          $or: [{ status: { $eq: "active" } }, { status: { $null: true } }],
        },
      })
    );
  });
});
