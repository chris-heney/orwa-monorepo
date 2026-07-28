import { describe, expect, it } from "vitest";
import { hasSelectedId } from "./hasSelectedId";

describe("hasSelectedId", () => {
  it.each([0, 1, "0", "99", 42])("treats %s as selected", (id) => {
    expect(hasSelectedId(id)).toBe(true);
  });

  it.each([undefined, null, ""])("treats %s as missing", (id) => {
    expect(hasSelectedId(id)).toBe(false);
  });
});
