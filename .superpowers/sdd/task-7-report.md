# Task 7 Report: Guarded Golf Overage Reconciliation

## RED

- Wrote `scripts/reconcile-and-cancel-golf-overage.spec.ts` before implementation.
- Observed RED with:
  - `npx vitest run scripts/reconcile-and-cancel-golf-overage.spec.ts`
  - Failure: missing `./reconcile-and-cancel-golf-overage` module.
- Added a second RED during self-review for the extra-golfer mismatch guard.
  - Failure: dry run resolved instead of rejecting a parent with an extra cancelled golfer record.

## GREEN

- Implemented `scripts/reconcile-and-cancel-golf-overage.ts`.
- Verification passed:
  - `npx vitest run scripts/reconcile-and-cancel-golf-overage.spec.ts`
  - Result: 8 tests passed.
- Fixture dry run passed:
  - `npx tsx scripts/reconcile-and-cancel-golf-overage.ts`
  - Result: fixture mode, zero writes, zero network calls, 12 planned cancel requests.
  - Evidence: active golfers `59 -> 47`; availability `-23 -> -11`.
- Lints: no diagnostics reported for the new script or spec.

## Safety Design

- Default command is safe-by-default fixture dry run: no production network calls and no writes.
- Live read-only validation requires `--live`; apply requires `--apply`.
- Credentials are loaded only at runtime from existing local env files or process env and are never embedded or printed.
- Fixed allowlist is hardcoded to registration IDs `16781`, `16792`, and `16817`; all other IDs and missing IDs are refused.
- Pending-state guards require:
  - active golfer count exactly `59`;
  - maximum `36`, yielding target availability `-23`;
  - exactly 4 active golfer records and exactly 4 total golfer records on each allowed parent.
- Completed-state guard supports idempotent rerun only when all 12 target golfers are already cancelled, active golfer count is `47`, and availability is `-11`.
- Apply mode uses only supported deployed APIs:
  - one narrow `PUT /conferences/:documentId` for `available_contestants`;
  - one `POST /conference-contestants/:documentId/cancel` per target contestant.
- The script does not call refund, invoice, payment, total mutation, or email endpoints.
- Apply mode stops on first unexpected cancel response, then re-fetches and verifies totals, payment references, fees, Mulligans, status, active count, and availability.
- Non-secret audits are written under `tmp/golf-overage-2026-fall/`.

## Requirement Mapping

- Fixed allowlist: `validateTargets()`; verified by unit tests.
- Active golfer semantics: shared contains-`Golfer` style predicate in the script; verified by count/availability tests and operation fixture tests.
- Expected before state `59` active and `-23` target availability: `requireFreshPendingState()`; verified by dry-run/apply tests.
- Exactly 4 active golfers per target parent: parent summary guards; verified by mismatch test.
- Refuse extra golfer records: total golfer guard; verified by observed RED then GREEN regression test.
- Dry run makes no writes: injected client write methods remain uncalled; verified by dry-run test and fixture command output.
- Apply uses counter update then cancel endpoint: operation runner call order/scope; verified by apply test.
- No totals/payments/fees/Mulligans drift: after-apply verification functions; covered through operation path and fixture shape.

## Dry-Run Evidence

- Command: `npx tsx scripts/reconcile-and-cancel-golf-overage.ts`
- Mode: fixture dry run, zero writes, zero network calls.
- Latest generated audit files:
  - `tmp/golf-overage-2026-fall/2026-09-08T22-12-38-490Z-dry-run.json`
  - `tmp/golf-overage-2026-fall/2026-09-08T22-12-38-490Z-dry-run.md`

## Commit

- Commit subject: `scripts: add guarded golf cancellation operation`
- Commit hash: `10b70ed3`

## Self-Review / Concerns

- Production was not contacted, per instruction.
- The live API path is implemented but intentionally untested against production in this task.
- The script assumes the deployed Strapi core `PUT /conferences/:documentId` route accepts a documentId, consistent with current Strapi v5 document routes in this repo.
- The audit records payment references as non-secret registration fields only (`payment_method`, `wp_eid`, `passport_id`), not card or token data.

## Review Follow-Up RED

- Added review-driven failing tests before implementation.
- Observed RED with:
  - `npx vitest run scripts/reconcile-and-cancel-golf-overage.spec.ts`
  - Result: 20 tests, 15 failed, 5 passed.
- Key RED failures covered:
  - exact reason literal was missing the em dash;
  - dry-run projected after state kept active target golfers active;
  - partial rerun with already-cancelled rows was rejected instead of resumed;
  - already-cancelled wrong-reason rows did not get the intended exact-reason error;
  - missing/positive `available_contestants` was accepted;
  - counter recheck ordering was absent;
  - already-reconciled counter still performed an absolute PUT;
  - completed-state no-op audit lacked an explicit no-op reason;
  - HTTP client helpers were not exported;
  - nested `items` population and active-count client filtering were missing;
  - unknown CLI flags and unsafe apply API bases were not rejected;
  - HTTP errors lacked response body evidence and timeout signal assertion.

