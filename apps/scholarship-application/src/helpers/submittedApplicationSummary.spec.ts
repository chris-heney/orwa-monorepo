import { describe, expect, it } from "vitest";
import { summarizeSubmittedApplication } from "./submittedApplicationSummary";
import { nextConferenceYear } from "./nextConferenceYear";

describe("summarizeSubmittedApplication", () => {
  it("builds the applicant name, email, year and record id", () => {
    expect(
      summarizeSubmittedApplication(
        {
          applicant_first_name: " Jane ",
          applicant_middle_name: "",
          applicant_last_name: "Doe",
          applicant_email: "jane@e2e-seed.orwa.local ",
          scholarship_year: 2027,
        },
        { message: "success", scholarshipApplication: { documentId: "abc123" } }
      )
    ).toEqual({
      applicantName: "Jane Doe",
      applicantEmail: "jane@e2e-seed.orwa.local",
      scholarshipYear: 2027,
      documentId: "abc123",
    });
  });

  it("includes a middle name when present", () => {
    expect(
      summarizeSubmittedApplication({
        applicant_first_name: "Jane",
        applicant_middle_name: "Q",
        applicant_last_name: "Doe",
      }).applicantName
    ).toBe("Jane Q Doe");
  });

  it("falls back to the current cycle year and a null id", () => {
    const summary = summarizeSubmittedApplication(
      { applicant_first_name: "Jane", scholarship_year: "" },
      { message: "success" }
    );
    expect(summary.scholarshipYear).toBe(nextConferenceYear());
    expect(summary.documentId).toBeNull();
    expect(summary.applicantEmail).toBe("");
  });
});
