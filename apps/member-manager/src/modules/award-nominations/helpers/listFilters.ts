import {
  cycleYearChoices,
  nextAnnualConferenceYear,
} from "../../../helpers/conferenceCycleYear";
import {
  applySubmittedDateRange,
  type SubmittedDateRange,
} from "../../../helpers/submittedDateRange";

export const AWARD_STATUSES = [
  { id: "Draft", name: "Draft" },
  { id: "Submitted", name: "Submitted" },
  { id: "Under Review", name: "Under Review" },
  { id: "Winner", name: "Winner" },
  { id: "Runner Up", name: "Runner Up" },
  { id: "Not Selected", name: "Not Selected" },
];

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

export const buildAwardListFilter = (
  search: string,
  year: number | "all",
  region: string = "all",
  awardType: string = "all",
  submitted?: SubmittedDateRange
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
  return applySubmittedDateRange(filter, NOMINATION_SUBMITTED_FIELD, submitted);
};
