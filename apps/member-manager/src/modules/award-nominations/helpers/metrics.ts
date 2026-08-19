export type NominationStatus =
  | "Draft"
  | "Submitted"
  | "Under Review"
  | "Winner"
  | "Runner Up"
  | "Not Selected";

export type AwardNomination = {
  id: string | number;
  nomination_status?: NominationStatus | null;
  award_type?: string | null;
  award_year?: number | null;
  system_name?: string | null;
};

export const NOMINATION_META: Record<
  NominationStatus,
  { label: string; caption: string; colorKey: "received" | "review" | "approved" | "paid" | "closed" | "declined" }
> = {
  Draft: {
    label: "Draft",
    caption: "Not yet submitted",
    colorKey: "closed",
  },
  Submitted: {
    label: "Submitted",
    caption: "Ready for review",
    colorKey: "received",
  },
  "Under Review": {
    label: "Under Review",
    caption: "Committee is evaluating",
    colorKey: "review",
  },
  Winner: {
    label: "Winner",
    caption: "Selected for the award",
    colorKey: "approved",
  },
  "Runner Up": {
    label: "Runner Up",
    caption: "Honorable mention",
    colorKey: "paid",
  },
  "Not Selected": {
    label: "Not Selected",
    caption: "Not chosen this year",
    colorKey: "declined",
  },
};

export const buildAwardMetrics = (
  nominations: AwardNomination[],
  year?: number | "all"
) => {
  const filtered = nominations.filter((row) => {
    if (year == null || year === "all") return true;
    return row.award_year === year;
  });

  const byStatus = (Object.keys(NOMINATION_META) as NominationStatus[])
    .map((status) => ({
      status,
      ...NOMINATION_META[status],
      count: filtered.filter((row) => row.nomination_status === status).length,
    }))
    .filter((row) => row.count > 0);

  const byType: Record<string, number> = {};
  const byYear: Record<number, number> = {};
  const bySystem: Record<string, number> = {};

  for (const row of filtered) {
    const type = row.award_type || "Unknown";
    byType[type] = (byType[type] || 0) + 1;
    if (row.award_year) byYear[row.award_year] = (byYear[row.award_year] || 0) + 1;
    const system = row.system_name || "Unknown";
    bySystem[system] = (bySystem[system] || 0) + 1;
  }

  return { total: filtered.length, byStatus, byType, byYear, bySystem };
};
