import type { TabValue } from "../types/IGrantContextProvider";

export type SearchableTab =
  | "applications"
  | "payouts"
  | "Admin Payouts"
  | "application scores";

export const SEARCHABLE_TABS: SearchableTab[] = [
  "applications",
  "payouts",
  "Admin Payouts",
  "application scores",
];

export function isSearchableTab(tab: string): tab is SearchableTab {
  return (SEARCHABLE_TABS as string[]).includes(tab);
}

export function toSearchableTab(tab: TabValue): SearchableTab | null {
  return isSearchableTab(tab) ? tab : null;
}

export function hasPersistedSearch(value: string | null | undefined): boolean {
  return Boolean(value && value.trim().length > 0);
}

export function buildApplicationOrFilter(value: string) {
  const v = value.trim();
  if (!v) return null;
  return {
    $or: [
      { application: { legal_entity_name: { $containsi: v } } },
      { application: { application_id: { $containsi: v } } },
    ],
  };
}

export function buildScoresOrFilter(value: string) {
  const v = value.trim();
  if (!v) return null;
  return {
    $or: [
      { grant_application: { legal_entity_name: { $containsi: v } } },
      { grant_application: { application_id: { $containsi: v } } },
    ],
  };
}

function findContainsi(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  if (Array.isArray(node)) {
    for (const item of node) {
      const found = findContainsi(item);
      if (found) return found;
    }
    return "";
  }
  const obj = node as Record<string, unknown>;
  if (typeof obj.$containsi === "string") return obj.$containsi;
  for (const val of Object.values(obj)) {
    const found = findContainsi(val);
    if (found) return found;
  }
  return "";
}

export function extractOrSearchText(
  filterValues: Record<string, unknown>
): string {
  return findContainsi(filterValues.$or) || "";
}

/** Legacy FilterLiveSearch source keys used before the $or merge. */
export const LEGACY_PAYOUT_SEARCH_KEYS = [
  "application][legal_entity_name][$contains",
  "application][application_id][$contains",
] as const;

export const LEGACY_SCORE_SEARCH_KEYS = [
  "grant_application][legal_entity_name][$contains",
  "grant_application][application_id][$contains",
] as const;

export function stripSearchKeys(
  filterValues: Record<string, unknown>,
  keys: readonly string[]
): Record<string, unknown> {
  const next = { ...filterValues };
  delete next.$or;
  delete next.q;
  for (const key of keys) {
    delete next[key];
  }
  return next;
}
