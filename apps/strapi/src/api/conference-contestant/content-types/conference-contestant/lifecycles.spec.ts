import { describe, expect, it, vi } from "vitest";

const { findOneById } = vi.hoisted(() => ({
  findOneById: vi.fn(),
}));

vi.mock("../../../../utils/document-compat", () => ({
  findOneById,
}));

import lifecycles from "./lifecycles";
import {
  withContestantHardDelete,
  withContestantLifecycleTransition,
  withContestantRestCreate,
} from "../../services/contestant-lifecycle-context";

const event = (data: Record<string, unknown> = {}, where: Record<string, unknown> = {}) => ({
  params: { data, where },
});

describe("conference contestant lifecycle guard", () => {
  it("exports the hooks Strapi should register for the content type", () => {
    expect(lifecycles).toEqual(
      expect.objectContaining({
        beforeCreate: expect.any(Function),
        beforeUpdate: expect.any(Function),
        beforeDelete: expect.any(Function),
      })
    );
  });

  it("blocks direct lifecycle field changes from Content Manager/document service", async () => {
    await expect(
      lifecycles.beforeUpdate(event({ status: "cancelled" }) as never)
    ).rejects.toThrow("cancel/restore actions");

    await expect(
      lifecycles.beforeCreate(event({ cancelled_at: "2026-09-08T00:00:00Z" }) as never)
    ).rejects.toThrow("cancel/restore actions");
  });

  it("allows Strapi schema defaults on guarded create and rejects real cancellation metadata", async () => {
    const schemaDefaultedCreate = {
      conference: "conf-1",
      conference_ticket: "golfer",
      status: "active",
      cancelled_at: null,
      cancelled_reason: null,
      cancelled_by: null,
    };

    await expect(
      withContestantRestCreate(() =>
        lifecycles.beforeCreate(event(schemaDefaultedCreate) as never)
      )
    ).resolves.toBeUndefined();

    await expect(
      withContestantRestCreate(() =>
        lifecycles.beforeCreate(event({ ...schemaDefaultedCreate, status: "cancelled" }) as never)
      )
    ).rejects.toThrow("cancel/restore actions");

    await expect(
      withContestantRestCreate(() =>
        lifecycles.beforeCreate(
          event({ ...schemaDefaultedCreate, cancelled_reason: "manual write" }) as never
        )
      )
    ).rejects.toThrow("cancel/restore actions");
  });

  it("allows lifecycle changes only inside the explicit cancel/restore context", async () => {
    await expect(
      withContestantLifecycleTransition(() =>
        lifecycles.beforeUpdate(
          event({
            status: "cancelled",
            cancelled_at: "2026-09-08T00:00:00Z",
            cancelled_reason: "Duplicate",
          }) as never
        )
      )
    ).resolves.toBeUndefined();
  });

  it("blocks direct conference and ticket relation repoints", async () => {
    findOneById.mockResolvedValue({
      documentId: "contestant-1",
      conference: { id: 3, documentId: "conf-doc" },
      conference_ticket: { id: 37, documentId: "ticket-doc" },
    });

    await expect(
      lifecycles.beforeUpdate(
        event({ conference_ticket: "other-ticket" }, { documentId: "contestant-1" }) as never
      )
    ).rejects.toThrow("Cancel and create");
    await expect(
      lifecycles.beforeUpdate(
        event({ conference: "other-conference" }, { documentId: "contestant-1" }) as never
      )
    ).rejects.toThrow("Cancel and create");
  });

  it("allows unchanged relation payloads while blocking actual repoints", async () => {
    findOneById.mockResolvedValue({
      documentId: "contestant-1",
      conference: { id: 3, documentId: "conf-doc" },
      conference_ticket: { id: 37, documentId: "ticket-doc" },
    });

    await expect(
      lifecycles.beforeUpdate(
        event(
          { conference: { set: [{ id: 3 }] }, conference_ticket: { set: [{ documentId: "ticket-doc" }] }, first: "Ada" },
          { documentId: "contestant-1" }
        ) as never
      )
    ).resolves.toBeUndefined();

    await expect(
      lifecycles.beforeUpdate(
        event({ conference_ticket: { set: [{ documentId: "other-ticket" }] } }, { documentId: "contestant-1" }) as never
      )
    ).rejects.toThrow("Cancel and create");
  });

  it("rejects explicit relation clears and empty set payloads", async () => {
    findOneById.mockResolvedValue({
      documentId: "contestant-1",
      conference: { id: 3, documentId: "conf-doc" },
      conference_ticket: { id: 37, documentId: "ticket-doc" },
    });

    await expect(
      lifecycles.beforeUpdate(
        event({ conference: null }, { documentId: "contestant-1" }) as never
      )
    ).rejects.toThrow("Cancel and create");

    await expect(
      lifecycles.beforeUpdate(
        event({ conference_ticket: { set: [] } }, { documentId: "contestant-1" }) as never
      )
    ).rejects.toThrow("Cancel and create");
  });

  it("does not treat empty disconnect as a clear when unchanged connect/set is present", async () => {
    findOneById.mockResolvedValue({
      documentId: "contestant-1",
      conference: { id: 3, documentId: "conf-doc" },
      conference_ticket: { id: 37, documentId: "ticket-doc" },
    });

    await expect(
      lifecycles.beforeUpdate(
        event(
          {
            conference: { disconnect: [], set: [{ documentId: "conf-doc" }] },
            conference_ticket: { disconnect: [], connect: [{ id: 37 }] },
          },
          { documentId: "contestant-1" }
        ) as never
      )
    ).resolves.toBeUndefined();
  });

  it("allows unchanged lifecycle full-record values while blocking actual transitions", async () => {
    findOneById.mockResolvedValue({
      documentId: "contestant-1",
      status: "active",
      cancelled_at: null,
      cancelled_reason: null,
      cancelled_by: null,
      conference: { id: 3, documentId: "conf-doc" },
      conference_ticket: { id: 37, documentId: "ticket-doc" },
    });

    await expect(
      lifecycles.beforeUpdate(
        event(
          {
            status: "active",
            cancelled_at: null,
            cancelled_reason: null,
            cancelled_by: null,
            first: "Ada",
          },
          { documentId: "contestant-1" }
        ) as never
      )
    ).resolves.toBeUndefined();

    await expect(
      lifecycles.beforeUpdate(
        event({ status: "cancelled" }, { documentId: "contestant-1" }) as never
      )
    ).rejects.toThrow("cancel/restore actions");

    await expect(
      lifecycles.beforeUpdate(
        event({ cancelled_at: "2026-09-08T00:00:00Z" }, { documentId: "contestant-1" }) as never
      )
    ).rejects.toThrow("cancel/restore actions");
  });

  it("blocks Content Manager hard deletes but allows whole-registration cleanup context", async () => {
    await expect(lifecycles.beforeDelete({} as never)).rejects.toThrow(
      "must be cancelled"
    );

    await expect(
      withContestantHardDelete(() => lifecycles.beforeDelete({} as never))
    ).resolves.toBeUndefined();
  });

  it("blocks direct creates outside the guarded REST create path", async () => {
    await expect(
      lifecycles.beforeCreate(event({ conference: "conf-1", conference_ticket: "golfer" }) as never)
    ).rejects.toThrow("guarded Add Contestant flow");

    await expect(
      withContestantRestCreate(() =>
        lifecycles.beforeCreate(
          event({ conference: "conf-1", conference_ticket: "golfer" }) as never
        )
      )
    ).resolves.toBeUndefined();
  });
});
