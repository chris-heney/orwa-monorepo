# Contestant Smart Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Fall Contestants page-level Golf/Bass mashup with a Participants-only shell and one smart ContestantModal that handles sport, Fisher dual-tier attach-with-person, Golfer single price, per-line Mulligans, and mixed-cart webhook fan-out.

**Architecture:** Keep Approach 1 ticket rows (Golfer; Fishing Tournament; Fishing Tournament - Contestant Only). Move all contestant UX into `ContestantModal`. Store attach metadata per ticket line (`previous_registration_id`, `source_ticket_id`). Webhook validates attach targets before payment, then fans out: attach groups update existing regs; standalone lines create one Contestant registration.

**Tech Stack:** React + react-hook-form (conference-registration), Vitest, Strapi 5 document service (conference-webhook), existing `filterVisibleExtras` / `isStandaloneContestantTicket`.

## Global Constraints

- No hard-coded dollar amounts in UI — prices from ticket `price_online` / `price_event`.
- Golfer = one ticket/price; only Fisher has dual tier via “Contestant Only” name convention.
- Discounted Fisher must select an existing Attendee/Vendor **person** (registration attendees or cart tickets); copy contact into hidden fields.
- Mixed cart allowed (multiple orgs + standalone + golfers) in one payment.
- Heading copy is **Add Contestant**; page has only Participants + Add Contestant (+ team name if ≥2 Golfers).
- Mulligans are per-contestant in the modal (qty 0–`max_qty_each`), Golfer only.
- Deploy webhook before frontend if shipping separately; prefer same release.
- Spec: `docs/superpowers/specs/2026-07-27-contestant-smart-modal-design.md`

---

## File structure

| File | Responsibility |
|------|----------------|
| `apps/conference-registration/src/helpers/contestantSport.ts` | Detect golf/fish sports from ticket names; list available sports |
| `apps/conference-registration/src/helpers/resolveContestantTicket.ts` | Map sport + tier + checkout mode → `ITicketOption` |
| `apps/conference-registration/src/helpers/copyContestantPerson.ts` | Copy person contact fields; email auto-select hints |
| `apps/conference-registration/src/types/types.ts` | `previous_registration_id?`, `source_ticket_id?` on `ITicketPayload` |
| `apps/conference-registration/src/components/_components/ContestantModal.tsx` | Smart modal UI |
| `apps/conference-registration/src/steps/StepContestants.tsx` | Page shell only |
| `apps/conference-registration/src/components/StepNavigation.tsx` | Per-line attach validation |
| `apps/strapi/src/api/conference-webhook/helpers/contestant-fanout.ts` | Partition + validate attach groups |
| `apps/strapi/src/api/conference-webhook/controllers/conference-webhook.ts` | Use fan-out; validate before charge |

---

### Task 1: Contestant sport + ticket resolution helpers (TDD)

**Files:**
- Create: `apps/conference-registration/src/helpers/contestantSport.ts`
- Create: `apps/conference-registration/src/helpers/contestantSport.spec.ts`
- Create: `apps/conference-registration/src/helpers/resolveContestantTicket.ts`
- Create: `apps/conference-registration/src/helpers/resolveContestantTicket.spec.ts`
- Modify: `apps/conference-registration/src/helpers/contestantTicketTiers.ts` (keep `isStandaloneContestantTicket`; document cart-level `allowedContestantTickets` as legacy for modal sport-scoped use)

**Interfaces:**
- Produces:
  - `export type ContestantSport = "golf" | "fish"`
  - `export const contestantSportOf = (ticket: Pick<ITicketOption,"name">|null|undefined): ContestantSport | null`
  - `export const availableContestantSports = (tickets: ITicketOption[]|null|undefined): ContestantSport[]`
  - `export type FisherTier = "addon" | "standalone"`
  - `export const resolveContestantTicket = (args: { ticketOptions: ITicketOption[]|null|undefined; sport: ContestantSport; fisherTier?: FisherTier; registrationType: "Attendee"|"Vendor"|"Contestant"|null|undefined }): ITicketOption | null`
    - Attendee/Vendor + fish → add-on only (never standalone)
    - Contestant + golf → single non-standalone golf ticket (or only golf ticket)
    - Contestant + fish + addon/standalone → matching fishing ticket via `isStandaloneContestantTicket`

