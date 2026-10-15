import {
  cycleYearChoices,
  nextAnnualConferenceYear,
} from "../../../helpers/conferenceCycleYear";
import {
  applySubmittedDateRange,
  type SubmittedDateRange,
} from "../../../helpers/submittedDateRange";

/** Strapi field holding the review status (`award-nomination` schema). */
export const NOMINATION_STATUS_FIELD = "nomination_status";

/**
 * `award-nomination.nomination_status` enum, verbatim from the Strapi
 * schema. The single source for the review form's Status select, the Filters
 * drawer's Status checkboxes and the `NominationStatus` type.
 */
export const NOMINATION_STATUS_VALUES = [
  "Draft",
  "Submitted",
  "Under Review",
  "Winner",
  "Runner Up",
  "Not Selected",
] as const;

export type NominationStatus = (typeof NOMINATION_STATUS_VALUES)[number];

export const isNominationStatus = (value: unknown): value is NominationStatus =>
  (NOMINATION_STATUS_VALUES as readonly unknown[]).includes(value);

/** react-admin choice shape of the enum (review form Status select). */
export const AWARD_STATUSES = NOMINATION_STATUS_VALUES.map((id) => ({
  id,
  name: id,
}));

/** Watersystem.region enum — filter nominations via the linked system. */
export const WATER_SYSTEM_REGIONS = [
  "Region 1",
  "Region 2",
  "Region 3",
  "Region 4",
] as const;

export type WaterSystemRegion = (typeof WATER_SYSTEM_REGIONS)[number];

/**
 * Award cycle year = the next annual conference, by the same May rollover the
 * public form and Strapi stamp into `award_year` (`conferenceCycleYear.ts`).
 */
export const nominationCycleYear = (now: Date = new Date()): number =>
  nextAnnualConferenceYear(now);

/** All years, then the upcoming cycle, current calendar year, and 7 prior years. */
export const calendarYearChoices = (now: Date = new Date()) =>
  cycleYearChoices(now);

/** Strapi `datetime` the public submit stamps (`submissions` controller). */
export const NOMINATION_SUBMITTED_FIELD = "submission_date";

/**
 * @param statuses Filters drawer Status multi-select. Empty = no status
 *   filter; otherwise `nomination_status: { $in: [...] }` (the serializer emits
 *   `filters[nomination_status][$in][]=…`). Values outside the schema enum
 *   (stale prefs) are dropped rather than sent.
 */
export const buildAwardListFilter = (
  search: string,
  year: number | "all",
  region: string = "all",
  awardType: string = "all",
  submitted?: SubmittedDateRange,
  statuses: readonly string[] = []
) => {
  const filter: Record<string, unknown> = {};
  if (search.trim()) filter.q = search.trim();
  if (year !== "all") filter.award_year = year;
  if (region && region !== "all") {
    filter.watersystem = { region };
  }
  if (awardType && awardType !== "all") {
    filter.award_type = awardType;
  }
  const selectedStatuses = statuses.filter(isNominationStatus);
  if (selectedStatuses.length > 0) {
    filter[NOMINATION_STATUS_FIELD] = { $in: selectedStatuses };
  }
  return applySubmittedDateRange(filter, NOMINATION_SUBMITTED_FIELD, submitted);
};
