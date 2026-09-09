# Task 8 — Full local verification report

**Branch:** `conference/contestant-soft-cancellation`
**Date:** 2026-09-08
**Environment:** local Strapi on `http://localhost:13370` against the local
migration-copy database (`strapi_prod`, MySQL on 127.0.0.1:3307). Production
was never written to.

**Result: PASS, with two implementation defects found and fixed.**

Both defects were in Member Manager and both made the feature's core promise
unreachable from the UI even though every server-side path was already
correct. Neither was visible from unit tests or build output — both were found
by driving the real app in a browser and reading the queries it emitted.

---

## 1. Defects found and fixed

### Defect 1 — the Cancelled and All views were unreachable

**Commit:** `84a7b583 member-manager: fix contestant status view toggle`

`ConferenceDashboard` seeds the list's `filterValues` from
`normalizeFiltersForListQuery`, which for `conference-contestants` injects the
default active clause:

```
filters[$or][0][status][$eq]=active&filters[$or][1][status][$null]=true
```

`ContestantStatusFilterControl` then spread those same `filterValues` and added
its own `status` key. The two constraints were ANDed, so the emitted query was:

```
GET /api/conference-contestants?...&filters[$or][0][status][$eq]=active
   &filters[$or][1][status][$null]=true&filters[conference]=10&filters[year]=2026
   &filters[status]=cancelled        <-- captured live, reqid 2385
```

Rows cannot be simultaneously active and cancelled, so **Cancelled always
returned zero rows** ("No results found") and **All silently stayed
active-only** because deleting `status` left the `$or` in place. Only the
default Active view worked. The status chip, the audit columns, the Restore
button and the whole "cancelled records stay visible as evidence" design were
unreachable in Conference Manager.

The existing unit tests passed because they exercised
`normalizeFiltersForListQuery` in isolation with inputs the UI never produces —
the `status: "all"` branch was dead code from the UI's perspective.

**Fix:** moved the status transition into `listQueryFilters.ts` as
`applyContestantStatusFilter` / `contestantStatusFromFilters`, which *replace*
the status constraint rather than stacking a second one, and shared the
active-or-null clause (`CONTESTANT_ACTIVE_OR_NULL_CLAUSE`) between the list
default and the control so they can never drift apart. Unrelated `$or` branches
(e.g. a search clause) are preserved.

**Post-fix queries captured live:**

| View | Emitted filters | Rows |
|---|---|---|
| Active | `$or[0][status][$eq]=active`, `$or[1][status][$null]=true` | 9 |
| Cancelled | `status=cancelled` (no `$or`) | 2 |
| All | neither | 11 |

### Defect 2 — a successful cancel reported failure and left the row stale

**Commit:** `55d37171 member-manager: repaint contestant list after cancel`

After a successful `POST /cancel`, the row kept showing **Active** indefinitely
(sampled every 900 ms for 6 s) and the operator saw the toast:

> The dataProvider threw an error. It should return a rejected Promise instead.

Root cause: react-admin's `useDataProvider` returns a Proxy that returns a
function for *any* property access and unconditionally calls `.then()` on the
result:

```js
return dataProvider[type].apply(dataProvider, args).then(...)
```

`invalidateResourceCache` returned `void`, so `.then` threw a `TypeError`. The
optional chaining in `dataProvider.invalidateResourceCache?.(...)` never
short-circuited (the proxy always yields a function), so the throw landed
*before* `refresh()` and was caught by the same `catch` that reports a failed
cancellation. Net effect: the write landed in the database, but the UI claimed
it failed and never repainted — an operator would reasonably retry.

**Fix:** `invalidateResourceCache` now resolves a `Promise<void>` (signatures
updated in `DataProviderFactory.ts` and `types.ts`), and the post-write refresh
in `ContestantCancellationActions` moved outside the `try` so a refresh problem
can never be reported as a failed cancellation.

**Post-fix, verified live:** row repaints to `Cancelled` within the first
900 ms sample; the only toast is `Contestant cancelled.` Restore round-trips
the same way (`Contestant restored.`, row returns to `Active`).

### Regression tests added

`apps/member-manager/src/modules/conference/helpers/listQueryFilters.spec.ts`
(+6) now drives the round trip the UI actually performs — seeding from
`normalizeFiltersForListQuery` output, asserting every view reads back what it
writes, that Cancelled replaces rather than ANDs, that repeated toggling never
stacks constraints, and that unrelated `$or` branches survive.

`DataProviderFactory.spec.ts` (+1) pins the contract the react-admin proxy
requires: `invalidateResourceCache` must return a thenable.

---

## 2. Commits

| Commit | Subject |
|---|---|
| `d8d06e95` | strapi: fix contestant build typecheck |
| `39a5512f` | strapi: grant contestant cancel and restore permissions |
| `84a7b583` | member-manager: fix contestant status view toggle |
| `55d37171` | member-manager: repaint contestant list after cancel |

