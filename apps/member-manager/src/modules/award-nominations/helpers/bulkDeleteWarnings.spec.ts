import { describe, expect, it, vi } from "vitest";
import type { DataProvider } from "react-admin";
import {
  fetchLinkedWinnerCount,
  linkedWinnerWarningLines,
  nominationBulkDeleteWarnings,
} from "./bulkDeleteWarnings";

describe("linkedWinnerWarningLines", () => {
  it("is silent when nothing is linked", () => {
    expect(linkedWinnerWarningLines(0, 3)).toEqual([]);
  });

  it("phrases single, partial and full links", () => {
    expect(linkedWinnerWarningLines(1, 1)[0]).toMatch(/^This nomination is linked/);
    expect(linkedWinnerWarningLines(1, 3)[0]).toMatch(
      /^1 of the 3 selected nominations is linked/
    );
    expect(linkedWinnerWarningLines(2, 3)[0]).toMatch(
      /^2 of the 3 selected nominations are linked/
    );
    expect(linkedWinnerWarningLines(3, 3)[0]).toMatch(
      /^All 3 selected nominations are linked/
    );
  });
});

describe("fetchLinkedWinnerCount", () => {
  it("asks award-winners for rows whose nomination is in the selection", async () => {
    const getList = vi.fn().mockResolvedValue({ data: [{ id: "w1" }], total: 1 });
    const dataProvider = { getList } as unknown as DataProvider;
    await expect(
      fetchLinkedWinnerCount(["abc123abc123abc123abc123", "def456def456def456def456"], dataProvider)
    ).resolves.toBe(1);
    expect(getList).toHaveBeenCalledWith(
      "award-winners",
      expect.objectContaining({
        filter: {
          award_nomination: {
            $in: ["abc123abc123abc123abc123", "def456def456def456def456"],
          },
        },
      })
    );
  });

  it("skips the request for an empty selection", async () => {
    const getList = vi.fn();
    await expect(
      fetchLinkedWinnerCount([], { getList } as unknown as DataProvider)
    ).resolves.toBe(0);
    expect(getList).not.toHaveBeenCalled();
  });
});

describe("nominationBulkDeleteWarnings", () => {
  it("turns the linked count into confirmation copy", async () => {
    const dataProvider = {
      getList: vi.fn().mockResolvedValue({ data: [], total: 2 }),
    } as unknown as DataProvider;
    const lines = await nominationBulkDeleteWarnings(["a", "b", "c"], dataProvider);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatch(/^2 of the 3 selected nominations are linked/);
  });
});
