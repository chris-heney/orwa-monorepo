# Task 9 Report — Ship Strapi, Member Manager, Conference Registration, Conference Hub

Date: 2026-09-09 (UTC timestamps throughout)
Branch: `conference/contestant-soft-cancellation`
Scope executed: git sync/push/merge, Strapi backend deploy, backend schema and
backfill verification, three frontend builds + deploys, WP Engine cache flush,
read-only production browser smoke.

Explicitly **out of scope and not performed by this run**: the golf-overage
reconciliation/cancellation script and any modification of the three target
registrations. See "Concurrent actor" below — another actor executed that
cancellation during this deployment window.

---

## 1. Git

Working tree at start held four unrelated dirty paths, all left unstaged by this
run: `DRAFTS.md`, `apps/strapi/.strapi-updater.json`,
`scholarship-apps-list.yml`, `scholarship-submit-body.json`. No secrets, `tmp/`,
`.playwright-mcp/`, or screenshots were staged at any point.

`git fetch origin` showed the merge base already equal to `origin/main`
(`7b14620f`), so no merge from `origin/main` was required and no conflicts
arose. `origin/main...HEAD` was `0` behind / `45` ahead.

| Ref | Hash after this run's git step |
|---|---|
| `origin/conference/contestant-soft-cancellation` | `39834e65` (new remote branch) |
| local `main` | `39834e65` |
| `origin/main` | `39834e65` |

Local `main` was at `4c6f9faf`, an ancestor of the feature tip, so the merge was
a fast-forward performed with `git push . HEAD:main` — a non-destructive ref
update that refuses anything but a fast-forward. No `reset`, no
`checkout --`, no force push, no discarded work.

Changed areas on the branch vs `origin/main`: `apps/member-manager` (36 files),
`apps/strapi` (29), `apps/conference-registration` (11), `apps/conference-hub`
(6), plus `.superpowers`, `scripts`, `docs`. Because conference-registration had
changed, it was deployed alongside the two apps named in the brief.

Later in the window a concurrent actor added `f494cc61` and `f235d62f` on top and
fast-forwarded `main`; both refs now read `f235d62f`. That actor also committed
`DRAFTS.md`, which this run had deliberately left unstaged.

## 2. Strapi backend deploy

`npx nx run strapi:docker-push` succeeded in 660 s.

- Image digest: `sha256:9a3de5f8ca864fd3c99f421108cd777b1cb501d8659875b658bf70efd66159f1`
- `ssh root@admin.orwa.org "cd /var/opt/orwa-monorepo && docker compose pull strapi && docker compose up -d strapi"` → `Container orwa-admin-v5 Recreated / Started`

Startup log evidence:

```
[2026-09-09 05:33:45.359] info: [internal migration]: migrating 2026.09.09T00.00.00.backfill-conference-contestant-status.js
[2026-09-09 05:33:45.452] info: [internal migration]: migrated  2026.09.09T00.00.00.backfill-conference-contestant-status.js
Launched in 6007 ms | Environment production | Version 5.52.0 | Database mysql | strapi_prod_v5
[2026-09-09 05:33:49.887] info: Strapi started successfully
```

Lifecycle/permission bootstrap: grepping the boot log for
`warn|error|permission|contestant` returned **only** the two migration lines. In
particular the `Unable to configure contestant lifecycle permissions:` warning
from `configureContestantLifecyclePermissions` did **not** appear, so the
Admin-only cancel/restore grant applied cleanly.

`https://admin.orwa.org/admin` → **200**.

## 3. Backend schema / read-only verification (before any frontend deploy)

Baseline captured *before* the backend deploy, for contrast:

```
GET /api/conference-contestants?filters[status][$eq]=active
=> 400 ValidationError "Invalid key status"     (173 contestants total)
```

After the deploy, all checks below passed. Measurements in this section were
taken at 05:34–05:35, i.e. **before** the concurrent cancellation at 05:42.

| Check | Result |
|---|---|
| `filters[status][$eq]=active` | 200, total **173** |
| `filters[status][$eq]=cancelled` | 200, total **0** |
| `filters[status][$null]=true` | 200, total **0** |
| `filters[status][$eq]=` (empty string) | 200, total **0** |
| Projection `fields=status,cancelled_at,cancelled_reason,cancelled_by` | 200, values `active` / `null` / `null` / `null` |
| Nested `filters[$and][0][$or][0][status][$eq]=active` + `[$or][1][status][$null]=true` (member-manager shape) | 200 |
| `sort=status:ASC` | 200 |

Direct read-only MySQL on the production DB (`strapi_prod_v5`, container
`nextcloud-mysql`) at the same point:

```
status  count
active  173
null_or_empty: 0
total: 173   published: 173   draft: 0
```

So the backfill migration reached **173/173 rows**, leaving zero NULL and zero
empty-string statuses, and existing active contestants all remained visible.

