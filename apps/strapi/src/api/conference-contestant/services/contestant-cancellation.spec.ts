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
  let conferences: Record<string, { documentId: string; available_contestants: number }>;
  let capacityDelta: number;
  let capacityIncrementCalls: number;
  let statusUpdateCalls: number;
  let transactionTokens: unknown[];
  let lockEvents: string[];

  beforeEach(() => {
    conferences = {
      "conference-1": { documentId: "conference-1", available_contestants: 1 },
    };
    contestants = {
      "golfer-1": {
        documentId: "golfer-1",
        status: "active",
        fee: 150,
        items: [{ label: "Mulligan", value: "5" }],
        conference: conferences["conference-1"],
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
        conference: conferences["conference-1"],
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
    lockEvents = [];

    const hydrateContestant = (documentId: string) => {
      const contestant = contestants[documentId];
      if (!contestant) return null;
      return clone({
        ...contestant,
        conference: conferences[contestant.conference.documentId],
      });
    };

    const lockTails = new Map<string, Promise<void>>();
    const transactionReleases = new Map<unknown, Array<() => void>>();

    const acquireLock = async (key: string, trx: unknown) => {
      let release!: () => void;
      const previous = lockTails.get(key) ?? Promise.resolve();
      const next = new Promise<void>((resolve) => {
        release = resolve;
      });
      lockTails.set(
        key,
        previous.then(() => next)
      );
      await previous;
      lockEvents.push(key);
      transactionReleases.get(trx)?.push(release);
    };

    const makeCapacityBuilder = () => {
      let table = "";
      let criteria: Record<string, unknown> = {};
      let trx: unknown;
      let shouldLock = false;

      const builder = {
        table: (name: string) => {
          table = name;
          return builder;
        },
        where: vi.fn((nextCriteria: Record<string, unknown>) => {
          criteria = nextCriteria;
          return builder;
        }),
        transacting: vi.fn((nextTrx: unknown) => {
          trx = nextTrx;
          transactionTokens.push(nextTrx);
          return builder;
        }),
        forUpdate: vi.fn(() => {
          shouldLock = true;
          return builder;
        }),
        first: vi.fn(async () => {
          if (shouldLock && trx) {
            await acquireLock(`${table}:${criteria.document_id}`, trx);
          }
          if (table === "conference_contestants") {
            return contestants[String(criteria.document_id)] ?? null;
          }
          if (table === "conferences") {
            return conferences[String(criteria.document_id)] ?? null;
          }
          return null;
        }),
        increment: vi.fn((_column: string, amount = 1) => {
          capacityIncrementCalls += 1;
          capacityDelta += amount;
          conferences[String(criteria.document_id)].available_contestants += amount;
          return builder;
        }),
        decrement: vi.fn((_column: string, amount = 1) => {
          capacityDelta -= amount;
          conferences[String(criteria.document_id)].available_contestants -= amount;
          return builder;
        }),
      };
      return builder;
    };

    strapi = {
      db: {
        transaction: vi.fn(
          async (callback: (args: { trx: unknown }) => unknown) => {
            const trx = { id: transactionReleases.size + 1 };
            transactionReleases.set(trx, []);
            try {
              return await callback({ trx });
            } finally {
              const releases = transactionReleases.get(trx) ?? [];
              releases.reverse().forEach((release) => release());
              transactionReleases.delete(trx);
            }
          }
        ),
        connection: vi.fn((table: string) => makeCapacityBuilder().table(table)),
      },
      documents: vi.fn((uid: string) => {
        expect(uid).toBe("api::conference-contestant.conference-contestant");
        return {
          findOne: vi.fn(async ({ documentId }: { documentId: string }) =>
            hydrateContestant(documentId)
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
              return hydrateContestant(documentId);
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
    expect(lockEvents).toEqual([
      "conference_contestants:golfer-1",
      "conferences:conference-1",
    ]);
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

  it("increments capacity once when overlapping cancels race", async () => {
    const [first, second] = await Promise.all([
      cancelContestant(strapi, input),
      cancelContestant(strapi, input),
    ]);

    expect(first.status).toBe("cancelled");
    expect(second.status).toBe("cancelled");
    expect(contestants["golfer-1"].status).toBe("cancelled");
    expect(conferences["conference-1"].available_contestants).toBe(2);
    expect(capacityIncrementCalls).toBe(1);
  });

  it("decrements capacity once when overlapping restores race", async () => {
    contestants["golfer-1"] = {
      ...contestants["golfer-1"],
      status: "cancelled",
      cancelled_at: "2026-09-08T00:00:00.000Z",
      cancelled_reason: "Pending refund",
      cancelled_by: "staff@example.org",
    };

    const [first, second] = await Promise.all([
      restoreContestant(strapi, restoreInput),
      restoreContestant(strapi, restoreInput),
    ]);

    expect(first.status).toBe("active");
    expect(second.status).toBe("active");
    expect(contestants["golfer-1"].status).toBe("active");
    expect(conferences["conference-1"].available_contestants).toBe(0);
    expect(statusUpdateCalls).toBe(1);
  });

  it("allows only one of two cancelled golfers to restore into one remaining slot", async () => {
    contestants["golfer-1"] = {
      ...contestants["golfer-1"],
      status: "cancelled",
      cancelled_at: "2026-09-08T00:00:00.000Z",
      cancelled_reason: "Pending refund",
      cancelled_by: "staff@example.org",
    };
    contestants["golfer-2"] = {
      ...contestants["golfer-1"],
      documentId: "golfer-2",
      status: "cancelled",
      registration: { documentId: "reg-2", total: 150 },
      team: { documentId: "team-2" },
    };
    conferences["conference-1"].available_contestants = 1;

    const results = await Promise.allSettled([
      restoreContestant(strapi, restoreInput),
      restoreContestant(strapi, { ...restoreInput, documentId: "golfer-2" }),
    ]);

    expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    expect(results.filter((result) => result.status === "rejected")).toHaveLength(1);
    expect(
      results.some(
        (result) =>
          result.status === "rejected" &&
          String(result.reason?.message ?? result.reason).includes("sold out")
      )
    ).toBe(true);
    expect(conferences["conference-1"].available_contestants).toBe(0);
    expect(
      Object.values(contestants).filter(
        (contestant) =>
          contestant.status === "active" &&
          contestant.conference_ticket.name.includes("Golfer")
      )
    ).toHaveLength(1);
  });

  it("rejects cancellation without a reason before side effects", async () => {
    await expect(
      cancelContestant(strapi, { ...input, reason: "   " })
    ).rejects.toThrow("reason");

    expect(statusUpdateCalls).toBe(0);
    expect(capacityIncrementCalls).toBe(0);
  });
});
