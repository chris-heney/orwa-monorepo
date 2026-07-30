import { describe, expect, it } from "vitest";
import {
  freeVendorAllowance,
  vendorOrdinalAtIndex,
} from "./freeVendorAllowance";
import { applyFreeVendorPricing } from "./applyFreeVendorPricing";
import { ITicketPayload } from "../types/types";

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

describe("applyFreeVendorPricing", () => {
  const vendorTicket = (price: number): ITicketPayload =>
    ({
      type: "Vendor",
      price,
      extras: [],
      ticket_type: {
        id: 31,
        name: "Vendor",
        price_online: 150,
        price_event: 200,
      },
    }) as unknown as ITicketPayload;

  it("zeros the first two vendor tickets when one booth is present", () => {
    const priced = applyFreeVendorPricing(
      [vendorTicket(150), vendorTicket(150), vendorTicket(150)],
      1,
      "online",
      []
    );
    expect(priced.map((t) => t.price)).toEqual([0, 0, 150]);
  });

  it("corrects a stale paid price when a booth exists", () => {
    const priced = applyFreeVendorPricing([vendorTicket(150)], 1, "online", []);
    expect(priced[0].price).toBe(0);
  });
});
