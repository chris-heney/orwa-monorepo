import { cycleYearOf } from "../../_components/review-packet/formatters";
import { formatScholarshipYear } from "../../../helpers/conferenceCycleYear";
import type { ScholarshipPacketRecord } from "./printScholarshipPacket";

type YearSource = Pick<
  ScholarshipPacketRecord,
  "submission_date" | "createdAt" | "scholarship_year"
>;

/**
 * Year printed on the packet: the `scholarship_year` Strapi stamps on submit
 * (cycle rule — year of the next Annual Conference), else, for legacy rows
 * where it is NULL, the same cycle rule applied to `submission_date` /
 * `createdAt` (`cycleYearOf`). Never the clock unless the record has no date.
 */
export const scholarshipPacketYear = (record?: YearSource | null): string => {
  const stamped = Number(record?.scholarship_year);
  if (record?.scholarship_year != null && Number.isInteger(stamped) && stamped > 0) {
    return String(stamped);
  }
  const derived = cycleYearOf(record?.submission_date ?? record?.createdAt ?? new Date());
  return String(Number.isNaN(derived) ? cycleYearOf(new Date()) : derived);
};

const sanitize = (value: string) =>
  value
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);

/** `ORWEF-Scholarship-{last}-{start}-{end}.pdf` — same split year as the packet cover. */
export const scholarshipPacketFilename = (
  record?: (YearSource & { applicant_last_name?: string | null }) | null
): string => {
  const last =
    sanitize(String(record?.applicant_last_name || "").trim()) || "Applicant";
  return `ORWEF-Scholarship-${last}-${formatScholarshipYear(scholarshipPacketYear(record))}.pdf`;
};