## Review Follow-Up GREEN

- Verification passed:
  - `npx vitest run scripts/reconcile-and-cancel-golf-overage.spec.ts`
  - Result: 20 tests passed.
- Fixture dry run passed:
  - `npx tsx scripts/reconcile-and-cancel-golf-overage.ts`
  - Result: fixture mode, `API base: (fixture)`, zero writes, zero network calls, 12 planned cancel requests.
  - Evidence: active golfers `59 -> 47`; availability `-23 -> -11`.
- Latest generated dry-run audit:
  - `tmp/golf-overage-2026-fall/2026-09-08T22-25-58-986Z-dry-run.json`
  - `tmp/golf-overage-2026-fall/2026-09-08T22-25-58-986Z-dry-run.md`
- Lints: no diagnostics reported for the new script or spec.

## Reviewer Checklist

- H1 Mulligans: fixed by replacing `fields=items` with nested `populate[contestants][populate][items]` for `key`, `label`, `value`, `selection`, and related `item` fields. Tests assert the generated HTTP query and realistic Strapi REST fixture item shape. Missing `items` now fails separately from an empty `items: []` array. Before/after summaries preserve exact `itemsSnapshot` for all target golfers.
- H2 counter safety: fixed by requiring stored `available_contestants` to exist and be non-positive, deriving the target from active count, re-fetching immediately before an absolute PUT, aborting if that value changed, re-fetching after PUT, and requiring the target. The absolute PUT only runs before the first cancellation and only when stored differs from derived target. This is documented as a quiet-window recheck, not true DB CAS.
- M1 canonical predicate: fixed by importing and using `countsAgainstGolfCapacity` from the Strapi webhook helper.
- M2 resume safety and preflight: fixed by allowing partial rerun only when each target registration still has exactly 4 total authorized golfers and already-cancelled rows have the exact required reason plus timestamp. Expected active count is `59 - alreadyCancelledTargetCount`; only remaining active targets are cancelled. Apply mode performs a non-mutating permission/readiness preflight before writes. Tests cover kth cancel failure and resumable completion.
- M3 apply API/CLI safety: fixed by requiring `apiBase === https://admin.orwa.org/api` for `--apply`, requiring `/api` suffix in live modes, rejecting unknown CLI flags, printing API base but never the key, and resolving env/audit paths from repo-root absolute paths.
- M4 cancellation audit fields: fixed by carrying `cancelled_at`, `cancelled_reason`, and `cancelled_by` into summaries/audits and requiring all 12 post-apply rows to have exact reason and non-null timestamp.
- M5 exact reason: fixed to `2026 Fall golf overage — pending card refund`; tests assert the literal.
- Low dry-run consistency: fixed projected after state so target golfer statuses/counts become cancelled in dry-run summaries.
- Low completed-state audit: fixed completed rerun to emit an explicit no-op reason.
- Low HTTP robustness: fixed timeout signaling and response-body error messages.
- Low pagination robustness: fixed active-count pagination to continue until exhausted with a sane high ceiling.
- Low operation ordering: tested counter recheck/update/recheck before the first cancel request.
- Legacy active count: fixed by fetching scoped contestant rows without `status=active` filter and filtering client-side so `active`, null, and missing statuses count as active while `cancelled` does not.
- Out-of-band maximum: kept explicit as `36` and included in audit output.

## Follow-Up Commit

- Commit subject: `scripts: harden golf cancellation operation`
- Commit hash: `9171f9bb`

## Second Review RED

- Added second-review failing tests before implementation across:
  - `scripts/reconcile-and-cancel-golf-overage.spec.ts`
  - `apps/conference-registration/src/helpers/golfCapacity.spec.ts`
  - `apps/strapi/src/api/conference-webhook/helpers/contestant-capacity.spec.ts`
- Observed RED with:
  - `npx vitest run scripts/reconcile-and-cancel-golf-overage.spec.ts apps/conference-registration/src/helpers/golfCapacity.spec.ts apps/strapi/src/api/conference-webhook/helpers/contestant-capacity.spec.ts`
  - Result: 45 total tests, 22 failed, 23 passed.
- Added final audit-shape RED with:
  - `npx vitest run scripts/reconcile-and-cancel-golf-overage.spec.ts`
  - Result: 29 script tests, 3 failed.

## Second Review GREEN

- Covering specs passed:
  - `npx vitest run scripts/reconcile-and-cancel-golf-overage.spec.ts apps/conference-registration/src/helpers/golfCapacity.spec.ts apps/strapi/src/api/conference-webhook/helpers/contestant-capacity.spec.ts`
  - Result: 48 tests passed.
