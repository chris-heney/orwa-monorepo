import { describe, expect, it } from "vitest";
import { toMediaId } from "./mediaId";

describe("toMediaId", () => {
  it("keeps numeric file ids", () => {
    expect(toMediaId(5324)).toBe(5324);
    expect(toMediaId("5324")).toBe(5324);
    expect(toMediaId([5324])).toBe(5324);
    expect(toMediaId({ id: 5324 })).toBe(5324);
    expect(toMediaId([{ id: 5324, url: "/uploads/x.png" }])).toBe(5324);
  });

  it("drops FileInput leftovers that are not uploaded", () => {
    expect(
      toMediaId([
        {
          src: "blob:https://orwa.org/35a2b7cc-2a8e-4f75-af63-7d6733400da6",
          title: "BF TrustInvesment logo Blue.jpg",
          rawFile: {},
        },
      ])
    ).toBeNull();
    expect(toMediaId({})).toBeNull();
    expect(toMediaId("")).toBeNull();
    expect(toMediaId(null)).toBeNull();
  });
});
