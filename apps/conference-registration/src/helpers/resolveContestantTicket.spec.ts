import { describe, expect, it } from "vitest";
import { resolveContestantTicket } from "./resolveContestantTicket";
import { ITicketOption } from "../types/types";

const ticket = (
  partial: Partial<ITicketOption> & { id: number; name: string }
): ITicketOption =>
  ({
    price_online: 75,
    price_event: 75,
    context: "Contestant",
    ...partial,
  }) as ITicketOption;

const golfer = ticket({ id: 37, name: "Golfer", price_online: 125, price_event: 125 });
const fishAddon = ticket({
  id: 44,
  name: "Fishing Tournament",
  price_online: 75,
  price_event: 75,
});
const fishStandalone = ticket({
  id: 45,
  name: "Fishing Tournament - Contestant Only",
  price_online: 175,
  price_event: 175,
});

const all = [golfer, fishAddon, fishStandalone];

describe("resolveContestantTicket", () => {
  it("returns the single Golfer ticket for golf", () => {
    expect(
      resolveContestantTicket({
        ticketOptions: all,
        sport: "golf",
        registrationType: "Contestant",
      })?.id
    ).toBe(37);
  });

  it("returns fish add-on for Contestant + addon tier", () => {
    expect(
      resolveContestantTicket({
        ticketOptions: all,
        sport: "fish",
        fisherTier: "addon",
        registrationType: "Contestant",
      })?.id
    ).toBe(44);
  });

  it("returns fish standalone for Contestant + standalone tier", () => {
    expect(
      resolveContestantTicket({
        ticketOptions: all,
        sport: "fish",
        fisherTier: "standalone",
        registrationType: "Contestant",
      })?.id
    ).toBe(45);
  });

  it("never returns standalone fish for Attendee checkout", () => {
    expect(
      resolveContestantTicket({
        ticketOptions: all,
        sport: "fish",
        fisherTier: "standalone",
        registrationType: "Attendee",
      })?.id
    ).toBe(44);
  });

  it("returns fish add-on for Vendor without needing tier", () => {
    expect(
      resolveContestantTicket({
        ticketOptions: all,
        sport: "fish",
        registrationType: "Vendor",
      })?.id
    ).toBe(44);
  });
});
