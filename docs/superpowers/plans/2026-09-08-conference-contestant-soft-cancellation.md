# Conference Contestant Soft Cancellation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an auditable, recoverable contestant cancellation lifecycle, deploy it, reconcile golf capacity, and soft-cancel the golfers on registrations 16781, 16792, and 16817 without changing payments or refund evidence.

**Architecture:** Strapi owns cancellation invariants through dedicated transactional cancel/restore actions and blocks public hard deletion. Member Manager replaces Delete with Cancel/Restore and distinguishes active from cancelled records. All active counts and public rosters explicitly filter cancelled contestants, while registration receipts retain cancelled fee and Mulligan evidence.

**Tech Stack:** Strapi 5.52 TypeScript, MySQL/Knex transactions, React 19, react-admin 5, Material UI 7, Vitest 3, Vite 7, Docker, WP Engine.

## Global Constraints

- Preserve contestant fee, Mulligan components, ticket/registration/team relations, contacts, registration totals, invoices, and card transactions.
- Do not process refunds, alter invoices, send emails, or touch payment-provider records.
- A golf ticket is a Contestant-context ticket whose name contains `Golfer` case-insensitively.
- Cancellation and restoration must be idempotent and adjust capacity at most once.
- Cancelled contestants are historical evidence, not active roster or metric entries.
- Generic REST hard deletion of conference contestants must be rejected.
- Production writes are limited to the one capacity reconciliation and contestants attached to registrations 16781, 16792, and 16817.
- Never delete, rotate, or overwrite API tokens or `.env` keys.

---

## File Structure

### Strapi

- Modify `apps/strapi/src/api/conference-contestant/content-types/conference-contestant/schema.json` — lifecycle fields.
- Create `apps/strapi/src/api/conference-contestant/services/contestant-cancellation.ts` — transactional cancel/restore domain service.
- Create `apps/strapi/src/api/conference-contestant/services/contestant-cancellation.spec.ts` — service behavior and preservation tests.
- Modify `apps/strapi/src/api/conference-contestant/controllers/conference-contestant.ts` — custom actions and hard-delete rejection.
- Create `apps/strapi/src/api/conference-contestant/controllers/conference-contestant.spec.ts` — HTTP behavior tests.
- Create `apps/strapi/src/api/conference-contestant/routes/01-conference-contestant-actions.ts` — cancel/restore routes before core routes.
- Modify `apps/strapi/src/api/conference-summary/services/conference-summary.ts` — active-only contestant summaries.
- Modify `apps/strapi/src/api/conference-summary/services/conference-summary.spec.ts` or add a focused sibling spec — cancelled exclusion.
- Modify `apps/strapi/types/generated/contentTypes.d.ts` — generated schema types.

### Member Manager

- Create `apps/member-manager/src/modules/conference/helpers/contestantStatus.ts` — status normalization, active filter, cancellation payload.
- Create `apps/member-manager/src/modules/conference/helpers/contestantStatus.spec.ts` — pure helper tests.
- Create `apps/member-manager/src/modules/conference/components/ContestantCancellationActions.tsx` — Cancel/Restore confirmation UI.
- Modify `apps/member-manager/src/modules/conference/components/ConferenceContestants.tsx` — status display, toggle, retained evidence, no DeleteButton.
- Modify `apps/member-manager/src/modules/conference/ConferenceDashboard.tsx` — active status default for contestants.
- Modify `apps/member-manager/src/modules/conference/helpers/listQueryFilters.ts` and `.spec.ts` — deterministic status filter.
- Modify `apps/member-manager/src/modules/conference/components/summary/useConferenceMetrics.ts` — active-only metrics.
- Modify `apps/member-manager/src/modules/conference/components/RegistrationReceipt.tsx` — separate cancelled contestant history.

### Conference Hub

- Modify `apps/conference-hub/src/helpers/API.ts` — request active contestants only.
- Modify `apps/conference-hub/src/types/IContestant.ts` — status type if absent.
- Create `apps/conference-hub/src/helpers/contestantStatus.ts` and `.spec.ts` — defensive cancelled filtering.
- Modify `apps/conference-hub/src/sections/tournament.tsx` — apply the defensive filter before roster grouping.

### Operations

