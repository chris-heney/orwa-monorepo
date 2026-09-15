import { describe, expect, it } from "vitest";

import { earlyPricingEndsOn, isEarlyPricingOpen } from "./priceTier";

describe("isEarlyPricingOpen", () => {
  it("is open through the end date in Central time", () => {
    expect(
      isEarlyPricingOpen("2026-09-11", new Date("2026-09-12T04:59:59Z"))
    ).toBe(true);
  });

  it("closes at midnight Central after the end date", () => {
    expect(
      isEarlyPricingOpen("2026-09-11", new Date("2026-09-12T05:00:00Z"))
    ).toBe(false);
    expect(
      isEarlyPricingOpen("2026-09-11", new Date("2026-09-15T17:31:00Z"))
    ).toBe(false);
  });

  it("is closed when there is no end date", () => {
    expect(isEarlyPricingOpen(null)).toBe(false);
  });
});

describe("earlyPricingEndsOn", () => {
  it("is the day after the end date, across month ends", () => {
    expect(earlyPricingEndsOn("2026-09-11")).toBe("2026-09-12");
    expect(earlyPricingEndsOn("2026-09-30")).toBe("2026-10-01");
    expect(earlyPricingEndsOn(null)).toBeNull();
  });
});
