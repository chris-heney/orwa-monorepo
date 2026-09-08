# Task 5 Report: Conference Contestant Cancel/Restore UI

## Summary

Implemented the Conference Manager contestant soft-cancellation surface on branch
`conference/contestant-soft-cancellation`.

The contestant list now defaults to active contestants, supports Active /
Cancelled / All filtering, shows cancellation audit fields, preserves fee and
item/Mulligan chips in cancelled views, and replaces the hard delete toolbar on
this surface with Cancel/Restore actions backed by the custom Strapi routes.

## RED / GREEN

### RED 1: Default contestants to active

Command:

```bash
npx vitest run apps/member-manager/src/modules/conference/helpers/listQueryFilters.spec.ts
```

Observed failure:

```text
FAIL normalizeFiltersForListQuery > defaults conference contestants to active
expected { conference: 3, year: 2026 } to deeply equal { conference: 3, year: 2026, status: "active" }
```

Fix:

- `normalizeFiltersForListQuery("conference-contestants", ...)` now adds
  `status: "active"` only when no status is supplied.
- Explicit `status: "cancelled"` is preserved.

### RED 2: All filter must not query `status=all`

Command:

```bash
npx vitest run apps/member-manager/src/modules/conference/helpers/listQueryFilters.spec.ts
```

Observed failure:

```text
FAIL normalizeFiltersForListQuery > omits contestant status when all is selected
expected { conference: 3, year: 2026, status: "all" } to deeply equal { conference: 3, year: 2026 }
```

Fix:

- `status: "all"` is treated as a UI sentinel and stripped from the Strapi list
  query.

### GREEN

Command:

```bash
npx vitest run apps/member-manager/src/modules/conference/helpers/listQueryFilters.spec.ts apps/member-manager/src/modules/conference/helpers/contestantStatus.spec.ts
```

Result:

```text
Test Files  2 passed (2)
Tests       10 passed (10)
```

## UI Behavior

- The contestant datagrid has an Active / Cancelled / All toggle above the list.
- Active is the default list query for `conference-contestants`.
- Cancelled rows remain visible when Cancelled or All is selected.
- Cancelled rows use theme-aware warning alpha colors, not light-only hardcoded
  colors.
- Fee and grouped item chips remain visible for all records, including cancelled
  contestants and Mulligan-style quantity extras.
- The expanded edit form uses a save-only toolbar for contestants, so the generic
  hard `DeleteButton` no longer renders on this surface.
- Each row shows Status, Cancelled At, Reason, Cancelled By, and Actions.
- Active records show a red Cancel action. Cancel opens a confirmation dialog with
  a required reason field and POSTs to
  `/api/conference-contestants/:documentId/cancel`.
- Cancelled records show a secondary Restore action. Restore opens a confirmation
  dialog with a required reason field and POSTs to
  `/api/conference-contestants/:documentId/restore`.
- Both actions use the existing authenticated react-admin `httpClient`, show
  success/error notifications, disable controls while saving, and refresh the
  list after success.

## Schema-Derived Requirements

- `status` enum (`active`, `cancelled`) with default `active`:
  enforced in `listQueryFilters.ts` and surfaced in the datagrid status chip and
  status filter.
- `cancelled_at`, `cancelled_reason`, `cancelled_by`:
  surfaced as read-only list columns.
- `fee` and `items`:
  preserved in the list for cancelled rows; no UI path clears or hides these
  values.
- Custom cancel/restore routes require `reason`:
  enforced in `ContestantCancellationActions.tsx` before POSTing.
- Backend capacity handling remains authoritative:
  UI calls the existing Strapi custom routes and does not mutate capacity itself.

## Typecheck / Lints

Edited-file lints:

```text
No linter errors found.
```

Full member-manager typecheck:

```bash
cd apps/member-manager && npx tsc --noEmit
```

Result: fails on a pre-existing baseline outside Task 5. Representative baseline
errors include:

- `src/helpers/ra-strapi-rest/index.ts` react-admin data provider type mismatch.
- missing CKEditor package declarations in `src/modules/_components/CKEditor*`.
- stale conference context properties in `src/modules/Schedule/components/ScheduleForm.tsx`.
- existing settings/training/soonerwarn/terms-gate TypeScript errors.

Scoped edited-file typecheck filter:

```bash
cd apps/member-manager && npx tsc --noEmit --pretty false 2>&1 | rg "src/modules/conference/(components/ConferenceContestants|components/ContestantCancellationActions|helpers/listQueryFilters)"
```

