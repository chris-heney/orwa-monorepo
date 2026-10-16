import {
  cycleYearChoices,
  cycleYearWindow,
  formatScholarshipYear,
  nextAnnualConferenceYear,
} from "../../../helpers/conferenceCycleYear";
import {
  applySubmittedDateRange,
  localDayEndIso,
  localDayStartIso,
  type SubmittedDateRange,
} from "../../../helpers/submittedDateRange";

/** Strapi field holding the review status (`scholarship-application` schema). */
export const APPLICATION_STATUS_FIELD = "application_status";

/**
 * `scholarship-application.application_status` enum, verbatim from the
 * Strapi schema. The single source for the review form's Status select, the
 * Filters drawer's Status checkboxes and the `ScholarshipStatus` type.
 */
export const SCHOLARSHIP_STATUS_VALUES = [
  "Draft",
  "Submitted",
  "Under Review",
  "Approved",
  "Denied",
] as const;

export type ScholarshipStatus = (typeof SCHOLARSHIP_STATUS_VALUES)[number];

export const isScholarshipStatus = (value: unknown): value is ScholarshipStatus =>
  (SCHOLARSHIP_STATUS_VALUES as readonly unknown[]).includes(value);

/** react-admin choice shape of the enum (review form Status select). */
export const SCHOLARSHIP_STATUSES = SCHOLARSHIP_STATUS_VALUES.map((id) => ({
  id,
  name: id,
}));

/** Watersystem.region enum — filter applications via the linked system. */
export const WATER_SYSTEM_REGIONS = [
  "Region 1",
  "Region 2",
  "Region 3",
  "Region 4",
] as const;

export type WaterSystemRegion = (typeof WATER_SYSTEM_REGIONS)[number];

/**
 * Scholarship cycle year = the next annual conference, by the same May
 * rollover the public form and Strapi stamp into `scholarship_year`
 * (`conferenceCycleYear.ts`), so applications for the upcoming cycle are
 * filed and filtered under that year from the day they arrive.
 */
export const scholarshipCycleYear = (now: Date = new Date()): number =>
  nextAnnualConferenceYear(now);

/** All years, then the upcoming cycle, current calendar year, and 7 prior years (integer values). */
export const calendarYearChoices = (now: Date = new Date()) =>
  cycleYearChoices(now);

/**
 * Option / caption label for a `calendarYearChoices` value: ORWEF shows the
 * split academic year ("2027-2028"); the stored / filtered value stays the
 * integer start year. (Awards keep plain years — do not reuse this there.)
 */
export const scholarshipYearLabel = (value: number | "all"): string =>
  value === "all" ? "All years" : formatScholarshipYear(value);

export const watersystemRegion = (record: {
  watersystem?: { region?: string | null } | null;
}): string => record.watersystem?.region?.trim() || "";

/** Strapi `datetime` the public submit stamps (`submissions` controller). */
export const APPLICATION_SUBMITTED_FIELD = "submission_date";

/**
 * Integer cycle year the public form / Strapi stamp on submit. Applications
 * from before the field existed have `null` here and are filed by the cycle
 * year of `submission_date` instead (`scholarshipYearFilter`, same May
 * rollover as `cycleYearOf`).
 */
export const APPLICATION_YEAR_FIELD = "scholarship_year";

/**
 * Year window for the Applications list: `scholarship_year` when stamped,
 * otherwise legacy rows whose `submission_date` falls in that cycle's
 * collection window — May 1 of the prior year 00:00 local through Apr 30 of
 * `year` 23:59:59.999 local (`cycleYearWindow`). Bounds are full local-day
 * instants, so a bare `YYYY-04-30` upper bound cannot compare as midnight and
 * drop that day's submissions.
 */
export const scholarshipYearFilter = (year: number) => {
  const window = cycleYearWindow(year);
  return {
    $or: [
      { [APPLICATION_YEAR_FIELD]: year },
      {
        [APPLICATION_YEAR_FIELD]: { $null: true },
        [APPLICATION_SUBMITTED_FIELD]: {
          $between: [
            localDayStartIso(window.start),
            localDayEndIso(window.end),
          ],
        },
      },
    ],
  };
};

/**
 * @param statuses Filters drawer Status multi-select. Empty = no status
 *   filter; otherwise `application_status: { $in: [...] }` (the serializer
 *   emits `filters[application_status][$in][]=…`). Values outside the schema
 *   enum (stale prefs) are dropped rather than sent.
 */
export const buildScholarshipListFilter = (
  search: string,
  year: number | "all",
  region = "all",
  submitted?: SubmittedDateRange,
  statuses: readonly string[] = []
) => {
  const filter: Record<string, unknown> = {};
  if (search.trim()) filter.q = search.trim();
  if (year !== "all") Object.assign(filter, scholarshipYearFilter(year));
  if (region && region !== "all") {
    filter.watersystem = { region };
  }
  const selectedStatuses = statuses.filter(isScholarshipStatus);
  if (selectedStatuses.length > 0) {
    filter[APPLICATION_STATUS_FIELD] = { $in: selectedStatuses };
  }
  return applySubmittedDateRange(filter, APPLICATION_SUBMITTED_FIELD, submitted);
};
