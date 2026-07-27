import { describe, expect, it } from "vitest";
import {
  partitionContestantLines,
  sharePaymentAmount,
  assertSourcePersonOnRegistration,
} from "./contestant-fanout";

describe("partitionContestantLines", () => {
  it("groups attach lines by previous_registration_id and keeps standalone separate", () => {
    const lines = [
      { previous_registration_id: 10, source: 75, source_ticket_id: 1 },
      { previous_registration_id: 20, price: 75, source_ticket_id: 2 },
      { previous_registration_id: 10, price: 75, source_ticket_id: 3 },
      { price: 125 },
      { price: 175 },
    ];
    const { attachGroups, standalone } = partitionContestantLines(lines);
    expect([...attachGroups.keys()].sort()).toEqual(["10", "20"]);
    expect(attachGroups.get("10")).toHaveLength(2);
    expect(attachGroups.get("20")).toHaveLength(1);
    expect(standalone).toHaveLength(2);
  });
});

describe("sharePaymentAmount", () => {
  it("sums line prices", () => {
    expect(sharePaymentAmount([{ price: 75 }, { price: "50.5" }, { price: 0 }])).toBe(
      125.5
    );
  });
});

describe("assertSourcePersonOnRegistration", () => {
  const registration = {
    id: 10,
    attendees: [
      { id: 1, first: "Ann", last: "A" },
      { id: 2, first: "Bob", last: "B" },
    ],
  };

  it("accepts a matching attendee id", () => {
    expect(() =>
      assertSourcePersonOnRegistration(registration, 2)
    ).not.toThrow();
  });

  it("rejects a missing source person", () => {
    expect(() =>
      assertSourcePersonOnRegistration(registration, 99)
    ).toThrow(/source person/i);
  });

  it("rejects when source id is missing", () => {
    expect(() =>
      assertSourcePersonOnRegistration(registration, undefined)
    ).toThrow(/source person/i);
  });
});
