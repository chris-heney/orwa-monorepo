import { describe, expect, it } from "vitest";
import { formatScholarshipYear, nextConferenceYear } from "./nextConferenceYear";

describe("formatScholarshipYear (split academic year)", () => {
  it("renders the integer start year as START-END", () => {
    expect(formatScholarshipYear(2027)).toBe("2027-2028");
    expect(formatScholarshipYear(1999)).toBe("1999-2000");
    expect(formatScholarshipYear("2027")).toBe("2027-2028");
  });

  it("echoes non-integer input rather than NaN-NaN", () => {
    expect(formatScholarshipYear("")).toBe("");
  });
});

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
