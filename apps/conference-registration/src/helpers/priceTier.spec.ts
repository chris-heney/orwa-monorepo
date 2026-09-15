import { describe, expect, it } from "vitest";
import {
  isPastOnlineRegistrationEnd,
  priceFor,
  pricingCalendarDay,
  resolvePriceTier,
} from "./priceTier";

// Fall Conference 2026: online_registration_end = 2026-09-11, $150 / $200.
const END = "2026-09-11";
const attendee = { price_online: 150, price_event: 200 };

describe("pricingCalendarDay", () => {
  it("uses Oklahoma time, not UTC", () => {
    // 02:00Z on the 12th is still 21:00 on the 11th in Central time.
    expect(pricingCalendarDay(new Date("2026-09-12T02:00:00Z"))).toBe(
      "2026-09-11"
    );
  });
});

describe("resolvePriceTier", () => {
  it("keeps early pricing through the whole end date (inclusive)", () => {
    expect(
      resolvePriceTier("online", END, new Date("2026-09-11T05:00:00Z"))
    ).toBe("online"); // 00:00 CDT on the 11th
    expect(
      resolvePriceTier("online", END, new Date("2026-09-12T04:59:59Z"))
    ).toBe("online"); // 23:59:59 CDT on the 11th
  });

  it("switches to event pricing at midnight Central after the end date", () => {
    expect(
      resolvePriceTier("online", END, new Date("2026-09-12T05:00:00Z"))
    ).toBe("event");
  });

  it("charges event pricing for the live 2026-09-15 case", () => {
    const tier = resolvePriceTier(
      "online",
      END,
      new Date("2026-09-15T17:31:00Z")
    );
    expect(tier).toBe("event");
    expect(priceFor(attendee, tier)).toBe(200);
  });

  it("does not flip early on the UTC date change", () => {
    expect(
      resolvePriceTier("online", END, new Date("2026-09-12T02:00:00Z"))
    ).toBe("online");
  });

  it("is always event pricing at the kiosk", () => {
    expect(
      resolvePriceTier("kiosk", END, new Date("2026-08-01T12:00:00Z"))
    ).toBe("event");
  });

  it("stays online when the conference has no end date", () => {
    expect(resolvePriceTier("online", null, new Date())).toBe("online");
    expect(resolvePriceTier("online", "", new Date())).toBe("online");
    expect(resolvePriceTier(undefined, undefined, new Date())).toBe("online");
  });

  it("accepts a datetime-shaped end value", () => {
    expect(
      isPastOnlineRegistrationEnd(
        "2026-09-11T00:00:00.000Z",
        new Date("2026-09-12T05:00:00Z")
      )
    ).toBe(true);
  });
});

describe("priceFor", () => {
  it("reads the tier's field and treats missing prices as 0", () => {
    expect(priceFor(attendee, "online")).toBe(150);
    expect(priceFor(attendee, "event")).toBe(200);
    expect(priceFor({ price_online: null }, "online")).toBe(0);
    expect(priceFor(undefined, "event")).toBe(0);
    expect(priceFor({ price_event: "75" }, "event")).toBe(75);
  });
});