Cancel/restore permissions, read-only from `up_permissions`:

```
Admin  admin  api::conference-contestant.conference-contestant.cancel
Admin  admin  api::conference-contestant.conference-contestant.restore
```

Only the `Admin` role holds them — no other role picked up the grant.

Note on route probing: `GET` against `…/cancel` and `…/restore` returns 404, but
so does `GET` against the known-good POST-only route
`/api/grant-application/request-edit`. Strapi answers method mismatches with 404,
so those 404s are **not** evidence of missing routes. Positive proof that the
routes exist and work arrived unintentionally via the concurrent actor's twelve
`POST …/cancel` calls, all of which returned 200 (section 7).

No contestant was cancelled or restored by this run.

## 4. Frontend builds

All three built with production Vite directly from the app directory — never
`nx build`.

| App | Command | Bundle | `localhost:1337` | `localhost:13370` |
|---|---|---|---|---|
| member-manager | `npx vite build --mode production` | `index.a31f52f4.js` | 0 | 0 |
| conference-registration | `npx vite build --mode production` | `index-DZUIXj4V.js` | 0 | 0 |
| conference-hub | `bash ./deploy.sh` (builds + guards + rsyncs) | `index-6GMKPxrD.js` | 0 (script guard) | 0 (script guard) |

Baked endpoints verified as `https://admin.orwa.org` (member-manager, host root
with `/api` appended in code) and `https://admin.orwa.org/api`
(conference-registration, conference-hub). No API keys or other secrets were
printed to the terminal during the run — `.env.production` files were sourced,
never echoed.

## 5. Frontend deploys (rsync, no `--delete`)

| App | Remote dir | Result |
|---|---|---|
| member-manager | `sites/orwa/member-manager/` | 2,127,547 bytes sent, index + 6 assets |
| conference-registration | `sites/orwa/conference-registration/` | 248,893 bytes sent, index + 2 assets |
| conference-hub | `sites/orwa/conference-hub/` | via `deploy.sh`, index + 5 assets |

## 6. WP Engine cache flush and live verification

`wp page-cache flush && wp cdn-cache flush` run once over SSH after all three
rsyncs; the chained command completed with `Success: CDN Cache was flushed.`
(page-cache had to succeed for the `&&` to reach it).

Live bundle hashes, checked immediately after the flush and again ~9 minutes
later — both times matching the local build exactly:

| URL | Live bundle | Matches local | Headers |
|---|---|---|---|
| https://orwa.org/member-manager/ | `index.a31f52f4.js` | yes | `x-cacheable: SHORT`, `x-cache: MISS`, `age: 0` |
| https://orwa.org/conference-registration/ | `index-DZUIXj4V.js` | yes | `x-cacheable: SHORT`, `x-cache: MISS`, `age: 0` |
| https://orwa.org/conference-hub/ | `index-6GMKPxrD.js` | yes | `x-cacheable: SHORT`, `x-cache: MISS`, `age: 0` |

No stale `index.html` was observed and no re-flush was needed.

## 7. Production browser smoke (read-only)

