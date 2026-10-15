import type {
  IScholarshipApplicationPayload,
  SubmittedApplicationSummary,
} from "../types/types";
import { nextConferenceYear } from "./nextConferenceYear";

const text = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

/**
 * Pure: what the success screen needs to say about the application that was
 * just accepted — built from the payload we POSTed plus the Strapi response
 * (`{ message: "success", scholarshipApplication? }`).
 */
export const summarizeSubmittedApplication = (
  payload: Partial<IScholarshipApplicationPayload>,
  response?: unknown
): SubmittedApplicationSummary => {
  const applicantName = [
    text(payload.applicant_first_name),
    text(payload.applicant_middle_name),
    text(payload.applicant_last_name),
  ]
    .filter(Boolean)
    .join(" ");

  const year = Number(payload.scholarship_year);
  const scholarshipYear =
    Number.isFinite(year) && year > 0 ? year : nextConferenceYear();

  const record =
    response && typeof response === "object"
      ? (response as { scholarshipApplication?: { documentId?: unknown } })
          .scholarshipApplication
      : undefined;
  const documentId = text(record?.documentId) || null;

  return {
    applicantName,
    applicantEmail: text(payload.applicant_email),
    scholarshipYear,
    documentId,
  };
};