`d8d06e95` and `39a5512f` were made earlier in this verification run: the
Strapi TypeScript build failed on three errors in the contestant controller and
service, and the bootstrap never granted the `admin` role the
`conference-contestant.cancel` / `.restore` permissions, so the UI buttons
returned 403. `apps/strapi/src/index.spec.ts` asserts the seeded UIDs match
what `contestantActionPermissionUid` checks before rendering the buttons.

Unrelated dirty files were left untouched and unstaged: `DRAFTS.md`,
`apps/strapi/.strapi-updater.json`, `scholarship-apps-list.yml`,
`scholarship-submit-body.json`.

---

## 3. Test suites

```bash
cd apps/strapi          && npx vitest run                          # 22 files, 166 tests — PASS
cd apps/strapi          && npx vitest run src/api/conference-contestant \
                              src/api/conference-summary src/api/conference-webhook
                                                                   # 16 files, 135 tests — PASS
cd apps/member-manager  && npx vitest run src/modules/conference   #  9 files,  62 tests — PASS
cd apps/conference-hub  && npx vitest run                          #  2 files,   2 tests — PASS
npx vitest run scripts/reconcile-and-cancel-golf-overage.spec.ts   #  1 file,   33 tests — PASS
cd apps/member-manager  && npx vitest run \
    src/helpers/ra-strapi-data-provider/src/DataProviderFactory.spec.ts \
    src/modules/conference/helpers/listQueryFilters.spec.ts        #  2 files,  18 tests — PASS
```

### Full member-manager suite — pre-existing failures, baseline-compared

`npx vitest run` in `apps/member-manager` reports failures. To prove none are
mine, the same suite was run with my changed files reverted to `39a5512f`:

| | Files failed | Tests failed | Tests passed |
|---|---|---|---|
| Baseline (`39a5512f`) | 30 | 6 | 209 |
| With fixes (`HEAD`) | 31 | 7 | 216 |

Diffing the failing-file sets, the only difference is
`src/modules/award-nominations/helpers/printNominationApplication.spec.ts`,
which timed out at 15 197 ms against a 5 000 ms limit under full-suite parallel
load. Run in isolation twice it passes 7/7 — a load-related timeout flake, and
unrelated to contestants. Every other failure is a vendored
`local_modules/@react-admin/*` collection error plus
`src/fields/ensureEntityIdColumn.spec.tsx`, all present at baseline.

My changes add 7 passing tests (215 → 222 excluding the flake).

### Typecheck

`apps/strapi`: `npx tsc --noEmit -p tsconfig.json` — exit 0.
`apps/member-manager`: pre-existing errors elsewhere in the app; **zero** in any
file I touched (`listQueryFilters`, `ConferenceContestants`,
`ContestantCancellationActions`, `DataProviderFactory`, `types.ts`).

---

## 4. Builds — direct Vite, not `nx build`

All builds run in a scrubbed environment (`env -i` with only `PATH`/`HOME`),
because `apps/member-manager/vite.config.ts` inlines `process.env` and would
otherwise bake the host shell's variables into the bundle.

```bash
cd apps/strapi                 && npx strapi build                    # exit 0
cd apps/member-manager         && npx vite build --mode production     # exit 0
cd apps/conference-hub         && npx vite build --mode production     # exit 0
cd apps/conference-registration&& npx vite build --mode production     # exit 0
```

### Bundle scan

| Bundle | `localhost:1337` | `localhost:13370` | any `localhost` | secrets |
|---|---|---|---|---|
| `apps/member-manager/dist` | 0 | 0 | 1 | none |
| `dist/apps/conference-hub` | 0 | 0 | 0 | none |
| `dist/apps/conference-registration` | 0 | 0 | 0 | none |

The single `localhost` hit in member-manager is `linkifyjs` registering
`localhost` as a recognised host in its URL tokenizer — library internals, not
an endpoint. Scanned for `DB_PASSWORD`, `MYSQL`, `ADMIN_JWT`, `API_TOKEN_SALT`,
`SSH_`, `AWS_`, `strapi_prod`, `id_ed25519`, `wpengine`: zero hits in all three
bundles. All three resolve API calls to `https://admin.orwa.org/api`.

---

## 5. Strapi boot, migration and lifecycles

Real Strapi booted on port 13370 against the migration-copy database.

**Migration applied and recorded:**

```
2026.09.09T00.00.00.backfill-conference-contestant-status.js   2026-09-08 20:09:58
```

`SHOW COLUMNS FROM conference_contestants LIKE 'status'` → `varchar(255)`.
Post-migration distribution was 97 `active` / 0 `cancelled` / 0 `NULL` — every
pre-existing row backfilled. The one `NULL`-status row observed during the run
(`ZZTASK8LegacyNull`, created 20:14:48, *after* the migration) was a deliberate
legacy fixture, and it behaved as active everywhere: Active view, public
roster, and summary count.

