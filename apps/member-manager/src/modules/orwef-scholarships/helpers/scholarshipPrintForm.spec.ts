import { describe, expect, it } from "vitest";
import { scholarshipRunningTitle } from "./scholarshipPrintForm";

describe("scholarshipRunningTitle", () => {
  it("prints the ORWEF start year as the split academic year", () => {
    expect(
      scholarshipRunningTitle({ applicantName: "Jordan Harper", year: "2027" })
    ).toBe("Jordan Harper  ·  ORWEF Scholarship  ·  Year: 2027-2028");
  });

  it("omits the year segment when the model has none and never says Cycle", () => {
    const title = scholarshipRunningTitle({ applicantName: "", year: "" });
    expect(title).toBe("Applicant  ·  ORWEF Scholarship");
    expect(title).not.toMatch(/cycle/i);
  });
});
