import { describe, expect, it } from "vitest";
import { nextAnnualConferenceYear, resolveCycleYear } from "./cycle-year";

describe("nextAnnualConferenceYear", () => {
  it("rolls to next year once the April conference has passed", () => {
    expect(nextAnnualConferenceYear(new Date("2026-10-15T12:00:00"))).toBe(2027);
    expect(nextAnnualConferenceYear(new Date("2026-05-01T00:00:00"))).toBe(2027);
    expect(nextAnnualConferenceYear(new Date("2026-12-31T23:59:59"))).toBe(2027);
  });

  it("keeps the current year while the conference is still ahead", () => {
    expect(nextAnnualConferenceYear(new Date("2027-01-09T12:00:00"))).toBe(2027);
    expect(nextAnnualConferenceYear(new Date("2027-04-30T23:59:59"))).toBe(2027);
  });
});

describe("resolveCycleYear (email display only — storage uses nextAnnualConferenceYear)", () => {
  const now = new Date("2026-10-15T12:00:00");

  it("keeps a sane client-sent year (number or numeric string)", () => {
    expect(resolveCycleYear(2027, now)).toBe(2027);
    expect(resolveCycleYear("2026", now)).toBe(2026);
  });

  it("falls back to the cycle year for blanks and garbage", () => {
    expect(resolveCycleYear(undefined, now)).toBe(2027);
    expect(resolveCycleYear(null, now)).toBe(2027);
    expect(resolveCycleYear("", now)).toBe(2027);
    expect(resolveCycleYear("abc", now)).toBe(2027);
    expect(resolveCycleYear(26, now)).toBe(2027);
    expect(resolveCycleYear(2026.5, now)).toBe(2027);
  });
});