- Fixture dry run passed:
  - `npx tsx scripts/reconcile-and-cancel-golf-overage.ts`
  - Result: fixture mode, `API base: (fixture)`, zero writes, zero network calls, 12 planned cancellations.
  - Evidence: active golfers `59 -> 47`; availability `-23 -> -11`.
- Latest generated dry-run audit:
  - `tmp/golf-overage-2026-fall/2026-09-08T22-41-30-245Z-dry-run.json`
  - `tmp/golf-overage-2026-fall/2026-09-08T22-41-30-245Z-dry-run.md`
- Lints: no diagnostics reported on the touched script/spec/helper files.

## Second Reviewer Checklist

- H1 target contestant conference: fixed by populating each contestant's own `conference` fields and asserting target conference, parent conference, and each target golfer conference match the pinned Fall conference identity before any write. Mismatch test proves zero counter/cancel writes.
- M1 local rehearsal: fixed with explicit `--apply --rehearse-local`, allowing only `http://localhost:13370/api`; ordinary `--apply` remains pinned to `https://admin.orwa.org/api`. Endpoint prints; keys never print.
- M2 active pagination: fixed by sorting active-count pages by `id:ASC`, collecting documentIds in a `Set`, and failing on duplicate or missing documentIds. Multipage tests cover this.
- M3 readiness check: fixed by removing `/users/me`; the API client now performs a non-mutating contestant readiness GET. Report/audit caveat states cancel permission must be verified by local rehearsal and production role inspection before production apply. Tests cover first-cancel failure after counter reconciliation and safe resume.
- M4 inherited predicate: fixed both canonical helpers so any ticket name containing `Golfer` counts regardless of context. Frontend and Strapi tests prove null-context `Golfer - Contestant Only` counts.
- M5 post-counter recount: fixed by re-fetching/recounting after counter PUT and immediate stored-value check, requiring the active golfer count to remain unchanged before the first cancellation. Ordering test covers recheck, PUT, recheck, recount, then first cancel.
- Repo root: fixed env/audit resolution from `import.meta.url` instead of caller cwd; audits always write under repo `tmp`.
- Conference identity: fixed with explicit target conference id/documentId/name guard surfaced in audits. Production values still require runtime verification before live apply because production was not contacted.
- Audit detail: fixed Markdown audit to include cancellation metadata context plus a per-golfer fee/Mulligan evidence table. JSON audit stores sanitized response audit only, not raw endpoint responses.
- Mulligan extraction: fixed to detect `key`, `label`, and related `item.name` shapes.
- Stale test names: renamed the partial-rerun test to describe the behavior accurately.
- Defense in depth allowlist: operation core still validates the fixed target IDs and API fetch validates returned IDs.
- Local rehearsal coverage: script tests cover apply-path ordering, partial failure, resume, readiness-only endpoint, and no unintended `/users/me` endpoint.

## Second Follow-Up Commit

- Commit subject: `scripts: close golf cancellation production gates`
- Commit hash: `5fa2dcae`

## Final Review RED

- Added final-review failing tests before implementation across:
  - `scripts/reconcile-and-cancel-golf-overage.spec.ts`
  - `apps/conference-registration/src/helpers/golfCapacity.spec.ts`
  - `apps/strapi/src/api/conference-webhook/helpers/contestant-capacity.spec.ts`
  - `apps/strapi/src/api/conference-webhook/controllers/conference-webhook.matrix.spec.ts`
- Observed RED with:
  - `npx vitest run scripts/reconcile-and-cancel-golf-overage.spec.ts apps/conference-registration/src/helpers/golfCapacity.spec.ts apps/strapi/src/api/conference-webhook/helpers/contestant-capacity.spec.ts apps/strapi/src/api/conference-webhook/controllers/conference-webhook.matrix.spec.ts`
  - Result: 69 tests total, 7 failed, 62 passed.
- Added final failure-audit PII RED:
  - `npx vitest run scripts/reconcile-and-cancel-golf-overage.spec.ts`
  - Result: 32 script tests, 1 failed.

## Final Review GREEN

- Full related suites passed:
  - `npx vitest run scripts/reconcile-and-cancel-golf-overage.spec.ts apps/conference-registration/src/helpers/golfCapacity.spec.ts apps/strapi/src/api/conference-webhook/helpers/contestant-capacity.spec.ts apps/strapi/src/api/conference-webhook/controllers/conference-webhook.matrix.spec.ts apps/strapi/src/api/conference-contestant/controllers/conference-contestant.spec.ts apps/strapi/src/api/conference-contestant/services/contestant-cancellation.spec.ts`
  - Result: 87 tests passed.
- Fixture dry run passed:
  - `npx tsx scripts/reconcile-and-cancel-golf-overage.ts`
  - Result: fixture mode, `API base: (fixture)`, zero writes, zero network calls, 12 planned cancellations.
  - Evidence: active golfers `59 -> 47`; availability `-23 -> -11`.
