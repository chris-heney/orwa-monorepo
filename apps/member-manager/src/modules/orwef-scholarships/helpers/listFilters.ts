export const SCHOLARSHIP_STATUSES = [
  { id: "Draft", name: "Draft" },
  { id: "Submitted", name: "Submitted" },
  { id: "Under Review", name: "Under Review" },
  { id: "Approved", name: "Approved" },
  { id: "Denied", name: "Denied" },
];

/** Watersystem.region enum — filter applications via the linked system. */
export const WATER_SYSTEM_REGIONS = [
  "Region 1",
  "Region 2",
  "Region 3",
  "Region 4",
] as const;

export type WaterSystemRegion = (typeof WATER_SYSTEM_REGIONS)[number];

export const calendarYearChoices = () => {
  const current = new Date().getFullYear();
  return ["all" as const, ...Array.from({ length: 8 }, (_, i) => current - i)];
};

export const watersystemRegion = (record: {
  watersystem?: { region?: string | null } | null;
}): string => record.watersystem?.region?.trim() || "";

export const buildScholarshipListFilter = (
  search: string,
  year: number | "all",
  region = "all"
) => {
  const filter: Record<string, unknown> = {};
  if (search.trim()) filter.q = search.trim();
  if (year !== "all") {
    filter.submission_date = {
      $between: [`${year}-01-01`, `${year}-12-31`],
    };
  }
  if (region && region !== "all") {
    filter.watersystem = { region };
  }
  return filter;
};