**Lifecycles load and fire** — verified against the running server:

| Attempt | Result |
|---|---|
| `PUT {status: "cancelled"}` | 400 — "Conference contestant lifecycle fields must be changed through cancel/restore actions." |
| `PUT {cancelled_at: "2020-01-01…"}` | 400 — same guard |
| `PUT {conference: null}` | 400 — "Cancel and create a new contestant to change conference or ticket." |
| `PUT {phone: "4055550100"}` (benign) | 200, row updated |
| `DELETE /api/conference-contestants/:documentId` | 405 — "Conference contestants must be cancelled, not deleted.", row unchanged |

---

## 6. API-level verification harness — 83/83

`node tmp/task8/verify-api.mjs` (log: `tmp/task8/verify-api-run2.log`), re-run
against the current build after both fixes. Every check the brief and the
additional gates call for:

**B. Webhook capacity & reservation (24 checks)** — mixed Attendee+Golfer cart
succeeds, decrements capacity by exactly 1, creates exactly one contestant row
with 3 Mulligan items, defaults to `status=active`; contestant-only checkout
decrements by 1; Fisher consumes no golf capacity; **cap−1 / cap / cap+1** —
cap+1 rejected with "The golf tournament is sold out…", availability never goes
negative and no contestant row is created; a 1-remaining/2-requested cart is
rejected naming the exact remaining count; a 3-golfer cart consumes exactly
once per golfer (3 → 0); **forced contestant-create failure** returns
non-success, releases the reservation (no burned slot) and leaves no
orphan/duplicate row.

**C. Direct REST staff paths (17 checks)** — staff Add golfer decrements by 1;
Add non-golfer does not; Add golfer at 0 capacity rejected 409 carrying the
sold-out message with capacity untouched; full-record unchanged edit allowed
(200) preserving fee and ticket relation; clearing or repointing
`conference_ticket` rejected 400 with the relation surviving; status flip via
generic PUT rejected 400; REST DELETE rejected 405 with row and capacity intact.

**D. Cancel / restore (25 checks)** — cancel without a reason rejected 400;
cancel records `cancelled_at`, `cancelled_reason`, `cancelled_by`, releases one
golf slot, preserves fee, Mulligan items and both relations; repeated cancel is
idempotent (no second slot released, original reason not overwritten);
cancelling a non-golfer leaves golf capacity alone; editing a cancelled
contestant rejected 400; restore at 0 capacity rejected 409 with the record
still cancelled; restore clears the audit fields, re-consumes exactly one slot,
and preserves fee and Mulligans; repeated restore consumes no second slot.

**E. Views, metrics, public roster (8 checks)** — Active excludes cancelled;
Cancelled returns them with fee and items intact; All returns both;
`conference-summary` excludes cancelled; public hub roster query excludes
cancelled and still returns actives; legacy `NULL` status treated as active.

**F. Whole-registration removal (6 checks)** — removal returns the active
golfer's slot to inventory, removes both child contestants, and removing an
already-cancelled golfer does **not** double-credit capacity.

---

## 7. Browser verification

Driven with Chrome DevTools MCP against the local stack. Screenshots in
`tmp/task8/screenshots/` (gitignored).

### Member Manager — light mode

| Screenshot | What it shows |
|---|---|
| `mm-light-01-contestants-active.png` | Active view, 9 rows, all `Active` chips, red **Cancel** on every row, **no Delete control anywhere** |
| `mm-light-02-contestants-cancelled.png` | Cancelled view, 2 rows (was 0 before the fix), amber `Cancelled` chips, **Restore** buttons |
| `mm-light-03-contestants-all.png` | All view, 11 rows mixed; cancelled rows keep **fee $150** and **Mulligan items**, and populate Cancelled At / Reason / Cancelled By |
| `mm-light-04-receipt-cancelled-history.png` | Registration 16554 receipt with the panel **"Cancelled Contestants — retained for refund history (3)"** listing ID, Name, Ticket, Fee, Mulligans, Cancelled At, Reason, Cancelled By |

### Member Manager — dark mode

`RaStore.theme` forced to `dark` and reloaded.

| Screenshot | What it shows |
|---|---|
| `mm-dark-01-contestants-all.png` | Same list, theme-aware cancelled-row tint (no hardcoded light colours), readable chips and buttons |
| `mm-dark-02-cancel-dialog.png` | Cancel dialog with required reason field, readable on dark surface |
| `mm-dark-03-summary-metrics.png` | Event Command Center; **Contest Corner: 6 contestants / $900** — active-only (6 × $150), with cancelled fees surfaced separately as "Contest Fees Pending Refund" |

### Interactive flows exercised in-browser

- Cancel with an empty reason is blocked (`A reason is required.`).
- Cancel with a reason: DB shows `status=cancelled`, reason and
  `cancelled_by=zztask8-verify@task8.invalid`, and golf capacity 3 → 4.