- Read-only production dry run passed:
  - `npx tsx scripts/reconcile-and-cancel-golf-overage.ts --live`
  - Result: dry run only, no writes, `API base: https://admin.orwa.org/api`, 12 planned cancellations.
  - Evidence: active golfers `59 -> 47`; current counter `-20`, reconciliation target `-23`, final target `-11`.
- Latest fixture audit:
  - `tmp/golf-overage-2026-fall/2026-09-08T22-57-51-807Z-dry-run.json`
  - `tmp/golf-overage-2026-fall/2026-09-08T22-57-51-807Z-dry-run.md`
- Latest read-only production audit:
  - `tmp/golf-overage-2026-fall/2026-09-08T22-56-49-632Z-dry-run.json`
  - `tmp/golf-overage-2026-fall/2026-09-08T22-56-49-632Z-dry-run.md`
- Lints: no diagnostics reported on touched files.

## Production Read-Only Findings

- API base: `https://admin.orwa.org/api`.
- Target conference: id `3`, documentId `s55n2bz60qx2c2cxg7mb6jx5`, name `Fall Conference`.
- Current `available_contestants`: `-20`.
- Target parent registrations:
  - `16781`, year `2026`, organization `Oklahoma Department of Environmental Quality`, 4 Golfer contestants.
  - `16792`, year `2026`, organization `Guthrie Excavation LLC`, 4 Golfer contestants.
  - `16817`, year `2026`, organization `Okmulgee County Rural Water District #4`, 4 Golfer contestants.
- Target contestant tickets: `Golfer` with `Contestant` context on all 12 target golfers.
- Conference/year scoped active golfer count: `59`.
- Ticket-context count from production scoped rows:
  - `Golfer|Contestant`: `54`
  - `Golfer - Contestant Only|Contestant`: `5`
- Read-only production query shape validated after removing pre-deploy-only `status` field requests from the parent registration read.

## Final Reviewer Checklist

- H1 real identity: fixed by read-only discovery and pinning exact production-observed conference id/documentId/name. Script tests assert these values.
- H2 year scope: fixed active golfer pagination to filter by conference and `year=2026`; client also ignores cross-year rows defensively. Tests cover cross-year exclusion.
- H3 failure audit: fixed apply/rehearsal catch path to write sanitized partial audit before rethrow with planned target ids, completed sanitized cancel responses, current phase, and redacted error message. Test covers kth cancel failure audit.
- M1 routing/gate/decrement: fixed backend `isContestantTicket` fallback to recognize names containing Golfer/Fisher/Contestant case-insensitively, kept `countsAgainstGolfCapacity` gated by that routing, and mirrored frontend routing/gate behavior. Helper and webhook matrix tests cover null-context standalone golfer routing/decrement/gate alignment.
- M2 operation allowlist: fixed operation core to validate actual `before.registrations.map(id)` before summary/write paths. Malicious snapshot test proves zero writes.
- M3 rehearse flag: fixed parser so `--rehearse-local` is valid only with `--apply`; local rehearsal apply permits only `http://localhost:13370/api`; ordinary apply remains production-pinned. Tests cover this.
- Low pagination metadata: fixed active pagination to fail closed if pagination metadata is missing.
- Low API-token actor caveat: audit caveat states cancel endpoint actor under API-token auth is the token identity; permission must be verified by local rehearsal and production role inspection before production apply.
- Low constant naming: expected constants now represent observed operation semantics with target conference/year constants pinned separately.

## Final Follow-Up Commit

- Commit subject: `scripts: pin golf cancellation production gates`
- Commit hash: `dcfb3d30`

## Final Blocking Defect / Lifecycle Bypass Follow-Up RED

- Script status projection RED:
  - Added an assertion that the active-golfer live query projects `status` while still avoiding a brittle `filters[status]`.
  - Observed failure: generated URL lacked `fields[2]=status`.
- Ticket matching RED:
  - Added frontend/backend tests for contextless `Golfer - Contestant Only`.
  - Added negative tests proving `Non-Golfer Guest` does not classify as `Contestant` or consume golf capacity.
  - Observed failures: previous `includes("golfer")` semantics misclassified `Non-Golfer Guest`.
- Generic REST lifecycle/capacity RED:
  - Added service tests for direct lifecycle field rejection, relation-change rejection, sold-out golfer create, successful golfer create with one decrement, contextless `Golfer - Contestant Only`, non-golfer create, and cancelled-record read-only updates.
  - Added controller tests proving REST `create`/`update` route through the lifecycle service and map errors safely.
  - Observed failures: controller had no custom create/update and service did not enforce these invariants.
- Metric RED:
  - Added pure revenue derivation test proving `$1,600` cancelled/pending-refund contestant fees are separated instead of being folded into `Tickets & Extras`.
  - Observed failure: helper did not exist and previous residual math would mislabel cancelled contestant fees.