- [ ] **Step 1: Write failing tests** for sport detection and resolve rules (golf one price; fish dual; attendee never gets standalone fish)

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd apps/conference-registration && npx vitest run src/helpers/contestantSport.spec.ts src/helpers/resolveContestantTicket.spec.ts
```

- [ ] **Step 3: Implement helpers**

- [ ] **Step 4: Run tests — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add apps/conference-registration/src/helpers/contestantSport.ts apps/conference-registration/src/helpers/contestantSport.spec.ts apps/conference-registration/src/helpers/resolveContestantTicket.ts apps/conference-registration/src/helpers/resolveContestantTicket.spec.ts
git commit -m "conference-registration: helpers for contestant sport and ticket resolution"
```

---

### Task 2: Person copy + email auto-select helpers (TDD)

**Files:**
- Create: `apps/conference-registration/src/helpers/copyContestantPerson.ts`
- Create: `apps/conference-registration/src/helpers/copyContestantPerson.spec.ts`
- Modify: `apps/conference-registration/src/types/types.ts` — add to `ITicketPayload`:
  - `previous_registration_id?: Identifier`
  - `source_ticket_id?: Identifier`

**Interfaces:**
- Produces:
  - `export type ContestantPersonSource = { id: string|number; first?: string; last?: string; email?: string; phone?: string; license?: string }`
  - `export const contactFieldsFromPerson = (person: ContestantPersonSource): Pick<ITicketPayload,"first"|"last"|"email"|"phone"|"license"|"source_ticket_id">`
  - `export const emailAutoSelect = (args: { email: string|undefined; registrations: Array<{ id: Identifier; organization?: string; attendees?: ContestantPersonSource[] }> }): { registrationId?: Identifier; personId?: Identifier }`
    - Unique email match on one attendee → both ids; unique org with multiple people matching → registrationId only; else empty

- [ ] **Step 1: Write failing tests**

- [ ] **Step 2: Run — expect FAIL**

```bash
cd apps/conference-registration && npx vitest run src/helpers/copyContestantPerson.spec.ts
```

- [ ] **Step 3: Implement + type fields**

- [ ] **Step 4: Run — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add apps/conference-registration/src/helpers/copyContestantPerson.ts apps/conference-registration/src/helpers/copyContestantPerson.spec.ts apps/conference-registration/src/types/types.ts
git commit -m "conference-registration: contestant person copy and email auto-select helpers"
```

---

### Task 3: Webhook contestant fan-out helpers (TDD)

**Files:**
- Create: `apps/strapi/src/api/conference-webhook/helpers/contestant-fanout.ts`
- Create: `apps/strapi/src/api/conference-webhook/helpers/contestant-fanout.spec.ts`
- Modify: `apps/strapi/src/api/conference-webhook/helpers/previous-registration.ts` — export a `assertSourcePersonOnRegistration(registration, sourceTicketId)` that checks `registration.attendees` (or populated tickets) for matching id

**Interfaces:**
- Consumes: `assertEligiblePreviousRegistration`
- Produces:
  - `export type ContestantLine = { previous_registration_id?: string|number; source_ticket_id?: string|number; price?: number; ticket_type?: { id?: unknown; name?: string }; first?: string; last?: string; email?: string; extras?: unknown[]; [k: string]: unknown }`
  - `export const partitionContestantLines = (tickets: ContestantLine[]): { attachGroups: Map<string, ContestantLine[]>; standalone: ContestantLine[] }`
  - `export const sharePaymentAmount = (lines: ContestantLine[]): number` — sum of `Number(line.price)||0` (line price already includes extras from frontend)
  - `export async function validateAttachGroups(...): Promise<void>` — throws if any group invalid or source person missing

- [ ] **Step 1: Write failing tests** — partition two orgs + standalone; reject missing source person; sharePaymentAmount sums

- [ ] **Step 2: Run — expect FAIL**

```bash
cd apps/strapi && npx vitest run src/api/conference-webhook/helpers/contestant-fanout.spec.ts src/api/conference-webhook/helpers/previous-registration.spec.ts
```

- [ ] **Step 3: Implement**

- [ ] **Step 4: Run — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add apps/strapi/src/api/conference-webhook/helpers/contestant-fanout.ts apps/strapi/src/api/conference-webhook/helpers/contestant-fanout.spec.ts apps/strapi/src/api/conference-webhook/helpers/previous-registration.ts apps/strapi/src/api/conference-webhook/helpers/previous-registration.spec.ts
git commit -m "strapi: contestant mixed-cart fan-out helpers"
```

