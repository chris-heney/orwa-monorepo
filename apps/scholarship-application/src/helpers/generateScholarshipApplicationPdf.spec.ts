import { describe, expect, it } from "vitest";
import { buildModel } from "./generateScholarshipApplicationPdf";
import { scholarshipDefaultPayload } from "./scholarshipDefaultPayload";
import { formatScholarshipYear, nextConferenceYear } from "./nextConferenceYear";

describe("buildModel (emailed PDF cover / running header year)", () => {
  it("prints the stored start year as the split academic year", () => {
    const model = buildModel({
      ...scholarshipDefaultPayload,
      applicant_first_name: "Jane",
      applicant_last_name: "Doe",
      scholarship_year: 2027,
    });
    expect(model.cycleYear).toBe("2027-2028");
    expect(model.applicantName).toBe("Jane Doe");
  });

  it("falls back to the current cycle when the payload year is blank", () => {
    const model = buildModel({ ...scholarshipDefaultPayload, scholarship_year: "" });
    expect(model.cycleYear).toBe(formatScholarshipYear(nextConferenceYear()));
  });
});
