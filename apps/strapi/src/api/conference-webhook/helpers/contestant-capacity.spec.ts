import { describe, expect, it } from "vitest";

import {
  countsAgainstGolfCapacity,
  isContestantTicket,
} from "./contestant-capacity";

const payload = (name: string, context?: string | null) =>
  ({
    ticket_type: { name, context },
  } as never);

describe("countsAgainstGolfCapacity", () => {
  it.each([
    ["Golfer", "Contestant", true],
    ["Golfer - Contestant Only", "Contestant", true],
    ["GOLFER (late entry)", "Contestant", true],
    ["Golfers Team", "Contestant", true],
    ["Golfer - Contestant Only", null, true],
    ["Non-Golfer Guest", "Contestant", false],
    ["Non Golfer", "Contestant", false],
    ["Golfer Spouse (Non-Golfer)", "Contestant", false],
    ["Non-Golfer Guest", null, false],
    ["Fisher - Contestant Only", null, false],
  ])("classifies %s / %s as golf capacity=%s", (name, context, expected) => {
    expect(countsAgainstGolfCapacity(payload(name, context))).toBe(expected);
  });
});

describe("isContestantTicket", () => {
  it.each([
    ["Golfer - Contestant Only", null, true],
    ["Fisher - Contestant Only", null, true],
    ["Contestant Only", null, true],
    ["Attendee + Contestant", null, false],
    ["Non-Golfer Guest", null, false],
  ])("routes %s / %s as contestant=%s", (name, context, expected) => {
    expect(isContestantTicket(payload(name, context))).toBe(expected);
  });
});