## Final Blocking Defect / Lifecycle Bypass Follow-Up GREEN

- Script:
  - Active-golfer pagination now requests `documentId`, `year`, and `status`, filters by conference and `year=2026`, and still counts null/missing status as active in fixtures.
  - Audit summaries now preserve registration payment lookup keys: registration id, payer email, amount, registration date, payment method.
  - Transaction rows are not guessed because `conference-transaction` has no durable registration relation.
  - Task 10 production dry-run command now uses `--live`.
- Strapi:
  - Generic contestant REST create/update now rejects direct writes to `status`, `cancelled_at`, `cancelled_reason`, and `cancelled_by`.
  - Direct golfer creates gate against `available_contestants` and decrement once inside the transaction path.
  - Direct update rejects `conference` and `conference_ticket` relation changes with the cancel-and-create instruction.
  - Cancelled contestants are read-only through generic update.
  - Hard DELETE remains blocked.
  - Webhook team creation now uses the shared golfer capacity predicate instead of exact `name === "Golfer"`.
- Frontend / Member Manager:
  - `ticketMatchesContext` now uses token semantics and rejects negated `Non-Golfer` names.
  - Frontend golf capacity mirrors backend semantics.
  - `StepContestants` team-name semantics use shared golfer capacity logic.
  - Existing Member Manager contestant edit forms disable and omit locked conference/ticket relation fields; create still allows staff Add Contestant.
  - Conference revenue splits active contestant fees from cancelled pending-refund contestant fees.
- Verification:
  - Targeted follow-up suite: 80 tests passed.
  - Full requested covering suite: 15 test files, 143 tests passed.
  - Fixture dry run passed: 12 planned cancellations, active golfers `59 -> 47`, availability `-23 -> -11`.
  - Read-only live dry run performed no writes and failed closed because current production rejects `fields[2]=status` until the lifecycle schema/API is deployed.
- Commits:
  - `8401d58e` — `scripts: require live golf preflight status`
  - `d1c74171` — `strapi: enforce contestant rest lifecycle`
  - `e86c6e10` — `conference: align golfer metrics and forms`

## Remaining Concern

- Production `--live` now intentionally requires the `status` projection. Current production returned HTTP 400 `Invalid key status`, so Task 10 production preflight must be run only after the lifecycle schema/API deploy that makes `status` readable on `conference-contestants`. No production writes were made.

## Combined Review Follow-Up RED

- B1 unified predicate RED:
  - Added exhaustive golden tests on backend and frontend for `Golfer`, `Golfer - Contestant Only`, case variants, `Golfers Team`, `Non-Golfer Guest`, `Non Golfer`, and `Golfer Spouse (Non-Golfer)`.
  - Observed failure: frontend capacity still counted explicit Contestant-context negated names; backend did not count plural golfer names.
- B2 Content Manager/document-service bypass RED:
  - Added lifecycle hook tests proving direct status flips, relation repoints, direct creates, and hard deletes are blocked outside explicit internal contexts.
  - Observed failure: lifecycle hook/context files were absent.
- I1/I2 direct create RED:
  - Added service tests for ticket/conference mismatch and missing/wrong year.
  - Observed failure: direct create persisted and decremented without those validations.
- I4/I5 controller RED:
  - Added controller tests for exact `ContestantCapacityError.message` passthrough and `sanitizeInput` before custom create/update service calls.
  - Observed failure: custom create/update skipped `sanitizeInput` and returned generic capacity text.
- I3 member-manager RED:
  - Added `contestantFormDefaults` tests for scalar conference/year defaults.
  - Added `createRecord` test for surfacing backend error messages.
  - Observed failure: helper did not exist and generic create errors hid backend detail.

## Combined Review Follow-Up GREEN

- B1:
  - Backend and frontend now use mirrored token semantics: golfer/golfers tokens count, but `Non-Golfer`/`Non Golfer` negations suppress golf capacity even under Contestant context.
  - Cross-layer imports were avoided; helpers are mirrored per app.
- B2:
  - Added AsyncLocalStorage lifecycle context for explicit internal transitions.
  - Content-type lifecycle blocks direct lifecycle field writes, relation repoints, direct creates outside guarded REST create, and hard deletes outside whole-registration cleanup.
  - Cancel/restore use the lifecycle transition context; whole-registration cleanup uses the hard-delete context only for contestant children.
- I1/I2:
  - Direct create now validates selected conference, integer year, conference cycle year, selected ticket existence, and selected ticket belongs to selected conference before any create/decrement.
- I3:
  - Member Manager Add Contestant defaults conference/year as scalars.
  - `createRecord` prefers backend error messages when available.
- I4/I5:
  - Custom create/update run `sanitizeInput` before service calls.
  - `ContestantCapacityError` messages are returned exactly through conflict responses.
