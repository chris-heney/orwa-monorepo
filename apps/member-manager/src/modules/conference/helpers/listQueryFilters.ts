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
