import { describe, expect, it } from "vitest";
import {
  applySelfEligibleParticipant,
  emptyToNull,
  manyMedia,
  resolveFinancialResources,
  resolveGpa,
  resolveSystemName,
  singleMedia,
  validationErrorMessage,
} from "./helpers";

describe("applySelfEligibleParticipant", () => {
  const applicant = {
    applicant_first_name: "Hunter",
    applicant_last_name: "Breitenberg",
    applicant_email: "hunter@example.org",
    applicant_phone: "(405) 555-0101",
    applicant_street: "1 Test St",
    applicant_city: "Ada",
    applicant_state: "Oklahoma",
    applicant_zip: "74820",
  };

  it("fills participant contact fields from the applicant for Self", () => {
    const result = applySelfEligibleParticipant({
      ...applicant,
      relationship: "Self",
      eligible_participant_name: { first: "", last: "" },
      eligible_participant_email: "",
      eligible_participant_phone: "",
      eligible_participant_address: { street: "", city: "", state: "Oklahoma", zip: "" },
    });
    expect(result.eligible_participant_name).toEqual({
      first: "Hunter",
      last: "Breitenberg",
    });
    expect(result.eligible_participant_email).toBe("hunter@example.org");
    expect(result.eligible_participant_phone).toBe("(405) 555-0101");
    expect(result.eligible_participant_address).toEqual({
      street: "1 Test St",
      city: "Ada",
      state: "Oklahoma",
      zip: "74820",
    });
  });

  it("also handles fields that were never sent (undefined)", () => {
    const result = applySelfEligibleParticipant({
      ...applicant,
      relationship: "Self",
    });
    expect(result.eligible_participant_email).toBe("hunter@example.org");
    expect(result.eligible_participant_name?.first).toBe("Hunter");
  });

  it("keeps values the client did send", () => {
    const result = applySelfEligibleParticipant({
      ...applicant,
      relationship: "Self",
      eligible_participant_email: "work@example.org",
    });
    expect(result.eligible_participant_email).toBe("work@example.org");
  });

  it("leaves dependent applications untouched", () => {
    const input = {
      ...applicant,
      relationship: "DependentChild",
      eligible_participant_email: "",
    };
    expect(applySelfEligibleParticipant(input)).toBe(input);
  });
});

describe("validationErrorMessage", () => {
  it("lists field paths from a Strapi/yup ValidationError", () => {
    const err = Object.assign(new Error("2 errors occurred"), {
      name: "ValidationError",
      details: {
        errors: [
          { path: ["eligible_participant_phone"], message: "eligible_participant_phone must be defined." },
          { path: ["eligible_participant_email"], message: "This attribute must be unique" },
        ],
      },
    });
    expect(validationErrorMessage(err)).toBe(
      "Please check the following: eligible_participant_phone must be defined.; eligible_participant_email: This attribute must be unique."
    );
  });

  it("returns null for non-validation errors", () => {
    expect(validationErrorMessage(new Error("boom"))).toBeNull();
    expect(validationErrorMessage(null)).toBeNull();
  });
});

describe("submissions helpers", () => {
  it("emptyToNull turns blank strings into null and keeps real values", () => {
    expect(emptyToNull("")).toBeNull();
    expect(emptyToNull(undefined)).toBeNull();
    expect(emptyToNull("2026-04-15")).toBe("2026-04-15");
    expect(emptyToNull(0)).toBe(0);
  });

  it("singleMedia unwraps arrays and entity objects to a single id", () => {
    expect(singleMedia([{ id: 12 }, { id: 13 }])).toBe(12);
    expect(singleMedia({ documentId: "abc123def4567890" })).toBe(
      "abc123def4567890"
    );
    expect(singleMedia({ id: 44 })).toBe(44);
    expect(singleMedia([])).toBeNull();
    expect(singleMedia("")).toBeNull();
    expect(singleMedia(9)).toBe(9);
  });

  it("manyMedia normalizes a mixed list of file ids", () => {
    expect(manyMedia([{ id: 1 }, { documentId: "filedocid12345678" }])).toEqual([
      1,
      "filedocid12345678",
    ]);
    expect(manyMedia({ id: 7 })).toEqual([7]);
    expect(manyMedia(null)).toBeNull();
  });

  it("resolveGpa prefers schema gpa over leftover high_school_gpa", () => {
    expect(resolveGpa({ gpa: 3.6, high_school_gpa: 2.1 })).toBe(3.6);
    expect(resolveGpa({ high_school_gpa: "3.2" })).toBe(3.2);
    expect(resolveGpa({})).toBeNull();
  });

  it("resolveSystemName never falls back to school_name", () => {
    expect(
      resolveSystemName({
        school_name: "Norman High",
        watersystemName: "Rural Water District #1",
      })
    ).toBe("Rural Water District #1");
    expect(
      resolveSystemName({
        system_name: "City of Edmond",
        school_name: "Norman High",
      })
    ).toBe("City of Edmond");
    expect(resolveSystemName({ school_name: "Norman High" })).toBe("");
  });

  it("resolveFinancialResources maps one item, caps at 10, and bridges leftover financial1/2", () => {
    expect(
      resolveFinancialResources({
        financial_resources: [
          { institution: "ORWEF", amount: 1500 },
          { institution: "", amount: "" },
        ],
      })
    ).toEqual([{ institution: "ORWEF", amount: 1500 }]);

    expect(
      resolveFinancialResources({
        financial_resources: Array.from({ length: 11 }, (_, index) => ({
          institution: `Aid ${index + 1}`,
          amount: index + 1,
        })),
      })
    ).toHaveLength(10);

    expect(
      resolveFinancialResources({
        financial_resources: [{ institution: "", amount: "" }],
        financial1_institution: "Legacy Fund",
        financial1_amount: 500,
        financial2_institution: "County Aid",
        financial2_amount: "750",
      })
    ).toEqual([
      { institution: "Legacy Fund", amount: 500 },
      { institution: "County Aid", amount: 750 },
    ]);
  });
});
