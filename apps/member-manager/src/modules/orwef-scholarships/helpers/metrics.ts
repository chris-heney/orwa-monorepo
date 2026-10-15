import { cycleYearOf } from "../../../helpers/conferenceCycleYear";
import type { ScholarshipStatus } from "./listFilters";

export type { ScholarshipStatus };

export type ScholarshipApplication = {
  id: string | number;
  application_status?: ScholarshipStatus | null;
  /** Cycle year stamped on submit; `null` on applications from before the field. */
  scholarship_year?: number | string | null;
  submission_date?: string | null;
  createdAt?: string | null;
  system_name?: string | null;
  relationship?: string | null;
  gpa?: number | null;
};

export type StatusCount = {
  status: ScholarshipStatus;
  label: string;
  caption: string;
  count: number;
  colorKey: "received" | "review" | "approved" | "declined" | "closed";
};

export const STATUS_META: Record<
  ScholarshipStatus,
  Omit<StatusCount, "count">
> = {
  Draft: {
    status: "Draft",
    label: "Draft",
    caption: "Started but not yet submitted",
    colorKey: "closed",
  },
  Submitted: {
    status: "Submitted",
    label: "Submitted",
    caption: "Ready for staff review",
    colorKey: "received",
  },
  "Under Review": {
    status: "Under Review",
    label: "Under Review",
    caption: "Committee is evaluating",
    colorKey: "review",
  },
  Approved: {
    status: "Approved",
    label: "Approved",
    caption: "Awarded a scholarship",
    colorKey: "approved",
  },
  Denied: {
    status: "Denied",
    label: "Denied",
    caption: "Not selected",
    colorKey: "declined",
  },
};

export type ResolvedScholarshipYear = {
  year: number | null;
  /** True when `scholarship_year` was blank and the year came from the submission date. */
  derived: boolean;
};

/**
 * Same rule as the Applications list filter (`scholarshipYearFilter`): the
 * stamped `scholarship_year`, else the conference cycle year of
 * `submission_date` (or `createdAt`) by the May rollover (`cycleYearOf`).
 */
export const resolveScholarshipYear = (
  application: Pick<
    ScholarshipApplication,
    "scholarship_year" | "submission_date" | "createdAt"
  >
): ResolvedScholarshipYear => {
  const stamped = Number(application.scholarship_year);
  if (application.scholarship_year != null && Number.isInteger(stamped)) {
    return { year: stamped, derived: false };
  }
  const raw = application.submission_date || application.createdAt;
  if (!raw) return { year: null, derived: true };
  const year = cycleYearOf(raw);
  return { year: Number.isFinite(year) ? year : null, derived: true };
};

export const yearOf = (application: ScholarshipApplication) =>
  resolveScholarshipYear(application).year;

export const buildScholarshipMetrics = (
  applications: ScholarshipApplication[],
  year?: number | "all"
) => {
  const filtered = applications.filter((application) => {
    if (year == null || year === "all") return true;
    return yearOf(application) === year;
  });

  const byStatus = (Object.keys(STATUS_META) as ScholarshipStatus[]).map(
    (status) => ({
      ...STATUS_META[status],
      count: filtered.filter((row) => row.application_status === status)
        .length,
    })
  );

  const byRelationship: Record<string, number> = {};
  const bySystem: Record<string, number> = {};
  const byYear: Record<number, number> = {};

  for (const row of filtered) {
    const relationship = row.relationship || "Unknown";
    byRelationship[relationship] = (byRelationship[relationship] || 0) + 1;
    const system = row.system_name || "Unknown";
    bySystem[system] = (bySystem[system] || 0) + 1;
    const yearValue = yearOf(row);
    if (yearValue) byYear[yearValue] = (byYear[yearValue] || 0) + 1;
  }

  return {
    total: filtered.length,
    byStatus: byStatus.filter((item) => item.count > 0),
    byRelationship,
    bySystem,
    byYear,
  };
};
