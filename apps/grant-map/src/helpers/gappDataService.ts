import IGrantApplication from "../types/IGrantApplication";
import { Filter } from "../types/Filter";
import { useGetGrantApplications } from "./APIService";

/**
 * Shared grant-application data service.
 *
 * GIS-at-scale pattern: download the full (field-pruned) dataset ONCE per
 * session and derive every view of it — the filtered map set, sidebar totals,
 * water/wastewater badge counts — in memory. Previously each consumer issued
 * its own `pagination[limit]=10000` request (5 concurrent multi-MB fetches on
 * every load, plus a refetch on every filter change), which serialized in the
 * database and dominated time-to-map.
 */
let allApplicationsPromise: Promise<IGrantApplication[]> | null = null;

export const fetchAllGrantApplications = (): Promise<IGrantApplication[]> => {
  if (!allApplicationsPromise) {
    const getGrantApplications = useGetGrantApplications();
    allApplicationsPromise = getGrantApplications([])
      .then((data) => {
        // An empty result usually means "not logged in yet" — don't cache it,
        // so the fetch retries after authentication.
        if (!data.length) allApplicationsPromise = null;
        return data;
      })
      .catch((error) => {
        allApplicationsPromise = null;
        throw error;
      });
  }
  return allApplicationsPromise;
};

export const invalidateGrantApplications = (): void => {
  allApplicationsPromise = null;
};

/**
 * Client-side equivalent of the Strapi REST filters grant-map sends
 * (`filters[<key>]=<value>` repeated per value):
 * - `status`: relation matched by numeric id
 * - `approved_projects`: relation matched by any related id
 * - everything else (`county`, `drinking_or_wastewater`, ...): scalar equality
 *   against any of the values ($in semantics).
 */
export const matchesFilters = (
  app: IGrantApplication,
  filters: Filter[]
): boolean => {
  for (const filter of filters) {
    const values = (
      Array.isArray(filter.value) ? filter.value : [filter.value]
    ).map(String);
    if (!values.length) continue;

    if (filter.key === "status") {
      if (!app.status || !values.includes(String(app.status.id))) return false;
    } else if (filter.key === "approved_projects") {
      const ids = (app.approved_projects ?? []).map((p) => String(p.id));
      if (!values.some((v) => ids.includes(v))) return false;
    } else {
      const raw = (app as unknown as Record<string, unknown>)[filter.key];
      const scalar = typeof raw === "string" ? raw.trim() : raw;
      if (!values.includes(String(scalar ?? ""))) return false;
    }
  }
  return true;
};

export const filterApplications = (
  applications: IGrantApplication[],
  filters: Filter[]
): IGrantApplication[] =>
  filters.length
    ? applications.filter((app) => matchesFilters(app, filters))
    : applications;

/** Count matching applications without any extra network round-trip. */
export const countApplications = async (
  filters: Filter[]
): Promise<number> => {
  const applications = await fetchAllGrantApplications();
  return filterApplications(applications, filters).length;
};