Result: no output after fixes, meaning the final full typecheck baseline does not
include Task 5 edited-file errors.

## Commit

Commit message:

```text
member-manager: add contestant cancel and restore controls
```

The final commit hash is reported by the task runner after commit creation.

## Self-Review

- Verified no generic shared toolbar behavior was changed; hard delete removal is
  scoped to `ConferenceContestants.tsx`.
- Verified `httpClient` is used instead of ad hoc auth fetches.
- Verified `status: "all"` is not sent as a Strapi filter.
- Verified unrelated dirty files (`DRAFTS.md`, Strapi updater state, and
  scholarship scratch files) remain unstaged.

## Concerns

- I did not deploy or mutate production.
- I did not perform a browser smoke because this task was completed as a scoped
  local implementation with the existing member-manager typecheck baseline
  failing outside Task 5. The UI uses MUI palette tokens and `alpha()` for light
  and dark mode compatibility.

## Review Follow-Up Evidence

### RED

Command:

```bash
npx vitest run apps/member-manager/src/helpers/ra-strapi-data-provider/src/DataProviderFactory.spec.ts apps/member-manager/src/modules/conference/helpers/contestantStatus.spec.ts
```

Observed failures:

```text
provider.invalidateResourceCache is not a function
expected 'undefined' to be 'function' for canEditContestant
expected 'undefined' to be 'function' for contestantActionPermissionUid
```

These covered the stale provider cache invalidation gap and the missing pure
helpers for read-only/action permission state.

### GREEN

Command:

```bash
npx vitest run apps/member-manager/src/helpers/ra-strapi-data-provider/src/DataProviderFactory.spec.ts apps/member-manager/src/modules/conference/helpers/contestantStatus.spec.ts apps/member-manager/src/modules/conference/helpers/listQueryFilters.spec.ts
```

Result:

```text
Test Files  3 passed (3)
Tests       13 passed (13)
```

### Fixes

- Added `invalidateResourceCache(resource)` to the Strapi react-admin data
  provider. It narrowly invalidates cached `getList`, `getOne`, `getMany`, and
  `getManyReference` keys for the supplied resource.
- Added a provider regression test proving a stale
  `conference-contestants` cached list is evicted after
  `invalidateResourceCache("conference-contestants")`.
- Cancel/Restore now calls the provider invalidation API after the successful
  custom POST and before `refresh()`.
- Added `canEditContestant()` so cancelled contestants render read-only in the
  expanded panel. Active contestants still render the editable `SimpleForm`.
- Cancelled expanded records now show identity, fee, ticket, status audit, and
  grouped item/Mulligan evidence without save controls or item editors.
- Added a synchronous `useRef` in-flight guard in
  `ContestantCancellationActions` in addition to disabled button state.
- Reused `ContestantCancellationActions` in the active edit toolbar and
  cancelled read-only header, so expanded views also expose Cancel/Restore
  without a separate request implementation.
- RBAC now uses `useCan().canAction()` with the actual custom Strapi action UIDs:
  `api::conference-contestant.conference-contestant.cancel` and
  `api::conference-contestant.conference-contestant.restore`.

### Production RBAC Requirement

Production roles that should be able to cancel or restore contestants need the
custom controller permissions above enabled in the Strapi role permission matrix.
If a role has only generic `update` or `delete` on `conference-contestant`, this
UI will not show Cancel/Restore unless the corresponding custom action
permission is also present.

### Final Verification

Edited-file lints:

```text
No linter errors found.
```

Full member-manager typecheck:

```bash
cd apps/member-manager && npx tsc --noEmit
```

Result: still fails on the pre-existing baseline outside these review fixes,
including `src/helpers/ra-strapi-rest/index.ts`, missing CKEditor declarations,
stale Schedule context properties, existing settings/training/soonerwarn errors,
and `libs/terms-gate` TypeScript errors.

Scoped edited-file typecheck filter:

```bash
cd apps/member-manager && npx tsc --noEmit --pretty false 2>&1 | rg "src/(helpers/ra-strapi-data-provider/src/(DataProviderFactory|types)|modules/conference/(components/ConferenceContestants|components/ContestantCancellationActions|helpers/contestantStatus|helpers/listQueryFilters))"
```

Result: no output, so the current typecheck baseline does not include edited-file
errors from the Task 5 review follow-up.
