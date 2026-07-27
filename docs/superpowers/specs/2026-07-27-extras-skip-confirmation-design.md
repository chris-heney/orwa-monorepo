# Extras Skip Confirmation — Design

**Date:** 2026-07-27  
**Status:** Approved (brainstorming)  
**Apps touched:** `apps/conference-registration`  
**Scope:** Attendee and Vendor `TicketModal` only

## Problem

When registering Attendees or Vendors, people often overlook optional extras (lunch, dinner, etc.) and save the ticket with nothing selected. Extras are optional today, so there is no nudge — only “A La Carte Meals” hard-requires at least one meal.

## Goals

1. Soft-confirm when the user is about to save an Attendee/Vendor ticket with **no optional extras** selected.
2. List the unchecked optional extras in plain language.
3. **Continue without extras** finishes save as today.
4. **Go back and choose** keeps the modal open and highlights the Extras section like other invalid fields.
5. Do not treat included/default-checked extras as “the user already picked something.”

## Non-goals

- Booth, Contestant, or registration-level extras flows.
- Forcing extras to be required.
- Warning when some optional extras are selected but others are not.
- Changing pricing, visibility, or included-extra auto-selection behavior.

## Trigger rules

Run only in `TicketModal` when `type` is `Attendee` or `Vendor`, on **Add** / **Update**, **after** existing validation succeeds (including the A La Carte hard fail).

Show the dialog when:

1. There is at least one **visible optional** extra for this ticket, and
2. The ticket has **no selected extras beyond included/default ones**.

Definitions:

- **Visible** — `filterVisibleExtras` for context Attendee (Vendor uses the same Attendee extras context as `AddExtras` today) and this ticket type.
- **Included / default-selected** — `isExtraIncluded(ticket, ExtraOptions, extra.id)` (same rule that pre-checks included meals when ticket type changes).
- **Optional** — visible and not included.
- **Has optional pick** — any id in `ticket.extras` that corresponds to an optional extra (quantity ≥ 1 counts).

Skip the dialog when:

- No visible optional extras, or
- At least one optional extra is already selected, or
- Modal type is Contestant (out of scope), or
- Validation failed earlier in `handleSave`.

## Dialog copy and actions

**Title / body:**

> Are you sure you do not want to add: {list}?

List formatting:

- 1 item: `Lunch`
- 2 items: `Lunch or Dinner`
- 3+ items: `Lunch, Dinner, or Reception` (Oxford comma)

**Buttons:**

| Label | Behavior |
|-------|----------|
| Continue without extras | Close dialog; complete the normal save path |
| Go back and choose | Close dialog; stay in TicketModal; highlight Extras; scroll Extras into view |

Saving again after “Go back” re-evaluates the same rules (dialog may appear again if still no optional picks).

## UI

- Nested confirm overlay above the open TicketModal (same visual language: white panel, dimmed backdrop, clear primary/secondary buttons). Do not use `window.confirm`.
- Extras highlight uses existing `validationHighlightClassName` on the Extras section inside the modal via **local state** (not step-level `ValidationHighlight` keys).
- Clear the highlight when the user selects any optional extra or when the modal closes.

## Architecture

```
helpers/getUncheckedOptionalExtras.ts   # pure helper + unit tests
components/.../TicketModal.tsx          # gate Save; confirm state; highlight
components/AddExtras.tsx                # optional highlight wrapper / data attr
```

Recommended shape of the helper:

```ts
getUncheckedOptionalExtras({
  ticket,
  extras,
  context: "Attendee" | "Vendor",
}): IExtraOption[]
```

Returns the list of optional visibles that are not selected. Empty array ⇒ do not show dialog. TicketModal maps names into the sentence above.

Keep dialog markup small — either inline in TicketModal or a tiny presentational confirm component if it keeps TicketModal readable.

## Error handling / edge cases

- A La Carte with zero meals still hard-fails before this soft confirm.
- If the user unchecks all included extras and selects nothing optional, the dialog lists the unchecked optionals (included items that were unchecked are not the focus of the list; the list is unchecked **optional** extras only).
- If every visible extra is included and still selected, helper returns `[]` ⇒ no dialog (nothing optional was overlooked).
- Free ($0) optionals still appear in the list — same visibility rules as `filterVisibleExtras`.

## Testing

Unit-test `getUncheckedOptionalExtras`:

| Case | Expected |
|------|----------|
| All optional unchecked | Returns those optionals |
| One optional checked | Returns `[]` |
| Only included selected | Returns remaining optionals |
| No visible extras | Returns `[]` |
| Vendor context | Same visibility mapping as Attendee extras in UI |
| Quantity optional with qty ≥ 1 | Counts as selected ⇒ `[]` |

Manual / browser: Attendee ticket with lunch/dinner unchecked → Save → dialog → both button paths; Vendor same; Contestant unchanged.

## Rollout

Frontend-only change in conference-registration. No Strapi/schema changes.
