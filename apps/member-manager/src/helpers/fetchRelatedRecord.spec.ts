import { describe, expect, it, vi } from "vitest";
import {
  fetchRelatedField,
  fetchRelatedRecord,
  isIdSource,
  readExportCellValue,
  readExportColumn,
  readExportField,
  relationDisplayValue,
  resolveExportCell,
} from "./fetchRelatedRecord";

const getOne = vi.fn();
const dataProvider = { getOne } as unknown as Parameters<
  typeof fetchRelatedRecord
>[0];

describe("fetchRelatedRecord", () => {
  it("returns empty for null", async () => {
    await expect(
      fetchRelatedRecord(dataProvider, "grant-statuses", null)
    ).resolves.toEqual({});
    expect(getOne).not.toHaveBeenCalled();
  });

  it("returns a populated object without fetching", async () => {
    const status = { id: "abc123def456ghi789", name: "New Application" };
    await expect(
      fetchRelatedRecord(dataProvider, "grant-statuses", status)
    ).resolves.toEqual(status);
    expect(getOne).not.toHaveBeenCalled();
  });

  it("fetches by numeric id", async () => {
    getOne.mockResolvedValueOnce({ data: { id: 5, name: "Paid in Full" } });
    await expect(
      fetchRelatedRecord(dataProvider, "grant-statuses", 5)
    ).resolves.toEqual({ id: 5, name: "Paid in Full" });
    expect(getOne).toHaveBeenCalledWith("grant-statuses", { id: 5 });
  });

  it("fetches by documentId string (the Strapi 5 exporter footgun)", async () => {
    getOne.mockResolvedValueOnce({
      data: { id: "w7sc1t8z3pncyru4izhmp44a", name: "Awaiting Committee" },
    });
    await expect(
      fetchRelatedRecord(
        dataProvider,
        "grant-statuses",
        "w7sc1t8z3pncyru4izhmp44a"
      )
    ).resolves.toEqual({
      id: "w7sc1t8z3pncyru4izhmp44a",
      name: "Awaiting Committee",
    });
    expect(getOne).toHaveBeenCalledWith("grant-statuses", {
      id: "w7sc1t8z3pncyru4izhmp44a",
    });
  });

  it("returns empty when getOne fails", async () => {
    getOne.mockRejectedValueOnce(new Error("404"));
    await expect(
      fetchRelatedRecord(dataProvider, "grant-statuses", 99)
    ).resolves.toEqual({});
  });
});

describe("fetchRelatedField", () => {
  it("returns the named field from a resolved relation", async () => {
    getOne.mockResolvedValueOnce({ data: { name: "Requested" } });
    await expect(
      fetchRelatedField(
        dataProvider,
        "payout-statuses",
        "w7sc1t8z3pncyru4izhmp44a",
        "name"
      )
    ).resolves.toBe("Requested");
  });
});

describe("resolveExportCell", () => {
  it("fetches a documentId when the resource is known", async () => {
    getOne.mockResolvedValueOnce({ data: { name: "New Application" } });
    await expect(
      resolveExportCell("w7sc1t8z3pncyru4izhmp44a", {
        dataProvider,
        resource: "grant-statuses",
      })
    ).resolves.toBe("New Application");
  });

  it("keeps ordinary strings and numbers when no resource is mapped", async () => {
    await expect(resolveExportCell("Creek County")).resolves.toBe(
      "Creek County"
    );
    await expect(resolveExportCell(1500)).resolves.toBe("1500");
  });
});

describe("relationDisplayValue", () => {
  it("unwraps populated status objects to name", () => {
    expect(
      relationDisplayValue({ id: "w7sc1t8z3pncyru4izhmp44a", name: "On Hold" })
    ).toBe("On Hold");
  });

  it("unwraps person objects", () => {
    expect(relationDisplayValue({ first: "Ada", last: "Lovelace" })).toBe(
      "Ada Lovelace"
    );
  });

  it("does not dump a bare id object", () => {
    expect(relationDisplayValue({ id: "w7sc1t8z3pncyru4izhmp44a" })).toBe("");
  });

  it("keeps scalars", () => {
    expect(relationDisplayValue("New Application")).toBe("New Application");
    expect(relationDisplayValue(12)).toBe("12");
    expect(relationDisplayValue(true)).toBe("Yes");
  });
});

const DOC = "w7sc1t8z3pncyru4izhmp44a";

describe("readExportField", () => {
  it("exports the numeric entityId for an id column, never the documentId", () => {
    expect(readExportField({ id: DOC, entityId: 42 }, "id")).toBe(42);
  });

  it("treats documentId and entityId sources the same way", () => {
    expect(readExportField({ id: DOC, entityId: 42 }, "documentId")).toBe(42);
    expect(readExportField({ id: DOC, entityId: 42 }, "entityId")).toBe(42);
  });

  it("exports an empty cell rather than a documentId when there is no PK", () => {
    expect(readExportField({ id: DOC }, "id")).toBe("");
  });

  it("passes a legacy numeric id straight through", () => {
    expect(readExportField({ id: 7 }, "id")).toBe(7);
  });

  it("leaves non-id columns untouched", () => {
    expect(readExportField({ id: DOC, name: "Tulsa" }, "name")).toBe("Tulsa");
  });

  it("is safe on missing records and sources", () => {
    expect(readExportField(null, "id")).toBeUndefined();
    expect(readExportField({ id: DOC }, undefined)).toBeUndefined();
  });
});

describe("isIdSource", () => {
  it("flags only the identity columns", () => {
    expect(isIdSource("id")).toBe(true);
    expect(isIdSource("documentId")).toBe(true);
    expect(isIdSource("entityId")).toBe(true);
    expect(isIdSource("name")).toBe(false);
    expect(isIdSource(undefined)).toBe(false);
  });
});

describe("readExportColumn", () => {
  it("resolves an ID column to the numeric PK", () => {
    expect(
      readExportColumn({ id: DOC, entityId: 42 }, { source: "id", label: "ID" })
    ).toBe(42);
  });

  it("falls back to the lowercased label when the column has no source", () => {
    expect(
      readExportColumn({ id: DOC, entityId: 42 }, { label: "ID" })
    ).toBe(42);
    expect(
      readExportColumn({ organization: "ORWA" }, { label: "Organization" })
    ).toBe("ORWA");
  });
});

describe("readExportCellValue", () => {
  it("prefers the source and still resolves id columns numerically", () => {
    expect(
      readExportCellValue({ id: DOC, entityId: 42 }, "id", "ID")
    ).toBe(42);
  });

  it("falls back to the label when the source misses", () => {
    expect(
      readExportCellValue({ team: "Blue" }, "conference_team", "Team")
    ).toBe("Blue");
  });
});
