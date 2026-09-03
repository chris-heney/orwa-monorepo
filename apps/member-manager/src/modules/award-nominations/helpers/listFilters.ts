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

/** Award cycle year = next annual conference (calendar year + 1). */
export const nominationCycleYear = (now: Date = new Date()): number =>
  now.getFullYear() + 1;

/** All years, then cycle (current+1), current calendar year, and 7 prior years. */
export const calendarYearChoices = (now: Date = new Date()) => {
  const current = now.getFullYear();
  const cycle = nominationCycleYear(now);
  const lookback = Array.from({ length: 8 }, (_, i) => current - i);
  const years = [cycle, ...lookback.filter((year) => year !== cycle)];
  return ["all" as const, ...years];
};

export const buildAwardListFilter = (
  search: string,
  year: number | "all",
  region: string = "all",
  awardType: string = "all"
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
  return filter;
};
