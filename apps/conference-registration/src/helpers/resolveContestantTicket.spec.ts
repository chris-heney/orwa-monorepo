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
const golferStandalone = ticket({
  id: 47,
  name: "Golfer - Contestant Only",
  price_online: 125,
  price_event: 125,
});
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

const all = [golfer, golferStandalone, fishAddon, fishStandalone];

describe("resolveContestantTicket", () => {
  it("returns the add-on Golfer ticket when no tier is requested", () => {
    expect(
      resolveContestantTicket({
        ticketOptions: all,
        sport: "golf",
      })?.id
    ).toBe(37);
  });

  it("returns the standalone Golfer ticket when standalone tier is requested (Add Unregistered Contestant)", () => {
    expect(
      resolveContestantTicket({
        ticketOptions: all,
        sport: "golf",
        tier: "standalone",
      })?.id
    ).toBe(47);
  });

  it("falls back to the add-on Golfer ticket when no standalone golf ticket exists", () => {
    expect(
      resolveContestantTicket({
        ticketOptions: [golfer, fishAddon, fishStandalone],
        sport: "golf",
        tier: "standalone",
      })?.id
    ).toBe(37);
  });

  it("returns fish add-on for the default (addon) tier", () => {
    expect(
      resolveContestantTicket({
        ticketOptions: all,
        sport: "fish",
        tier: "addon",
      })?.id
    ).toBe(44);
  });

  it("returns fish standalone for the standalone tier", () => {
    expect(
      resolveContestantTicket({
        ticketOptions: all,
        sport: "fish",
        tier: "standalone",
      })?.id
    ).toBe(45);
  });

  it("returns standalone fish ticket when standalone tier is explicitly requested, even for an Attendee/Vendor checkout (Add Unregistered Contestant)", () => {
    expect(
      resolveContestantTicket({
        ticketOptions: all,
        sport: "fish",
        tier: "standalone",
      })?.id
    ).toBe(45);
  });

  it("returns fish add-on when no tier is requested", () => {
    expect(
      resolveContestantTicket({
        ticketOptions: all,
        sport: "fish",
      })?.id
    ).toBe(44);
  });

  it("returns null when the sport has no matching tickets", () => {
    expect(
      resolveContestantTicket({
        ticketOptions: [fishAddon],
        sport: "golf",
      })
    ).toBeNull();
  });
});
