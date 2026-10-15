import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  activeMembershipWhere,
  findActiveMembershipWatersystem,
  isActiveMembershipPaymentDate,
  rollingOneYearAgo,
} from "./active-membership";

const NOW = new Date(2026, 9, 15, 12, 0, 0); // 2026-10-15 local

describe("rollingOneYearAgo", () => {
  it("returns YYYY-MM-DD exactly one year before now", () => {
    expect(rollingOneYearAgo(NOW)).toBe("2025-10-15");
  });

  it("zero-pads month and day", () => {
    expect(rollingOneYearAgo(new Date(2026, 0, 5))).toBe("2025-01-05");
  });
});

describe("isActiveMembershipPaymentDate (boundary)", () => {
  it("rejects null / undefined / empty", () => {
    expect(isActiveMembershipPaymentDate(null, NOW)).toBe(false);
    expect(isActiveMembershipPaymentDate(undefined, NOW)).toBe(false);
    expect(isActiveMembershipPaymentDate("", NOW)).toBe(false);
  });

  it("cutoff - 1 day is inactive", () => {
    expect(isActiveMembershipPaymentDate("2025-10-14", NOW)).toBe(false);
  });

  it("cutoff day itself is active ($gte)", () => {
    expect(isActiveMembershipPaymentDate("2025-10-15", NOW)).toBe(true);
  });

  it("cutoff + 1 day is active", () => {
    expect(isActiveMembershipPaymentDate("2025-10-16", NOW)).toBe(true);
  });

  it("accepts Date instances and ISO datetime strings", () => {
    expect(isActiveMembershipPaymentDate(new Date(2026, 2, 1), NOW)).toBe(true);
    expect(isActiveMembershipPaymentDate("2025-10-15T00:00:00.000Z", NOW)).toBe(
      true
    );
    expect(isActiveMembershipPaymentDate("2024-12-31T00:00:00.000Z", NOW)).toBe(
      false
    );
  });
});

describe("activeMembershipWhere", () => {
  it("mirrors the public forms' REST filter", () => {
    expect(activeMembershipWhere(NOW)).toEqual({
      payment_last_date: { $notNull: true, $gte: "2025-10-15" },
    });
  });
});

describe("findActiveMembershipWatersystem", () => {
  const findOne = vi.fn();

  beforeEach(() => {
    findOne.mockReset();
    (globalThis as any).strapi = {
      db: { query: () => ({ findOne }) },
    };
  });

  it("queries by documentId with the active-membership where clause", async () => {
    findOne.mockResolvedValue({
      id: 7,
      documentId: "abcdefghijklmnop",
      name: "Test RWD",
      payment_last_date: "2026-01-01",
    });

    const row = await findActiveMembershipWatersystem("abcdefghijklmnop", NOW);

    expect(row?.name).toBe("Test RWD");
    expect(findOne).toHaveBeenCalledWith({
      where: {
        documentId: "abcdefghijklmnop",
        payment_last_date: { $notNull: true, $gte: "2025-10-15" },
      },
      select: ["id", "documentId", "name", "county", "payment_last_date"],
    });
  });

  it("returns null when the query matches nothing", async () => {
    findOne.mockResolvedValue(null);
    expect(await findActiveMembershipWatersystem("abcdefghijklmnop", NOW)).toBe(
      null
    );
  });

  it("short-circuits on an empty documentId without querying", async () => {
    expect(await findActiveMembershipWatersystem("", NOW)).toBe(null);
    expect(findOne).not.toHaveBeenCalled();
  });
});
