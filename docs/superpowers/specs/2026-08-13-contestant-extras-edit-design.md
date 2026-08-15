# Contestant extras edit — Design

**Date:** 2026-08-13  
**Status:** Approved  
**App:** `apps/member-manager` (Conference Manager → Contestants)

## Problem

Registered golfers (and other contestants) buy quantity extras such as Mulligans. Conference Manager already shows those as grouped chips (`Mulligan (x4)`) but the expand-edit form cannot change them. Staff need to add or reduce extras after registration without opening public checkout.

## Goals

1. Editing (and creating) a contestant includes an **Extras** block for every Contestant-context extra on that conference.
2. Quantity extras use a `0…max_qty_each` stepper (same cap as public registration). Boolean extras use a checkbox. Extras that require a choice (e.g. shirt size) show a dropdown when taken.
3. Persist the existing storage shape: one `shared.field-meta` row per unit on `conference-contestant.items`.
4. Do **not** change Fee, the parent registration total, or payments.

## Non-goals

- Charging a card or invoicing for added extras.
- Changing attendee/booth extras (`ConferenceMetaRepeatableComponent` stays checkbox + immediate save).
- Strapi schema or webhook changes.
- Raising the public max for staff.

## Data

- Catalog: `conference-extras` filtered to the contestant’s conference.
- Visibility: `context` is `Contestant` or `Contestants` (Mulligan uses the plural). Also show an extra that is already on the record even if it is excluded for this ticket; otherwise honor ticket `excluded`.
- Write: replace that extra’s rows with `N` flat `{ key, label, value, selection?, item }` objects. `item` is the extra’s documentId/id scalar — never a populated extra object.
- Leave other extras’ rows untouched.
- `value` is display-only (reuse an existing row’s value, else `price_event` / `price_online`).

## UI

Under Contestant Info on the expand/create form:

```
Extras
  Mulligan          $25    [ − ]  2  [ + ]   Max: 4
  Closest to Pin    $10    [ ✓ ]
```

Hide the heading when no extras apply. Theme-aware (light and dark). Items chips in the grid stay grouped by count.

## Save

Extras save with the existing contestant Save (`createRecord` / `updateRecord`). No live PATCH on each stepper click. Missing required selection blocks save.

## Testing

- Unit: context match, quantity enable/min/max, group-by-count, apply quantity (add/remove/clamp), excluded-ticket visibility, missing selection.
- Browser: expand a golfer, change Mulligan qty, save, chips update, Fee unchanged.
