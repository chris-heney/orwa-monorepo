/** Tabs that store the conference id as `conferences: [id]` */
export const MULTI_CONFERENCE_TABS = new Set([
  "tickets",
  "extras",
  "addons",
]);

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
