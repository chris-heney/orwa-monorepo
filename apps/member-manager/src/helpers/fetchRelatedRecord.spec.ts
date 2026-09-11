import { describe, expect, it, vi } from "vitest";
import {
  buildExportRelationCache,
  fetchRelatedField,
  fetchRelatedRecord,
  isIdSource,
  readExportCellValue,
  readExportColumn,
  readExportField,
  readPath,
  relationDisplayValue,
  resolveExportCell,
  selectExportColumns,
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

describe("selectExportColumns", () => {
  const columns = [
    { index: "0", label: "ID" },
    { index: "1", label: "Name" },
    { index: "2", label: "Email" },
    { index: "3", label: "Phone" },
  ];

  it("exports in the user's on-screen order, not declaration order", () => {
    // The grid renders columnIds.map(i => children[i]); the CSV must match.
    expect(
      selectExportColumns(columns, ["3", "1", "0"]).map((c) => c.label)
    ).toEqual(["Phone", "Name", "ID"]);
  });

  it("drops the columns the user hid", () => {
    expect(selectExportColumns(columns, ["1", "2"]).map((c) => c.label)).toEqual(
      ["Name", "Email"]
    );
  });

  it("falls back to every column when there is no saved preference", () => {
    expect(selectExportColumns(columns, []).map((c) => c.label)).toEqual([
      "ID",
      "Name",
      "Email",
      "Phone",
    ]);
    expect(selectExportColumns(columns, undefined)).toEqual(columns);
  });

  it("ignores stale indices that no longer exist", () => {
    expect(selectExportColumns(columns, ["2", "99"]).map((c) => c.label)).toEqual(
      ["Email"]
    );
  });

  it("matches indices stored as numbers (the grid renders them; the CSV used to drop them)", () => {
    expect(
      selectExportColumns(columns, [3, 1] as unknown as string[]).map((c) => c.label)
    ).toEqual(["Phone", "Name"]);
  });

  it("falls back to every column instead of a blank file when nothing resolves", () => {
    expect(selectExportColumns(columns, ["98", "99"]).map((c) => c.label)).toEqual([
      "ID",
      "Name",
      "Email",
      "Phone",
    ]);
  });

  it("derives a label from the source when the stored preference lost it", () => {
    const stale: { index: string; source?: string; label?: string }[] = [
      { index: "0", source: "first" },
      { index: "1", source: "conference_ticket" },
      { index: "2", source: "point_of_contact.phone" },
      { index: "3" },
    ];
    expect(selectExportColumns(stale, []).map((c) => c.label)).toEqual([
      "First",
      "Conference Ticket",
      "Phone",
    ]);
  });
});

describe("readPath", () => {
  it("walks a dotted relation source (the blank Phone column)", () => {
    expect(
      readPath(
        { point_of_contact: { phone: "555-0100" } },
        "point_of_contact.phone"
      )
    ).toBe("555-0100");
  });

  it("returns undefined instead of throwing when the relation is missing", () => {
    expect(
      readPath({ point_of_contact: null }, "point_of_contact.phone")
    ).toBeUndefined();
    expect(readPath({}, "a.b.c")).toBeUndefined();
  });

  it("still reads plain sources", () => {
    expect(readPath({ county: "Stephens" }, "county")).toBe("Stephens");
  });
});

describe("readExportField dotted sources", () => {
  it("exports the populated relation field the grid shows", () => {
    expect(
      readExportField(
        { point_of_contact: { phone: "555-0100" } },
        "point_of_contact.phone"
      )
    ).toBe("555-0100");
  });
});

describe("buildExportRelationCache", () => {
  it("fetches each relation type once instead of once per record", async () => {
    const getMany = vi.fn().mockResolvedValue({
      data: [
        { id: 1, name: "New Application" },
        { id: 2, name: "Approved" },
      ],
    });
    const provider = { getMany } as unknown as Parameters<
      typeof buildExportRelationCache
    >[2];

    const cache = await buildExportRelationCache(
      [
        { id: "a", status: 1 },
        { id: "b", status: 2 },
        { id: "c", status: 1 },
      ],
      [{ source: "status", label: "Status" }],
      provider,
      { status: "grant-statuses" }
    );

    expect(getMany).toHaveBeenCalledTimes(1);
    expect(getMany).toHaveBeenCalledWith("grant-statuses", { ids: [1, 2] });
    expect(cache.get("grant-statuses:1")).toMatchObject({
      name: "New Application",
    });
  });

  it("resolves cells from the cache without another round trip", async () => {
    const getMany = vi
      .fn()
      .mockResolvedValue({ data: [{ id: 7, name: "Paid" }] });
    const getOne = vi.fn();
    const provider = { getMany, getOne } as unknown as Parameters<
      typeof buildExportRelationCache
    >[2];

    const cache = await buildExportRelationCache(
      [{ id: "a", payout_status: 7 }],
      [{ source: "payout_status", label: "Payout Status" }],
      provider
    );

    await expect(
      resolveExportCell(7, {
        dataProvider: provider as never,
        resource: "payout-statuses",
        cache,
      })
    ).resolves.toBe("Paid");
    expect(getOne).not.toHaveBeenCalled();
  });

  it("survives a failed lookup with blank cells", async () => {
    const getMany = vi.fn().mockRejectedValue(new Error("boom"));
    const provider = { getMany } as unknown as Parameters<
      typeof buildExportRelationCache
    >[2];
    await expect(
      buildExportRelationCache(
        [{ id: "a", status: 1 }],
        [{ source: "status", label: "Status" }],
        provider,
        { status: "grant-statuses" }
      )
    ).resolves.toEqual(new Map());
  });
});
