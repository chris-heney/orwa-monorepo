import { describe, expect, it } from "vitest";
import { nextConferenceYear } from "./nextConferenceYear";

describe("nextConferenceYear", () => {
  it("rolls to next year once the April conference has passed", () => {
    expect(nextConferenceYear(new Date("2026-10-15T12:00:00"))).toBe(2027);
    expect(nextConferenceYear(new Date("2026-05-01T00:00:00"))).toBe(2027);
    expect(nextConferenceYear(new Date("2026-12-31T23:59:59"))).toBe(2027);
  });

  it("keeps the current year while the conference is still ahead", () => {
    expect(nextConferenceYear(new Date("2027-01-09T12:00:00"))).toBe(2027);
    expect(nextConferenceYear(new Date("2027-04-30T23:59:59"))).toBe(2027);
  });
});