- Restore: status back to `active`, `cancelled_at`/`_reason`/`_by` cleared, and
  capacity 7 → 6 (slot re-consumed).
- Summary count reflects active-only (6 = 5 active + 1 legacy `NULL`).

### Conference Hub — public roster

Pointed at local Strapi via inline `VITE_API_ENDPOINT` (no `.env` file was
modified). The Tournament tab is hard-gated to `conference_id=3`, so exclusion
was verified against the local copy of conference 3.

- Roster before: **7 rows**, including golfer "G One".
- Cancelled "G One" via the API, reloaded: **6 rows**, "G One" gone, "G Two"
  still present — `hub-01-roster-excludes-cancelled.png`.
- Restored "G One" afterwards; conference 3 returned to
  `available_contestants = 26` and the record to `active` with null audit
  fields.

Matching API-level proof on the throwaway conference, using the hub's exact
query string: filtered → 6 rows (5 active + 1 legacy `NULL`); unfiltered → 11
rows (including all 5 cancelled).

### Conference Registration

| Screenshot | What it shows |
|---|---|
| `reg-01-contestant-step-capacity.png` | Contestants step showing **"Golf tournament: 6 spots remaining."** — exactly the DB value after cancellations returned their slots |
| `reg-02-golf-sold-out.png` | With capacity forced to 0: red **"Golf tournament is SOLD OUT — no golfer spots remain."**, Golfer option greyed with a `SOLD OUT` badge and `aria-disabled="true"`, Fisher still selectable |

With golf sold out, clicking Golfer does not select it, and Save is blocked
with the shared red toast **"Select Golfer or Fisher"**. Capacity was restored
to 6 immediately afterwards.

---

## 8. Guarded script — `--apply --rehearse-local`

The local table snapshot was taken first
(`tmp/task8/pre-rehearsal-tables.sql`, covering `conference_contestants`,
`conferences`, and the conference link table), so any writes were reversible.

```bash
STRAPI_API_ENDPOINT=http://localhost:13370/api STRAPI_API_TOKEN=… \
  npx tsx scripts/reconcile-and-cancel-golf-overage.ts --apply --rehearse-local
```

```
Mode: APPLY REHEARSAL (local API)
API base: http://localhost:13370/api
targets must be exactly 16781, 16792, 16817
```

**The apply path could not be exercised end-to-end locally, by design.** This
script is a single-use remediation for a specific past production incident: it
is pinned to conference documentId `s55n2bz60qx2c2cxg7mb6jx5`, registrations
`16781 / 16792 / 16817`, and asserted before/after values (59 active golfers,
availability −23 → −11, 12 cancellations). The local migration copy has
conference 3 under a different documentId (`kfabvdy298x07iwovvskh3qb`) and none
of those registrations, so `validateTargets` correctly refused to act.
Reproducing the incident locally would mean forging a conference documentId,
59 golfers and three pinned registration IDs — fabricating production state to
satisfy a guard whose entire purpose is to prevent acting on anything else.

What was verified instead:

| Invocation | Outcome |
|---|---|
| dry run (default) | Runs against the built-in fixture with zero writes and zero network calls: targets `16781, 16792, 16817`, 12 cancel requests, availability −23 → −11, active golfers 59 → 47 |
| `--apply --rehearse-local` with `STRAPI_API_ENDPOINT=https://admin.orwa.org/api` | **Refused** — "apply rehearsal requires apiBase === http://localhost:13370/api" |
| `--apply` (no rehearse) with a localhost endpoint | **Refused** — "apply mode requires apiBase === https://admin.orwa.org/api" |
| `--rehearse-local` without `--apply` | **Refused** — "--rehearse-local requires --apply" |

`--apply` was never pointed at production. After all rehearsal attempts, a
second dump of the same three tables was byte-identical to the snapshot apart
from the dump's own timestamp comment — **zero writes**. The script's
computation is additionally covered by 33 passing unit tests.

---

## 9. Cleanup — no temporary records or users remain

Every artifact was tagged `ZZTASK8` / `@task8.invalid`. After cleanup
(`tmp/task8/cleanup.sql`):

| Table | Residual |
|---|---|
| conferences | 0 |
| conference_contestants | 0 |
| conference_registrations | 0 |
| conference_attendees | 0 |
| conference_tickets | 0 |
| conference_extras | 0 |
| conference_teams | 0 |
| contacts | 0 |
| up_users | 0 |

Scanned every `varchar`/`text` column of those tables for `ZZTASK8` and
`task8.invalid` — zero hits. Orphan link rows pointing at deleted contestants:
0 across `conference_lnk`, `registration_lnk`, `ticket_lnk`.