- Create `scripts/reconcile-and-cancel-golf-overage.ts` — guarded, idempotent production operation with dry-run default.
- Create `scripts/reconcile-and-cancel-golf-overage.spec.ts` — target validation and arithmetic tests.
- Write runtime audit files only under `tmp/golf-overage-2026-fall/`.

---

### Task 1: Add the contestant lifecycle schema and shared status semantics

**Files:**
- Modify: `apps/strapi/src/api/conference-contestant/content-types/conference-contestant/schema.json`
- Create: `apps/member-manager/src/modules/conference/helpers/contestantStatus.ts`
- Test: `apps/member-manager/src/modules/conference/helpers/contestantStatus.spec.ts`
- Modify: `apps/strapi/types/generated/contentTypes.d.ts`

**Interfaces:**
- Produces: `ContestantStatus = "active" | "cancelled"`
- Produces: `isCancelledContestant(record): boolean`
- Produces: `activeContestantFilter(showCancelled): { status?: string }`

- [ ] **Step 1: Write failing status-helper tests**

```ts
import { describe, expect, it } from "vitest";
import {
  activeContestantFilter,
  isCancelledContestant,
} from "./contestantStatus";

describe("contestantStatus", () => {
  it("treats legacy records without status as active", () => {
    expect(isCancelledContestant({})).toBe(false);
  });

  it("recognizes cancelled records", () => {
    expect(isCancelledContestant({ status: "cancelled" })).toBe(true);
  });

  it("filters the normal view to active records", () => {
    expect(activeContestantFilter(false)).toEqual({ status: "active" });
    expect(activeContestantFilter(true)).toEqual({});
  });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npx vitest run apps/member-manager/src/modules/conference/helpers/contestantStatus.spec.ts
```

Expected: FAIL because `contestantStatus.ts` does not exist.

- [ ] **Step 3: Add schema fields**

Add to `conference-contestant/schema.json`:

```json
"status": {
  "type": "enumeration",
  "enum": ["active", "cancelled"],
  "default": "active",
  "required": true
},
"cancelled_at": { "type": "datetime" },
"cancelled_reason": { "type": "text" },
"cancelled_by": { "type": "string" }
```

- [ ] **Step 4: Implement the helper**

```ts
export type ContestantStatus = "active" | "cancelled";

export const isCancelledContestant = (record: {
  status?: string | null;
}): boolean => record.status === "cancelled";

export const activeContestantFilter = (
  showCancelled: boolean
): Record<string, string> => (showCancelled ? {} : { status: "active" });
```

- [ ] **Step 5: Generate Strapi types and verify GREEN**

Run:

```bash
cd apps/strapi && npx strapi ts:generate-types
cd ../.. && npx vitest run apps/member-manager/src/modules/conference/helpers/contestantStatus.spec.ts
```

Expected: generated type includes all four fields; 3 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/strapi/src/api/conference-contestant/content-types/conference-contestant/schema.json \
  apps/strapi/types/generated/contentTypes.d.ts \
  apps/member-manager/src/modules/conference/helpers/contestantStatus.ts \
  apps/member-manager/src/modules/conference/helpers/contestantStatus.spec.ts
git commit -m "conference: add contestant cancellation lifecycle"
```

---

### Task 2: Implement transactional cancel and restore services

**Files:**
- Create: `apps/strapi/src/api/conference-contestant/services/contestant-cancellation.ts`
- Test: `apps/strapi/src/api/conference-contestant/services/contestant-cancellation.spec.ts`

**Interfaces:**
- Consumes: `countsAgainstGolfCapacity(ticket)` from `conference-webhook/helpers/contestant-capacity.ts`
- Produces: `cancelContestant(strapi, input): Promise<Contestant>`
- Produces: `restoreContestant(strapi, input): Promise<Contestant>`

- [ ] **Step 1: Write failing service tests**

Cover these cases with a fake Strapi documents service and transaction-aware
Knex builder:

```ts
it("cancels a golfer without changing fee, items, or relations", async () => {
  const result = await cancelContestant(strapi, {
    documentId: "golfer-1",
    reason: "2026 Fall golf overage — pending card refund",
    actor: "staff@example.org",
  });
  expect(result).toMatchObject({
    status: "cancelled",
    fee: 150,
    items: [{ label: "Mulligan", value: "5" }],
    registration: { documentId: "reg-1" },
  });
  expect(capacityDelta).toBe(1);
});

