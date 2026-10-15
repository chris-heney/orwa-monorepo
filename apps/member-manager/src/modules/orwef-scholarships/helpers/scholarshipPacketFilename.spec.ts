import { describe, expect, it } from "vitest";
import { scholarshipPacketFilename } from "./scholarshipPacketFilename";

describe("scholarshipPacketFilename", () => {
  it("builds ORWEF-Scholarship-{last}-{year}.pdf from the stamped scholarship_year", () => {
    expect(
      scholarshipPacketFilename({
        applicant_last_name: "Smith",
        scholarship_year: 2027,
        submission_date: "2026-10-15",
      })
    ).toBe("ORWEF-Scholarship-Smith-2027.pdf");
  });

  it("derives the cycle year for legacy rows without scholarship_year", () => {
    // Mar 15 → same year's conference.
    expect(
      scholarshipPacketFilename({
        applicant_last_name: "Smith",
        submission_date: "2026-03-15",
      })
    ).toBe("ORWEF-Scholarship-Smith-2026.pdf");
    // Jun 15 → next year's conference.
    expect(
      scholarshipPacketFilename({
        applicant_last_name: "Jones",
        scholarship_year: null,
        submission_date: "2025-06-15",
      })
    ).toBe("ORWEF-Scholarship-Jones-2026.pdf");
  });

  it("sanitizes last names and falls back to Applicant", () => {
    expect(
      scholarshipPacketFilename({
        applicant_last_name: "O'Brien / Jr.",
        submission_date: "2025-03-15",
      })
    ).toBe("ORWEF-Scholarship-O-Brien-Jr-2025.pdf");
    expect(scholarshipPacketFilename({})).toMatch(
      /^ORWEF-Scholarship-Applicant-\d{4}\.pdf$/
    );
  });
});
