import { beforeEach, describe, expect, it, vi } from "vitest";

import { hardDeleteContestantForRegistrationRemoval } from "./contestant-hard-delete";

type ContestantRow = {
  documentId: string;
  status?: string | null;
  conference: { documentId: string; available_contestants: number };
  conference_ticket: { name: string; context?: string | null };
};

describe("contestant hard delete for registration removal", () => {
  let strapi: any;
  let contestants: Record<string, ContestantRow>;
  let deleted: string[];
  let capacityDelta: number;
  let failIncrement: boolean;

  beforeEach(() => {
    contestants = {
      golfer: {
        documentId: "golfer",
        status: "active",
        conference: { documentId: "conf-1", available_contestants: 0 },
        conference_ticket: { name: "Golfer", context: "Contestant" },
      },
      fisher: {
        documentId: "fisher",
        status: "active",
        conference: { documentId: "conf-1", available_contestants: 0 },
        conference_ticket: { name: "Fisher", context: "Contestant" },
      },
      cancelled: {
        documentId: "cancelled",
        status: "cancelled",
        conference: { documentId: "conf-1", available_contestants: 0 },
        conference_ticket: { name: "Golfer", context: "Contestant" },
      },
    };
    deleted = [];
    capacityDelta = 0;
    failIncrement = false;

    const makeBuilder = () => {
      let criteria: Record<string, unknown> = {};
      const builder = {
        where: vi.fn((next: Record<string, unknown>) => {
          criteria = next;
          return builder;
        }),
        forUpdate: vi.fn(() => builder),
        transacting: vi.fn(() => builder),
        first: vi.fn(async () => ({ document_id: criteria.document_id })),
        increment: vi.fn(async (_column: string, amount = 1) => {
          if (failIncrement) throw new Error("increment failed");
          capacityDelta += amount;
          return builder;
        }),
      };
      return builder;
    };

    strapi = {
      db: {
        transaction: vi.fn(async (callback: (args: { trx: unknown }) => unknown) =>
          callback({ trx: { id: "trx" } })
        ),
        connection: vi.fn(() => makeBuilder()),
      },
      documents: vi.fn((uid: string) => {
        expect(uid).toBe("api::conference-contestant.conference-contestant");
        return {
          findOne: vi.fn(async ({ documentId }: { documentId: string }) =>
            contestants[documentId] ? structuredClone(contestants[documentId]) : null
          ),
          delete: vi.fn(async ({ documentId }: { documentId: string }) => {
            deleted.push(documentId);
            return { documentId };
          }),
        };
      }),
    };
  });

  it("restores one slot before deleting an active golfer", async () => {
    await hardDeleteContestantForRegistrationRemoval(strapi, "golfer");

    expect(capacityDelta).toBe(1);
    expect(deleted).toEqual(["golfer"]);
  });

  it("does not adjust capacity for non-golf or already-cancelled contestants", async () => {
    await hardDeleteContestantForRegistrationRemoval(strapi, "fisher");
    await hardDeleteContestantForRegistrationRemoval(strapi, "cancelled");

    expect(capacityDelta).toBe(0);
    expect(deleted).toEqual(["fisher", "cancelled"]);
  });

  it("does not delete when capacity restoration fails", async () => {
    failIncrement = true;

    await expect(
      hardDeleteContestantForRegistrationRemoval(strapi, "golfer")
    ).rejects.toThrow("increment failed");

    expect(deleted).toEqual([]);
  });
});
