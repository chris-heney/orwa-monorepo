import { describe, expect, it } from "vitest";
import { getDisplayEntityId, isDocumentId } from "./strapiIds";

const DOC = "u3t64cjca3x800ini1wtmftn";

describe("getDisplayEntityId", () => {
  it("prefers numeric entityId over remapped documentId", () => {
    expect(getDisplayEntityId({ id: DOC, entityId: 15234 })).toBe(15234);
  });

  it("accepts numeric string entityId", () => {
    expect(getDisplayEntityId({ id: DOC, entityId: "99" })).toBe(99);
  });

  it("falls back to a numeric id when entityId is missing", () => {
    expect(getDisplayEntityId({ id: 7 })).toBe(7);
    expect(getDisplayEntityId({ id: "7" })).toBe(7);
  });

  it("does not parseInt a documentId", () => {
    expect(isDocumentId(DOC)).toBe(true);
    expect(getDisplayEntityId({ id: DOC })).toBeUndefined();
    expect(Number.parseInt(DOC, 10)).toBeNaN();
  });

  it("returns undefined for empty records", () => {
    expect(getDisplayEntityId(null)).toBeUndefined();
    expect(getDisplayEntityId(undefined)).toBeUndefined();
    expect(getDisplayEntityId({})).toBeUndefined();
  });
});
