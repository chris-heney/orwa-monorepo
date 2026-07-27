import { describe, expect, it } from "vitest";
import {
  availableContestantSports,
  contestantSportOf,
} from "./contestantSport";
import { ITicketOption } from "../types/types";

const ticket = (partial: Partial<ITicketOption> & { name: string }): ITicketOption =>
  ({
    id: partial.id ?? 1,
    price_online: 0,
    price_event: 0,
    context: "Contestant",
    ...partial,
  }) as ITicketOption;

describe("contestantSportOf", () => {
  it("detects golf from Golfer", () => {
    expect(contestantSportOf(ticket({ name: "Golfer" }))).toBe("golf");
  });

  it("detects fish from Fishing Tournament", () => {
    expect(contestantSportOf(ticket({ name: "Fishing Tournament" }))).toBe(
      "fish"
    );
  });

  it("detects fish from Fisher", () => {
    expect(contestantSportOf(ticket({ name: "Fisher" }))).toBe("fish");
  });

  it("returns null for unrelated names", () => {
    expect(contestantSportOf(ticket({ name: "Attendee" }))).toBeNull();
  });
});

describe("availableContestantSports", () => {
  it("lists unique sports present on contestant tickets", () => {
    expect(
      availableContestantSports([
        ticket({ id: 1, name: "Golfer" }),
        ticket({ id: 2, name: "Fishing Tournament" }),
        ticket({ id: 3, name: "Fishing Tournament - Contestant Only" }),
      ])
    ).toEqual(["golf", "fish"]);
  });

  it("returns empty when no sports match", () => {
    expect(availableContestantSports([ticket({ name: "Attendee" })])).toEqual(
      []
    );
  });
});