it("does not increment capacity when cancel is repeated", async () => {
  await cancelContestant(strapi, input);
  await cancelContestant(strapi, input);
  expect(capacityIncrementCalls).toBe(1);
});

it("does not change golf capacity for a Fisher", async () => {
  await cancelContestant(strapi, fisherInput);
  expect(capacityIncrementCalls).toBe(0);
});

it("rejects restoring a golfer when no capacity remains", async () => {
  await expect(restoreContestant(strapi, restoreInput))
    .rejects.toThrow("sold out");
  expect(statusUpdateCalls).toBe(0);
});
```

- [ ] **Step 2: Run and verify RED**

```bash
npx vitest run apps/strapi/src/api/conference-contestant/services/contestant-cancellation.spec.ts
```

Expected: FAIL because the service module does not exist.

- [ ] **Step 3: Implement lookup and actor-safe state changes**

Implement `loadContestant()` with populated `conference`,
`conference_ticket`, `registration`, `items`, and `team`. Require a non-empty
reason. Derive golfer semantics by adapting the populated ticket to the shared
capacity predicate:

```ts
const ticketPayload = {
  ticket_type: {
    name: contestant.conference_ticket?.name,
    context: contestant.conference_ticket?.context,
  },
};
const isGolfer = countsAgainstGolfCapacity(ticketPayload);
```

- [ ] **Step 4: Make status and capacity one transaction**

Use Strapi's documented transaction API. Document-service writes inside the
callback participate implicitly; raw Knex increments explicitly use
`.transacting(trx)`:

```ts
return strapi.db.transaction(async ({ trx }) => {
  const fresh = await loadContestant(strapi, documentId);
  if (fresh.status === "cancelled") return fresh;

  if (isGolferTicket(fresh)) {
    await strapi.db.connection("conferences")
      .where({ document_id: fresh.conference.documentId })
      .increment("available_contestants", 1)
      .transacting(trx);
  }

  return strapi.documents(CONTESTANT_UID).update({
    documentId,
    data: {
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
      cancelled_reason: reason.trim(),
      cancelled_by: actor || null,
    },
    populate: "*",
  });
});
```

For restore, check fresh state, call `assertGolfCapacity()` against the fresh
conference value, decrement through the same transaction, and clear all three
cancellation audit fields.

- [ ] **Step 5: Run service tests and verify GREEN**

```bash
npx vitest run apps/strapi/src/api/conference-contestant/services/contestant-cancellation.spec.ts
```

Expected: all cancel, restore, preservation, and idempotency tests PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/strapi/src/api/conference-contestant/services/contestant-cancellation.ts \
  apps/strapi/src/api/conference-contestant/services/contestant-cancellation.spec.ts
git commit -m "strapi: add transactional contestant cancellation"
```

---

### Task 3: Expose cancel/restore and block REST hard deletes

**Files:**
- Modify: `apps/strapi/src/api/conference-contestant/controllers/conference-contestant.ts`
- Create: `apps/strapi/src/api/conference-contestant/controllers/conference-contestant.spec.ts`
- Create: `apps/strapi/src/api/conference-contestant/routes/01-conference-contestant-actions.ts`

**Interfaces:**
- Produces: `POST /conference-contestants/:documentId/cancel`
- Produces: `POST /conference-contestants/:documentId/restore`
- Replaces: REST `DELETE /conference-contestants/:documentId` with HTTP 405.

- [ ] **Step 1: Write failing controller tests**

```ts
it("requires a cancellation reason", async () => {
  await controller.cancel(ctx({ reason: " " }));
  expect(ctx.badRequest).toHaveBeenCalledWith("reason is required");
});

it("passes the authenticated actor to the service", async () => {
  const request = ctx({ reason: "Golf overage" }, {
    user: { email: "staff@example.org" },
  });
  await controller.cancel(request);
  expect(cancelContestant).toHaveBeenCalledWith(
    strapi,
    expect.objectContaining({ actor: "staff@example.org" })
  );
});

it("rejects generic hard deletion", async () => {
  await controller.delete(ctx());
  expect(ctx.methodNotAllowed).toHaveBeenCalled();
});
```

- [ ] **Step 2: Run and verify RED**

```bash
npx vitest run apps/strapi/src/api/conference-contestant/controllers/conference-contestant.spec.ts
```

Expected: FAIL because custom actions are absent.

- [ ] **Step 3: Extend the core controller**