Final database state: **92 active contestants, 0 cancelled, 0 NULL** — the
migrated production data, unchanged. The conference-3 probe was reverted
(`available_contestants = 26`; contestant 100 `active` with null audit fields).
The temporary Member Manager admin (`zztask8-verify@task8.invalid`) was deleted.

**No API tokens were created, deleted, rotated or modified, and no `.env` file
was touched.** The Conference Hub was pointed at local Strapi using an inline
environment variable only, and its dev server was returned to its original
configuration afterwards.

---

## 10. Blockers and deploy notes

### Deploy ordering is mandatory — Strapi first

Not a code defect, but it will break the public site if ignored. While the hub
dev server was briefly running against its default endpoint, its roster query
hit production and returned:

```
GET https://admin.orwa.org/api/conference-contestants?...&filters[$or][0][status][$eq]=active…
400 {"error":{"status":400,"name":"ValidationError","message":"Invalid key status",
     "details":{"key":"status","path":null,"source":"query","param":"filters"}}}
```

Production Strapi has no `status` field yet, and Strapi 5 rejects the unknown
filter key outright. **Conference Hub and Member Manager must not be deployed
before Strapi with the new schema and the backfill migration** — otherwise the
public Tournament roster and the Conference Manager contestants tab both fail
with 400. Only read-only GETs reached production; nothing was written.

### `apps/conference-hub/.env.development` is empty

`.env` sets `VITE_API_ENDPOINT=https://admin.orwa.org/api` and
`.env.development` is empty, so `npm run dev` on conference-hub points at
**production** by default (this is how the running dev server was found). Not
in scope for this branch and no `.env` was modified per the standing rule, but
it is a live footgun worth a follow-up.

### Stale persisted filter state self-heals

Operators who used a pre-fix build have `filterValues` in `RaStore` containing
the stacked `$or` + `status`. On reload the list shows the broken Cancelled
view once; the first click on any view toggle rewrites the filters cleanly.
Since the feature has not shipped, no migration is warranted.

### Non-blocking observation

The `SOLD OUT` ticket option in the Conference Registration contestant modal
keeps its `cursor-pointer` class while carrying `aria-disabled="true"`. It is
correctly unselectable and Save is blocked with a toast, so this is cosmetic
only.

---

## Appendix — evidence files

All under `tmp/task8/` (gitignored):

- `verify-api.mjs`, `verify-api-run2.log` — 83/83 API harness
- `mm-vitest.log`, `mm-vitest-baseline.log`, `*.fails.txt` — baseline comparison
- `strapi-vitest.log` — 166/166
- `build-strapi.log`, `build-member-manager.log`, `build-conference-hub.log`,
  `build-conference-registration.log`
- `pre-rehearsal-tables.sql`, `post-rehearsal-tables.sql` — zero-write proof
- `cleanup.sql` — teardown
- `screenshots/` — 11 browser captures

---

# Addendum — pre-deployment durability fixes

Requested after the Task 8 verification passed: five non-blocking durability
items, plus confirmation of the conference-hub deploy mapping. No production
contact; all verification against local Strapi on `:13370` and the local
migration-copy database.

## Commits

| Commit | Scope |
|---|---|
| `eabe751c` | `member-manager: serialize nested $and/$or filter groups` |
| `ec62e77c` | `member-manager: make the contestant All view a stable sentinel` |
| `91121237` | `member-manager: guard the post-cancel repaint from reporting failure` |
| `3b223ae6` | `strapi: declare the contestant lifecycle grant as testable data` |

## Requirement → implementation → verification

### 1. `invalidateResourceCache` consumer type is `Promise<void>`

`ContestantCancellationActions.tsx` declared the provider method as returning
`void` while awaiting it; the provider had already been corrected to return a
Promise. The consumer type now matches the awaited contract, with a comment
recording why (react-admin's `useDataProvider` proxy calls `.then()` on every
provider return value).

Verified by `ContestantCancellationActions.spec.tsx` and the existing
`DataProviderFactory.spec.ts` thenable test.

### 2. All is an explicit, stable sentinel end-to-end

The defect: All was encoded as *the absence of a status key*, which is exactly
how a freshly seeded list looks. `normalizeFiltersForListQuery` therefore read
it back as Active and re-applied the active clause, so the choice was lost on
the next normalization pass — the tab-change sync in `ConferenceFilters`, or any
rebuild of the list store key (which is derived from the tab filters, so it
changes whenever conference or year changes).

Now:

- `applyContestantStatusFilter` always writes `status: 'active' | 'cancelled' | 'all'`.
- `normalizeFiltersForListQuery` preserves that sentinel (and upgrades a legacy
  `$or` status clause to it) instead of stripping it.
- `expandContestantStatusForApi` — called from `getList` in `DataProviderFactory`,
  i.e. only when the API query is built — drops `all`, keeps `cancelled`, and
  expands `active` into `$or: [{status: active}, {status: null}]`.