- Payment evidence:
  - Operation audit preserves explicit lookup keys and documents that conference transaction rows have no durable registration relation; transaction rows remain untouched and unmatched.
- Verification:
  - Focused combined-review suite: 70 tests passed.
  - Full related suite plus fixture dry run: 18 files, 169 tests passed.
  - Read-only production `--live` made no writes and failed closed on current production `fields[2]=status` until schema/API deploy.
- Commits:
  - `d09e2a54` — `conference: mirror golfer ticket semantics`
  - `099dd896` — `strapi: block contestant lifecycle bypasses`
  - `bcf33399` — `member-manager: clarify contestant create errors`

## DO NOT SHIP Review Follow-Up RED

- Blocking 1 webhook lifecycle regression:
  - Added webhook matrix coverage that runs the real `conference-contestant` lifecycle `beforeCreate` guard around Document Service contestant creation.
  - Added a post-charge mixed-cart regression that forces contestant create failure and proves the controller does not return success and calls `reportWebhookFailure`.
  - Observed failure before fix: guarded contestant creates would be rejected unless the webhook used the narrow internal create context.
- Blocking 2 lifecycle registration proof:
  - Added a unit assertion that the content-type lifecycle module exports `beforeCreate`, `beforeUpdate`, and `beforeDelete` hooks.
  - This is not a runtime boot claim; Task 8 still needs a real Strapi boot test.
- Blocking 3 staff Add numeric relation:
  - Added service tests proving direct REST create accepts both numeric entity IDs and documentIds for `conference` and `conference_ticket`.
  - Observed failure: numeric IDs were treated as documentIds and the selected conference was not found.
- Important 4 typed public errors:
  - Added controller tests proving typed domain validation errors map to clear public 400/404 responses, while `ContestantCapacityError` remains exact 409 plain-language text.
- Important 5 contextless routing:
  - Added mirrored frontend/backend tests rejecting `Attendee + Contestant` while still accepting context-null labels beginning with `Golfer`, `Fisher`, or `Contestant`.
  - Observed failure: broad token matching routed `Attendee + Contestant`.
- Important 6 Content Manager update lifecycle:
  - Added lifecycle tests proving unchanged relation payloads are permitted for ordinary edits, including `{ set: [...] }`, numeric ID, and documentId shapes, while actual repoints are rejected.
- Important 7 whole-registration capacity drift:
  - Added service tests proving active golfer hard-delete restores one slot before delete, non-golf/already-cancelled contestants do not alter capacity, and delete is blocked if restoration fails.
- Important 8 year validation:
  - Added direct-create test proving conferences without usable cycle dates fail closed.
  - Added client-side required validation for Member Manager Add Contestant `year`.
- Important 9 updateRecord error surfacing:
  - Added `updateRecord` test proving backend error messages are shown instead of generic update text.

## DO NOT SHIP Review Follow-Up GREEN

- Webhook creates:
  - Legitimate webhook contestant Document Service creates are wrapped in `withContestantRestCreate`.
  - The webhook matrix fake Document Service invokes the real lifecycle guard, proving contestant creation, team behavior, and golf capacity decrement still work under the guard.
  - Post-charge contestant create failures now remain visibly failed in test coverage through existing outer error/report handling.
- Direct REST writes:
  - Direct create uses numeric/documentId-compatible lookup via `findOneById` for numeric relation IDs, validates conference/ticket ownership before create/decrement, requires integer `year`, and rejects missing conference cycle dates.
  - Domain validation now uses `ContestantDomainError` with safe status/message rather than keyword-only mapping.
- Lifecycle updates:
  - Content Manager/document-service updates compare requested `conference`/`conference_ticket` values to the current row and reject only real repoints.
  - Lifecycle transition permission is separated from relation-repoint permission.
- Whole-registration cleanup:
  - Registration removal now calls `hardDeleteContestantForRegistrationRemoval`; active golfer children restore capacity before the hard delete is allowed.
  - Existing hard-delete behavior remains destructive for whole-registration removal; this round prevents slot leakage but does not convert that operation to soft delete.
- Frontend / Member Manager:
  - Context-null routing uses safe prefix/token semantics in frontend and backend mirrors.
  - Add Contestant year has required validation.
  - `updateRecord` now surfaces backend messages like `createRecord`.
- Verification:
  - Focused RED/GREEN suite: 9 files, 101 tests passed.
  - Full related suite: 13 files, 140 tests passed.
  - Webhook matrix with real lifecycle guard: 19 tests passed.
  - Fixture dry run: zero network/writes, 12 cancel requests, active golfers `59 -> 47`, availability `-23 -> -11`.
- Commit:
  - `c48ff591` — `strapi: harden contestant lifecycle writes`

## NO-SHIP A/B and Important C-E RED

