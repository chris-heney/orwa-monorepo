import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkNominatableAwardType } from "./nominatable-award-type";

describe("checkNominatableAwardType", () => {
  const findOne = vi.fn();

  beforeEach(() => {
    findOne.mockReset();
    (globalThis as any).strapi = {
      db: { query: () => ({ findOne }) },
    };
  });

  it("returns not_found for blank / non-string input without querying", async () => {
    expect(await checkNominatableAwardType("")).toEqual({ status: "not_found" });
    expect(await checkNominatableAwardType(undefined)).toEqual({
      status: "not_found",
    });
    expect(await checkNominatableAwardType(42)).toEqual({ status: "not_found" });
    expect(findOne).not.toHaveBeenCalled();
  });

  it("matches by exact (trimmed) name", async () => {
    findOne.mockResolvedValue({
      id: 1,
      documentId: "awardtypedoc00001",
      name: "System of the Year",
      nominatable: true,
    });

    const result = await checkNominatableAwardType("  System of the Year ");

    expect(result.status).toBe("nominatable");
    expect(findOne).toHaveBeenCalledWith({
      where: { name: "System of the Year" },
      select: ["id", "documentId", "name", "nominatable"],
    });
  });

  it("returns not_nominatable for catalog rows with nominatable=false", async () => {
    findOne.mockResolvedValue({
      id: 5,
      documentId: "awardtypedoc00005",
      name: "Man of the Year",
      nominatable: false,
    });
    const result = await checkNominatableAwardType("Man of the Year");
    expect(result.status).toBe("not_nominatable");
  });

  it("returns not_found when no row matches", async () => {
    findOne.mockResolvedValue(null);
    expect(await checkNominatableAwardType("Nope")).toEqual({
      status: "not_found",
    });
  });
});
