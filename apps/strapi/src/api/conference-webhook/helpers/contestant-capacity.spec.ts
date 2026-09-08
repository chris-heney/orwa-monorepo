import { describe, expect, it } from "vitest";

import { countsAgainstGolfCapacity } from "./contestant-capacity";

const payload = (name: string, context?: string | null) =>
  ({
    ticket_type: { name, context },
  } as never);

describe("countsAgainstGolfCapacity", () => {
  it("counts null-context 'Golfer - Contestant Only' by name", () => {
    expect(countsAgainstGolfCapacity(payload("Golfer - Contestant Only", null))).toBe(
      true
    );
  });

  it("does not count Fisher tickets", () => {
    expect(countsAgainstGolfCapacity(payload("Fisher - Contestant Only", null))).toBe(
      false
    );
  });
});
