import { describe, expect, it } from "vitest";

import { activeContestants } from "./contestantStatus";

describe("activeContestants", () => {
  it("drops cancelled contestants while treating legacy missing status as active", () => {
    const records = [
      { first: "Active", status: "active" },
      { first: "Cancelled", status: "cancelled" },
      { first: "Legacy" },
      null,
      undefined,
    ];

    expect(activeContestants(records)).toEqual([
      { first: "Active", status: "active" },
      { first: "Legacy" },
    ]);
  });
});