Use `factories.createCoreController(uid, ({ strapi }) => ({ ... }))`. Resolve
the actor from `ctx.state.user.email`, then username, then authenticated API
token name; leave null when unavailable. Map domain not-found, validation, and
capacity errors to 404, 400, and 409 respectively. Override `delete(ctx)`:

```ts
async delete(ctx) {
  return ctx.methodNotAllowed(
    "Conference contestants must be cancelled, not deleted."
  );
}
```

- [ ] **Step 4: Add custom routes**

```ts
export default {
  routes: [
    {
      method: "POST",
      path: "/conference-contestants/:documentId/cancel",
      handler: "conference-contestant.cancel",
    },
    {
      method: "POST",
      path: "/conference-contestants/:documentId/restore",
      handler: "conference-contestant.restore",
    },
  ],
};
```

- [ ] **Step 5: Run controller and service tests**

```bash
npx vitest run \
  apps/strapi/src/api/conference-contestant/controllers/conference-contestant.spec.ts \
  apps/strapi/src/api/conference-contestant/services/contestant-cancellation.spec.ts
```

Expected: all tests PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/strapi/src/api/conference-contestant/controllers \
  apps/strapi/src/api/conference-contestant/routes/01-conference-contestant-actions.ts
git commit -m "strapi: expose contestant cancel and restore actions"
```

---

### Task 4: Exclude cancelled contestants from active server and public views

**Files:**
- Modify: `apps/strapi/src/api/conference-summary/services/conference-summary.ts`
- Test: `apps/strapi/src/api/conference-summary/services/conference-summary.spec.ts`
- Modify: `apps/conference-hub/src/helpers/API.ts`
- Create: `apps/conference-hub/src/helpers/contestantStatus.ts`
- Test: `apps/conference-hub/src/helpers/contestantStatus.spec.ts`
- Modify: `apps/conference-hub/src/sections/tournament.tsx`
- Modify: `apps/conference-hub/src/types/IContestant.ts`

**Interfaces:**
- Produces: server summaries with `status=active`
- Produces: public API request with `filters[status][$eq]=active`
- Produces: `activeContestants(records)` defensive filter

- [ ] **Step 1: Write failing server and hub tests**

Assert the summary contestant query merges `{ status: "active" }` with
conference/year scope. Assert the hub defensive helper removes cancelled rows
and treats legacy missing status as active.

- [ ] **Step 2: Run and verify RED**

```bash
npx vitest run \
  apps/strapi/src/api/conference-summary/services/conference-summary.spec.ts \
  apps/conference-hub/src/helpers/contestantStatus.spec.ts
```

Expected: FAIL because active filters are absent.

- [ ] **Step 3: Implement active-only server filters**

Change contestant filters to:

```ts
filters: { ...filter, status: "active" }
```

Apply this to every contestant fetch in `conference-summary.ts`, not merely
`getHeadCounts`.

- [ ] **Step 4: Implement active-only public roster**

Append `&filters[status][$eq]=active` in `getContestants()`, add `status` to
`IContestant`, and filter defensively before `transformContestants()`:

```ts
export const activeContestants = (records = []) =>
  records.filter((record) => record?.status !== "cancelled");
```

- [ ] **Step 5: Run tests and verify GREEN**

Run the same focused command; expected all PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/strapi/src/api/conference-summary \
  apps/conference-hub/src/helpers/API.ts \
  apps/conference-hub/src/helpers/contestantStatus.ts \
  apps/conference-hub/src/helpers/contestantStatus.spec.ts \
  apps/conference-hub/src/sections/tournament.tsx \
  apps/conference-hub/src/types/IContestant.ts
git commit -m "conference: exclude cancelled contestants from active rosters"
```

---

### Task 5: Replace Conference Manager delete with Cancel/Restore

**Files:**
- Create: `apps/member-manager/src/modules/conference/components/ContestantCancellationActions.tsx`
- Modify: `apps/member-manager/src/modules/conference/components/ConferenceContestants.tsx`
- Modify: `apps/member-manager/src/modules/conference/ConferenceDashboard.tsx`
- Modify: `apps/member-manager/src/modules/conference/helpers/listQueryFilters.ts`
- Test: `apps/member-manager/src/modules/conference/helpers/listQueryFilters.spec.ts`

**Interfaces:**
- Consumes: custom Strapi cancel/restore routes
- Produces: active/cancelled toggle and preserved-history display