- `preserveContestantStatusFilter` carries the view onto filters rebuilt from
  tab filters, which never carry contestant status.
- The chosen view persists in the react-admin store under
  `conference.contestantStatusView`, and seeds `filterDefaultValues`, so a
  store-key rebuild restores it without a second round trip.

Two things fell out of this that were wrong in their own right:

- **Active silently discarded an unrelated `$or`.** The active clause overwrote
  `filters.$or` wholesale, so a search clause would have been dropped and the
  result set quietly widened. It is now ANDed alongside via
  `$and: [{ $or: <unrelated> }, { $or: <status> }]`.
- **Nested boolean groups did not serialize.** `$and: [{ $or: [...] }]` fell
  through to the array-leaf branch of `appendFilterQuery` and emitted
  `[$in][]=[object Object]`, which Strapi matches nothing for. Fixed in
  `serializeStrapiFilters.ts` (`eabe751c`).

**Important correction found during this work:** an earlier draft defaulted an
absent status to Active at the provider boundary. That would have broken the
conference metrics dashboard, which deliberately fetches *every* contestant and
partitions active/cancelled client-side — cancelled fees would have vanished
from the revenue breakdown. `expandContestantStatusForApi` now expands only an
explicit sentinel and leaves status-free requests untouched, with a test naming
that caller.

### 3. Permission bootstrap is exported and asserted Admin-only

`CONTESTANT_LIFECYCLE_ROLE_GRANTS` and `configureContestantLifecyclePermissions`
are exported from `apps/strapi/src/index.ts`. `index.spec.ts` drives the real
configure function against a fake Strapi query engine and asserts that the only
role ever looked up is `{type:'admin'}`, that `public`/`authenticated` are never
targeted, that one permission row is created per action, and that a failing role
lookup warns instead of throwing.

### 4. Consumer-level regression test for the post-cancel repaint

`ContestantCancellationActions.spec.tsx` (5 tests) drives the real dialog and
asserts that a successful cancel followed by a rejected `invalidateResourceCache`
**or** a throwing `refresh` still shows exactly one success toast, zero error
toasts, issues exactly one write, and closes the dialog — and that a genuine
write failure still reports an error and leaves the dialog open for a retry.
`refresh()` is now guarded for the same reason the cache call already was.

Rendered with this app's own React 18 via `react-dom/client` rather than
`@testing-library/react`, which resolves from the workspace root's React 19 and
cannot render these elements. Fast Refresh is disabled under Vitest
(`vite.config.ts`) because its runtime expects a browser preamble jsdom never
injects.

### 5. Dead status-all paths

The unreachable `status === 'all'` strip branch in `normalizeFiltersForListQuery`
is gone; its test was repurposed to assert the opposite — that the sentinel
survives a normalization round trip. The "clears the status constraint entirely
for the all view" test became "records the all view as an explicit sentinel".

## Additional defect found and fixed: the toggle was off screen

Browser verification showed the Active/Cancelled/All control rendering at
x≈2651 — outside the viewport at any normal width. The control sits inside the
contestant table's horizontal scroll canvas (~2419px wide), so
`justifyContent: 'flex-end'` pushed it to the right edge of the *scroll width*.
The feature was effectively undiscoverable. The control is now pinned to the
visible left edge (`flex-start` + `position: sticky; left: 0`).

## Verification

Local Strapi `:13370`, local migration-copy DB (`strapi_prod`), member-manager
dev server `:4205`.

### Tests

| Suite | Result |
|---|---|
| `apps/strapi` full `vitest run` | **171/171 passed** (was 166; +5 bootstrap tests) |
| `apps/member-manager` conference + provider suites | **132/132 passed** |
| `apps/member-manager` full `vitest run` | 239 passed, 6 failed |
| `apps/strapi` `tsc --noEmit` | clean |
| `apps/member-manager` `tsc --noEmit` | 163 errors, **none in any touched file** |

The 6 member-manager failures are all `src/fields/ensureEntityIdColumn.spec.tsx`
failing with `(0 , jsxDEV) is not a function` — pre-existing and unrelated
(confirmed failing at baseline `4c6f9faf` during the original Task 8 run).
Passing tests went 216 → 239; failures went 7 → 6.

### Lint

`npx eslint` is **broken repo-wide** in member-manager, independent of these
changes: the app pins eslint 8.57.1 locally while `@typescript-eslint` 8.65 is
resolved from the root against eslint 9, producing
`Error while loading rule '@typescript-eslint/no-unused-expressions'` on every
file, including untouched ones. IDE diagnostics were used instead and report no
problems in any changed file. Flagged, not fixed — out of scope.

### API-level proof (local Strapi, real data)

Conference 3 / year 2024, 88 contestants. The three query strings were generated
by the real `applyContestantStatusFilter` → `expandContestantStatusForApi` →
`convertRaParamsToStrapiParams` chain and run against `:13370`:

