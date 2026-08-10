# Grant Dashboard Search Accordion — Design

**Date:** 2026-08-10  
**Status:** Approved (Approach 1 — mirror filter toggle)  
**App:** `apps/member-manager` (grant-manager module)

## Problem

Grant dashboard list tabs always show a white React Admin `actions` bar with search (and sometimes Create). That bar costs vertical space. Users want a header magnifying-glass control that accordion-toggles the bar, matching the existing filter icon pattern. Award Payouts and Scoresheets currently use two separate search fields; Create buttons sit in the search bar instead of the header.

## Goals

1. Header search icon (next to Filter) expands/collapses the white search bar with accordion motion.
2. Per-tab open/closed state (independent across Applications, Award Payouts, Admin Payouts, Scoresheets).
3. Default **collapsed**, unless that tab has a persisted/active search value — then default **open**.
4. Collapsing **clears** that tab’s search filters (and any persisted search value for that tab).
5. Award Payouts + Scoresheets: one combined fuzzy-style search (name OR id).
6. Move “+ Payout” Create buttons from Award/Admin Payout list bars into the dark header so the white bar is search-only.
7. Icon only relevant on tabs that have a search bar; hide or no-op on Summary / Map / Edit / Tokens.

## Non-goals

- Server-side user preference sync for this toggle (out of scope; use existing `useStore` / context patterns).
- Changing filter sidebar behavior.
- Full Strapi `_q` schema expansion for nested payout relations (use `$or` + `$containsi` instead).
- Search UI on tabs that do not already have list search.

## Architecture

Mirror `isFilterSidebarOpen`:

| Piece | Role |
|-------|------|
| Grant context | Per-tab search-open map + setters; optional per-tab persisted search strings where needed |
| `GrantDashboardHeader` | Search `IconButton` (filled when open); CreateButton when on payout tabs |
| List `actions` | Single search field wrapped in MUI `Collapse` |
| Clear-on-close | Closing sets open=false and removes that tab’s search filter keys / store value |

### State

```ts
type SearchableTab =
  | "applications"
  | "payouts"
  | "Admin Payouts"
  | "application scores";

searchBarOpen: Record<SearchableTab, boolean>
setSearchBarOpen: (tab, open) | toggle
```

Rules:

- Initial open for a tab = `Boolean(persistedOrActiveSearchValue)`.
- User opens via icon → `true` (bar expands empty).
- User closes via icon → `false` **and** clear that tab’s search (list filters + any `useStore` persistence).
- Switching tabs does not force other tabs open/closed.

Applications already persist `applicationSearchFilter` via `useStore`. Extend the same idea for payout/scores tabs if we keep query across remounts; otherwise open state can derive from live `filterValues` while the list is mounted, and Applications keep their existing store key.

### Header

- Add `SearchIcon` `IconButton` left of Filter (or immediately beside it), same stroke/fill open styling as Filter.
- Visible when `selectedTab` is one of the four searchable tabs.
- On Award Payouts / Admin Payouts: render `CreateButton` (label “Payout”) inside the existing header `ListBase` (resource already `grant-payouts`) so create stays in RA resource context.

### Accordion bar

Wrap each list’s `actions` content in MUI `Collapse` (`in={searchBarOpen[tab]}`, `timeout="auto"` / short ms, `unmountOnExit` optional — prefer keep mounted if needed for filter sync; prefer unmount after clear for simplicity).

When collapsed, `.RaList-actions` should take no vertical space (Collapse handles height; also avoid empty padding when closed).

### Combined search (Award Payouts, Scoresheets)

Replace dual `FilterLiveSearch` fields with one control that writes an `$or` filter, e.g.:

**Award Payouts:**

```ts
$or: [
  { application: { legal_entity_name: { $containsi: value } } },
  { application: { application_id: { $containsi: value } } },
]
```

**Scoresheets:**

```ts
$or: [
  { grant_application: { legal_entity_name: { $containsi: value } } },
  { grant_application: { application_id: { $containsi: value } } },
]
```

Use a small dedicated input (reuse/adapt `GrantSearchFilter` or a thin wrapper) that sets/clears `$or` (and removes the old dual sources) on change. Debounce like `FilterLiveSearch`.

**Applications:** keep single `FilterLiveSearch` / `q` → `_q` (already fuzzy).

**Admin Payouts:** keep a single field (today: application name `$contains`); no dual merge required. Still accordion + Create moved to header.

### Clear-on-collapse

On close for the current tab:

1. Set `searchBarOpen[tab] = false`.
2. Clear list filter keys for that tab’s search (`q`, `$or`, or specific `$contains` sources).
3. Clear persisted store value if any (`applicationSearchFilter` → `""`; add sibling keys only if we introduce them).

Opening does not invent a query; it only shows the empty (or still-active) field.

## Files (expected)

- `GrantContextProvider.tsx` / `IGrantContextProvider.ts` — search-open state
- `GrantDashboardHeader.tsx` — search icon + CreateButton on payout tabs
- `ApplicationList.tsx` — Collapse around search
- `PayoutsList.tsx` — single `$or` search, Collapse, remove CreateButton
- `AdministrativePayoutList.tsx` — Collapse, remove CreateButton
- `ScoreList.tsx` — single `$or` search, Collapse
- Optional: small `GrantCollapsibleSearchBar.tsx` / fuzzy search helper if it stays DRY without over-abstracting

## Error handling

- Empty search string → remove search keys from filters (do not send empty `$or`).
- Tabs without search: hide search icon.
- CreateButton only when `resource === "grant-payouts"` and tab is Award or Admin Payouts.

## Testing

- Manual / Playwright: collapsed by default on Applications with empty store; open when `grants-application-search-filter` set; toggle clears `q` and collapses.
- Award Payouts: one field matches name or id; Create is in header only.
- Scoresheets: one field matches name or id.
- Tab switch: Applications open state independent of Award Payouts.
- Summary/Map/Edit/Tokens: no search icon (or disabled).

## Success criteria

- Search bar starts collapsed unless a persisted search exists for that tab.
- Magnifying glass toggles accordion expand/collapse like Filter does for the sidebar.
- Collapse clears search; open-with-persisted-value keeps bar expanded until cleared/collapsed.
- Payout Create lives in the dark header; white bar is search-only on all four tabs.
- Dual searches merged on Award Payouts and Scoresheets.
