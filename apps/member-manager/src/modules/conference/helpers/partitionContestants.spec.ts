import { describe, expect, it } from "vitest";
import { partitionContestants } from "./partitionContestants";

describe("partitionContestants", () => {
  it("separates cancelled evidence from active contestants", () => {
    expect(
      partitionContestants([
        { id: "a", status: "active" },
        { id: "b", status: "cancelled" },
        { id: "legacy" },
      ])
    ).toEqual({
      active: [
        { id: "a", status: "active" },
        { id: "legacy" },
      ],
      cancelled: [{ id: "b", status: "cancelled" }],
    });
  });
});
