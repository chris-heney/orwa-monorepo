import { describe, expect, it, vi } from "vitest";

import {
  EXPECTED_ACTIVE_AFTER,
  EXPECTED_ACTIVE_BEFORE,
  EXPECTED_AVAILABLE_AFTER,
  EXPECTED_AVAILABLE_BEFORE,
  EXPECTED_CANCELLED_GOLFERS,
  REQUIRED_REGISTRATION_IDS,
  expectedAfter,
  reconciledAvailability,
  runGolfOverageOperation,
  validateTargets,
} from "./reconcile-and-cancel-golf-overage";

const makeGolfer = (
  suffix: string,
  overrides: Partial<{
    documentId: string;
    status: string;
    ticketName: string;
    fee: number;
    items: Array<Record<string, unknown>>;
  }> = {}
) => ({
  id: 1000 + Number(suffix.replace(/\D/g, "") || 0),
  documentId: overrides.documentId ?? `contestant-${suffix}`,
  status: overrides.status ?? "active",
  first: `First${suffix}`,
  last: `Last${suffix}`,
  fee: overrides.fee ?? 150,
  items: overrides.items ?? [{ label: "Mulligans", value: "2" }],
  conference_ticket: {
    documentId: `ticket-${suffix}`,
    name: overrides.ticketName ?? "Golfer - Contestant Only",
    context: "Contestant",
  },
});

const makeRegistration = (id: number, offset: number) => ({
  id,
  documentId: `registration-${id}`,
  organization: `Water System ${id}`,
  total: 600,
  payment_method: "Credit Card",
  wp_eid: id + 50000,
  passport_id: id + 60000,
  contestants: [0, 1, 2, 3].map((index) =>
    makeGolfer(`${id}-${index + offset}`)
  ),
});

const fixtureSnapshot = () => ({
  conference: {
    id: 98,
    documentId: "fall-conference-2026",
    name: "2026 Fall Conference",
    available_contestants: EXPECTED_AVAILABLE_BEFORE,
  },
  registrations: REQUIRED_REGISTRATION_IDS.map((id, index) =>
    makeRegistration(id, index * 10)
  ),
  activeGolferCount: EXPECTED_ACTIVE_BEFORE,
});

describe("golf overage reconciliation guards", () => {
  it("refuses any registration outside the fixed allowlist", () => {
    expect(() => validateTargets([16781, 99999])).toThrow("not authorized");
  });

  it("requires the exact fixed allowlist", () => {
    expect(() => validateTargets([16781, 16792])).toThrow(
      "exactly 16781, 16792, 16817"
    );
    expect(validateTargets([16817, 16781, 16792])).toEqual(
      REQUIRED_REGISTRATION_IDS
    );
  });

  it("derives available slots from active golfers", () => {
    expect(reconciledAvailability(36, 59)).toBe(-23);
  });

  it("expects 47 active golfers and -11 availability after 12 cancellations", () => {
    expect(
      expectedAfter({
        maximum: 36,
        activeBefore: 59,
        cancelled: 12,
      })
    ).toEqual({ activeAfter: 47, availableAfter: -11 });
  });
});

describe("golf overage reconciliation operation", () => {
  it("dry-runs the 12 allowed cancellations without writes", async () => {
    const client = {
      fetchSnapshot: vi.fn(async () => fixtureSnapshot()),
      updateConferenceAvailability: vi.fn(),
      cancelContestant: vi.fn(),
    };
    const writeAudit = vi.fn();

    const result = await runGolfOverageOperation({
      apply: false,
      client,
      writeAudit,
    });

    expect(result.mode).toBe("dry-run");
    expect(result.cancelRequests).toHaveLength(EXPECTED_CANCELLED_GOLFERS);
    expect(result.before.activeGolferCount).toBe(EXPECTED_ACTIVE_BEFORE);
    expect(result.before.availableContestants).toBe(EXPECTED_AVAILABLE_BEFORE);
    expect(result.after.activeGolferCount).toBe(EXPECTED_ACTIVE_AFTER);
    expect(result.after.availableContestants).toBe(EXPECTED_AVAILABLE_AFTER);
    expect(client.updateConferenceAvailability).not.toHaveBeenCalled();
    expect(client.cancelContestant).not.toHaveBeenCalled();
    expect(writeAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        before: expect.any(Object),
        plannedCancelRequests: expect.arrayContaining([
          expect.objectContaining({ reason: expect.stringContaining("pending card refund") }),
        ]),
      })
    );
  });

  it("refuses a parent registration without exactly four active golfers", async () => {
    const snapshot = fixtureSnapshot();
    snapshot.registrations[0].contestants[0].status = "cancelled";
    const client = {
      fetchSnapshot: vi.fn(async () => snapshot),
      updateConferenceAvailability: vi.fn(),
      cancelContestant: vi.fn(),
    };

    await expect(
      runGolfOverageOperation({ apply: false, client, writeAudit: vi.fn() })
    ).rejects.toThrow("expected 4 active golfers");
  });

  it("refuses a parent registration with extra golfer records", async () => {
    const snapshot = fixtureSnapshot();
    snapshot.registrations[0].contestants.push(
      makeGolfer("16781-extra", { status: "cancelled" })
    );
    const client = {
      fetchSnapshot: vi.fn(async () => snapshot),
      updateConferenceAvailability: vi.fn(),
      cancelContestant: vi.fn(),
    };

    await expect(
      runGolfOverageOperation({ apply: false, client, writeAudit: vi.fn() })
    ).rejects.toThrow("expected exactly 4 golfer records");
  });

  it("applies through the supported counter update and cancel endpoint only", async () => {
    const afterSnapshot = fixtureSnapshot();
    afterSnapshot.conference.available_contestants = EXPECTED_AVAILABLE_AFTER;
    afterSnapshot.activeGolferCount = EXPECTED_ACTIVE_AFTER;
    for (const registration of afterSnapshot.registrations) {
      for (const contestant of registration.contestants) {
        contestant.status = "cancelled";
      }
    }

    const client = {
      fetchSnapshot: vi
        .fn()
        .mockResolvedValueOnce(fixtureSnapshot())
        .mockResolvedValueOnce(afterSnapshot),
      updateConferenceAvailability: vi.fn(async () => ({
        documentId: "fall-conference-2026",
        available_contestants: EXPECTED_AVAILABLE_AFTER,
      })),
      cancelContestant: vi.fn(async (documentId: string) => ({
        documentId,
        status: "cancelled",
        fee: 150,
        items: [{ label: "Mulligans", value: "2" }],
      })),
    };

    const result = await runGolfOverageOperation({
      apply: true,
      client,
      writeAudit: vi.fn(),
    });

    expect(result.mode).toBe("apply");
    expect(client.updateConferenceAvailability).toHaveBeenCalledTimes(1);
    expect(client.updateConferenceAvailability).toHaveBeenCalledWith(
      "fall-conference-2026",
      EXPECTED_AVAILABLE_BEFORE
    );
    expect(client.cancelContestant).toHaveBeenCalledTimes(
      EXPECTED_CANCELLED_GOLFERS
    );
    expect(client.cancelContestant).toHaveBeenNthCalledWith(
      1,
      "contestant-16781-0",
      expect.stringContaining("pending card refund")
    );
  });
});
