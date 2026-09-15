import { describe, expect, it } from "vitest";
import {
  freeVendorAllowance,
  vendorOrdinalAtIndex,
} from "./freeVendorAllowance";
import { applyTicketPricing } from "./applyTicketPricing";
import { IExtraOption, ITicketPayload } from "../types/types";

describe("freeVendorAllowance", () => {
  it("gives 2 free vendors for 1 booth and 3 for 2+", () => {
    expect(freeVendorAllowance(0)).toBe(0);
    expect(freeVendorAllowance(1)).toBe(2);
    expect(freeVendorAllowance(2)).toBe(3);
    expect(freeVendorAllowance(5)).toBe(3);
  });
});

describe("vendorOrdinalAtIndex", () => {
  it("counts only Vendor tickets before the absolute index", () => {
    const tickets = [
      { type: "Attendee" },
      { type: "Vendor" },
      { type: "Vendor" },
    ];
    expect(vendorOrdinalAtIndex(tickets, 1)).toBe(0);
    expect(vendorOrdinalAtIndex(tickets, 2)).toBe(1);
  });
});

describe("applyTicketPricing", () => {
  const ticketType = {
    id: 32,
    name: "Attendee",
    price_online: 150,
    price_event: 200,
  };
  const line = (
    type: "Vendor" | "Attendee" | "Contestant",
    price: number,
    extras: number[] = []
  ): ITicketPayload =>
    ({ type, price, extras, ticket_type: ticketType }) as unknown as ITicketPayload;

  it("zeros the first two vendor tickets when one booth is present", () => {
    const priced = applyTicketPricing(
      [line("Vendor", 150), line("Vendor", 150), line("Vendor", 150)],
      1,
      "online",
      []
    );
    expect(priced.map((t) => t.price)).toEqual([0, 0, 150]);
  });

  it("corrects a stale paid price when a booth exists", () => {
    const priced = applyTicketPricing([line("Vendor", 150)], 1, "online", []);
    expect(priced[0].price).toBe(0);
  });

  it("re-prices an attendee saved at the early price once event pricing applies", () => {
    const priced = applyTicketPricing(
      [line("Attendee", 150), line("Vendor", 150)],
      0,
      "event",
      []
    );
    expect(priced.map((t) => t.price)).toEqual([200, 200]);
  });

  it("adds paid extras at the tier and skips extras the ticket includes", () => {
    const extras = [
      { id: 1, price_online: 10, price_event: 15, included: [] },
      { id: 2, price_online: 0, price_event: 0, included: [{ id: 32 }] },
      { id: 3, price_online: 5, price_event: 5, included: [{ id: 32 }] },
    ] as unknown as IExtraOption[];
    const priced = applyTicketPricing(
      [line("Contestant", 0, [1, 1, 2, 3])],
      0,
      "event",
      extras
    );
    expect(priced[0].price).toBe(200 + 15 + 15);
  });

  it("leaves a non-vendor line without a ticket type untouched", () => {
    const blank = { type: "Attendee", price: 0, extras: [] } as unknown as ITicketPayload;
    expect(applyTicketPricing([blank], 0, "event", [])[0]).toBe(blank);
  });
});