- [ ] **Step 1: Write failing list-filter tests**

```ts
it("defaults conference contestants to active", () => {
  expect(
    normalizeFiltersForListQuery(
      "conference-contestants",
      { conference: 3, year: 2026 },
      "contestants"
    )
  ).toEqual({ conference: 3, year: 2026, status: "active" });
});

it("keeps an explicit cancelled status", () => {
  expect(
    normalizeFiltersForListQuery(
      "conference-contestants",
      { conference: 3, year: 2026, status: "cancelled" },
      "contestants"
    )
  ).toEqual({ conference: 3, year: 2026, status: "cancelled" });
});
```

- [ ] **Step 2: Run and verify RED**

```bash
npx vitest run apps/member-manager/src/modules/conference/helpers/listQueryFilters.spec.ts
```

Expected: first assertion FAIL because no status is added.

- [ ] **Step 3: Implement filter normalization**

For only `conference-contestants`, default missing `status` to `active`.
Never overwrite an explicit status. Keep conference/year behavior unchanged.

- [ ] **Step 4: Build Cancel/Restore actions**

Use react-admin's authenticated `httpClient`, a confirmation dialog, required
reason input, `useNotify`, `useRefresh`, and loading state. Cancel calls:

```ts
httpClient(
  `${api}/api/conference-contestants/${record.id}/cancel`,
  {
    method: "POST",
    body: JSON.stringify({ reason }),
  }
);
```

Restore calls the sibling route with POST. Use red destructive styling for
Cancel and ordinary secondary styling for Restore.

- [ ] **Step 5: Integrate status UX**

In `ConferenceContestants.tsx`:

- replace `CustomToolBar` so no `DeleteButton` renders for this resource;
- show `ContestantCancellationActions`;
- add Status, Cancelled At, Reason, and Cancelled By columns;
- keep fee and grouped Mulligan chips visible for cancelled records;
- style cancelled rows without light-only hardcoded colors;
- add an Active/Cancelled/All control that changes list filters.

- [ ] **Step 6: Run helper tests, typecheck, and lints**

```bash
npx vitest run apps/member-manager/src/modules/conference/helpers/listQueryFilters.spec.ts \
  apps/member-manager/src/modules/conference/helpers/contestantStatus.spec.ts
cd apps/member-manager && npx tsc --noEmit
```

Expected: tests PASS; no new type errors beyond documented baseline.

- [ ] **Step 7: Commit**

```bash
git add apps/member-manager/src/modules/conference/components/ContestantCancellationActions.tsx \
  apps/member-manager/src/modules/conference/components/ConferenceContestants.tsx \
  apps/member-manager/src/modules/conference/ConferenceDashboard.tsx \
  apps/member-manager/src/modules/conference/helpers/listQueryFilters.ts \
  apps/member-manager/src/modules/conference/helpers/listQueryFilters.spec.ts
git commit -m "member-manager: add contestant cancel and restore controls"
```

---

### Task 6: Make metrics and receipts lifecycle-aware

**Files:**
- Modify: `apps/member-manager/src/modules/conference/components/summary/useConferenceMetrics.ts`
- Modify: `apps/member-manager/src/modules/conference/components/RegistrationReceipt.tsx`
- Create: `apps/member-manager/src/modules/conference/helpers/partitionContestants.ts`
- Test: `apps/member-manager/src/modules/conference/helpers/partitionContestants.spec.ts`

**Interfaces:**
- Produces: `partitionContestants(records): { active; cancelled }`

- [ ] **Step 1: Write failing partition tests**

```ts
it("separates cancelled evidence from active contestants", () => {
  expect(partitionContestants([
    { id: "a", status: "active" },
    { id: "b", status: "cancelled" },
    { id: "legacy" },
  ])).toEqual({
    active: [{ id: "a", status: "active" }, { id: "legacy" }],
    cancelled: [{ id: "b", status: "cancelled" }],
  });
});
```

- [ ] **Step 2: Run and verify RED**

```bash
npx vitest run apps/member-manager/src/modules/conference/helpers/partitionContestants.spec.ts
```

Expected: FAIL because helper is absent.

- [ ] **Step 3: Implement partition and apply to metrics**

Set the contestant list query filter to `{ ...scope, status: "active" }`.
Use the helper defensively before every contestant-derived metric.

