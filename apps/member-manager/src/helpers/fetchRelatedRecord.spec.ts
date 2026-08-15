import { describe, expect, it, vi } from "vitest";
import {
  fetchRelatedField,
  fetchRelatedRecord,
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
