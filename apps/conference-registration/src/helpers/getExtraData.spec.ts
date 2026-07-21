import { describe, expect, it } from "vitest";
import { getExtraData } from "./getExtraData";
import { IExtraOption } from "../types/types";

const extras = [
  { id: 37, documentId: "lunch-doc", name: "Lunch", price_online: 0 },
  { id: 38, documentId: "dinner-doc", name: "Dinner", price_online: 0 },
] as unknown as IExtraOption[];

describe("getExtraData", () => {
  it("finds extras by numeric id", () => {
    expect(getExtraData(extras, 37)?.name).toBe("Lunch");
  });

  it("finds extras when stored id is a string", () => {
    expect(getExtraData(extras, "37" as unknown as number)?.name).toBe("Lunch");
  });

  it("finds extras by documentId", () => {
    expect(getExtraData(extras, "lunch-doc" as unknown as number)?.name).toBe(
      "Lunch"
    );
  });

  it("finds extras when value is a relation object", () => {
    expect(getExtraData(extras, { id: 38 } as unknown as number)?.name).toBe(
      "Dinner"
    );
  });

  it("returns undefined for orphan ids from another conference", () => {
    // Conference 2 Lunch id — not present on Fall Conference options
    expect(getExtraData(extras, 34)).toBeUndefined();
  });
});
