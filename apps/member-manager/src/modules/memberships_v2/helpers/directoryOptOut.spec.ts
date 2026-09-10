import { describe, expect, it, vi } from "vitest";
import {
  fetchDirectoryOptOutEmails,
  getPublishableDirectoryContacts,
  isDirectoryOptedOut,
  normalizeContactEmail,
} from "./directoryOptOut";

describe("normalizeContactEmail", () => {
  it("lowercases and trims so the join is case-insensitive", () => {
    expect(normalizeContactEmail("  Ada@X.ORG ")).toBe("ada@x.org");
  });

  it("returns an empty key for anything unusable", () => {
    expect(normalizeContactEmail(null)).toBe("");
    expect(normalizeContactEmail(undefined)).toBe("");
    expect(normalizeContactEmail(42)).toBe("");
  });
});

describe("fetchDirectoryOptOutEmails", () => {
  it("queries the contacts table for opted-out rows only", async () => {
    const getList = vi
      .fn()
      .mockResolvedValue({ data: [{ id: 1, email: "A@x.org" }], total: 1 });
    const set = await fetchDirectoryOptOutEmails({ getList } as never);
    expect(getList).toHaveBeenCalledWith(
      "contacts",
      expect.objectContaining({ filter: { directory_opt_out: true } })
    );
    expect(set.has("a@x.org")).toBe(true);
  });

  it("pages until every opted-out row is collected", async () => {
    const first = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      email: `p1-${i}@x.org`,
    }));
    const getList = vi
      .fn()
      .mockResolvedValueOnce({ data: first, total: 1002 })
      .mockResolvedValueOnce({
        data: [{ id: 1000, email: "p2-a@x.org" }, { id: 1001, email: "p2-b@x.org" }],
        total: 1002,
      });
    const set = await fetchDirectoryOptOutEmails({ getList } as never);
    expect(getList).toHaveBeenCalledTimes(2);
    expect(set.size).toBe(1002);
    expect(set.has("p2-b@x.org")).toBe(true);
  });

  it("never adds an empty key, which would match every email-less contact", async () => {
    const getList = vi.fn().mockResolvedValue({
      data: [{ id: 1, email: "" }, { id: 2, email: null }, { id: 3 }],
      total: 3,
    });
    const set = await fetchDirectoryOptOutEmails({ getList } as never);
    expect(set.size).toBe(0);
  });

  it("propagates failure so the caller can abort the export", async () => {
    const getList = vi.fn().mockRejectedValue(new Error("boom"));
    await expect(
      fetchDirectoryOptOutEmails({ getList } as never)
    ).rejects.toThrow("boom");
  });
});

describe("isDirectoryOptedOut", () => {
  const empty = new Set<string>();

  it("honors the contact's own flag", () => {
    expect(isDirectoryOptedOut({ directory_opt_out: true }, empty)).toBe(true);
  });

  it("honors an opt-out recorded on another row with the same email", () => {
    expect(
      isDirectoryOptedOut({ email: "Ada@X.org" }, new Set(["ada@x.org"]))
    ).toBe(true);
  });

  it("publishes a contact nothing flags", () => {
    expect(isDirectoryOptedOut({ email: "ok@x.org" }, new Set(["no@x.org"]))).toBe(
      false
    );
  });

  it("publishes an email-less contact even when the set is non-empty", () => {
    expect(isDirectoryOptedOut({ first: "NoEmail" }, new Set(["no@x.org"]))).toBe(
      false
    );
  });
});

describe("getPublishableDirectoryContacts", () => {
  it("drops opted-out contacts and closes the gap", () => {
    const record = {
      id: "d",
      contacts: [
        { id: 1, first: "A", email: "a@x.org" },
        { id: 2, first: "B", email: "b@x.org", directory_opt_out: true },
        { id: 3, first: "C", email: "c@x.org" },
      ],
    } as never;
    const result = getPublishableDirectoryContacts(record, new Set(["a@x.org"]));
    expect(result.map((c) => c.first)).toEqual(["C"]);
  });
});
