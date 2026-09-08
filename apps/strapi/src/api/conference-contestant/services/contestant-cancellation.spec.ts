import { beforeEach, describe, expect, it, vi } from "vitest";

import { cancelContestant, restoreContestant } from "./contestant-cancellation";

const input = {
  documentId: "golfer-1",
  reason: "2026 Fall golf overage - pending card refund",
  actor: "staff@example.org",
};

const restoreInput = {
  documentId: "golfer-1",
  reason: "Restore golfer slot",
  actor: "staff@example.org",
};

const fisherInput = {
  documentId: "fisher-1",
  reason: "Wrong contestant",
  actor: "staff@example.org",
};

type ContestantRecord = {
  documentId: string;
  status: "active" | "cancelled";
  fee: number;
  items: Array<Record<string, unknown>>;
  conference: {
    documentId: string;
    available_contestants: number;
  };
  conference_ticket: {
    name: string;
    context: "Contestant";
  };
  registration: {
    documentId: string;
    total: number;
  };
  team: {
    documentId: string;
  };
  cancelled_at?: string | null;
  cancelled_reason?: string | null;
  cancelled_by?: string | null;
};

const clone = <T>(value: T): T => structuredClone(value);

describe("contestant cancellation service", () => {
  let strapi: any;
  let contestants: Record<string, ContestantRecord>;
  let capacityDelta: number;
  let capacityIncrementCalls: number;
  let statusUpdateCalls: number;
  let transactionTokens: unknown[];

  beforeEach(() => {
    contestants = {
      "golfer-1": {
        documentId: "golfer-1",
        status: "active",
        fee: 150,
        items: [{ label: "Mulligan", value: "5" }],
        conference: { documentId: "conference-1", available_contestants: 1 },
        conference_ticket: {
          name: "Golfer - Contestant Only",
          context: "Contestant",
        },
        registration: { documentId: "reg-1", total: 300 },
        team: { documentId: "team-1" },
      },
      "fisher-1": {
        documentId: "fisher-1",
        status: "active",
        fee: 75,
        items: [{ label: "Bait", value: "1" }],
        conference: { documentId: "conference-1", available_contestants: 1 },
        conference_ticket: {
          name: "Fisher - Contestant Only",
          context: "Contestant",
        },
        registration: { documentId: "reg-1", total: 300 },
        team: { documentId: "team-2" },
      },
    };
    capacityDelta = 0;
    capacityIncrementCalls = 0;
    statusUpdateCalls = 0;
    transactionTokens = [];

    const makeCapacityBuilder = () => {
      const builder = {
        where: vi.fn(() => builder),
        increment: vi.fn((_column: string, amount = 1) => {
          capacityIncrementCalls += 1;
          capacityDelta += amount;
          contestants["golfer-1"].conference.available_contestants += amount;
          return builder;
        }),
        decrement: vi.fn((_column: string, amount = 1) => {
          capacityDelta -= amount;
          contestants["golfer-1"].conference.available_contestants -= amount;
          return builder;
        }),
        transacting: vi.fn((trx: unknown) => {
          transactionTokens.push(trx);
          return Promise.resolve(1);
        }),
      };
      return builder;
    };

    strapi = {
      db: {
        transaction: vi.fn(async (callback: (args: { trx: unknown }) => unknown) =>
          callback({ trx: "trx-token" })
        ),
        connection: vi.fn(() => makeCapacityBuilder()),
      },
      documents: vi.fn((uid: string) => {
        expect(uid).toBe("api::conference-contestant.conference-contestant");
        return {
          findOne: vi.fn(async ({ documentId }: { documentId: string }) =>
            contestants[documentId] ? clone(contestants[documentId]) : null
          ),
          update: vi.fn(
            async ({
              documentId,
              data,
            }: {
              documentId: string;
              data: Partial<ContestantRecord>;
            }) => {
              statusUpdateCalls += 1;
              contestants[documentId] = {
                ...contestants[documentId],
                ...data,
              };
              return clone(contestants[documentId]);
            }
          ),
        };
      }),
    };
  });

  it("cancels a golfer without changing fee, items, or relations", async () => {
    const result = await cancelContestant(strapi, input);

    expect(result).toMatchObject({
      status: "cancelled",
      fee: 150,
      items: [{ label: "Mulligan", value: "5" }],
      registration: { documentId: "reg-1" },
      team: { documentId: "team-1" },
    });
    expect(capacityDelta).toBe(1);
    expect(transactionTokens).toEqual(["trx-token"]);
  });

  it("does not increment capacity when cancel is repeated", async () => {
    await cancelContestant(strapi, input);
    await cancelContestant(strapi, input);

    expect(capacityIncrementCalls).toBe(1);
  });

  it("does not change golf capacity for a Fisher", async () => {
    await cancelContestant(strapi, fisherInput);

    expect(capacityIncrementCalls).toBe(0);
    expect(capacityDelta).toBe(0);
  });

  it("rejects restoring a golfer when no capacity remains", async () => {
    contestants["golfer-1"].status = "cancelled";
    contestants["golfer-1"].conference.available_contestants = 0;

    await expect(restoreContestant(strapi, restoreInput)).rejects.toThrow(
      "sold out"
    );
    expect(statusUpdateCalls).toBe(0);
  });

  it("restores a golfer once and clears cancellation audit fields", async () => {
    contestants["golfer-1"] = {
      ...contestants["golfer-1"],
      status: "cancelled",
      cancelled_at: "2026-09-08T00:00:00.000Z",
      cancelled_reason: "Pending refund",
      cancelled_by: "staff@example.org",
    };

    const result = await restoreContestant(strapi, restoreInput);
    await restoreContestant(strapi, restoreInput);

    expect(result).toMatchObject({
      status: "active",
      cancelled_at: null,
      cancelled_reason: null,
      cancelled_by: null,
    });
    expect(capacityDelta).toBe(-1);
    expect(statusUpdateCalls).toBe(1);
  });

  it("rejects cancellation without a reason before side effects", async () => {
    await expect(
      cancelContestant(strapi, { ...input, reason: "   " })
    ).rejects.toThrow("reason");

    expect(statusUpdateCalls).toBe(0);
    expect(capacityIncrementCalls).toBe(0);
  });
});
