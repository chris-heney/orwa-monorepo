export const SCHOLARSHIP_STATUSES = [
  { id: "Draft", name: "Draft" },
  { id: "Submitted", name: "Submitted" },
  { id: "Under Review", name: "Under Review" },
  { id: "Approved", name: "Approved" },
  { id: "Denied", name: "Denied" },
];

export const calendarYearChoices = () => {
  const current = new Date().getFullYear();
  return ["all" as const, ...Array.from({ length: 8 }, (_, i) => current - i)];
};

export const buildScholarshipListFilter = (
  search: string,
  status: string,
  year: number | "all"
) => {
  const filter: Record<string, unknown> = {};
  if (search.trim()) filter.q = search.trim();
  if (status && status !== "all") filter.application_status = status;
  if (year !== "all") {
    filter.submission_date = {
      $between: [`${year}-01-01`, `${year}-12-31`],
    };
  }
  return filter;
};
