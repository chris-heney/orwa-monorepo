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

  return omitYearForListQuery(resource, shaped);
}
