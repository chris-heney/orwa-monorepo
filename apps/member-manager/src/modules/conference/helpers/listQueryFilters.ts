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

export const CONTESTANT_RESOURCE = "conference-contestants";

export type ContestantStatusFilter = "active" | "cancelled" | "all";

/** Store key for the Active/Cancelled/All view, so it outlives list remounts. */
export const CONTESTANT_STATUS_VIEW_STORE_KEY = "conference.contestantStatusView";

export const DEFAULT_CONTESTANT_STATUS_FILTER: ContestantStatusFilter = "active";

/**
 * Active contestants plus legacy rows written before `status` existed.
 * Only ever emitted at the API boundary — inside the list store the view is a
 * plain `status` sentinel, so a re-normalized copy can never be mistaken for a
 * different view.
 */
export const CONTESTANT_ACTIVE_OR_NULL_CLAUSE = [
  { status: { $eq: "active" } },
  { status: { $null: true } },
];

const isContestantStatusFilter = (
  value: unknown
): value is ContestantStatusFilter =>
  value === "active" || value === "cancelled" || value === "all";

const isContestantStatusClause = (clause: any): boolean =>
  clause != null &&
  typeof clause === "object" &&
  Object.keys(clause).length === 1 &&
  "status" in clause;

/**
 * Drop every status constraint this module may have applied, leaving unrelated
 * `$or` branches (conference, year, search) untouched. Legacy `$or` status
 * clauses are recognized too, so filters persisted by an earlier build do not
 * survive as a second, contradictory constraint.
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
  if (isContestantStatusFilter(filters?.status)) {
    return filters!.status;
  }

  return DEFAULT_CONTESTANT_STATUS_FILTER;
}

/**
 * Replace (never stack) the contestant status constraint on live list filters.
 * Every view — including All — is written as an explicit sentinel so that the
 * choice is distinguishable from a freshly seeded list.
 */
export function applyContestantStatusFilter(
  filters: Record<string, any> | undefined | null,
  status: ContestantStatusFilter
): Record<string, any> {
  return { ...withoutContestantStatusFilter(filters), status };
}

/**
 * Carry the contestant view onto filters rebuilt from somewhere that does not
 * track it (tab filters are shared across tabs and hold no contestant status).
 */
export function preserveContestantStatusFilter(
  resource: string,
  from: Record<string, any> | undefined | null,
  to: Record<string, any> | undefined | null
): Record<string, any> {
  if (resource !== CONTESTANT_RESOURCE) {
    return { ...to };
  }

  return applyContestantStatusFilter(to, contestantStatusFromFilters(from));
}

/**
 * Combine an existing top-level `$or` with the status `$or`. Strapi allows one
 * `$or` per level, so the two groups have to be ANDed instead of one replacing
 * the other — replacing would drop whatever the operator searched for.
 */
function withStatusOrClause(
  base: Record<string, any>,
  clause: Record<string, any>[]
): Record<string, any> {
  const { $or, $and, ...rest } = base;

  if (!Array.isArray($or) || $or.length === 0) {
    return { ...rest, ...($and ? { $and } : {}), $or: [...clause] };
  }

  return {
    ...rest,
    $and: [...(Array.isArray($and) ? $and : []), { $or }, { $or: [...clause] }],
  };
}

/**
 * Turn the stored view sentinel into something Strapi understands. Called only
 * on the way out to the API: `status: "all"` is a UI concept and would match no
 * rows, and `status: "active"` alone would hide legacy rows with a null status.
 *
 * Only an explicit sentinel is expanded. Callers that pass no status — the
 * metrics dashboard, which fetches every contestant and splits active from
 * cancelled itself — must keep getting every row.
 */
export function expandContestantStatusForApi(
  resource: string,
  filters: Record<string, any> | undefined | null
): Record<string, any> {
  if (resource !== CONTESTANT_RESOURCE || !isContestantStatusFilter(filters?.status)) {
    return { ...filters };
  }

  const status = filters!.status as ContestantStatusFilter;
  const base = withoutContestantStatusFilter(filters);

  if (status === "all") {
    return base;
  }
  if (status === "cancelled") {
    return { ...base, status: "cancelled" };
  }

  return withStatusOrClause(base, CONTESTANT_ACTIVE_OR_NULL_CLAUSE);
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

  // Contestant lists always carry an explicit view sentinel, defaulting to
  // active. Keeping it here is what lets the choice survive being written back
  // into the store and re-normalized on the next pass.
  if (resource === CONTESTANT_RESOURCE) {
    return applyContestantStatusFilter(
      normalized,
      contestantStatusFromFilters(normalized)
    );
  }

  return normalized;
}
