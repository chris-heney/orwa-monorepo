import { describe, expect, it } from "vitest";
import { filterVisibleExtras } from "./filterVisibleExtras";
import { IExtraOption, ITicketOption } from "../types/types";

const attendeeTicket = { id: 10, name: "Attendee" } as ITicketOption;

const lunch = {
  id: 37,
  name: "Lunch",
  context: "Attendee",
  price_online: 0,
  price_event: 0,
  included: [],
  excluded: [],
} as unknown as IExtraOption;

const dinner = {
  id: 38,
  name: "Dinner",
  context: "Attendee",
  price_online: 0,
  price_event: 0,
  included: [attendeeTicket],
  excluded: [],
} as unknown as IExtraOption;

const paidExtra = {
  id: 41,
  name: "Golf Cart",
  context: "Attendee",
  price_online: 50,
  price_event: 40,
  included: [],
  excluded: [],
} as unknown as IExtraOption;

const vendorOnlyExtra = {
  id: 42,
  name: "Vendor lunch",
  context: "Attendee",
  price_online: 0,
  price_event: 25,
  included: [],
  excluded: [attendeeTicket],
} as unknown as IExtraOption;

const boothExtra = {
  id: 1,
  name: "Table skirt",
  context: "Booth",
  price_online: 50,
  price_event: 40,
  included: [],
  excluded: [],
} as unknown as IExtraOption;

const freeBoothExtra = {
  id: 3,
  name: "Free sign",
  context: "Booth",
  price_online: 10,
  price_event: 0,
  included: [],
  excluded: [],
} as unknown as IExtraOption;

const mulligan = {
  id: 50,
  name: "Mulligan",
  context: "Contestants",
  price_online: 10,
  price_event: 10,
  included: [],
  excluded: [],
} as unknown as IExtraOption;

describe("filterVisibleExtras", () => {
  it("returns empty when no extras match context (heading must stay hidden)", () => {
    const visible = filterVisibleExtras({
      extras: [boothExtra, lunch],
      context: "Registration",
      registrationSource: "kiosk",
      ticketTypeId: attendeeTicket.id,
    });
    expect(visible).toHaveLength(0);
  });

  it("shows $0 extras in kiosk (no price_event gate) including included meals", () => {
    const visible = filterVisibleExtras({
      extras: [lunch, dinner, paidExtra],
      context: "Attendee",
      registrationSource: "kiosk",
      ticketTypeId: attendeeTicket.id,
    });
    expect(visible.map((e) => e.name)).toEqual(["Lunch", "Dinner", "Golf Cart"]);
  });

  it("shows $0 extras online the same way", () => {
    const visible = filterVisibleExtras({
      extras: [lunch, dinner],
      context: "Attendee",
      registrationSource: "online",
      ticketTypeId: attendeeTicket.id,
    });
    expect(visible.map((e) => e.name)).toEqual(["Lunch", "Dinner"]);
  });

  it("respects excluded tickets (non-Booth)", () => {
    const visible = filterVisibleExtras({
      extras: [vendorOnlyExtra, paidExtra],
      context: "Attendee",
      registrationSource: "kiosk",
      ticketTypeId: attendeeTicket.id,
    });
    expect(visible.map((e) => e.name)).toEqual(["Golf Cart"]);
  });

  it("does not apply excluded filtering for Booth context", () => {
    const boothWithExcluded = {
      ...boothExtra,
      excluded: [attendeeTicket],
    } as unknown as IExtraOption;
    const visible = filterVisibleExtras({
      extras: [boothWithExcluded],
      context: "Booth",
      registrationSource: "online",
      ticketTypeId: attendeeTicket.id,
    });
    expect(visible).toHaveLength(1);
  });

  it("matches Contestant UI context to Contestants Strapi context", () => {
    const visible = filterVisibleExtras({
      extras: [mulligan],
      context: "Contestant",
      registrationSource: "online",
    });
    expect(visible).toHaveLength(1);
  });

  it("shows $0 booth extras in kiosk (no price gate)", () => {
    const visible = filterVisibleExtras({
      extras: [freeBoothExtra, boothExtra],
      context: "Booth",
      registrationSource: "kiosk",
    });
    expect(visible.map((e) => e.name)).toEqual(["Free sign", "Table skirt"]);
  });
});
