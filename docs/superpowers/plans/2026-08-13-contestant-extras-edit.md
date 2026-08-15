# Contestant extras edit — Implementation Plan

> **For agentic workers:** Implement inline in this session. Do not commit unless the user asks.

**Goal:** Let Conference Manager staff change contestant extras (including Mulligan quantity) on the contestant expand/create form.

**Architecture:** Pure helpers own grouping, visibility, and the one-row-per-unit rewrite. A react-admin `useInput({ source: "items" })` editor writes those rows. Fee and registration totals are not touched.

**Tech Stack:** React, react-admin 4, MUI 5, Vitest, Strapi 5 `shared.field-meta` on `conference-contestants`.

## Global Constraints

- Items/count only — never auto-change `fee` or the parent registration.
- Enforce public `max_qty_each` (and `min_qty_each` once selected).
- All Contestant / Contestants extras for the conference; keep already-owned extras even if ticket-excluded.
- Write `item` as a scalar id, not a populated extra object.
- Theme tokens only — no hardcoded light-only colors.
- Contestants only — do not change attendee/booth `MetaComponent`.

## Files

- Create: `apps/member-manager/src/modules/conference/helpers/contestantExtras.ts`
- Create: `apps/member-manager/src/modules/conference/helpers/contestantExtras.spec.ts`
- Create: `apps/member-manager/src/modules/conference/components/ContestantExtrasEditor.tsx`
- Modify: `apps/member-manager/src/modules/conference/components/ConferenceContestants.tsx`
- Modify: `apps/member-manager/src/modules/conference/types/IConference.ts` (`max_qty_each` on `IExtra`)

### Task 1: Helpers + unit tests

Quantity/context/group/apply/visibility functions and Vitest coverage.

### Task 2: Editor + form wiring

`ContestantExtrasEditor` on create/edit. List chips use `groupItemsByExtra`.

### Task 3: Verify

`npx vitest run` on the new spec. Headless expand → change Mulligan → save → chips update, Fee unchanged.
