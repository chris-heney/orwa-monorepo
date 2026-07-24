# Training Manager Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize the member-manager Training Manager module (UI + workflow + correctness) per the approved spec `docs/superpowers/specs/2026-07-23-training-manager-overhaul-design.md`.

**Architecture:** A shared `workflow.ts` module centralizes pipeline stages/transitions/roles/email; new `EventPipelineHeader` + `TrainingStatusChip` components replace the duplicated header/action code; pages restyle onto `PageHeadingBar` and theme tokens; LIVE/COMPLETE advancement moves to a Strapi cron.

**Tech Stack:** react-admin v4.16, MUI v5.14, Strapi v5 (documents API), dayjs.

## Global Constraints

- Review email recipient: `dhall@orwa.org`, templateId 2 (the EventActionButtons values; the gmail/templateId-4 path is a test artifact).
- Role names: `'Training Manager'`, `'Admin'`, `'Administrator'` may post to DEQ/site; crud list has no `'Training Managaer'` typo and no duplicate `'Office Admin'`.
- All colors via theme tokens (`background.paper`, `divider`, `text.*`) or the shared `#262626` PageHeadingBar — must be legible in both light and dark themes.
- Do not touch `apps/strapi/src/api/schedule-functions` endpoints (submit/update/get-training-schedule) — the schedule builder keeps using them.
- No deploy; local verification only. No git commits unless user asks.

---

### Task 1: Shared workflow module

**Files:**
- Create: `apps/member-manager/src/modules/training/workflow.ts`

**Produces:**
- `TrainingStatus` union type; `STAGE_ORDER: TrainingStatus[]`
- `STAGE_META: Record<TrainingStatus, { label: string; description: string; color: 'default'|'info'|'warning'|'secondary'|'success'|'error'; chipBg: string; chipFg: string }>`
- `CRUD_ROLES: string[]`, `DEQ_ROLES: string[]`
- `nextAction(status): { label; icon: 'review'|'deq'|'post'; to: TrainingStatus } | null`
- `REVIEW_EMAIL = { to: 'dhall@orwa.org', templateId: 2 }`
- `sendReviewEmail(record, identity): Promise<boolean>` (fetch to `VITE_MAILER_ENDPOINT`)

- [x] Step 1: Implement module with the constants above.
- [x] Step 2: Typecheck passes (`npx tsc --noEmit` scoped via app build later).

### Task 2: Shared UI — TrainingStatusChip + EventPipelineHeader

**Files:**
- Create: `apps/member-manager/src/modules/training/_components/TrainingStatusChip.tsx`
- Create: `apps/member-manager/src/modules/training/_components/EventPipelineHeader.tsx`

**Produces:**
- `<TrainingStatusChip status={...} size? />` — color-coded chip from STAGE_META, dark/light safe.
- `<EventPipelineHeader context='create'|'edit'|'show' />` — sticky #262626 bar (title + status chip), horizontal MUI Stepper of DRAFT→REVIEW→DEQ→RSVP→LIVE→COMPLETE (CANCELLED shown as banner state), single contextual next-action button (role-gated via workflow.ts), overflow menu with Cancel/Reinstate. Hosts the DEQ email modal + Post-to-Site modal (reuses `EventModalEmailDeq`, `EventModalPostWebsite`).

- [x] Steps: implement, wire modals, role gating from workflow.ts, fixed Cancel visibility logic (proper parens; cancel available for DRAFT/REVIEW/DEQ/RSVP/LIVE for crud roles).

### Task 3: Events list overhaul

**Files:**
- Modify: `apps/member-manager/src/modules/training/training-events/TrainingEventList.tsx`
- Modify: `apps/member-manager/src/modules/training/training-events/components/EventListFilter.tsx`
- Modify: `apps/member-manager/src/modules/training/training-events/components/EventListCardMobile.tsx`
- Modify: `apps/member-manager/src/modules/training/training-events/components/EventListActionsMenu.tsx` (consume workflow.ts)

