import { describe, expect, it } from "vitest";
import {
  buildRegistrationReceiptRecord,
  buildReceiptContestantRows,
} from "./registrationReceiptContestants";

describe("registrationReceiptContestants", () => {
  const contestants = [
    {
      id: "active",
      status: null,
      first: "Ada",
      last: "Angler",
      fee: "75.00",
      conference_ticket: { name: "Golfer - Contestant Only", price_online: "999" },
      team: { name: "Team Active" },
      items: [
        { key: "Mulligan 0", label: "Mulligan", value: "20" },
        { key: "Mulligan 1", label: "Mulligan", value: "20" },
      ],
    },
    {
      id: "cancelled",
      status: "cancelled",
      first: "Cal",
      last: "Cancelled",
      fee: "55.00",
      conference_ticket: { name: "Fisher" },
      team: { name: "Team Historical" },
      items: [{ key: "Mulligan 0", label: "Mulligan", value: "10" }],
      cancelled_at: "2026-09-08T20:00:00.000Z",
      cancelled_reason: "Pending refund",
      cancelled_by: "staff@example.org",
    },
  ];

  it("projects active and cancelled contestants without losing refund evidence", () => {
    const rows = buildReceiptContestantRows(contestants);

    expect(rows.active).toEqual([
      expect.objectContaining({
        id: "active",
        name: "Ada Angler",
        status: null,
        ticket: "Golfer - Contestant Only",
        team: "Team Active",
        fee: "75.00",
        mulligans: ["Mulligan x2 ($20.00 each)"],
      }),
    ]);
    expect(rows.cancelled).toEqual([
      expect.objectContaining({
        id: "cancelled",
        name: "Cal Cancelled",
        status: "cancelled",
        ticket: "Fisher",
        team: "Team Historical",
        fee: "55.00",
        mulligans: ["Mulligan x1 ($10.00 each)"],
        cancelled_at: "2026-09-08T20:00:00.000Z",
        cancelled_reason: "Pending refund",
        cancelled_by: "staff@example.org",
      }),
    ]);
  });

  it("adds receipt-only contestant rows without changing the original relation", () => {
    const registration = { id: "registration", contestants };
    const receiptRecord = buildRegistrationReceiptRecord(registration);

    expect(receiptRecord.contestants).toBe(contestants);
    expect(receiptRecord.active_contestants).toHaveLength(1);
    expect(receiptRecord.cancelled_contestants).toHaveLength(1);
  });
});
