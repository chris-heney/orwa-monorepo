import { describe, expect, it } from "vitest";
import { resolveContestSport, summarizeContestSports } from "./contestSport";

const ticket = (name: string) => ({ conference_ticket: { id: 1, name } });

describe("resolveContestSport", () => {
  it("buckets every golf ticket variant into golf", () => {
    expect(resolveContestSport(ticket("Golfer"))).toBe("golf");
    expect(resolveContestSport(ticket("Golfer - Contestant Only"))).toBe("golf");
    expect(resolveContestSport(ticket("Golf Tournament — Mulligan"))).toBe(
      "golf"
    );
  });

  it("buckets every fishing ticket variant into fish", () => {
    expect(resolveContestSport(ticket("Fisher"))).toBe("fish");
    expect(resolveContestSport(ticket("Fisher - Contestant Only"))).toBe("fish");
    expect(resolveContestSport(ticket("Fishing Tournament"))).toBe("fish");
    expect(resolveContestSport(ticket("Bass Tournament"))).toBe("fish");
  });

  it("falls back to the legacy type column when no ticket is populated", () => {
    expect(resolveContestSport({ type: "Golfer" })).toBe("golf");
    expect(resolveContestSport({ type: "Fisher" })).toBe("fish");
  });

  it("prefers the ticket name over a stale legacy type", () => {
    expect(
      resolveContestSport({ type: "Contestant", ...ticket("Fishing Tournament") })
    ).toBe("fish");
    expect(
      resolveContestSport({ type: "Golfer", ...ticket("Bass Tournament") })
    ).toBe("fish");
  });

  it("leaves sportless rows unclassified", () => {
    expect(resolveContestSport({ type: "Contestant" })).toBeNull();
    expect(resolveContestSport(ticket("Contestant"))).toBeNull();
    expect(resolveContestSport(ticket("Sporting Clays"))).toBeNull();
    expect(resolveContestSport({})).toBeNull();
    expect(resolveContestSport(null)).toBeNull();
  });
});

describe("summarizeContestSports", () => {
  it("counts each sport across all of its ticket variants", () => {
    const totals = summarizeContestSports([
      ticket("Golfer"),
      ticket("Golfer - Contestant Only"),
      ticket("Fishing Tournament"),
      ticket("Bass Tournament"),
      ticket("Fisher - Contestant Only"),
    ]);

    expect(totals.golfers).toBe(2);
    expect(totals.fishers).toBe(3);
    expect(totals.total).toBe(5);
  });

  it("counts sportless contestants in the total but in neither bucket", () => {
    const totals = summarizeContestSports([
      ticket("Golfer"),
      { type: "Contestant" },
      ticket("Sporting Clays"),
    ]);

    expect(totals.golfers).toBe(1);
    expect(totals.fishers).toBe(0);
    expect(totals.total).toBe(3);
  });

  it("counts distinct teams among golfers only", () => {
    const totals = summarizeContestSports([
      { ...ticket("Golfer"), team: { id: 7, name: "Aqua" } },
      { ...ticket("Golfer"), team: { id: 7, name: "Aqua" } },
      { ...ticket("Golfer - Contestant Only"), team: { id: 9, name: "Wells" } },
      { ...ticket("Fishing Tournament"), team: { id: 12, name: "Reel Deal" } },
    ]);

    expect(totals.golfTeams).toBe(2);
  });

  it("does not merge different teams that share a name", () => {
    const totals = summarizeContestSports([
      { ...ticket("Golfer"), team: { id: 7, name: "Blue" } },
      { ...ticket("Golfer"), team: { id: 8, name: "Blue" } },
    ]);

    expect(totals.golfTeams).toBe(2);
  });

  it("ignores golfers who are not on a team", () => {
    const totals = summarizeContestSports([
      ticket("Golfer"),
      { ...ticket("Golfer"), team: null },
    ]);

    expect(totals.golfers).toBe(2);
    expect(totals.golfTeams).toBe(0);
  });

  it("accepts an unpopulated team relation as a bare id", () => {
    const totals = summarizeContestSports([
      { ...ticket("Golfer"), team: 7 },
      { ...ticket("Golfer"), team: 7 },
      { ...ticket("Golfer"), team: 8 },
    ]);

    expect(totals.golfTeams).toBe(2);
  });

  it("returns zeroes for missing or empty input", () => {
    expect(summarizeContestSports(null)).toEqual({
      fishers: 0,
      golfers: 0,
      golfTeams: 0,
      total: 0,
    });
    expect(summarizeContestSports([])).toEqual({
      fishers: 0,
      golfers: 0,
      golfTeams: 0,
      total: 0,
    });
  });
});
