import {
  DEFAULT_CONFERENCE_ID,
  getFilterYear,
  getPrimaryConferenceId,
} from "./mergeConferenceAcrossTabFilters";
import {
  CONTESTANT_RESOURCE,
  CONTESTANT_STATUS_VIEW_STORE_KEY,
  DEFAULT_CONTESTANT_STATUS_FILTER,
  normalizeFiltersForListQuery,
  shouldOmitYearFromListQuery,
} from "./listQueryFilters";
import type { ContestantStatusFilter } from "./listQueryFilters";

/**
 * The Conference Manager's one piece of module-level state: which conference
 * and which year every tab is looking at. Lives in RaStore (→ Strapi user
 * preferences) so `TabManifest.visible(ctx)` / the bar title read it through
 * `ctx.store()`, and every tab's list filter is kept in step with it by
 * `ConferenceListSync`.
 */
export const CONFERENCE_SELECTION_STORE_KEY = "conference.selection";

/**
 * Pre-framework per-tab filter bag (`{ attendees: { conference, year }, … }`).
 * Read once as a fallback so an operator's last selection survives the
 * migration; never written again.
 */
export const LEGACY_TAB_FILTERS_STORE_KEY = "conferenceTabFilters";

export interface ConferenceSelection {
  conference: number;
  year: number;
}

/** Tabs whose list filter never carries `year` (the Edit tab edits one conference). */
export const YEARLESS_TABS = new Set<string>(["edit"]);

export const currentYear = () => new Date().getFullYear();

export const defaultConferenceSelection = (): ConferenceSelection => ({
  conference: DEFAULT_CONFERENCE_ID,
  year: currentYear(),
});

/** Turn whatever is stored / persisted into a complete selection. */
export function coerceSelection(
  raw: unknown,
  fallback: ConferenceSelection = defaultConferenceSelection()
): ConferenceSelection {
  const source =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    conference: getPrimaryConferenceId(source) ?? fallback.conference,
    year: getFilterYear(source) ?? fallback.year,
  };
}

/** First conference / year found in the legacy per-tab bag, if any. */
export function selectionFromLegacyTabFilters(
  bag: unknown
): Partial<ConferenceSelection> | undefined {
  if (!bag || typeof bag !== "object") return undefined;
  let conference: number | undefined;
  let year: number | undefined;
  for (const entry of Object.values(bag as Record<string, unknown>)) {
    const filters = entry as Record<string, unknown> | null | undefined;
    if (conference === undefined) conference = getPrimaryConferenceId(filters);
    if (year === undefined) year = getFilterYear(filters);
    if (conference !== undefined && year !== undefined) break;
  }
  if (conference === undefined && year === undefined) return undefined;
  return { conference, year };
}

export type StoreReader = <T>(key: string, fallback: T) => T;

/** Selection for `ctx.store` / `store.getItem` readers (with legacy fallback). */
export function readConferenceSelection(read: StoreReader): ConferenceSelection {
  const stored = read<unknown>(CONFERENCE_SELECTION_STORE_KEY, undefined);
  if (stored) return coerceSelection(stored);
  const legacy = selectionFromLegacyTabFilters(
    read<unknown>(LEGACY_TAB_FILTERS_STORE_KEY, undefined)
  );
  return coerceSelection(legacy ?? {});
}

export const sameSelection = (a: ConferenceSelection, b: ConferenceSelection) =>
  a.conference === b.conference && a.year === b.year;

/** Structural equality for filter objects (nested `$or` arrays included). */
export function filtersEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== "object" || typeof b !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    return (
      a.length === b.length && a.every((v, i) => filtersEqual(v, b[i]))
    );
  }
  const ka = Object.keys(a as object);
  const kb = Object.keys(b as object);
  if (ka.length !== kb.length) return false;
  return ka.every(
    (k) =>
      k in (b as object) &&
      filtersEqual(
        (a as Record<string, unknown>)[k],
        (b as Record<string, unknown>)[k]
      )
  );
}

/**
 * Merge the selection into a tab's list filter values, keeping every other
 * key (search, ticket type, …) and normalising for the resource: singular
 * `conference` vs plural `conferences: [id]`, `year` dropped where Strapi
 * rejects it, and the contestant `status` sentinel seeded from the persisted
 * Active/Cancelled/All view when the list carries none yet.
 */
export function applySelectionToFilters(
  filters: Record<string, any> | null | undefined,
  selection: ConferenceSelection,
  tabKey: string,
  resource: string,
  contestantStatus?: ContestantStatusFilter
): Record<string, any> {
  const merged: Record<string, any> = {
    ...(filters ?? {}),
    conference: selection.conference,
    year: selection.year,
  };
  delete merged.conferences;
  if (
    resource === CONTESTANT_RESOURCE &&
    merged.status == null &&
    contestantStatus
  ) {
    merged.status = contestantStatus;
  }
  const next = normalizeFiltersForListQuery(resource, merged, tabKey);
  if (YEARLESS_TABS.has(tabKey)) delete next.year;
  return next;
}

/**
 * The selection a tab's live filter values represent. Year-less tabs /
 * resources cannot change the year, so it is carried over unchanged.
 */
export function selectionFromFilters(
  filters: Record<string, any> | null | undefined,
  current: ConferenceSelection,
  tabKey: string,
  resource: string
): ConferenceSelection {
  const conference = getPrimaryConferenceId(filters) ?? current.conference;
  const yearless = YEARLESS_TABS.has(tabKey) || shouldOmitYearFromListQuery(resource);
  const year = yearless ? current.year : getFilterYear(filters) ?? current.year;
  return { conference, year };
}

/**
 * The tab's PERMANENT list filter (`ListManifest.filter`): the selected
 * conference / year (+ contestant view) read from RaStore, shaped for the
 * resource. Merged over the user's filter values by react-admin, so the very
 * first query of a freshly mounted tab is already scoped — RA 4.16 with
 * `disableSyncWithLocation` starts every list from empty local params, and
 * the legacy dashboard relied on `filterDefaultValues` for the same reason.
 */
export function conferenceScopeFilter(
  read: StoreReader,
  tabKey: string,
  resource: string
): Record<string, unknown> {
  const selection = readConferenceSelection(read);
  const contestantStatus =
    resource === CONTESTANT_RESOURCE
      ? read<ContestantStatusFilter>(
          CONTESTANT_STATUS_VIEW_STORE_KEY,
          DEFAULT_CONTESTANT_STATUS_FILTER
        )
      : undefined;
  return applySelectionToFilters({}, selection, tabKey, resource, contestantStatus);
}
