import { yearOf, type ScholarshipApplication } from "./metrics";

const sanitize = (value: string) =>
  value
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);

export const scholarshipPacketFilename = (
  record?: Pick<
    ScholarshipApplication,
    "submission_date" | "createdAt"
  > & {
    applicant_last_name?: string | null;
  } | null
): string => {
  const last =
    sanitize(String(record?.applicant_last_name || "").trim()) || "Applicant";
  const year =
    (record ? yearOf(record as ScholarshipApplication) : null) ||
    new Date().getFullYear();
  return `ORWEF-Scholarship-${last}-${year}.pdf`;
};