---

### Task 4: Wire webhook controller for mixed cart

**Files:**
- Modify: `apps/strapi/src/api/conference-webhook/controllers/conference-webhook.ts`
- Modify: `apps/strapi/src/api/conference-webhook/controllers/conference-webhook.matrix.spec.ts` (extend mixed-cart cases)

**Behavior:**
1. When `registration_type === "Contestant"`, collect contestant lines from `tickets` via existing `isContestantTicket`.
2. **Before** payment: load each distinct `previous_registration_id`, `assertEligiblePreviousRegistration`, `assertSourcePersonOnRegistration` for each line; fail request on error.
3. Charge **once** for full `paymentData.amount`.
4. For each attach group: `buildAttachedRegistrationUpdate` with that group’s line-item extras share + contestant handling via `handleContestants` bound to that registration id / organization from the previous registration.
5. If standalone lines non-empty: create one Contestant registration; `handleContestants` for standalone lines only.
6. Stop using cart-level `contestant_already_registered` / single `previous_registration_id` as the attach switch (may accept legacy body that sets them on all lines only if no per-line ids — optional compat; prefer per-line only).
7. Attendee/Vendor path: unchanged create; still call `handleContestants` for contestant tickets on the new registration.

- [ ] **Step 1: Extend matrix/spec tests for mixed attach + standalone**

- [ ] **Step 2: Run — expect FAIL**

```bash
cd apps/strapi && npx vitest run src/api/conference-webhook/controllers/conference-webhook.matrix.spec.ts src/api/conference-webhook/helpers/contestant-fanout.spec.ts
```

- [ ] **Step 3: Implement controller wiring**

