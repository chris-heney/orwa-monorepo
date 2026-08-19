export const AWARD_STATUSES = [
  { id: "Draft", name: "Draft" },
  { id: "Submitted", name: "Submitted" },
  { id: "Under Review", name: "Under Review" },
  { id: "Winner", name: "Winner" },
  { id: "Runner Up", name: "Runner Up" },
  { id: "Not Selected", name: "Not Selected" },
];

export const calendarYearChoices = () => {
  const current = new Date().getFullYear();
  return ["all" as const, ...Array.from({ length: 8 }, (_, i) => current - i)];
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