**Steps:**
- [x] Delete `checkAndUpdateRecords` + its useEffect (cron replaces it).
- [x] PageHeadingBar header ("Training Events", create + export actions), `TrainingStatusChip` column, `program_billed.name` column fix, TermList-style datagrid borders.
- [x] Filter sidebar restyled; status filter items use chips.
- [x] Mobile card: replace per-card 1000-row instructor list with single `useGetOne('training-instructors', { id, meta: { populate: ['instructor'] } })`-style lookup; guard missing avatar/address.
- [x] EventListActionsMenu: workflow.ts roles/email; remove gmail recipient + templateId 4.

### Task 4: Event Create/Edit/Show pages

**Files:**
- Modify: `TrainingEventCreate.tsx`, `TrainingEventEdit.tsx`, `TrainingEventShow.tsx`
- Modify: `components/Event.tsx` (tab styling; roster tab gate unchanged)
- Modify: `components/EventPanelRoster.tsx`
- Delete usage of: `components/EventHeader.tsx`, `components/EventActionButtons.tsx` (superseded by EventPipelineHeader)

**Steps:**
- [x] Replace EventHeader with EventPipelineHeader on all three pages.
- [x] Roster: resource `training-event-registrations` (single s), filter `{ training_event: id }`, preference key fixed, PageHeadingBar-style section header, registration count.
- [x] Tabs styled with theme tokens.

### Task 5: Schedule builder redesign

**Files:**
- Modify: `components/EventPanelScheduleModify.tsx`
- Rewrite: `components/EventTrainingScheduleAccordion.tsx` (inline session rows, AM/PM grouping, hours total)
- Modify: `components/EventScheduleEditHeader.tsx` as needed

**Steps:**
- [x] Keep blocks state model + schedule-functions endpoints.
- [x] Day/AM-PM grouped block cards; sessions as inline editable rows (topic autocomplete, instructor autocomplete, start/end TimeField, summary) — no nested accordions.
- [x] Sticky footer strip: running total of session hours vs event `hours`.
- [x] Remove the artificial 4-session cap only if trivially safe — kept (DEQ rule unknown).

### Task 6: Dashboard work queue

**Files:**
- Rewrite: `dashboard/TrainingDashboard.tsx`
- Create: `dashboard/StatsStrip.tsx`, `dashboard/WorkQueueCard.tsx`
- Rewrite: `dashboard/UpComingEventCard.tsx`
- Delete: `dashboard/EventsWaitingReviewCard.tsx` (superseded)

**Steps:**
- [x] Stats strip: `useGetList` count-only queries per stage (REVIEW, DEQ, RSVP upcoming, LIVE).
- [x] Work queue cards: REVIEW list (Review action → show page), DEQ list (awaiting class #), RSVP starting ≤30 days. Server-side filters + sort, perPage 5-10.
- [x] Upcoming calendar: `filter: { start: { $gt: now } }` equivalents via data provider operators, sort start ASC, perPage 10; fix `training_type`/`start` field reads.
- [x] Remove empty placeholder grid cells; activity feed retained.

### Task 7: Training History

**Files:**
- Modify: `training-history/TrainingHistoryList.tsx`, `components/TrainingHistoryForm.tsx`, `training-history/index.ts`

**Steps:**
- [x] PageHeadingBar; hours from `record.hours` (fallback to type-based only when null); `reference="contacts"` casing; remove bogus recordRepresentation.

### Task 8: Settings

**Files:**
- Modify: `settings/EventSettings.tsx`, `settings/OfficeDetails.tsx`, `settings/program-billed/CustomInterface.tsx` (styling only)

**Steps:**
- [x] PageHeadingBar; consistent card styling; theme tokens.

### Task 9: Strapi cron for status advancement

**Files:**
- Create: `apps/strapi/config/cron-training-status.ts`
- Modify: `apps/strapi/config/server.ts`

**Steps:**
- [x] Hourly task: events with status RSVP and `start <= now < end` → LIVE; status RSVP|LIVE and `end < now` → COMPLETE. Use `strapi.db.query('api::training-event.training-event')` with where filters; log counts.
- [x] Register in server.ts cron tasks.

### Task 10: Seed data + verification

**Steps:**
- [x] Seed local Strapi (13370) via API: events in every status with addresses, instructors, schedule (blocks/sessions/topics), registrations, event logs.
- [x] Run member-manager dev server; headless-browser verify every training page, light + dark; screenshots.
- [x] `npx tsc --noEmit` (or vite build) clean for member-manager; strapi TS compile clean.
