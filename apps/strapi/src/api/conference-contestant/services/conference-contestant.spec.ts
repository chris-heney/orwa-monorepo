import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@strapi/strapi", () => ({
  factories: {
    createCoreService: vi.fn(() => ({})),
  },
}));

import { createContestant, updateContestant } from "./conference-contestant";

type ConferenceRecord = {
  id?: number;
  documentId: string;
  available_contestants: number | null;
  registration_start?: string;
  registration_end?: string;
  start_date?: string;
  end_date?: string;
};

type TicketRecord = {
  id?: number;
  documentId: string;
  name: string;
  context?: string | null;
  conferences?: Array<{ documentId: string }>;
};

describe("conference contestant REST write service", () => {
  let strapi: any;
  let conferences: Record<string, ConferenceRecord>;
  let tickets: Record<string, TicketRecord>;
  let contestants: Record<string, {
    documentId: string;
    status: string;
    cancelled_at?: string | null;
    cancelled_reason?: string | null;
    cancelled_by?: string | null;
    conference?: { id?: number; documentId?: string };
    conference_ticket?: { id?: number; documentId?: string };
  }>;
  let created: any[];
  let updated: any[];
  let decrements: number;
  let locks: string[];

  beforeEach(() => {
    conferences = {
      "conf-1": {
        id: 3,
        documentId: "conf-1",
        available_contestants: 2,
        registration_start: "2026-01-01",
        registration_end: "2026-12-31",
      },
      "conf-no-dates": {
        id: 4,
        documentId: "conf-no-dates",
        available_contestants: 2,
      },
      "conf-2": {
        documentId: "conf-2",
        available_contestants: 4,
        registration_start: "2026-01-01",
        registration_end: "2026-12-31",
      },
      "conf-event-year": {
        id: 5,
        documentId: "conf-event-year",
        available_contestants: 2,
        start_date: "2026-09-14",
        end_date: "2026-09-16",
        registration_start: "2025-11-01",
        registration_end: "2026-09-01",
      },
      "sold-out-conf": {
        documentId: "sold-out-conf",
        available_contestants: 0,
        registration_start: "2026-01-01",
        registration_end: "2026-12-31",
      },
    };
    tickets = {
      golfer: {
        id: 37,
        documentId: "golfer",
        name: "Golfer",
        context: "Contestant",
        conferences: [
          { id: 3, documentId: "conf-1" },
          { documentId: "sold-out-conf" },
          { id: 4, documentId: "conf-no-dates" },
          { id: 5, documentId: "conf-event-year" },
        ],
      },
      standalone: {
        documentId: "standalone",
        name: "Golfer - Contestant Only",
        context: null,
        conferences: [{ documentId: "conf-1" }],
      },
      fisher: {
        documentId: "fisher",
        name: "Fisher",
        context: "Contestant",
        conferences: [{ documentId: "conf-1" }],
      },
    };
    contestants = {
      "active-1": {
        documentId: "active-1",
        status: "active",
        cancelled_at: null,
        cancelled_reason: null,
        cancelled_by: null,
        conference: { id: 3, documentId: "conf-1" },
        conference_ticket: { id: 37, documentId: "golfer" },
      },
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
      contentTypes: {},
      db: {
        transaction: vi.fn(async (callback: (args: { trx: unknown }) => unknown) =>
          callback({ trx: { id: "trx" } })
        ),
        connection: vi.fn((table: string) => makeBuilder(table)),
      },
      documents: vi.fn((uid: string) => {
        if (uid === "api::conference.conference") {
          return {
            findFirst: vi.fn(async ({ filters }: { filters: { id: number } }) =>
              Object.values(conferences).find((row) => String(row.id) === String(filters.id)) ?? null
            ),
            findOne: vi.fn(async ({ documentId }: { documentId: string }) =>
              conferences[documentId] ? structuredClone(conferences[documentId]) : null
            ),
          };
        }
        if (uid === "api::conference-ticket.conference-ticket") {
          return {
            findFirst: vi.fn(async ({ filters }: { filters: { id: number } }) =>
              Object.values(tickets).find((row) => String(row.id) === String(filters.id)) ?? null
            ),
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
    (globalThis as any).strapi = strapi;
  });

  it("rejects direct lifecycle fields on create and update", async () => {
    await expect(
      createContestant(strapi, {
        data: { conference: "conf-1", conference_ticket: "golfer", status: "cancelled" },
      })
    ).rejects.toThrow("cancel/restore actions");

    await expect(
      updateContestant(strapi, {
        documentId: "active-1",
        data: { cancelled_reason: "manual write" },
      })
    ).rejects.toThrow("cancel/restore actions");
    expect(created).toHaveLength(0);
    expect(updated).toHaveLength(0);
  });

  it("rejects relation changes on update with a cancel-and-create instruction", async () => {
    await expect(
      updateContestant(strapi, {
        documentId: "active-1",
        data: { conference_ticket: "fisher" },
      })
    ).rejects.toThrow("Cancel and create");
    expect(updated).toHaveLength(0);
  });

  it("allows unchanged lifecycle and relation fields from a react-admin full-record update", async () => {
    await updateContestant(strapi, {
      documentId: "active-1",
      data: {
        status: "active",
        cancelled_at: null,
        cancelled_reason: null,
        cancelled_by: null,
        conference: { set: [{ id: 3 }] },
        conference_ticket: { set: [{ documentId: "golfer" }] },
        first: "Grace",
      },
    });

    expect(updated).toEqual([
      expect.objectContaining({
        documentId: "active-1",
        status: "active",
        cancelled_at: null,
        cancelled_reason: null,
        cancelled_by: null,
        first: "Grace",
      }),
    ]);
  });

  it("rejects actual lifecycle transitions and relation repoints on update", async () => {
    await expect(
      updateContestant(strapi, {
        documentId: "active-1",
        data: { status: "cancelled" },
      })
    ).rejects.toThrow("cancel/restore actions");

    await expect(
      updateContestant(strapi, {
        documentId: "active-1",
        data: { conference: { set: [{ documentId: "conf-2" }] } },
      })
    ).rejects.toThrow("Cancel and create");

    await expect(
      updateContestant(strapi, {
        documentId: "active-1",
        data: { conference_ticket: 999 },
      })
    ).rejects.toThrow("Cancel and create");
    expect(updated).toHaveLength(0);
  });

  it("rejects explicit relation clears and empty set payloads on update", async () => {
    await expect(
      updateContestant(strapi, {
        documentId: "active-1",
        data: { conference: null },
      })
    ).rejects.toThrow("Cancel and create");

    await expect(
      updateContestant(strapi, {
        documentId: "active-1",
        data: { conference_ticket: { set: [] } },
      })
    ).rejects.toThrow("Cancel and create");
    expect(updated).toHaveLength(0);
  });

  it("allows empty disconnect when unchanged connect/set relation values are present", async () => {
    await updateContestant(strapi, {
      documentId: "active-1",
      data: {
        conference: { disconnect: [], set: [{ documentId: "conf-1" }] },
        conference_ticket: { disconnect: [], connect: [{ id: 37 }] },
        first: "Grace",
      },
    });

    expect(updated).toEqual([
      expect.objectContaining({ documentId: "active-1", first: "Grace" }),
    ]);
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
        data: { conference: "sold-out-conf", conference_ticket: "golfer", year: 2026 },
      })
    ).rejects.toThrow("sold out");
    expect(created).toHaveLength(0);
    expect(decrements).toBe(0);
  });

  it("rejects golfer creates when the selected ticket is not on the selected conference", async () => {
    await expect(
      createContestant(strapi, {
        data: { conference: "conf-2", conference_ticket: "golfer", year: 2026 },
      })
    ).rejects.toThrow("ticket does not belong to the selected conference");
    expect(created).toHaveLength(0);
    expect(decrements).toBe(0);
  });

  it("rejects missing or wrong create year before persistence", async () => {
    await expect(
      createContestant(strapi, {
        data: { conference: "conf-1", conference_ticket: "golfer" },
      })
    ).rejects.toThrow("year is required");

    await expect(
      createContestant(strapi, {
        data: { conference: "conf-1", conference_ticket: "golfer", year: 2025 },
      })
    ).rejects.toThrow("year must match conference cycle 2026");
    expect(created).toHaveLength(0);
    expect(decrements).toBe(0);
  });

  it("creates a golfer and decrements capacity once", async () => {
    await createContestant(strapi, {
      data: { conference: "conf-1", conference_ticket: "golfer", year: 2026, first: "Ada" },
    });

    expect(created).toHaveLength(1);
    expect(decrements).toBe(1);
    expect(conferences["conf-1"].available_contestants).toBe(1);
    expect(locks).toContain("conferences:conf-1");
  });

  it("accepts numeric entity ids and documentIds for create relations", async () => {
    await createContestant(strapi, {
      data: { conference: 3, conference_ticket: 37, year: 2026 },
    });
    await createContestant(strapi, {
      data: { conference: "conf-1", conference_ticket: "golfer", year: 2026 },
    });

    expect(created).toHaveLength(2);
    expect(decrements).toBe(2);
  });

  it("uses the current year when conference dates cannot establish a cycle year", async () => {
    await createContestant(strapi, {
      data: { conference: "conf-no-dates", conference_ticket: "golfer", year: new Date().getFullYear() },
    });

    expect(created).toHaveLength(1);
    expect(decrements).toBe(1);
  });

  it("uses event start/end dates before registration window dates for create year validation", async () => {
    await createContestant(strapi, {
      data: { conference: "conf-event-year", conference_ticket: "golfer", year: 2026 },
    });

    await expect(
      createContestant(strapi, {
        data: { conference: "conf-event-year", conference_ticket: "golfer", year: 2025 },
      })
    ).rejects.toThrow("year must match conference cycle 2026");

    expect(created).toHaveLength(1);
  });

  it("creates contextless Golfer - Contestant Only and decrements capacity once", async () => {
    await createContestant(strapi, {
      data: { conference: "conf-1", conference_ticket: "standalone", year: 2026 },
    });

    expect(created).toHaveLength(1);
    expect(decrements).toBe(1);
  });

  it("creates non-golf contestants without adjusting golf capacity", async () => {
    await createContestant(strapi, {
      data: { conference: "conf-1", conference_ticket: "fisher", year: 2026 },
    });

    expect(created).toHaveLength(1);
    expect(decrements).toBe(0);
    expect(conferences["conf-1"].available_contestants).toBe(2);
  });
});
