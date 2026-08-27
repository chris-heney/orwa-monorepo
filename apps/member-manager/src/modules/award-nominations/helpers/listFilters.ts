export const AWARD_STATUSES = [
  { id: "Draft", name: "Draft" },
  { id: "Submitted", name: "Submitted" },
  { id: "Under Review", name: "Under Review" },
  { id: "Winner", name: "Winner" },
  { id: "Runner Up", name: "Runner Up" },
  { id: "Not Selected", name: "Not Selected" },
];

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
  status: string,
  year: number | "all"
) => {
  const filter: Record<string, unknown> = {};
  if (search.trim()) filter.q = search.trim();
  if (status && status !== "all") filter.nomination_status = status;
  if (year !== "all") filter.award_year = year;
  return filter;
};