- [ ] **Step 4: Preserve cancelled history in receipts**

Render active contestants under `Contestants`. Render cancelled entries under
`Cancelled Contestants — retained for refund history`, including name, ticket,
fee, Mulligan chips, cancellation time, reason, and actor. Do not strike or
remove monetary values.

- [ ] **Step 5: Verify GREEN and typecheck**

Run focused tests and `npx tsc --noEmit` from `apps/member-manager`.

- [ ] **Step 6: Commit**

```bash
git add apps/member-manager/src/modules/conference/components/summary/useConferenceMetrics.ts \
  apps/member-manager/src/modules/conference/components/RegistrationReceipt.tsx \
  apps/member-manager/src/modules/conference/helpers/partitionContestants.ts \
  apps/member-manager/src/modules/conference/helpers/partitionContestants.spec.ts
git commit -m "member-manager: retain cancelled contestant refund history"
```

---

### Task 7: Build the guarded reconciliation and cancellation operation

**Files:**
- Create: `scripts/reconcile-and-cancel-golf-overage.ts`
- Test: `scripts/reconcile-and-cancel-golf-overage.spec.ts`

**Interfaces:**
- Default mode: read-only dry run
- Required write flag: `--apply`
- Fixed allowlist: registration IDs 16781, 16792, 16817

- [ ] **Step 1: Write failing operation tests**

Test pure validation functions:

```ts
it("refuses any registration outside the fixed allowlist", () => {
  expect(() => validateTargets([16781, 99999])).toThrow("not authorized");
});

it("derives available slots from active golfers", () => {
  expect(reconciledAvailability(36, 59)).toBe(-23);
});

it("expects 47 active golfers and -11 availability after 12 cancellations", () => {
  expect(expectedAfter({ maximum: 36, activeBefore: 59, cancelled: 12 }))
    .toEqual({ activeAfter: 47, availableAfter: -11 });
});
```

- [ ] **Step 2: Run and verify RED**

```bash
npx vitest run scripts/reconcile-and-cancel-golf-overage.spec.ts
```

Expected: FAIL because the script is absent.

- [ ] **Step 3: Implement dry-run safeguards**

The script must:

- require the exact three registration IDs;
- fetch parent registrations and populated contestants;
- require exactly four active golfer tickets on each;
- snapshot names, document IDs, ticket, fee, Mulligans, registration total,
  and payment reference without secrets;
- compute active golfer count with the shared contains-`Golfer` predicate;
- print planned counter reconciliation and 12 cancel requests;
- perform no writes unless `--apply` is present.

- [ ] **Step 4: Implement apply mode**

In apply mode:

1. update the Fall Conference counter once from `36 - active golfer count`;
2. call the deployed cancel endpoint once per target contestant with reason
   `2026 Fall golf overage — pending card refund`;
3. stop immediately on an unexpected response;
4. re-fetch and verify parents/payments/totals unchanged;
5. verify all 12 records remain with `status=cancelled`, fees and Mulligans;
6. verify active count 47 and availability `-11`;
7. write before/after JSON and a Markdown audit under
   `tmp/golf-overage-2026-fall/`.

- [ ] **Step 5: Run tests and local dry run**

```bash
npx vitest run scripts/reconcile-and-cancel-golf-overage.spec.ts
npx tsx scripts/reconcile-and-cancel-golf-overage.ts
```

Expected: tests PASS; dry run reports 12 targets and performs zero writes.

- [ ] **Step 6: Commit**

```bash
git add scripts/reconcile-and-cancel-golf-overage.ts \
  scripts/reconcile-and-cancel-golf-overage.spec.ts
git commit -m "scripts: add guarded golf cancellation operation"
```

---

### Task 8: Full local verification

**Files:** No production files added.

- [ ] **Step 1: Run all focused tests**

```bash
npx vitest run \
  apps/strapi/src/api/conference-contestant/**/*.spec.ts \
  apps/strapi/src/api/conference-summary/**/*.spec.ts \
  apps/member-manager/src/modules/conference/**/*.spec.ts \
  apps/conference-hub/src/**/*.spec.ts \
  scripts/reconcile-and-cancel-golf-overage.spec.ts
```

Expected: zero failures.

- [ ] **Step 2: Run application builds**

```bash
cd apps/strapi && npx strapi build
cd ../member-manager && npx vite build --mode production
cd ../conference-hub && npx vite build --mode production
```

