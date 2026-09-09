export const conferenceCycleYear = (
  conference: Record<string, unknown> | null | undefined,
  fallbackYear = new Date().getFullYear()
): number => {
  const date =
    conference?.start_date ??
    conference?.end_date ??
    conference?.registration_start ??
    conference?.registration_end;

  if (typeof date !== "string" || !date) return fallbackYear;
  const year = new Date(`${date}T00:00:00Z`).getUTCFullYear();
  return Number.isFinite(year) ? year : fallbackYear;
};
