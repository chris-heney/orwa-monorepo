import {
  ensureConferenceInFilters,
  MULTI_CONFERENCE_TABS,
} from "./mergeConferenceAcrossTabFilters";

/**
 * Strapi list queries for these resources must not include `year` (no such field;
 * backend returns 400 "Invalid parameter year"). Tab store may still keep `year`
 * for UX when switching tabs — strip only for what the list sends to the API.
 */
export const RESOURCES_OMIT_YEAR_FROM_LIST_QUERY = new Set<string>([
  "conference-tickets",
  "conference-extras",
  "registration-addons",
  "conference-sponsorships",
]);

/** Resources whose Strapi relation field is plural `conferences` (many-to-many). */
export const RESOURCES_MULTI_CONFERENCE_RELATION = new Set<string>([
  "conference-tickets",
  "conference-extras",
  "registration-addons",
]);

export function omitYearForListQuery(
  resource: string,
  filters: Record<string, any> | undefined | null
): Record<string, any> {
  if (!filters) {
    return {};
  }
  if (!RESOURCES_OMIT_YEAR_FROM_LIST_QUERY.has(resource)) {
    return { ...filters };
  }
  const { year: _y, ...rest } = filters;
  return rest;
}

export function shouldOmitYearFromListQuery(resource: string): boolean {
  return RESOURCES_OMIT_YEAR_FROM_LIST_QUERY.has(resource);
}

export type ContestantStatusFilter = "active" | "cancelled" | "all";

/**
 * Active contestants plus legacy rows written before `status` existed.
 * Shared so the list default and the Active/Cancelled/All control emit the
 * identical clause — a second, differently shaped status constraint would be
 * ANDed with this one and silently match nothing.
 */
export const CONTESTANT_ACTIVE_OR_NULL_CLAUSE = [
  { status: { $eq: "active" } },
  { status: { $null: true } },
];

const isContestantStatusClause = (clause: any): boolean =>
  clause != null &&
  typeof clause === "object" &&
  Object.keys(clause).length === 1 &&
  "status" in clause;

/**
 * Drop every status constraint this module may have applied, leaving unrelated
 * `$or` branches (conference, year, search) untouched.
 */
function withoutContestantStatusFilter(
  filters: Record<string, any> | undefined | null
): Record<string, any> {
  const { status: _status, $or, ...rest } = filters ?? {};

  if (Array.isArray($or)) {
    const unrelated = $or.filter((clause) => !isContestantStatusClause(clause));
    if (unrelated.length > 0) {
      return { ...rest, $or: unrelated };
    }
  }

  return rest;
}

/** Which view the current list filters represent. */
export function contestantStatusFromFilters(
  filters: Record<string, any> | undefined | null
): ContestantStatusFilter {
  if (!filters) {
    return "all";
  }
  if (filters.status === "cancelled") {
    return "cancelled";
  }
  if (filters.status === "active") {
    return "active";
  }
  if (
    Array.isArray(filters.$or) &&
    filters.$or.some((clause: any) => isContestantStatusClause(clause))
  ) {
    return "active";
  }
  return "all";
}

/**
 * Replace (never stack) the contestant status constraint on live list filters.
 */
export function applyContestantStatusFilter(
  filters: Record<string, any> | undefined | null,
  status: ContestantStatusFilter
): Record<string, any> {
  const base = withoutContestantStatusFilter(filters);

  if (status === "all") {
    return base;
  }
  if (status === "cancelled") {
    return { ...base, status: "cancelled" };
  }
  return { ...base, $or: [...CONTESTANT_ACTIVE_OR_NULL_CLAUSE] };
}

/**
 * Normalize conference filter shape for a Strapi list query.
 * Singular-relation resources reject `filters[conferences]` (400 Invalid key).
 * Multi-relation resources expect `conferences: [id]`.
 */
export function normalizeFiltersForListQuery(
  resource: string,
  filters: Record<string, any> | undefined | null,
  tab?: string
): Record<string, any> {
  const useMulti =
    RESOURCES_MULTI_CONFERENCE_RELATION.has(resource) ||
    (tab != null && MULTI_CONFERENCE_TABS.has(tab));

  const shaped = ensureConferenceInFilters(
    filters,
    useMulti ? tab ?? "tickets" : tab ?? "sponsorships"
  );

  const normalized = omitYearForListQuery(resource, shaped);

  if (
    resource === "conference-contestants" &&
    normalized.status == null
  ) {
    return {
      ...normalized,
      $or: [...CONTESTANT_ACTIVE_OR_NULL_CLAUSE],
    };
  }

  if (
    resource === "conference-contestants" &&
    normalized.status === "all"
  ) {
    const { status: _status, ...rest } = normalized;
    return rest;
  }

  return normalized;
}
