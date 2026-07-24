import { describe, expect, it } from "vitest";
import {
  allowedContestantTickets,
  hasBothContestantTiers,
  isStandaloneContestantTicket,
  tierMinPrice,
} from "./contestantTicketTiers";
import { ITicketOption } from "../types/types";

const ticket = (overrides: Partial<ITicketOption>): ITicketOption =>
  ({
    id: 1,
    name: "Fishing Tournament",
    price_online: 75,
    price_event: 75,
    description: "",
    includes: [],
    excludes: [],
    context: "Contestant",
    ...overrides,
  } as ITicketOption);

const fishing = ticket({ id: 10, name: "Fishing Tournament" });
const fishingStandalone = ticket({
  id: 11,
  name: "Fishing Tournament - Contestant Only",
  price_online: 150,
  price_event: 150,
});
const attendeeTicket = ticket({
  id: 20,
  name: "Full Registration",
  context: "Attendee",
});

describe("isStandaloneContestantTicket", () => {
  it("detects the Contestant Only naming convention", () => {
    expect(isStandaloneContestantTicket(fishingStandalone)).toBe(true);
    expect(isStandaloneContestantTicket({ name: "CONTESTANT ONLY" })).toBe(true);
    expect(isStandaloneContestantTicket(fishing)).toBe(false);
    expect(isStandaloneContestantTicket(null)).toBe(false);
  });
});

describe("allowedContestantTickets", () => {
  const options = [fishing, fishingStandalone, attendeeTicket];

  it("offers the add-on tier to Attendee/Vendor registrations", () => {
    expect(allowedContestantTickets(options, "Attendee", false)).toEqual([
      fishing,
    ]);
    expect(allowedContestantTickets(options, "Vendor", false)).toEqual([
      fishing,
    ]);
  });

  it("offers the standalone tier to contestant-only registrations", () => {
    expect(allowedContestantTickets(options, "Contestant", false)).toEqual([
      fishingStandalone,
    ]);
  });

  it("offers the add-on tier when the contestant-only buyer is already registered", () => {
    expect(allowedContestantTickets(options, "Contestant", true)).toEqual([
      fishing,
    ]);
  });

  it("falls back to all contestant tickets when a tier is missing", () => {
    expect(allowedContestantTickets([fishing], "Contestant", false)).toEqual([
      fishing,
    ]);
    expect(
      allowedContestantTickets([fishingStandalone], "Attendee", false)
    ).toEqual([fishingStandalone]);
  });

  it("supports legacy name-only contestant tickets (no context)", () => {
    const golfer = ticket({
      id: 30,
      name: "Golfer",
      context: null as unknown as "Contestant",
    });
    expect(allowedContestantTickets([golfer], "Attendee", false)).toEqual([
      golfer,
    ]);
  });
});

describe("hasBothContestantTiers", () => {
  it("is true only when both tiers exist", () => {
    expect(hasBothContestantTiers([fishing, fishingStandalone])).toBe(true);
    expect(hasBothContestantTiers([fishing])).toBe(false);
    expect(hasBothContestantTiers([fishingStandalone])).toBe(false);
    expect(hasBothContestantTiers([])).toBe(false);
  });
});

describe("tierMinPrice", () => {
  it("uses online price by default and event price for kiosk", () => {
    const kiosk = ticket({ id: 40, price_online: 75, price_event: 100 });
    expect(tierMinPrice([kiosk], "online")).toBe(75);
    expect(tierMinPrice([kiosk], "kiosk")).toBe(100);
    expect(tierMinPrice([], "online")).toBeNull();
  });
});