- A create defaults:
  - Added lifecycle tests that run realistic Strapi schema-defaulted create data through `beforeCreate`: `status: active` plus null cancellation metadata.
  - Observed failure: guarded REST/webhook creates were rejected as lifecycle bypasses when schema defaults were injected.
  - Added negative coverage for `status: cancelled` and non-null cancellation metadata during guarded create.
- B edits:
  - Added lifecycle and REST service tests for react-admin-style full-record updates carrying unchanged `status: active` and null cancellation audit fields.
  - Added negative coverage for active-to-cancelled and cancellation metadata edits outside cancel/restore actions.
  - Observed failure: both layers rejected any lifecycle field presence, even unchanged values.
- C atomic hard delete:
  - Added hard-delete tests proving active golfer capacity restore and Document Service delete happen in one transaction.
  - Added delete-fails-after-increment rollback and retry coverage.
  - Observed failure: delete occurred after the transaction, so a delete failure left the restored slot committed.
- D relations:
  - Added REST service tests for full-record relation round-trips using numeric IDs, documentIds, object, and `{ set: [...] }` shapes.
  - Added negative coverage for true conference/ticket repoints.
  - Observed failure: REST update rejected any submitted `conference` or `conference_ticket`, even unchanged values.
- E year:
  - Added direct-create test where registration opens in the prior calendar year but event `start_date`/`end_date` are in the current event year.
  - Observed failure: cycle-year validation picked `registration_start` first and rejected the valid event year.
- Member Manager full-record helper:
  - Added helper coverage proving edit payload shaping strips locked relation fields but preserves unchanged lifecycle defaults for backend comparison.

## NO-SHIP A/B and Important C-E GREEN

- A create defaults:
  - `beforeCreate` now permits only safe Strapi defaults in legitimate `withContestantRestCreate` context: `status` normalized to active and null/absent cancellation metadata.
  - Guarded creates still reject cancelled status and non-null `cancelled_at`, `cancelled_reason`, or `cancelled_by`.
- B edits:
  - Lifecycle and REST service update paths now load the current contestant and reject only actual lifecycle transitions/metadata modifications.
  - React-admin full-record round-trips with unchanged active/null lifecycle fields are allowed.
- C atomic hard delete:
  - Whole-registration contestant hard delete now lock-loads the contestant, restores active golfer capacity, and performs the Document Service delete under `withContestantHardDelete` inside one `strapi.db.transaction`.
  - Delete failure rolls back the capacity increment in test and retries cleanly.
- D relations:
  - REST update compares submitted `conference` and `conference_ticket` against the current row and accepts unchanged numeric/documentId/object/set shapes.
  - Actual repoints still fail with the cancel-and-create instruction.
- E year:
  - Cycle-year derivation now prefers event `start_date`/`end_date`; registration window dates are fallback only.
  - Direct staff create and webhook current-year behavior now agree for events whose registration opens in the prior year.
- Verification:
  - New blocker suite: 4 files, 30 tests passed.
  - Full related suite: 13 files, 147 tests passed.
  - Fixture dry run: zero network/writes, 12 cancel requests, active golfers `59 -> 47`, availability `-23 -> -11`.
  - Diagnostics: no linter errors on touched files.
- Remaining concern:
  - Local unit lifecycle export assertion remains in place, but real Strapi boot verification is still deferred to Task 8 as requested.

## Webhook Race NO-SHIP Follow-Up RED

- Mixed-cart contestant failure:
  - Fixed the regression test to use an Attendee/Vendor-style mixed cart (`registration_type: Attendee`) with an attendee line plus a golfer contestant line.
  - Observed failure: `handleContestants` was wrapped in `runSafely`, so post-charge contestant create failure still returned success.
- Atomic capacity reservation:
  - Added race coverage for two simultaneous card requests with one remaining golfer slot.
  - Added payment-failure and contestant-create-failure tests proving reserved slots release exactly once and the response is not success.
  - Added success coverage proving one golfer success decrements capacity once, not again in `handleContestants`.
  - Observed failure: both concurrent requests reached payment/success because capacity was checked from stale request-start data and decremented later.
- Relation clears:
  - Added lifecycle and REST service tests proving explicit `null`, empty `{ set: [] }`, and disconnect-like relation clears are rejected while absent keys remain no-op and unchanged values are allowed.
  - Observed failure: explicit clears normalized to `null` and were treated as unchanged.
- Hard delete duplicate/concurrency:
  - Added hard-delete coverage requiring a contestant-row lock before active-state checks and proving duplicate whole-registration delete attempts return exactly one slot.
  - Observed failure: the service could active-check the same contestant twice and increment capacity twice.
- Year alignment:
  - Added shared helper tests for event `start_date`/`end_date` precedence, registration-window fallback, and current-year fallback when dates are absent.
  - Direct create tests cover registration opening in the prior year while the event year is current.
- Capacity error mapping:
  - Added controller coverage for `ContestantCapacityError` messages that start with `Only N golfer...`, proving they map to 409 instead of keyword/generic fallback.

