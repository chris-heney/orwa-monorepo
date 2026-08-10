# Grant Dashboard Search Accordion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a per-tab header search toggle that accordion-collapses each grant list’s search bar (clear on close; open if persisted search), merge dual payout/scores searches into one `$or` field, and move “+ Payout” into the dark header.

**Architecture:** Mirror `isFilterSidebarOpen` with a per-tab `searchBarOpen` map in grant context. Header owns the magnifying-glass + CreateButton; each list wraps `actions` in MUI `Collapse`. Fuzzy multi-field search uses Strapi `$or` + `$containsi` via a small helper + input wrapper.

**Tech Stack:** React, MUI (`Collapse`, `IconButton`), react-admin (`FilterLiveSearch`, `CreateButton`, `useListFilterContext`, `useStore`), TypeScript, Vitest for pure helpers.

## Global Constraints

- Default collapsed unless that tab has a persisted/active search value.
- Collapsing clears that tab’s search filters and any persisted search string.
- Per-tab open state (independent).
- Search icon only on: `applications`, `payouts`, `Admin Payouts`, `application scores`.
- Award Payouts + Scoresheets: single combined search; Admin Payouts: single field; Applications: keep `q`.
- CreateButton (“Payout”) only in header on Award/Admin Payout tabs.
- Spec: `docs/superpowers/specs/2026-08-10-grant-search-accordion-design.md`

## File Structure

| File | Responsibility |
|------|----------------|
| `apps/member-manager/src/modules/grant-manager/helpers/searchBarTabs.ts` | `SearchableTab` type, tab→keys map, `$or` builders, `hasActiveSearch` |
| `apps/member-manager/src/modules/grant-manager/helpers/searchBarTabs.spec.ts` | Unit tests for helpers |
| `apps/member-manager/src/modules/grant-manager/_components/GrantCollapsibleSearch.tsx` | Collapse wrapper + clear-on-close hookup |
| `apps/member-manager/src/modules/grant-manager/_components/GrantOrLiveSearch.tsx` | Single debounced input that sets/clears `$or` |
| `apps/member-manager/src/modules/grant-manager/types/IGrantContextProvider.ts` | Context type for `searchBarOpen` |
| `apps/member-manager/src/modules/grant-manager/GrantContextProvider.tsx` | State + provider value |
| `apps/member-manager/src/modules/grant-manager/_components/GrantDashboardHeader.tsx` | Search icon + CreateButton |
| `.../grant-application/ApplicationList.tsx` | Collapse around existing search |
| `.../payouts/PayoutsList.tsx` | Collapse + Or search; remove CreateButton |
| `.../payouts/AdministrativePayoutList.tsx` | Collapse; remove CreateButton |
| `.../scores/ScoreList.tsx` | Collapse + Or search |

---

### Task 1: Search helpers + unit tests

**Files:**
- Create: `apps/member-manager/src/modules/grant-manager/helpers/searchBarTabs.ts`
- Create: `apps/member-manager/src/modules/grant-manager/helpers/searchBarTabs.spec.ts`

**Interfaces:**
- Produces:
  - `export type SearchableTab = "applications" | "payouts" | "Admin Payouts" | "application scores"`
  - `export const SEARCHABLE_TABS: SearchableTab[]`
  - `export function isSearchableTab(tab: string): tab is SearchableTab`
  - `export function buildApplicationOrFilter(value: string): { $or: unknown[] } | null`
  - `export function buildScoresOrFilter(value: string): { $or: unknown[] } | null`
  - `export function extractOrSearchText(filterValues: Record<string, unknown>): string`
  - `export function hasPersistedSearch(value: string | null | undefined): boolean`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, expect, it } from "vitest";
import {
  buildApplicationOrFilter,
  buildScoresOrFilter,
  extractOrSearchText,
  hasPersistedSearch,
  isSearchableTab,
} from "./searchBarTabs";