| View | Query | Before cancel | After cancelling one |
|---|---|---|---|
| Active | `filters[$or][0][status][$eq]=active&filters[$or][1][status][$null]=true` | 88 | 87 |
| Cancelled | `filters[status]=cancelled` | 0 | 1 |
| All | *(no status constraint)* | 88 | 88 |

Nested-group proof: searching `first $contains Todd` **within the Active view**
(`filters[$and][0][$or][0][first][$contains]=Todd&filters[$and][1][$or][...]`)
returned 0 once Todd was cancelled, while the same search in the All view
returned 1 — the search clause and the status clause both applied, neither
overwrote the other.

### Browser (Playwright, member-manager dev server)

Screenshots in `tmp/task8b/screenshots/` (gitignored).

| Check | Result |
|---|---|
| Active view | 87 rows, "87 Records", Active pressed |
| Cancelled view | 1 row — Todd Ray, Cancelled chip, reason shown |
| All view | 88 rows = 87 Active + 1 Cancelled chips |
| Tab round trip (Contestants → Attendees → Contestants) | still All, 88 rows |
| Full page reload | still All, 88 rows, `RaStore.conference.contestantStatusView` = `"all"` |
| Dark mode | toggle and status chips legible, cancelled row keeps its warning tint |
| Restore via the UI | dialog closed, Cancelled view emptied, `POST .../restore` → 200 |
| Console errors | 0 |
| Failed requests | 0 (all API calls 200, including the restore) |
| Query sent for All | no `status` parameter — sentinel never reaches Strapi |

### Data left clean

The one contestant cancelled during verification (id 3, Todd Ray) was restored
through the UI. Final state: 92 active, 0 cancelled, `cancelled_at` /
`cancelled_reason` / `cancelled_by` all NULL — identical to the starting state.
The temporary admin user (`zztask8b@task8.invalid`) was deleted along with its
role link; 0 rows matching `task8` remain in `up_users` or
`conference_contestants`. No API tokens or `.env` files were touched.

## conference-hub deploy mapping (from the tracked script, not the docs)

Read from `apps/conference-hub/deploy.sh` — tracked, unmodified, last changed in
`edab3f94` (2026-07-29):

- **Remote:** `orwa@orwa.ssh.wpengine.net:sites/orwa/conference-hub/`
- **Public URL:** `https://orwa.org/conference-hub/`
- **SSH key:** `~/.ssh/id_ed25519`, `IdentitiesOnly=yes`
- **Build:** `npx vite build --mode production` from the app dir (not `nx build`),
  output `dist/apps/conference-hub`, `base: './'` set correctly
- **Guards:** aborts if `localhost:1337` or `localhost:13370` appears in the
  bundle; rsync excludes `.DS_Store`, `package.json`, `README.md`; no `--delete`

Two documentation/script gaps worth noting (not changed here):

1. Neither `.cursor/rules/orwa-ship-deploy.mdc` nor `AGENTS.md` lists
   conference-hub in the frontend deploy table — the docs are incomplete, so the
   script is the only source of truth for this app.
2. `deploy.sh` does **not** run `wp page-cache flush && wp cdn-cache flush`,
   which the ship rule requires after every frontend rsync. It only curls the
   live page for the bundle hash, which will report the stale hash until the WP
   Engine page cache expires.

---

# Addendum 2 — final pre-deployment findings

The two non-blocking findings raised after the durability pass. Verified against
local Strapi on `:13370` and the local migration-copy database; no production
contact.

## Commits

| Commit | Scope |
|---|---|
| `21d4c8cc` | `member-manager: keep the contestant view when filtering on a phone` |
| `1701211b` | `member-manager: stop doubling the documentId path when filtering by it` |
| `e7523826` | `member-manager: keep cancelled contestants out of the assignment pickers` |
| `34f8772c` | `member-manager: drop the inert sticky on the contestant view toggle` |

## 1. Narrow viewport preserved the status sentinel

Below the `sm` breakpoint the dashboard swaps `ConferenceFilters` for
`ConferenceAccordionFilter`, and that component applied the incoming tab's
shared filters with `omitYearForListQuery` alone. Tab filters carry no
contestant status, so a phone user switching tabs kept a toggle reading
Cancelled over a list showing every contestant — label and query disagreeing,
which is exactly the failure the sentinel work was meant to end.

It now performs the same `preserveContestantStatusFilter` →
`normalizeFiltersForListQuery` the wide sidebar does, which also supplies the
default Active view.

`ConferenceAccordionFilter.spec.tsx` (4 tests) drives the component with
react-admin stubbed: an explicit Cancelled sentinel survives applying tab
filters, All survives a Contestants → Attendees → Contestants round trip, a
contestant list with no sentinel defaults to Active, and a non-contestant list
never acquires a status key.

### Browser evidence (480×900, local dev server)