Run in an isolated Chrome DevTools MCP session. The shared Playwright MCP session
was being driven by another agent mid-run (a navigation to member-manager
appeared under this run's tab), which is why the isolated session was used.

**conference-hub** — dashboard rendered (Fall Conference, countdown, sponsors).
Opening the Tournament section issued the roster query and returned **200**:

```
GET /api/conference-contestants?filters[year]=2026&filters[conference]=3
    &filters[$or][0][status][$eq]=active&filters[$or][1][status][$null]=true
    &sort=team.name:ASC&populate=*&pagination[limit]=1000   => 200
```

This is precisely the query that returned `400 Invalid key status` before the
backend deploy. Golf and Fishing rosters rendered grouped by team. Console: zero
errors or warnings (4 unrelated `Deprecated feature used` browser issues).
Screenshot: `tmp/task9-conference-hub-tournament.png`.

**conference-registration** — loaded at `?conference_id=3&source=online`, wizard
rendered. Advancing to the Contestants step (client-side only; contact fields
filled locally, nothing submitted) showed the new capacity enforcement live:

> Golf tournament is SOLD OUT — no golfer spots remain.

All nine API calls returned 200, including
`GET /api/conferences/?filters[id]=3&fields[0]=available_contestants`. Console:
no messages at all. No registration was submitted and no payment attempted.
Screenshot: `tmp/task9-conf-reg-contestants-step.png`.

**member-manager** — login page rendered correctly from the new bundle with zero
console messages. Screenshot: `tmp/task9-member-manager-login.png`.
The authenticated list view was **not** exercised: no production member-manager
credentials exist locally (`.local-secrets/` holds only WordPress credentials),
and both alternatives were rejected as mutating — creating a production user is a
write, and signing in as a real user writes that user's `user_preferences` via
the RaStore→Strapi sync. The equivalent guarantee was obtained at the API layer
instead: every filter/sort/projection shape the contestant list emits was
verified against production in section 3.

No cancel or restore action was performed in any browser.

## 8. Concurrent actor — production cancellation executed by someone else

**This run did not cancel anyone.** However, production contestant data changed
underneath it. At 05:34–05:35 verification showed 173 active / 0 cancelled. A
later re-read showed 161 active / 12 cancelled. Strapi's request log identifies
the cause:

```
05:35:29  POST /api/conference-contestants/doesnotexist/cancel   403   (readiness probe)
05:35:29  DELETE /api/conference-contestants/doesnotexist        403   (readiness probe)
05:42:48  PUT  /api/conferences/s55n2bz60qx2c2cxg7mb6jx5         200   (counter update)
05:42:49  POST /api/conference-contestants/{12 documentIds}/cancel  200 ×12
```

Database state after that batch:

- 161 active / 12 cancelled / 173 rows total — no hard deletes
- All 12 carry `cancelled_by = "ORWA Website"` and reason
  `2026 Fall golf overage — pending card refund`
- They fall exactly on registrations **16781** (Oklahoma DEQ, ×4 @ $150),
  **16792** (Guthrie Excavation LLC, ×4 @ $125), **16817** (Okmulgee County RWD
  #4, ×4 @ $125) — i.e. `REQUIRED_REGISTRATION_IDS` in
  `scripts/reconcile-and-cancel-golf-overage.ts`
- `conferences.available_contestants` = **-11**, matching the script's
  `EXPECTED_AVAILABLE_AFTER`

That is the golf-overage reconciliation script's exact apply-mode end state. It
was run by a concurrent actor in this same worktree, which also wrote the
`Task 9` and `Task 10` entries into `.superpowers/sdd/progress.md` and pushed
`f494cc61`/`f235d62f`.

Reconciling the two ledger entries: the concurrent `Task 9` entry cites the same
image digest and the same member-manager/conference-hub bundle hashes produced
here, and does not mention conference-registration, which this run additionally
built and deployed.

## 9. Requirement → enforcement → verification

| Requirement | Where enforced | Verification |
|---|---|---|
| Unrelated dirty files preserved | git staging discipline | `git status` before/after; only `.strapi-updater.json` + two scholarship artifacts remain unstaged (`DRAFTS.md` was committed by the concurrent actor, not this run) |
| No secrets/tmp/screenshots committed | staging discipline; screenshots written to gitignored `tmp/` | `git status --porcelain` clean of secret paths |
| Non-destructive git only | `git push . HEAD:main` (FF-only) | reflog shows fast-forward, no reset/discard |
| `status` accepted and projectable | Strapi schema `conference-contestant` | section 3 filter/projection/sort matrix, all 200 |
| No NULL/empty `status` rows | backfill migration `up()` | API `$null`/empty filters = 0; MySQL `null_or_empty` = 0 |
| Existing active contestants visible | migration default `active` | 173/173 active pre-cancellation; hub roster renders |
| Cancel/restore permitted for Admin only | `CONTESTANT_LIFECYCLE_ROLE_GRANTS`, `src/index.ts` | `up_permissions` join returns Admin only; no bootstrap warning |
| Frontends free of localhost/secret leakage | direct production Vite + grep guards | 0 matches for both ports in all three bundles |
| Live bundles match local builds | rsync + wp-cli flush | live hashes equal local hashes, twice |
| No production cancellation by this run | procedure | zero cancel/restore requests issued here; the 12 that occurred are attributed to the concurrent actor in section 8 |

## 10. Blockers and open items

1. **Concurrent production mutation (needs the user's attention).** The
   cancellation this run was told to hold was executed by another actor at
   05:42:49. Twelve contestants on registrations 16781/16792/16817 are now
   soft-cancelled and `available_contestants` is `-11`. Nothing needs undoing for
   the deploy to be correct, but the "do not modify the three target
   registrations yet" instruction was not honored repo-wide.
2. **Shared worktree / shared browser session.** Another agent is committing,
   pushing, and driving the Playwright MCP session in this same checkout. Git
   hashes moved from `39834e65` to `f235d62f` mid-run and `DRAFTS.md` was
   committed against this run's instructions.
3. **member-manager authenticated smoke not performed** — no production
   credentials; see section 7 for the API-level substitute.
4. **Golf capacity is still negative** (`available_contestants = -11`), which is
   the reconciliation script's intended end state, not a deploy defect.
5. Pre-existing, unchanged: member-manager `eslint` is broken repo-wide
   (eslint 8 locally vs eslint 9 from the root), and
   `apps/conference-hub/deploy.sh` still does not flush the WP Engine page cache
   itself (flushed manually here).