describe("searchBarTabs", () => {
  it("isSearchableTab", () => {
    expect(isSearchableTab("applications")).toBe(true);
    expect(isSearchableTab("summary")).toBe(false);
  });

  it("buildApplicationOrFilter returns null for blank", () => {
    expect(buildApplicationOrFilter("")).toBeNull();
    expect(buildApplicationOrFilter("  ")).toBeNull();
  });

  it("buildApplicationOrFilter builds name/id $or", () => {
    expect(buildApplicationOrFilter("Acme")).toEqual({
      $or: [
        { application: { legal_entity_name: { $containsi: "Acme" } } },
        { application: { application_id: { $containsi: "Acme" } } },
      ],
    });
  });

  it("buildScoresOrFilter builds grant_application $or", () => {
    expect(buildScoresOrFilter("42")).toEqual({
      $or: [
        { grant_application: { legal_entity_name: { $containsi: "42" } } },
        { grant_application: { application_id: { $containsi: "42" } } },
      ],
    });
  });

  it("extractOrSearchText reads first $containsi leaf", () => {
    expect(
      extractOrSearchText({
        $or: [
          { application: { legal_entity_name: { $containsi: "X" } } },
        ],
      })
    ).toBe("X");
    expect(extractOrSearchText({})).toBe("");
  });

  it("hasPersistedSearch", () => {
    expect(hasPersistedSearch("q")).toBe(true);
    expect(hasPersistedSearch("")).toBe(false);
    expect(hasPersistedSearch(undefined)).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL (module missing)**

Run from `apps/member-manager`:

```bash
npx vitest run src/modules/grant-manager/helpers/searchBarTabs.spec.ts
```

Expected: FAIL cannot find module / file

- [ ] **Step 3: Implement helpers**

```ts
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

/** Map TabValue → SearchableTab when applicable */
export function toSearchableTab(tab: TabValue): SearchableTab | null {
  return isSearchableTab(tab) ? tab : null;
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx vitest run src/modules/grant-manager/helpers/searchBarTabs.spec.ts
```

- [ ] **Step 5: Commit**

```bash
git add apps/member-manager/src/modules/grant-manager/helpers/searchBarTabs.ts \
  apps/member-manager/src/modules/grant-manager/helpers/searchBarTabs.spec.ts
git commit -m "feat(grant-manager): add search bar tab helpers"
```

---

### Task 2: Context state for per-tab search open

**Files:**
- Modify: `apps/member-manager/src/modules/grant-manager/types/IGrantContextProvider.ts`
- Modify: `apps/member-manager/src/modules/grant-manager/GrantContextProvider.tsx`

**Interfaces:**
- Consumes: `SearchableTab`, `hasPersistedSearch` from Task 1
- Produces:
  - `searchBarOpen: Record<SearchableTab, boolean>`
  - `setSearchBarOpenForTab: (tab: SearchableTab, open: boolean) => void`
  - `toggleSearchBarForTab: (tab: SearchableTab) => void`

- [ ] **Step 1: Extend `IGrantContextProvider`**

Add imports and fields:

```ts
import type { SearchableTab } from '../helpers/searchBarTabs'

// on interface:
searchBarOpen: Record<SearchableTab, boolean>
setSearchBarOpenForTab: (tab: SearchableTab, open: boolean) => void
toggleSearchBarForTab: (tab: SearchableTab) => void
```

- [ ] **Step 2: Wire provider**

Initialize from persisted application search only (others start closed until list hydrates open from live filters if needed):

```ts
import {
  SearchableTab,
  SEARCHABLE_TABS,
  hasPersistedSearch,
} from "./helpers/searchBarTabs";

const emptyOpen = (): Record<SearchableTab, boolean> => ({
  applications: false,
  payouts: false,
  "Admin Payouts": false,
  "application scores": false,
});

// after applicationSearchFilter store:
const [searchBarOpen, setSearchBarOpen] = useState<Record<SearchableTab, boolean>>(
  () => ({
    ...emptyOpen(),
    applications: hasPersistedSearch(
      // read initial from store — useStore returns current; set after hook:
      ""
    ),
  })
);
```

Because `useStore` is available after hooks, sync applications open once:

```ts
const [searchBarOpen, setSearchBarOpen] =
  useState<Record<SearchableTab, boolean>>(emptyOpen);

useEffect(() => {
  if (hasPersistedSearch(applicationSearchFilter)) {
    setSearchBarOpen((prev) =>
      prev.applications ? prev : { ...prev, applications: true }
    );
  }
}, [applicationSearchFilter]);

const setSearchBarOpenForTab = (tab: SearchableTab, open: boolean) => {
  setSearchBarOpen((prev) => ({ ...prev, [tab]: open }));
};

const toggleSearchBarForTab = (tab: SearchableTab) => {
  setSearchBarOpen((prev) => ({ ...prev, [tab]: !prev[tab] }));
};
```

Update default context object and Provider `value` with the three new fields.

- [ ] **Step 3: Typecheck**

```bash
npx tsc -p apps/member-manager --noEmit 2>&1 | head -40
```

Fix any missing context defaults. (Full project may have pre-existing errors — ensure grant-manager context compiles.)

- [ ] **Step 4: Commit**

```bash
git add apps/member-manager/src/modules/grant-manager/types/IGrantContextProvider.ts \
  apps/member-manager/src/modules/grant-manager/GrantContextProvider.tsx
git commit -m "feat(grant-manager): add per-tab searchBarOpen context"
```

---

### Task 3: `GrantOrLiveSearch` + `GrantCollapsibleSearch`

**Files:**
- Create: `apps/member-manager/src/modules/grant-manager/_components/GrantOrLiveSearch.tsx`
- Create: `apps/member-manager/src/modules/grant-manager/_components/GrantCollapsibleSearch.tsx`

**Interfaces:**
- Consumes: context `searchBarOpen` / `setSearchBarOpenForTab`; helpers from Task 1
- Produces:
  - `<GrantOrLiveSearch buildOr={fn} placeholder? />`
  - `<GrantCollapsibleSearch tab={SearchableTab} clearSearch={() => void}>{children}</GrantCollapsibleSearch>`

- [ ] **Step 1: Implement `GrantOrLiveSearch`**

Single `TextField`/`TextInput` with debounce (~300ms). On change:

```ts
const { filterValues, setFilters } = useListFilterContext();
const text = extractOrSearchText(filterValues);

const apply = (value: string) => {
  const next = { ...filterValues };
  delete next.$or;
  // also strip legacy dual-search keys if present
  delete next["application][legal_entity_name][$contains"];
  delete next["application][application_id][$contains"];
  delete next["grant_application][legal_entity_name][$contains"];
  delete next["grant_application][application_id][$contains"];
  const built = buildOr(value);
  if (built) Object.assign(next, built);
  setFilters(next, null);
};
```

Props: `buildOr: (value: string) => { $or: unknown[] } | null`, optional `placeholder`, `helperText={false}`.

- [ ] **Step 2: Implement `GrantCollapsibleSearch`**

```tsx
import { Collapse, Box } from "@mui/material";
import { useEffect, useRef } from "react";
import { useGrantContext } from "../GrantContextProvider";
import type { SearchableTab } from "../helpers/searchBarTabs";

type Props = {
  tab: SearchableTab;
  /** Clears list filters + any persisted store for this tab */
  onClearSearch: () => void;
  children: React.ReactNode;
};

export function GrantCollapsibleSearch({ tab, onClearSearch, children }: Props) {
  const { searchBarOpen, setSearchBarOpenForTab } = useGrantContext();
  const open = searchBarOpen[tab];
  const prevOpen = useRef(open);

  useEffect(() => {
    // transition open → closed: clear
    if (prevOpen.current && !open) {
      onClearSearch();
    }
    prevOpen.current = open;
  }, [open, onClearSearch]);

  return (
    <Collapse in={open} timeout={200} unmountOnExit={false}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          px: 2,
          py: open ? 1 : 0,
          gap: 2,
        }}
      >
        {children}
      </Box>
    </Collapse>
  );
}
```

Note: lists currently put padding on `.RaList-actions`. Prefer moving padding into this Box and setting list `sx` `.RaList-actions` to `{ minHeight: 0, p: 0 }` so collapsed height is zero.

- [ ] **Step 3: Commit**

```bash
git add apps/member-manager/src/modules/grant-manager/_components/GrantOrLiveSearch.tsx \
  apps/member-manager/src/modules/grant-manager/_components/GrantCollapsibleSearch.tsx
git commit -m "feat(grant-manager): add collapsible and $or live search components"
```

---

### Task 4: Header search icon + CreateButton

**Files:**
- Modify: `apps/member-manager/src/modules/grant-manager/_components/GrantDashboardHeader.tsx`

**Interfaces:**
- Consumes: `searchBarOpen`, `toggleSearchBarForTab`, `setSearchBarOpenForTab`, `selectedTab`, `isSearchableTab`, `applicationSearchFilter`, `setApplicationSearchFilter`

- [ ] **Step 1: Add Search icon + clear-on-toggle-close**

Import `SearchIcon` from `@mui/icons-material/Search` and `CreateButton` from `react-admin`.

When toggling closed from header, clear must happen: either call `setSearchBarOpenForTab(tab, false)` and let `GrantCollapsibleSearch` clear, or clear store here for applications:

```tsx
const searchable = isSearchableTab(selectedTab) ? selectedTab : null;

const handleSearchToggle = () => {
  if (!searchable) return;
  const willOpen = !searchBarOpen[searchable];
  setSearchBarOpenForTab(searchable, willOpen);
  // clear for applications store immediately when closing
  if (!willOpen && searchable === "applications") {
    setApplicationSearchFilter("");
  }
};
```

Place Search `IconButton` immediately before the Filter button. Style fill/stroke like Filter. Only render when `searchable`.

Inside existing `ListBase` (when resource is set), after `SelectColumnsButton`, when `selectedTab === "payouts" || selectedTab === "Admin Payouts"`:

```tsx
<CreateButton
  label="Payout"
  sx={{
    backgroundColor: "primary.main",
    color: "white",
    "&:hover": { backgroundColor: "primary.dark" },
  }}
/>
```

- [ ] **Step 2: Commit**

```bash
git add apps/member-manager/src/modules/grant-manager/_components/GrantDashboardHeader.tsx
git commit -m "feat(grant-manager): header search toggle and payout create"
```

---

### Task 5: Wire all four list tabs

**Files:**
- Modify: `ApplicationList.tsx`
- Modify: `PayoutsList.tsx`
- Modify: `AdministrativePayoutList.tsx`
- Modify: `ScoreList.tsx`

**Interfaces:**
- Consumes: `GrantCollapsibleSearch`, `GrantOrLiveSearch`, builders, context

- [ ] **Step 1: ApplicationList**

Wrap `PersistentFilterLiveSearch` in:

```tsx
actions={
  <GrantCollapsibleSearch
    tab="applications"
    onClearSearch={() => {
      setApplicationSearchFilter("");
      // clear q via list context — do inside a child that has useListFilterContext
    }}
  >
    <PersistentFilterLiveSearch />
  </GrantCollapsibleSearch>
}
```

Implement clear inside `PersistentFilterLiveSearch` or a tiny `ClearSearchOnClose` child:

```tsx
const ClearListSearchKeys = ({ keys }: { keys: string[] }) => {
  const { filterValues, setFilters } = useListFilterContext();
  // expose clear via ref/callback registration — simpler: onClearSearch in parent uses a ref set by child
};
```

Simpler approach: `GrantCollapsibleSearch` accepts optional `onClearSearch` that runs in the Collapse effect; each list passes a child wrapper:

```tsx
const ApplicationsSearchActions = () => {
  const { setApplicationSearchFilter, searchBarOpen } = useGrantContext();
  const { filterValues, setFilters } = useListFilterContext();

  const onClearSearch = useCallback(() => {
    setApplicationSearchFilter("");
    const { q, ...rest } = filterValues;
    setFilters(rest, null);
  }, [filterValues, setFilters, setApplicationSearchFilter]);

  // Also: if hasPersistedSearch(applicationSearchFilter) ensure open — already in provider effect

  return (
    <GrantCollapsibleSearch tab="applications" onClearSearch={onClearSearch}>
      <PersistentFilterLiveSearch />
    </GrantCollapsibleSearch>
  );
};
```

But `actions` is outside ListContext... Actually in RA, `actions` render **inside** List, so `useListFilterContext` works in action components. Use a component as `actions={<ApplicationsSearchActions />}` not a bare element that calls hooks incorrectly.

Set list `sx`:

```tsx
".RaList-actions": { p: 0, minHeight: 0 },
```

Initialize open when `applicationSearchFilter` non-empty (provider effect).

- [ ] **Step 2: PayoutsList**

Remove dual `FilterLiveSearch` + `CreateButton`. Use:

```tsx
actions={<PayoutsSearchActions />}
```

```tsx
const PayoutsSearchActions = () => {
  const { filterValues, setFilters } = useListFilterContext();
  const onClearSearch = useCallback(() => {
    const next = { ...filterValues };
    delete next.$or;
    delete next["application][legal_entity_name][$contains"];
    delete next["application][application_id][$contains"];
    setFilters(next, null);
  }, [filterValues, setFilters]);

  return (
    <GrantCollapsibleSearch tab="payouts" onClearSearch={onClearSearch}>
      <GrantOrLiveSearch
        buildOr={buildApplicationOrFilter}
        placeholder="Search by name or ID"
      />
    </GrantCollapsibleSearch>
  );
};
```

- [ ] **Step 3: AdministrativePayoutList**

Same Collapse pattern; keep single `FilterLiveSearch` for name (or use Or with one field — keep single `$contains` source as today). Remove `CreateButton`. `tab="Admin Payouts"`.

- [ ] **Step 4: ScoreList**

Same as payouts with `buildScoresOrFilter`, `tab="application scores"`.

- [ ] **Step 5: Commit**

```bash
git add apps/member-manager/src/modules/grant-manager/grant-application/ApplicationList.tsx \
  apps/member-manager/src/modules/grant-manager/payouts/PayoutsList.tsx \
  apps/member-manager/src/modules/grant-manager/payouts/AdministrativePayoutList.tsx \
  apps/member-manager/src/modules/grant-manager/scores/ScoreList.tsx
git commit -m "feat(grant-manager): collapsible search on all list tabs"
```

---

### Task 6: Browser verification

**Files:** none (manual / Playwright MCP)

- [ ] **Step 1:** Open grant Applications tab — search bar collapsed; icon visible.
- [ ] **Step 2:** Click search icon — bar expands; type query — filters; collapse — query cleared and bar hidden.
- [ ] **Step 3:** Set persisted search (or type, refresh if store persists) — bar open on load.
- [ ] **Step 4:** Award Payouts — one search field; Create in header; name OR id match.
- [ ] **Step 5:** Admin Payouts — Create in header; search accordion works.
- [ ] **Step 6:** Scoresheets — one combined search; independent open state from Applications.
- [ ] **Step 7:** Summary/Map — no search icon.

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Header magnifying glass | 4 |
| Accordion Collapse | 3, 5 |
| Per-tab state | 2 |
| Default collapsed | 2 |
| Open if persisted search | 2, 5 |
| Collapse clears search | 3, 4, 5 |
| Combined $or search Award/Scores | 1, 3, 5 |
| CreateButton in header | 4 |
| Hide icon on non-search tabs | 4 |

## Self-review

- No TBD placeholders.
- Helper names consistent across tasks (`buildApplicationOrFilter`, `GrantOrLiveSearch`, `searchBarOpen`).
- Clear-on-close handled in Collapse effect + applications store clear from header/list.
