/** Tabs that store the conference id as `conferences: [id]` */
export const MULTI_CONFERENCE_TABS = new Set([
  "tickets",
  "extras",
  "addons",
]);

/** Default conference for filters and fallbacks (Annual). */
export const DEFAULT_CONFERENCE_ID = 1;

/**
 * Numeric DB id for conference filter values.
 * Data provider sets `id` to Strapi documentId; `entityId` keeps the numeric PK.
 */
export function getConferenceFilterId(conference: {
  id?: unknown;
  entityId?: unknown;
} | null | undefined): number | undefined {
  if (!conference) return undefined;
  const entity = conference.entityId;
  if (typeof entity === "number" && !Number.isNaN(entity)) return entity;
  if (typeof entity === "string" && /^\d+$/.test(entity)) {
    return parseInt(entity, 10);
  }
  const id = conference.id;
  if (typeof id === "number" && !Number.isNaN(id)) return id;
  if (typeof id === "string" && /^\d+$/.test(id)) return parseInt(id, 10);
  return undefined;
}

export function getPrimaryConferenceId(
  filters: Record<string, unknown> | null | undefined
): number | undefined {
  if (!filters) {
    return undefined;
  }
  const c = filters.conference;
  if (c != null && c !== "") {
    const n = Number(c);
    return Number.isNaN(n) ? undefined : n;
  }
  const list = filters.conferences;
  if (Array.isArray(list) && list.length > 0) {
    const n = Number(list[0]);
    return Number.isNaN(n) ? undefined : n;
  }
  return undefined;
}

/**
 * Conference is a radio: always keep exactly one selected.
 * Restores the default when missing/cleared. Preserves tab shape
 * (`conference` vs `conferences: [id]`).
 */
export function ensureConferenceInFilters(
  filters: Record<string, any> | null | undefined,
  tab?: string,
  defaultId: number = DEFAULT_CONFERENCE_ID
): Record<string, any> {
  const base = filters || {};
  if (getPrimaryConferenceId(base) != null) {
    return base;
  }
  const next = { ...base };
  const useMulti = tab != null && MULTI_CONFERENCE_TABS.has(tab);
  if (useMulti) {
    delete next.conference;
    next.conferences = [defaultId];
  } else {
    delete next.conferences;
    next.conference = defaultId;
  }
  return next;
}

export function getFilterYear(
  filters: Record<string, unknown> | null | undefined
): number | undefined {
  if (!filters) {
    return undefined;
  }
  const y = filters.year;
  if (y == null || y === "") {
    return undefined;
  }
  const n = Number(y);
  return Number.isNaN(n) ? undefined : n;
}

/**
 * When one tab’s filters are saved, keep the same conference and year on all
 * other tabs (each tab may use `conference` or `conferences` shape).
 */
export function mergeConferenceYearIntoAllTabs(
  prev: Record<string, any>,
  selectedTab: string,
  tabEntry: Record<string, any>
): Record<string, any> {
  const next: Record<string, any> = { ...prev, [selectedTab]: tabEntry };
  const primaryId = getPrimaryConferenceId(tabEntry);
  const yearVal = getFilterYear(tabEntry);

  if (primaryId === undefined && yearVal === undefined) {
    return next;
  }

  for (const tab of Object.keys(next)) {
    if (tab === selectedTab) {
      continue;
    }
    const cur = { ...(next[tab] || {}) };
    if (primaryId !== undefined) {
      if (MULTI_CONFERENCE_TABS.has(tab)) {
        cur.conferences = [primaryId];
        delete cur.conference;
      } else {
        cur.conference = primaryId;
        delete cur.conferences;
      }
    }
    if (yearVal !== undefined) {
      cur.year = yearVal;
    }
    next[tab] = cur;
  }
  return next;
}
