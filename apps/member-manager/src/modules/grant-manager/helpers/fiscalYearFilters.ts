import type { Identifier } from "react-admin";

/** Same pending statuses GrantSummary uses for createdAt (not committee_date). */
export const PENDING_APPLICATION_STATUSES = [
  "New Application",
  "Awaiting Committee",
] as const;

type DateRange = { $between: [string, string] };

/**
 * Strapi filter matching GrantSummary's client-side FY window:
 * New Application / Awaiting Committee → createdAt; everyone else → committee_date.
 * Returns null when FY is cleared (Reset) so lists stay unscoped.
 */
export function buildApplicationFiscalYearFilter(
  start: string | null | undefined,
  end: string | null | undefined
): { $or: Record<string, unknown>[] } | null {
  if (!start || !end) return null;
  const range: DateRange = { $between: [start, end] };
  const pending = [...PENDING_APPLICATION_STATUSES];
  return {
    $or: [
      {
        status: { name: { $in: pending } },
        createdAt: range,
      },
      {
        status: { name: { $notIn: pending } },
        committee_date: range,
      },
    ],
  };
}

/** Scores join applications — same FY rule nested under grant_application. */
export function buildScoreFiscalYearFilter(
  start: string | null | undefined,
  end: string | null | undefined
): { grant_application: { $or: Record<string, unknown>[] } } | null {
  const fy = buildApplicationFiscalYearFilter(start, end);
  if (!fy) return null;
  return { grant_application: fy };
}

/** Permanent Application list / header-export filter. */
export function buildApplicationListFilter(
  grantFilterId: Identifier,
  applicationStatuses: string[],
  fiscalYearStart: string | null | undefined,
  fiscalYearEnd: string | null | undefined
): Record<string, unknown> {
  const fy = buildApplicationFiscalYearFilter(fiscalYearStart, fiscalYearEnd);
  return {
    grant: grantFilterId,
    ...(applicationStatuses.length > 0 ? { status: applicationStatuses } : {}),
    ...(fy ?? {}),
  };
}
