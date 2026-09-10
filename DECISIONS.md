# Decision log

Newest first. One entry per decision that would otherwise have been a question.

---

## 2026-09-10 — Filters drawer titlebar: Reset / Save / Collapse, and what "Save" saves

**Intent.** Every Filters drawer in member-manager should carry the same three
titlebar controls, LTR: Reset (cancel icon), Save (heart), Collapse (right
chevron). Saving should be DRY and capture the whole view — resource, selected
columns, column order, per-page, sort — not just filter values.

### 1. Where the three controls live

- **Options.** (a) Add them per filter sidebar. (b) Add them once in the
  framework's Filters-drawer manifest.
- **Chosen: (b).** `framework/ListScope.tsx:DefaultFiltersHeaderActions` is the
  single place that renders left of `RightDrawer`'s collapse chevron, and
  `framework/Drawers.tsx` auto-attaches it to every list with filters. All 22
  filter sidebars route through a manifest `filterBody:` — there are zero
  `aside=` filter panels left — so one edit covers the app.
- **Consequence.** Reset and Save are now unconditional. The ~15 manifest
  entries that opted in with `filterHeaderActions: SaveQueryHeaderAction` were
  deleted; leaving them would have rendered two hearts. `filterHeaderActions`
  survives for genuinely list-specific buttons.
- The collapse chevron already lived in `RightDrawer` and was already
  consistent everywhere. No change — the hunch was right.

### 2. Reset resets filters only

- **Options.** (a) Clear filter values. (b) Also restore sort, per-page and
  columns to manifest defaults.
- **Chosen: (a).** The control sits in the *Filters* drawer; silently
  reordering someone's columns because they cleared a filter would surprise.
  (b) is the same helper plus manifest defaults if it's ever wanted.
- Reset is disabled (not hidden) when no filters are active, so the titlebar
  does not reflow as filters come and go.

### 3. The save modal moved into the header

- Previously `SaveFilterModal` was mounted by `SavedFilters`, i.e. only on
  lists whose *body* rendered `SavedFiltersSection`. Once the heart became
  universal, every list whose body omits that section (the plain `FilterForm`
  path, and conference when `hasSavedQueries` is false) would have shown a
  button that does nothing.
- **Chosen.** `SaveQueryHeaderAction` owns the modal and the
  `can('create','saved-query')` gate. MUI `Modal` portals, so tree position
  costs nothing.

### 4. Storage shape: a new `view` column, not a fatter `filters`

- **Options.** (a) Nest the view inside the existing `filters` JSON with a
  version tag — no backend change. (b) Add a `view` JSON attribute to the
  `saved-query` content type.
- **Chosen: (b).** `filters` stays exactly the filter values, so existing rows
  keep working and the "which saved query is currently active?" comparison in
  `SavedFilters.tsx` keeps comparing like with like. (a) would have forced that
  matcher to learn about wrapper keys.
- **Cost.** member-manager must not ship ahead of Strapi. Acceptable here:
  schema and frontend already ship together in this repo (most recently
  `2ab3c5b7`), and the saved-query controller is a plain core controller with no
  field whitelist.
- Legacy rows have no `view`; the client reads `record.view ?? undefined` and
  applies filters only.

### 5. Columns: one key works for both grid families

- RA's `preferences.<key>.columns` is an **ordered array of shown column ids** —
  selection and order in one field.
- The custom `AgDatagrid` deliberately reuses the same preference shape
  (`AgDatagrid.tsx` reads `preferences.<raColumnsKey>.columns`), so saving that
  one array covers both `DatagridConfigurable` and AG Grid lists with no
  per-grid branching.
- The key is not always `${resource}.datagrid` (some grids mount a custom
  `preferenceKey`), so `ListManifest.columnsPreferenceKey` overrides it.
- A saved view records the key it came from and refuses to restore columns
  captured under a different one, so a view can never blank an unrelated grid.

### 6. Header actions must survive a Filters drawer with no list

- `useListFilterContext()` **throws** outside a provider, and grant-manager's
  Summary and Map tabs mount `grantFiltersDrawer` with no `list:` at all
  (it holds grant + date-range pickers). The drawer header renders eagerly even
  while closed, so an unguarded hook would have crashed those two tabs.
- Both header actions read `ListFilterContext` via `useContext` and render
  nothing when it is absent.

### 7. The saved-query picker reaches every list that can save

- A universal Save is only half a feature if the list has no picker to load it
  back. Five sidebars had none: `GrantFilters`, both Soonerwarn status bodies,
  `OrwefFilterSidebar`, `AwardFilterSidebar`. They now render
  `SavedFiltersSection` as the first child of their existing padded box, which
  is where the other twelve already put it.
- **Not** hoisted into `DefaultFiltersBody` instead, even though that would be
  DRYer. Conference deliberately hides the picker on its scope-only tabs
  (Summary / Tools / Edit), and those tabs *do* have a `list` — so a central
  render would need a new per-tab opt-out and would change behaviour there.
  Worth revisiting if a second list ever wants to opt out.
- `SavedFiltersSection` now returns null without a `ListFilterContext`, for the
  same reason the header actions do — `GrantFilters` is also the body of
  grant-manager's list-less Summary and Map tabs.

### 8. Applying a whole view in one handler is safe on this RA version

- Checked rather than assumed, because "setSort then setPerPage then setPage,
  all in one click handler" is a classic stale-closure trap.
- `ra-core`'s `useListParams.changeParams` accumulates actions dispatched in the
  same tick into `tempParams.current` (seeded from `query` by the first call,
  then reduced onto itself) and commits them in one scheduled flush. And
  `setFilters(filter, displayedFilters, debounce = false)` is **not** debounced
  by default. So filters, sort, per-page and page all land together.
- If ra-core is ever upgraded, re-read that function before trusting
  `useApplyListView`.

### Known limits

- `AgDatagrid` persists in-grid **drag** reorder to its own `agGrid.<resource>`
  prefs (`onColumnMoved={persistColumnWidths}`), not to
  `preferences.<key>.columns`. A saved view therefore captures the column order
  chosen through the Columns button, not one dragged in the grid. Column
  *widths* are likewise not part of a saved view.

### Verification

- `tsc --noEmit`: 148 top-level errors, identical to the pre-change baseline,
  none in any touched file.
- `vitest`: 12 new tests in `listView.spec.ts` pass; no new failures. The
  remaining failures are pre-existing worktree artifacts (fixture paths under
  `tmp/`, vendored `local_modules/@react-admin/*` specs).
- `vite build --mode production`: succeeds.
