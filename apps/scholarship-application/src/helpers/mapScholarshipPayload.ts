import {
  IScholarshipApplicationPayload,
  ScholarshipAddress,
  ScholarshipFinancialResource,
  ScholarshipName,
} from "../types/types";

export const MAX_FINANCIAL_RESOURCES = 10;

const emptyToUndefined = (value: unknown) =>
  value === "" || value === undefined ? undefined : value;

const asName = (value: unknown): ScholarshipName | undefined => {
  if (!value || typeof value !== "object") return undefined;
  const name = value as ScholarshipName;
  if (!name.first && !name.last) return undefined;
  return { first: name.first || "", last: name.last || "" };
};

const asAddress = (value: unknown): ScholarshipAddress | undefined => {
  if (!value || typeof value !== "object") return undefined;
  const address = value as ScholarshipAddress;
  if (!address.street && !address.city && !address.zip) return undefined;
  return {
    street: address.street || "",
    city: address.city || "",
    state: address.state || "Oklahoma",
    zip: address.zip || "",
  };
};

const asNumber = (value: unknown) => {
  if (value === "" || value == null) return undefined;
  if (value instanceof Date) return undefined;
  const numeric = Number(value);
  return Number.isNaN(numeric) ? undefined : numeric;
};

const asFinancialResource = (
  value: unknown
): { institution?: string; amount?: number } | null => {
  if (!value || typeof value !== "object") return null;
  const row = value as { institution?: unknown; amount?: unknown };
  const institution = emptyToUndefined(row.institution);
  const amount = asNumber(row.amount);
  if (institution == null && amount == null) return null;
  return {
    ...(typeof institution === "string" ? { institution } : {}),
    ...(amount != null ? { amount } : {}),
  };
};

/**
 * Prefer `financial_resources` (capped at 10). If that list is empty,
 * bridge leftover financial1/2 draft keys so old sessions still land.
 * Amounts stay numbers — never Date instances.
 */
export const asFinancialResources = (
  payload: Record<string, unknown>
): Array<{ institution?: string; amount?: number }> => {
  const rows = Array.isArray(payload.financial_resources)
    ? payload.financial_resources
    : [];
  const mapped = rows
    .map(asFinancialResource)
    .filter(
      (row): row is { institution?: string; amount?: number } => row != null
    )
    .slice(0, MAX_FINANCIAL_RESOURCES);

  if (mapped.length > 0) return mapped;

  return [
    asFinancialResource({
      institution: payload.financial1_institution,
      amount: payload.financial1_amount,
    }),
    asFinancialResource({
      institution: payload.financial2_institution,
      amount: payload.financial2_amount,
    }),
  ]
    .filter(
      (row): row is { institution?: string; amount?: number } => row != null
    )
    .slice(0, MAX_FINANCIAL_RESOURCES);
};

export const hydrateFinancialResources = (
  payload: Record<string, unknown>
): ScholarshipFinancialResource[] => {
  const mapped = asFinancialResources(payload);
  if (mapped.length === 0) {
    return [{ institution: "", amount: "" }];
  }
  return mapped.map((row) => ({
    institution: row.institution ?? "",
    amount: row.amount ?? "",
  }));
};

/**
 * Keep only schema fields and coerce empties so Strapi 5 does not 400.
 * Dates stay YYYY-MM-DD strings.
 */
export const mapScholarshipPayload = (
  payload: IScholarshipApplicationPayload & Record<string, unknown>
) => ({
  applicant_first_name: payload.applicant_first_name,
  applicant_middle_name: emptyToUndefined(payload.applicant_middle_name),
  applicant_last_name: payload.applicant_last_name,
  applicant_phone: payload.applicant_phone,
  applicant_email: payload.applicant_email,
  applicant_street: payload.applicant_street,
  applicant_city: payload.applicant_city,
  applicant_state: payload.applicant_state,
  applicant_zip: payload.applicant_zip,
  system_name: payload.system_name,
  watersystem: payload.watersystem ?? payload.watersystem_id ?? null,
  relationship: payload.relationship,
  eligible_participant_name: asName(payload.eligible_participant_name),
  eligible_participant_title: payload.eligible_participant_title,
  eligible_participant_phone: payload.eligible_participant_phone,
  eligible_participant_email: payload.eligible_participant_email,
  eligible_participant_address: asAddress(payload.eligible_participant_address),
  school_name: payload.school_name,
  graduation_date: emptyToUndefined(payload.graduation_date),
  school_address: asAddress(payload.school_address),
  gpa: asNumber(
    payload.gpa !== "" && payload.gpa != null
      ? payload.gpa
      : payload.high_school_gpa
  ),
  sat_score: asNumber(payload.sat_score),
  act_score: asNumber(payload.act_score),
  transcript: payload.transcript ?? payload.upload_transcript ?? null,
  test_scores: payload.test_scores ?? payload.upload_scores ?? null,
  first_year: payload.first_year,
  credits_completed: asNumber(payload.credits_completed) ?? 0,
  credits_required: asNumber(payload.credits_required) ?? 0,
  college_gpa: asNumber(payload.college_gpa) ?? 0,
  education_type: payload.education_type,
  major: emptyToUndefined(payload.major),
  awards: emptyToUndefined(payload.awards),
  recommender1_name: asName(payload.recommender1_name),
  recommender1_email: payload.recommender1_email,
  recommender1_phone: payload.recommender1_phone,
  recommendation_letter_1:
    payload.recommendation_letter_1 ?? payload.recommender1_file ?? null,
  recommender2_name: asName(payload.recommender2_name),
  recommender2_email: payload.recommender2_email,
  recommender2_phone: payload.recommender2_phone,
  recommendation_letter_2:
    payload.recommendation_letter_2 ?? payload.recommender2_file ?? null,
  financial_resources: asFinancialResources(payload),
  essay: payload.essay ?? payload.essay_upload ?? null,
  biography: payload.biography ?? payload.bio_upload ?? null,
  photograph: payload.photograph ?? payload.photo_upload ?? null,
  applicant_pdf: payload.applicant_pdf ?? null,
  age_confirm: payload.age_confirm,
  applicant_certification: Boolean(payload.applicant_certification),
  applicant_certification_date: emptyToUndefined(
    payload.applicant_certification_date
  ),
  guardian_name: asName(payload.guardian_name),
  guardian_certification: payload.guardian_certification || undefined,
  guardian_certification_date: emptyToUndefined(
    payload.guardian_certification_date
  ),
  accepted_terms: payload.accepted_terms,
  adminOptions: payload.adminOptions,
});
