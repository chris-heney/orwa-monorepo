import { describe, expect, it } from "vitest";
import { nextConferenceYear } from "./nextConferenceYear";

describe("nextConferenceYear", () => {
  it("returns the following calendar year", () => {
    expect(nextConferenceYear(new Date("2026-08-19T12:00:00"))).toBe(2027);
    expect(nextConferenceYear(new Date("2025-01-01T00:00:00"))).toBe(2026);
    expect(nextConferenceYear(new Date("2026-12-31T23:59:59"))).toBe(2027);
  });
});
