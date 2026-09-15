import { describe, expect, it } from "vitest";
import { priceFor, pricingCalendarDay, resolvePriceTier } from "./price-tier";

// Fall Conference 2026: online_registration_end = 2026-09-11, $150 / $200.
const END = "2026-09-11";

describe("resolvePriceTier", () => {
  it("keeps early pricing through the end date, in Central time", () => {
    expect(
      resolvePriceTier("online", END, new Date("2026-09-12T04:59:59Z"))
    ).toBe("online");
    expect(pricingCalendarDay(new Date("2026-09-12T02:00:00Z"))).toBe(
      "2026-09-11"
    );
  });

  it("uses event pricing from the day after the end date", () => {
    expect(
      resolvePriceTier("online", END, new Date("2026-09-12T05:00:00Z"))
    ).toBe("event");
    expect(
      priceFor(
        { price_online: 150, price_event: 200 },
        resolvePriceTier("online", END, new Date("2026-09-15T17:31:00Z"))
      )
    ).toBe(200);
  });

  it("is event pricing at the kiosk and online without an end date", () => {
    expect(resolvePriceTier("kiosk", END, new Date("2026-08-01"))).toBe(
      "event"
    );
    expect(resolvePriceTier("online", null)).toBe("online");
    expect(resolvePriceTier(undefined, undefined)).toBe("online");
  });
});
