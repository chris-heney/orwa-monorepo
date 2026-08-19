import { describe, expect, it } from "vitest";
import { scholarshipPacketFilename } from "./scholarshipPacketFilename";

describe("scholarshipPacketFilename", () => {
  it("builds ORWEF-Scholarship-{last}-{year}.pdf", () => {
    expect(
      scholarshipPacketFilename({
        applicant_last_name: "Smith",
        submission_date: "2026-03-15",
      })
    ).toBe("ORWEF-Scholarship-Smith-2026.pdf");
  });

  it("sanitizes last names and falls back to Applicant", () => {
    expect(
      scholarshipPacketFilename({
        applicant_last_name: "O'Brien / Jr.",
        submission_date: "2025-06-15",
      })
    ).toBe("ORWEF-Scholarship-O-Brien-Jr-2025.pdf");
    expect(scholarshipPacketFilename({})).toMatch(
      /^ORWEF-Scholarship-Applicant-\d{4}\.pdf$/
    );
  });
});
