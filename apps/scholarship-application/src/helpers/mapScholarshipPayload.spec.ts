import { describe, expect, it } from "vitest";
import {
  mapScholarshipPayload,
  withSelfEligibleParticipant,
} from "./mapScholarshipPayload";
import { nextConferenceYear } from "./nextConferenceYear";
import { scholarshipDefaultPayload } from "./scholarshipDefaultPayload";

describe("mapScholarshipPayload", () => {
  it("fills eligible participant contact from the applicant for Self", () => {
    const mapped = mapScholarshipPayload({
      ...scholarshipDefaultPayload,
      relationship: "Self",
      applicant_first_name: "Hunter",
      applicant_last_name: "Breitenberg",
      applicant_email: "hunter@example.org",
      applicant_phone: "(405) 555-0101",
      applicant_street: "1 Test St",
      applicant_city: "Ada",
      applicant_state: "Oklahoma",
      applicant_zip: "74820",
      eligible_participant_title: "Operator",
    } as any);

    expect(mapped.eligible_participant_name).toEqual({
      first: "Hunter",
      last: "Breitenberg",
    });
    expect(mapped.eligible_participant_email).toBe("hunter@example.org");
    expect(mapped.eligible_participant_phone).toBe("(405) 555-0101");
    expect(mapped.eligible_participant_address).toEqual({
      street: "1 Test St",
      city: "Ada",
      state: "Oklahoma",
      zip: "74820",
    });
    expect(mapped.eligible_participant_title).toBe("Operator");
  });

  it("leaves dependent applications' participant fields alone", () => {
    const input = {
      ...scholarshipDefaultPayload,
      relationship: "DependentChild",
      applicant_email: "kid@example.org",
      eligible_participant_email: "parent@example.org",
    };
    expect(withSelfEligibleParticipant(input as any)).toBe(input);
    expect(mapScholarshipPayload(input as any).eligible_participant_email).toBe(
      "parent@example.org"
    );
  });

  it("sends the cycle year and defaults it when blank", () => {
    expect(
      mapScholarshipPayload({ ...scholarshipDefaultPayload, scholarship_year: 2027 } as any)
        .scholarship_year
    ).toBe(2027);
    expect(
      mapScholarshipPayload({ ...scholarshipDefaultPayload, scholarship_year: "" } as any)
        .scholarship_year
    ).toBe(nextConferenceYear());
  });

  it("maps leftover grant-era field names onto schema keys", () => {
    const mapped = mapScholarshipPayload({
      ...scholarshipDefaultPayload,
      applicant_first_name: "Ada",
      applicant_last_name: "Lovelace",
      high_school_gpa: 3.8,
      upload_transcript: 11,
      upload_scores: 12,
      essay_upload: 13,
      bio_upload: 14,
      photo_upload: 15,
      recommender1_file: 16,
      recommender2_file: 17,
      watersystem_id: 99,
    } as any);

    expect(mapped.gpa).toBe(3.8);
    expect(mapped.transcript).toBe(11);
    expect(mapped.test_scores).toBe(12);
    expect(mapped.essay).toBe(13);
    expect(mapped.biography).toBe(14);
    expect(mapped.photograph).toBe(15);
    expect(mapped.recommendation_letter_1).toBe(16);
    expect(mapped.recommendation_letter_2).toBe(17);
    expect(mapped.watersystem).toBe(99);
  });

  it("keeps dates as YYYY-MM-DD strings and drops empty ones", () => {
    const mapped = mapScholarshipPayload({
      ...scholarshipDefaultPayload,
      graduation_date: "2026-05-15",
      applicant_certification_date: "",
    } as any);

    expect(mapped.graduation_date).toBe("2026-05-15");
    expect(mapped.applicant_certification_date).toBeUndefined();
  });

  it("does not invent a system_name from the school", () => {
    const mapped = mapScholarshipPayload({
      ...scholarshipDefaultPayload,
      school_name: "Norman High",
      system_name: "Rural Water District #4",
    } as any);

    expect(mapped.system_name).toBe("Rural Water District #4");
    expect(mapped.school_name).toBe("Norman High");
  });

  it("maps a single financial resource and keeps amount as a number", () => {
    const mapped = mapScholarshipPayload({
      ...scholarshipDefaultPayload,
      financial_resources: [
        { institution: "ORWEF", amount: 1500 },
        { institution: "", amount: "" },
      ],
    } as any);

    expect(mapped.financial_resources).toEqual([
      { institution: "ORWEF", amount: 1500 },
    ]);
    expect(typeof mapped.financial_resources[0].amount).toBe("number");
    expect(mapped.financial_resources[0].amount instanceof Date).toBe(false);
  });

  it("caps financial_resources at 10", () => {
    const mapped = mapScholarshipPayload({
      ...scholarshipDefaultPayload,
      financial_resources: Array.from({ length: 11 }, (_, index) => ({
        institution: `Aid ${index + 1}`,
        amount: index + 1,
      })),
    } as any);

    expect(mapped.financial_resources).toHaveLength(10);
    expect(mapped.financial_resources[0].institution).toBe("Aid 1");
    expect(mapped.financial_resources[9].institution).toBe("Aid 10");
  });

  it("bridges leftover financial1/2 when the repeater is empty", () => {
    const mapped = mapScholarshipPayload({
      ...scholarshipDefaultPayload,
      financial_resources: [{ institution: "", amount: "" }],
      financial1_institution: "Legacy Fund",
      financial1_amount: 500,
      financial2_institution: "County Aid",
      financial2_amount: "750",
    } as any);

    expect(mapped.financial_resources).toEqual([
      { institution: "Legacy Fund", amount: 500 },
      { institution: "County Aid", amount: 750 },
    ]);
    expect(mapped).not.toHaveProperty("financial1_institution");
    expect(mapped).not.toHaveProperty("financial2_amount");
  });
});
