# Training Manager Overhaul — Design Spec

Date: 2026-07-23
Status: Approved by user (Approach B — workflow-first overhaul)
App: `apps/member-manager` (react-admin v4 + MUI v5), backend `apps/strapi` (Strapi v5)

## Goal

Modernize the Training Manager module's UI to match the app's current design language
(sticky `PageHeadingBar`, centralized light/dark theme tokens) and restructure the pages
around the staff's two hot paths: (1) shepherding events through the
DRAFT → REVIEW → DEQ → RSVP → LIVE → COMPLETE pipeline, and (2) building event schedules.
Fix all known correctness and performance bugs in the module along the way.

## Decisions made with user

- Scope: full overhaul — UI restyle + workflow redesign + correctness/perf fixes.
- Review email recipient: `dhall@orwa.org` (the gmail address in one code path is a test artifact).
- Primary workflows to optimize: event pipeline shepherding and schedule building.
- LIVE/COMPLETE status advancement: Strapi hourly cron server-side; remove all client-side writes.

## 1. Shared workflow foundation

New module `apps/member-manager/src/modules/training/workflow.ts` as the single source of truth:

- Stage order and metadata: DRAFT, REVIEW, DEQ, RSVP, LIVE, COMPLETE, CANCELLED
  (label, color token, description).
- Allowed transitions and the single "next action" per stage
  (Send for Review, Send to DEQ, Post to Site).
- Role gates: fix `'Training Managaer'` typo → `'Training Manager'`; dedupe `'Office Admin'`.
- Review email config: recipient `dhall@orwa.org`, one template ID.

Both `EventActionButtons` and `EventListActionsMenu` (currently duplicated, diverging logic)
consume this module.

## 2. Dashboard → work queue (`/training/dashboard`)

Replace the one-card-plus-empty-cells layout with:

- Stats strip: counts per stage (Needs Review, At DEQ, Upcoming, Live).
- Work queue panels grouped by "what needs doing":
  - Events in REVIEW (primary action: Review)
  - Events at DEQ awaiting class number
  - RSVP events starting within 30 days
- Activity feed retained, restyled to match theme.
- Upcoming calendar retained, but fed by a server-side filtered query
  (`start >= today`, sorted ascending, ~10 rows) instead of perPage:10000 + client filter.
  Fix wrong field reads (`name`/`start_date` → `training_type`/`start`).

## 3. Events list (`/training-events`)

- Sticky `PageHeadingBar` with New Event action (match Terms/Asset Manager).
- Color-coded status chips per stage (theme-aware).
- Corrected columns (`program_billed` relation, not `program`).
- Filters: status, training type, date range.
- REMOVE the on-mount status auto-mutation (`checkAndUpdateRecords`) — replaced by Strapi cron.
- Mobile cards: instructor data from list query populate, not per-row
  `useGetList('training-instructors', perPage:1000)` + `useGetOne('contacts')`.

## 4. Event Create/Edit/Show

- Pipeline stepper header showing all stages with current highlighted, plus exactly one
  contextual next-action button per stage. Cancel/Reinstate in overflow menu.
- Fix operator-precedence bug: `(COMPLETE || RSVP || LIVE && crud.includes(role))`
  → proper parenthesization so Cancel only shows for permitted roles.
- Tabs: Details / Schedule / Roster (Roster from RSVP onward).
- Roster fixes: resource typo `training-event-registrationss` → `training-event-registrations`;
  filter field `event` → `training_event`; fix typo'd preference key.
- Send-to-DEQ modal and Post-to-Site kept, wired through the shared workflow module.

## 5. Schedule builder

- Blocks grouped by AM/PM; sessions as inline-editable rows (time, topic, instructor, summary).
- Inline add-session; running credit-hours total pinned in view vs the event's `hours`.
- Data loading: one batched populate query for schedule → blocks → sessions → topics;
  eliminate the sequential useGetMany cascade and per-row 1000-instructor fetches.

## 6. Training History + Settings

- Both restyled with `PageHeadingBar`.
- History: hours from the record's actual `hours` field, not hardcoded 4 (Block) / 1 (Session);
  fix `reference="Contacts"` casing → `contacts`.
- Settings keeps its four sections (office details, email templates, programs billed, topics),
  modernized styling. Remove `recordRepresentation: 'title'` where no `title` attribute exists.

## 7. Strapi backend

- Hourly cron (`apps/strapi`) advancing statuses from event dates:
  RSVP → LIVE when `start <= now < end`; RSVP/LIVE → COMPLETE when `end < now`.
  Only touches events in RSVP/LIVE (never DRAFT/REVIEW/DEQ/CANCELLED).
- No content-type schema changes anticipated.

## 8. Testing

- Seed local Strapi (port 13370, MySQL 3307 migration copy) with training events across every
  status, plus schedules/blocks/sessions/topics, registrations, and event logs.
- Verify every training page headlessly (browser MCP) in both light and dark mode.
- Typecheck/build member-manager; no deploy without explicit user request.

## Out of scope

- DOH approval path (doesn't exist today).
- Modern Tribe TODOs (RSVP sync-back from WordPress, QR codes, organizers).
- Public registration frontend (conference-registration-style flows).