- [ ] **Step 4: Run — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add apps/strapi/src/api/conference-webhook/controllers/conference-webhook.ts apps/strapi/src/api/conference-webhook/controllers/conference-webhook.matrix.spec.ts
git commit -m "strapi: fan out contestant-only carts across attach targets"
```

---

### Task 5: ContestantModal UI

**Files:**
- Create: `apps/conference-registration/src/components/_components/ContestantModal.tsx`
- Modify: `apps/conference-registration/src/components/AddExtras.tsx` only if needed to support qty-first Mulligan rendering when `max_qty_each > 1` without requiring checkbox (prefer existing qty UI; ensure Contestant context works with `fieldIndex`)

**Behavior:**
- Props mirror TicketModal open state: `isOpen`, `setIsOpen`, uses `useTicketIndex` + `tickets` field array.
- Progressive fields:
  1. Sport buttons (from `availableContestantSports`)
  2. If fish + `registration_type === "Contestant"`: Fisher tier cards with API prices
  3. Person:
     - Contestant + fish addon: org `<select>` from `useGetRegistrations` (Attendee/Vendor), then person `<select>` from `registration.attendees` labeled `first last`
     - Attendee/Vendor checkout: person `<select>` from cart tickets where type Attendee|Vendor
     - Else: visible TextInput/Email/Phone like TicketModal Contestant (no training/voting clutter unless already shown for contestants)
  4. On person select: `contactFieldsFromPerson` into ticket fields; set `previous_registration_id` when org selected
  5. Set `ticket_type` via `resolveContestantTicket`; set `type: "Contestant"`; recompute `price` like TicketModal (`ticket price + extras`)
  6. `AddExtras` with `context="Contestant"`, `fieldIndex={ticketIndex}` so extras land on ticket line; Mulligan qty UI
  7. Email auto-select once when opening create mode if registrant email present
- Save validates sport + (tier if fish contestant-only) + person/contact + extras qty
- Cancel/remove draft row on close if create context incomplete (match TicketModal patterns)

- [ ] **Step 1: Implement ContestantModal**

- [ ] **Step 2: Smoke with vitest if pure helpers covered; manual typecheck**

```bash
cd apps/conference-registration && npx tsc --noEmit -p tsconfig.app.json 2>&1 | head -40
```

- [ ] **Step 3: Commit**

```bash
git add apps/conference-registration/src/components/_components/ContestantModal.tsx apps/conference-registration/src/components/AddExtras.tsx
git commit -m "conference-registration: add ContestantModal with sport/tier/person/extras"
```

---

### Task 6: StepContestants page shell + StepNavigation

**Files:**
- Modify: `apps/conference-registration/src/steps/StepContestants.tsx` — rewrite to heading “Add Contestant”, Participants + Add Contestant, team name if ≥2 Golfers, subtotal; use ContestantModal; remove page-level tier/org/Mulligans
- Modify: `apps/conference-registration/src/components/StepNavigation.tsx` — `contestantValid`: require ≥1 contestant if Contestant-only; for each contestant fish addon line require `previous_registration_id` + `source_ticket_id`; for Attendee/Vendor contestant lines require `source_ticket_id`; drop cart-level `contestant_already_registered` / `previous_registration_id` checks
- Modify: `apps/conference-registration/src/components/_components/AddTicket.tsx` if needed so Contestant still opens modal

- [ ] **Step 1: Rewrite StepContestants + validation**

- [ ] **Step 2: Run frontend unit tests**

```bash
cd apps/conference-registration && npx vitest run src/helpers/
```

- [ ] **Step 3: Commit**

```bash
git add apps/conference-registration/src/steps/StepContestants.tsx apps/conference-registration/src/components/StepNavigation.tsx apps/conference-registration/src/components/_components/AddTicket.tsx
git commit -m "conference-registration: Contestants step shell + per-line validation"
```

---

### Task 7: Browser verify Fall conference

**Files:** none (verification only)

- [ ] **Step 1:** Open `https://orwa.org/conference-registration/?conference_id=3&source=online&admin` or local vite against prod API with admin view enabled
- [ ] **Step 2:** Contestant-only: Add Contestant → Fisher → Already registered → org → person; Golfer with Mulligan qty; standalone Fisher; confirm no page-level Mulligans / Golf & Bass heading
- [ ] **Step 3:** Attendee path: add attendee, Add Contestant → pick person from cart, Fisher or Golfer
- [ ] **Step 4:** Note any blockers; fix if trivial

- [ ] **Step 5: Commit** any fixes

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Page heading Add Contestant / Participants only | 6 |
| Smart modal sport → Fisher tier → person → extras | 5 |
| Golfer one price; Fisher dual via ticket rows | 1, 5 |
| Person must be existing attendee/vendor | 2, 5, 3–4 |
| Mulligans per-contestant qty in modal | 5 |
| Mixed cart webhook fan-out | 3, 4 |
| Email auto-select nice-to-have | 2, 5 |
| No hard-coded prices | Global + 1, 5 |
| Team name ≥2 Golfers on page | 6 |