## Webhook Race NO-SHIP Follow-Up GREEN

- Mixed-cart failures:
  - Attendee/Vendor branch no longer wraps `handleContestants` in `runSafely`; contestant creation/capacity failures are critical and return non-success.
- Atomic reservation:
  - Webhook now reserves golfer slots before card/invoice processing and before registration writes using one conditional SQL decrement when capacity is configured.
  - Null `available_contestants` remains uncapped.
  - Reservation is tracked per request and released exactly once on payment failure or critical post-reservation write failure.
  - The old decrement at the end of `handleContestants` was removed, so successful requests consume capacity once.
  - No DB transaction is held open around external payment.
- Relation clears:
  - Lifecycle and REST service relation comparison now distinguishes absent relation keys from explicit clear/disconnect payloads.
  - Numeric, string, documentId, object, and `{ set: [...] }` unchanged relation shapes remain accepted.
- Hard delete:
  - Whole-registration hard delete locks the contestant row and conference row in the same transaction before active golfer slot restoration and Document Service delete.
  - Delete failure rolls back the capacity increment in tests; retry restores exactly once.
- Year alignment:
  - Added shared `conferenceCycleYear` helper and used it in direct staff create and webhook contestant year writes.
  - Event dates are authoritative; registration dates are fallback; no-date conferences use current year consistently.
- Verification:
  - Targeted race/lifecycle suite: 6 files, 71 tests passed.
  - Full requested suite: 14 files, 157 tests passed.
  - Fixture dry run: zero network/writes, 12 cancel requests, active golfers `59 -> 47`, availability `-23 -> -11`.
  - Diagnostics: no linter errors on touched files.

## Migration / Settlement NO-SHIP Follow-Up RED

- B1 migration/backfill:
  - Added executable migration tests for migration-before-schema-sync semantics: no-op when table is absent, create `status` when table exists without the column, backfill `NULL`/empty to `active`, preserve `cancelled`, and remain idempotent.
  - Added Member Manager and server summary tests requiring default active contestant views to query `$ne: cancelled` so legacy null rows cannot disappear.
  - Observed failure: Member Manager and server summary used `status: active`, excluding legacy NULL rows.
- B2 reservation settlement:
  - Added matrix tests for `4 reserved / 3 persisted / 1 fails => release 1`, team failure after all four golfer rows persisted releases zero, payment failure releases all, and success does not release/double-decrement.
  - Observed failure: reservation release returned the full reserved count on any failure, even after some golfer rows had persisted.
- I1 relation clear:
  - Added lifecycle and REST service tests showing empty `disconnect: []` with unchanged `connect`/`set` is not a clear, while explicit null/empty set remain rejected.
- I2 webhook year:
  - Added a matrix assertion that one checkout writes the same event cycle year across registration, attendee, booth, sponsor, contestant, team, and invoice rows when registration opens the prior year.
- I3 partial capacity message:
  - Added race-path test where the conditional reservation affects zero rows, rereads fresh availability of 2, and returns the exact `Only 2 golfer spots remain...` message for a 3-golfer request.
- I4 release retry:
  - Added transient compensation failure test proving `released` is set only after increment succeeds, the retry restores capacity once, and the compensation failure is reported with conference/count details.

## Migration / Settlement NO-SHIP Follow-Up GREEN

- B1:
  - Added `2026.09.09T00.00.00.backfill-conference-contestant-status.js`, safe before schema sync: skips missing table, creates missing column, backfills null/empty to active, preserves cancelled, and is idempotent.
  - Member Manager contestant list defaults and server summary head counts now filter `{ status: { $ne: "cancelled" } }`; explicit Cancelled remains equality.
- B2:
  - Golf reservation now exposes `markConsumed`; `handleContestants` creates rows sequentially and marks each persisted golfer.
  - Failure release returns only `reserved - consumed`; team failure after all golfer rows persisted releases zero; payment failure before persistence releases all.
- I1:
  - Relation normalization now treats absent key as no-op, null/empty set as clear, non-empty disconnect without reattach as clear, and empty disconnect with unchanged connect/set as unchanged.
- I2:
  - Webhook computes `eventYear` once with `conferenceCycleYear` and uses it for sibling conference records and invoice year where relevant.
- I3:
  - Failed conditional reservations reread current conference availability and call `golfCapacityMessage(realRemaining, requested)`.
- I4:
  - Reservation release sets `released` only after increment succeeds; compensation failures are logged/reported with conference id, reserved count, consumed count, and release count, and retry remains safe.
- Verification:
  - Targeted migration/settlement suite: 9 files, 88 tests passed.
  - Full related suite: 17 files, 174 tests passed.
  - Fixture dry run: zero network/writes, 12 cancel requests, active golfers `59 -> 47`, availability `-23 -> -11`.
  - Diagnostics: no linter errors on touched files.