| Check | Result |
|---|---|
| Accordion filter present, sidebar absent | yes (narrow layout confirmed) |
| Contestants tab, stored view Cancelled | Cancelled pressed, 1 row (the seeded cancelled contestant) |
| Contestants → Attendees → Contestants | still Cancelled, still 1 row |
| Toggle reachable at 480px | yes, at x=78 with the page unscrolled |
| Console errors | 0 |

Screenshot: `tmp/task9/screenshots/narrow-cancelled-after-round-trip.png`.

### Related correction

The previous pass added `position: sticky; left: 0` to the view toggle. It never
did anything: the toggle's nearest scroll container is a non-scrolling
`overflow: auto` ancestor, while the dashboard as a whole scrolls sideways on
the page. Left alignment is the part that actually keeps the control on screen
(measured at 480px), so the inert declarations and the comment claiming they
pinned it are gone.

## 2. Cancelled contestants excluded from the assignment pickers

`ConferenceTeams` and `ConferenceRegistrations` each expose a picker that
attaches a contestant, and both offered every contestant regardless of status —
a cancelled contestant could be attached to a new team or registration.

Both now pass `contestantChoicesFilter(record?.contestants)`:

- Nothing linked → the `status: "active"` sentinel, which the provider expands
  into the same active-or-legacy-null clause the Active list view uses.
- Something linked → `$or: [active, null, documentId $in <linked>]`, so the
  record's own contestants stay visible.

The union is required rather than decorative. React-admin normally re-fetches
selected rows with `getMany`, but this provider returns relations populated as
whole records, and `getMany` discards non-id values — so the only thing
rendering a chip is the row's presence in the choices. A plain active filter
would have made a registration's own cancelled contestant vanish from its form.

The display-only `ReferenceArrayField` on the team list is untouched; cancelled
members still show there.

### A latent serializer bug this exposed

Filtering on `documentId` directly emitted
`filters[$or][2][documentId][documentId][$in][]=…` — the documentId rewrite
appended another `[documentId]` to a key that already was one. Strapi answers
**500 Internal Server Error** to that shape (verified live). Nothing filtered on
documentId directly before, so it had never surfaced. `isIdKey` now treats
`documentId` like `id` in all three rewrite paths.

### Query verification (live local Strapi, one contestant temporarily cancelled)

| Query | Total | Cancelled row present |
|---|---|---|
| `filters[$or][0][status][$eq]=active&filters[$or][1][status][$null]=true` | 91 | no |
| …`&filters[$or][2][documentId][$in][]=<linked>` | 92 | yes |
| …`&filters[$or][2][id][$in][]=3` | 92 | yes |
| pre-fix doubled `[documentId][documentId]` path | — | HTTP 500 |

### Tests

`listQueryFilters.spec.ts` gains 8 cases for `contestantChoicesFilter` (empty,
records, plain ids, numeric fallback, mixed shapes, blanks/duplicates, and both
directions through the API boundary). `serializeStrapiFilters.spec.ts` gains the
emitted-query test and `documentIdFilterPath` coverage.
`contestantRelationPickers.spec.tsx` (4 tests) renders both forms with
react-admin stubbed and asserts the filter each picker receives, including that
the other relation pickers on those forms stay unconstrained.

### Browser evidence (1600×1000)

| Check | Result |
|---|---|
| Team edit, cancelled member linked | chips "Kyle Engel" and "Brett Rymer" (cancelled) both render |
| Team picker, search a cancelled unlinked contestant | "No options" — cannot be assigned |
| Team picker, search an active contestant | offered |
| Registration edit, cancelled contestant linked | chips "G One" (cancelled) and "G Two" render |
| Registration picker, search a cancelled unlinked contestant | "No options" |
| Choices request issued | `$or` active/null + `documentId $in` the linked pair, HTTP 200 |

Screenshot: `tmp/task9/screenshots/registration-picker-cancelled-not-offered.png`.

Two console errors appeared on the registration receipt — `Invalid prop
children of type array supplied to ReferenceFieldView` from
`RegistrationReceipt.tsx:256`. Pre-existing and unrelated; not touched.

## Test and lint summary

| Suite | Result |
|---|---|
| `apps/member-manager` conference + provider suites | **151/151 passed** (was 132; +19) |
| `apps/member-manager` `tsc --noEmit` | 163 errors, unchanged, none in any touched file |
| `npx eslint` | still broken repo-wide (eslint 8 locally vs @typescript-eslint 8.65 from the root); IDE diagnostics clean on every changed file |

## Data left clean

The three contestants cancelled during verification (ids 3, 18, 100) were
restored: 92 active, 0 cancelled, no `cancelled_at` / `cancelled_reason` /
`cancelled_by` anywhere — identical to the starting state. The temporary admin
user and its role link were deleted; 0 rows matching `task8` or `task9` remain
in `up_users`. No API tokens or `.env` files were touched.
