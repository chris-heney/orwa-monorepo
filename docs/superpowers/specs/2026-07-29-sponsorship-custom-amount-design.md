# Sponsorship Custom Amount — Design

**Date:** 2026-07-29  
**Status:** Approved (Approach A)  
**Apps touched:** `apps/strapi`, `apps/member-manager`, `apps/conference-registration`

## Problem

Conference sponsorship packages are fixed-price only. Some packages (e.g. Bass Tournament) should allow sponsors to donate any amount at or above a minimum.

## Goals

1. Admin checkbox on Conference Sponsorship: **Allow sponsor to donate custom amount.**
2. When checked, existing **Amount** is the **minimum**.
3. Registration shows a custom amount input for those packages (always visible, pre-filled with the minimum); selecting the package includes the typed amount.
4. Quantity is forced to **1** for custom-amount packages (no qty control).
5. No maximum — minimum only.
6. Server enforces the floor before charging / persisting.

## Non-goals

- Separate maximum field or system hard cap.
- Per-unit custom amounts when qty > 1.
- Changing fixed-price packages.

## Data model

`conference-sponsorship.allow_custom_amount` (boolean, default `false`).

Reuse `amount` as fixed price, or as minimum when `allow_custom_amount` is true.

Purchased amount continues to flow through `sponsor.amount` → `sponsorship_items.value` (already supported).

## Admin (member-manager `ConferenceGiving`)

- Checkbox under Amount: “Allow sponsor to donate custom amount.”
- When checked: Amount label becomes **Minimum Amount**; Max Purchasable is hidden and saved as `1`.

## Registration (`StepSponsorship`)

- For `allow_custom_amount` packages: always show a currency amount input (default = catalog `amount`); hide Qty.
- Selecting the checkbox appends one sponsor entry using the typed amount.
- Changing the input while selected updates that entry’s `amount`.
- Subtotal / checkout use `sponsor.amount` as today.
- Step validation: selected custom packages must have `amount >=` catalog minimum; highlight + red toast.

## Webhook

Before payment / persistence, for each sponsor line load the catalog package:

- Custom: reject if submitted amount &lt; catalog `amount`.
- Fixed: overwrite submitted amount with catalog `amount` (do not trust client underpay/overpay).
