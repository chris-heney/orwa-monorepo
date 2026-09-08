import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@strapi/strapi", () => ({
  factories: {
    createCoreService: vi.fn(() => ({})),
  },
}));

import { createContestant, updateContestant } from "./conference-contestant";

type ConferenceRecord = {
  documentId: string;
  available_contestants: number | null;
};

type TicketRecord = {
  documentId: string;
  name: string;
  context?: string | null;
};

describe("conference contestant REST write service", () => {
  let strapi: any;
  let conferences: Record<string, ConferenceRecord>;
  let tickets: Record<string, TicketRecord>;
  let contestants: Record<string, { documentId: string; status: string }>;
  let created: any[];
  let updated: any[];
  let decrements: number;
  let locks: string[];

  beforeEach(() => {
    conferences = {
      "conf-1": { documentId: "conf-1", available_contestants: 2 },
      "sold-out-conf": { documentId: "sold-out-conf", available_contestants: 0 },
    };
    tickets = {
      golfer: { documentId: "golfer", name: "Golfer", context: "Contestant" },
      standalone: {
        documentId: "standalone",
        name: "Golfer - Contestant Only",
        context: null,
      },
      fisher: { documentId: "fisher", name: "Fisher", context: "Contestant" },
    };
    contestants = {
      "active-1": { documentId: "active-1", status: "active" },
      "cancelled-1": { documentId: "cancelled-1", status: "cancelled" },
    };
    created = [];
    updated = [];
    decrements = 0;
    locks = [];

    const makeBuilder = (table: string) => {
      let criteria: Record<string, unknown> = {};
      const builder = {
        where: vi.fn((next: Record<string, unknown>) => {
          criteria = next;
          return builder;
        }),
        forUpdate: vi.fn(() => {
          locks.push(`${table}:${criteria.document_id}`);
          return builder;
        }),
        transacting: vi.fn(() => builder),
        first: vi.fn(async () => {
          if (table === "conferences") {
            return conferences[String(criteria.document_id)] ?? null;
          }
          return null;
        }),
        decrement: vi.fn((_column: string, amount = 1) => {
          decrements += amount;
          conferences[String(criteria.document_id)].available_contestants! -= amount;
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
        connection: vi.fn((table: string) => makeBuilder(table)),
      },
      documents: vi.fn((uid: string) => {
        if (uid === "api::conference.conference") {
          return {
            findOne: vi.fn(async ({ documentId }: { documentId: string }) =>
              conferences[documentId] ? structuredClone(conferences[documentId]) : null
            ),
          };
        }
        if (uid === "api::conference-ticket.conference-ticket") {
          return {
            findOne: vi.fn(async ({ documentId }: { documentId: string }) =>
              tickets[documentId] ? structuredClone(tickets[documentId]) : null
            ),
          };
        }
        expect(uid).toBe("api::conference-contestant.conference-contestant");
        return {
          findOne: vi.fn(async ({ documentId }: { documentId: string }) =>
            contestants[documentId] ? structuredClone(contestants[documentId]) : null
          ),
          create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => {
            const row = { documentId: `contestant-${created.length + 1}`, ...data };
            created.push(row);
            return row;
          }),
          update: vi.fn(async ({ documentId, data }: { documentId: string; data: Record<string, unknown> }) => {
            const row = { documentId, ...data };
            updated.push(row);
            return row;
          }),
        };
      }),
    };
  });

  it("rejects direct lifecycle fields on create and update", async () => {
    await expect(
      createContestant(strapi, {
        data: { conference: "conf-1", conference_ticket: "golfer", status: "cancelled" },
      })
    ).rejects.toThrow("cancel/restore actions");

    await expect(
      updateContestant(strapi, {
        documentId: "contestant-1",
        data: { cancelled_reason: "manual write" },
      })
    ).rejects.toThrow("cancel/restore actions");
    expect(created).toHaveLength(0);
    expect(updated).toHaveLength(0);
  });

  it("rejects relation changes on update with a cancel-and-create instruction", async () => {
    await expect(
      updateContestant(strapi, {
        documentId: "contestant-1",
        data: { conference_ticket: "fisher" },
      })
    ).rejects.toThrow("Cancel and create");
    expect(updated).toHaveLength(0);
  });

  it("allows personal edits on active contestants but keeps cancelled contestants read-only", async () => {
    await updateContestant(strapi, {
      documentId: "active-1",
      data: { first: "Grace", fee: 125 },
    });

    expect(updated).toEqual([{ documentId: "active-1", first: "Grace", fee: 125 }]);

    await expect(
      updateContestant(strapi, {
        documentId: "cancelled-1",
        data: { first: "Changed" },
      })
    ).rejects.toThrow("Cancelled conference contestants are read-only");
    expect(updated).toHaveLength(1);
  });

  it("rejects sold-out golfer creates before persistence", async () => {
    await expect(
      createContestant(strapi, {
        data: { conference: "sold-out-conf", conference_ticket: "golfer" },
      })
    ).rejects.toThrow("sold out");
    expect(created).toHaveLength(0);
    expect(decrements).toBe(0);
  });

  it("creates a golfer and decrements capacity once", async () => {
    await createContestant(strapi, {
      data: { conference: "conf-1", conference_ticket: "golfer", first: "Ada" },
    });

    expect(created).toHaveLength(1);
    expect(decrements).toBe(1);
    expect(conferences["conf-1"].available_contestants).toBe(1);
    expect(locks).toContain("conferences:conf-1");
  });

  it("creates contextless Golfer - Contestant Only and decrements capacity once", async () => {
    await createContestant(strapi, {
      data: { conference: "conf-1", conference_ticket: "standalone" },
    });

    expect(created).toHaveLength(1);
    expect(decrements).toBe(1);
  });

  it("creates non-golf contestants without adjusting golf capacity", async () => {
    await createContestant(strapi, {
      data: { conference: "conf-1", conference_ticket: "fisher" },
    });

    expect(created).toHaveLength(1);
    expect(decrements).toBe(0);
    expect(conferences["conf-1"].available_contestants).toBe(2);
  });
});