Expected: all exit 0. For both frontend outputs:

```bash
grep -R -c 'localhost:1337' dist/assets/*.js
grep -R -c 'localhost:13370' dist/assets/*.js
```

Expected: every count is 0.

- [ ] **Step 3: Browser-verify Member Manager**

Against local Strapi:

- Cancel a test golfer and confirm it leaves Active view.
- Switch to Cancelled and confirm fee/Mulligans/audit metadata remain.
- Confirm summary count and public hub roster exclude it.
- Restore it and confirm it returns only when capacity permits.
- Repeat in light and dark modes; save screenshots to `tmp/`.

- [ ] **Step 4: Verify hard-delete rejection**

Send a DELETE for the test contestant and expect HTTP 405 with no row change.

---

### Task 9: Ship Strapi, Member Manager, and Conference Hub

**Files:** Commits from Tasks 1–7.

- [ ] **Step 1: Sync and push**

```bash
git fetch origin
git merge origin/main
git push origin main
```

Leave `tmp/`, `.playwright-mcp/`, screenshots, secret `.env` files, scholarship
test artifacts, and `.strapi-updater.json` unstaged.

- [ ] **Step 2: Deploy Strapi**

```bash
npx nx run strapi:docker-push
ssh root@admin.orwa.org \
  "cd /var/opt/orwa-monorepo && docker compose pull strapi && docker compose up -d strapi"
```

Wait for `Strapi started successfully`; verify
`https://admin.orwa.org/admin` returns 200.

- [ ] **Step 3: Deploy Member Manager**

```bash
cd apps/member-manager
npx vite build --mode production
grep -R -c 'localhost:1337' dist/assets/*.js
grep -R -c 'localhost:13370' dist/assets/*.js
rsync -avz --exclude '.DS_Store' --exclude 'package.json' \
  dist/ -e "ssh -o IdentitiesOnly=yes -i ${HOME}/.ssh/id_ed25519" \
  orwa@orwa.ssh.wpengine.net:sites/orwa/member-manager/
```

- [ ] **Step 4: Deploy Conference Hub**

Use the tracked deployment script, which builds directly with production Vite,
checks both localhost ports, and rsyncs without `--delete` to
`sites/orwa/conference-hub/`:

```bash
cd apps/conference-hub
bash ./deploy.sh
```

Verify `https://orwa.org/conference-hub/` serves the script's new local bundle
hash after the cache flush in Step 5.

- [ ] **Step 5: Flush WP Engine caches once after both frontend deploys**

```bash
ssh -o IdentitiesOnly=yes -i "${HOME}/.ssh/id_ed25519" \
  orwa@orwa.ssh.wpengine.net 'wp page-cache flush && wp cdn-cache flush'
```

Verify each public URL serves the new hashed bundle. Smoke both frontends
headlessly without mutating production data.

---

### Task 10: Reconcile capacity and soft-cancel the authorized golfers

**Files:** Runtime audit only under `tmp/golf-overage-2026-fall/`.

- [ ] **Step 1: Run production dry run**

```bash
npx tsx scripts/reconcile-and-cancel-golf-overage.ts
```

Require output to confirm:

- registrations exactly 16781, 16792, 16817;
- four active golfers each;
- 12 preserved golfer records total;
- active golfer count 59 before;
- counter reconciliation target `36 - 59 = -23`;
- post-cancellation target `36 - 47 = -11`;
- no writes performed.

- [ ] **Step 2: Run apply mode**

```bash
npx tsx scripts/reconcile-and-cancel-golf-overage.ts --apply
```

Stop on any mismatch. Do not improvise production SQL or broaden IDs.

- [ ] **Step 3: Independently verify production**

Use fresh read-only API/SQL queries to confirm:

- all 12 target contestants remain and are `cancelled`;
- their fees, Mulligans, registration links, and ticket links are intact;
- registrations 16781, 16792, and 16817 still exist;
- their totals and card transaction IDs are unchanged;
- no active golfer remains on those registrations;
- active golfer count is 47;
- `available_contestants` is -11;
- public roster and Conference Manager active metrics exclude the 12;
- Cancelled view can retrieve all 12.

- [ ] **Step 4: Record the audit**

Save exact before/after evidence and endpoint responses under
`tmp/golf-overage-2026-fall/`; do not commit personal or payment data.

