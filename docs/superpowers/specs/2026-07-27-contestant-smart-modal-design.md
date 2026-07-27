# Contestant Smart Modal — Design

**Date:** 2026-07-27  
**Status:** Approved (brainstorming)  
**Apps touched:** `apps/conference-registration`, `apps/strapi` (webhook)  
**Supersedes (UX):** page-level tier toggle / org picker / registration-level Mulligans in `2026-07-24-fishing-contestant-registration-design.md` § Contestants step. Ticket-row Approach 1 and `Contestant` registration type remain.

## Problem

The Fall Contestants step mixes Golf and Fishing into one page-level flow:

- Heading “Golf & Bass Tournament” and a cart-wide “Already registered / Contestant only” toggle show a single min price across sports.
- Organization and Mulligans live on the page, not per contestant.
- Discounted fishers can be named freely against an org registration (abuse: many $75 fishers on one org without being that org’s people).
- Golfer was briefly dual-tiered; business rule is **Golfer = one price**. Only Fisher has two prices ($75 attach / $175 standalone).

## Goals

1. One **smart ContestantModal** for both checkout modes (Attendee/Vendor add-on + Contestant-only).
2. Page shell is only **Add Contestant** + Participants list + subtotal.
3. Per-contestant sport → (Fisher) tier → person source → extras (Mulligans on Golfer only).
4. Discounted Fisher must pick an existing Attendee/Vendor **person** on the chosen registration (or on this cart); contact fields copy into hidden ticket fields.
5. Mixed cart allowed: attach fishers to different orgs + standalone fishers + golfers in one payment.
6. No hard-coded dollar amounts; no rules engine yet (post–next-conference). Use dual Fisher ticket rows + single Golfer row.

## Non-goals

- Conditional pricing / merge-tag rules engine.
- Changing Attendee/Vendor TicketModal beyond contestant usage.
- Water Taste Test (Annual) flow.

## CMS (already done in production)

Staff already set Fisher Contestant Only to **$175** and removed the Golfer Contestant Only row. Expected Fall contestant tickets:

| Ticket | Role |
|--------|------|
| `Golfer` | Single price; `context: Contestant` |
| `Fishing Tournament` | Add-on / already-registered Fisher |
| `Fishing Tournament - Contestant Only` | Standalone Fisher ($175) |

`Mulligan` extra: `context: Contestants`, linked to Fall, included on Golfer, excluded on fishing tickets; qty via `max_qty_each` (5).

## Page shell

**Heading:** “Add Contestant”  
**Body:** Participants section + Add Contestant button + empty-state copy (required vs optional by `registration_type`).  
**Footer:** participant count + subtotal (sum of contestant ticket line prices including per-line extras).

**Removed from page:** tournament title, registration-status cards, organization field, registration-level Mulligans (`registrationExtrasIds` for Contestant context).

**Keep on page (outside modal):** Golf team name when ≥2 tickets named exactly `Golfer` (existing inventory/team rule).

## ContestantModal flow

Dedicated modal (not generic `TicketModal`). Progressive disclosure:

### 1. Sport

Offer sports present in API contestant tickets (`/golf/i`, `/fish/i` on name). Selecting sport selects the default ticket type for that sport (Golfer → the single Golfer ticket; Fisher → pending tier).

### 2. Fisher tier only

Skip entirely for Golfer.

- **Already registered** → ticket whose name is Fisher/Fishing and **not** “Contestant Only”
- **Contestant only** → ticket whose name matches `/contestant\s*only/i`

Prices displayed from `price_online` / `price_event` by registration source.

### 3. Person source

| Checkout mode | Sport / tier | UI |
|---------------|--------------|----|
| Contestant-only | Fisher add-on | Org dropdown (`useGetRegistrations` Attendee/Vendor) → person dropdown (that registration’s Attendee/Vendor tickets). Copy contact into ticket fields (hidden). Set per-line `previous_registration_id` + `source_ticket_id`. |
| Contestant-only | Fisher standalone or Golfer | Full visible contact fields (same required set as today’s contestant ticket). |
| Attendee / Vendor | Any | Dropdown of **this cart’s** Attendee/Vendor tickets. Copy to hidden fields. Always Golfer single price or Fisher **add-on** ticket (no standalone tier). |

### 4. Extras

Per contestant via ticket `extras`. Mulligan (and any Contestant-context extras) filtered with `filterVisibleExtras` + sport: show for Golfer; hide for Fisher (excluded tickets / context). Mulligan uses **qty 0–5** control (not boolean), same pattern as today’s max_qty_each UI.

### Email auto-select (nice-to-have)

If registrant email uniquely matches one ticket on one eligible registration → preselect org + person. If multiple people share email → preselect org only when org is unique. Never override after user changes a dropdown.

## Data model

### Per contestant `ITicketPayload` additions

| Field | Required when | Purpose |
|-------|---------------|---------|
| `previous_registration_id?` | Contestant-only Fisher add-on | Attach target registration |
| `source_ticket_id?` | Any “pick existing person” path | Anti-abuse + audit; person must belong to chosen registration or current cart |
| `ticket_type` | Always | Golfer **or** Fisher add-on **or** Fisher Contestant Only |
| `extras` | Optional | Mulligan qty as repeated extra ids (existing convention) |
| contact fields | Always present | Hidden+copied on attach paths; visible on standalone/Golfer contestant-only |

### Cart-level fields

Stop using cart-level `contestant_already_registered` + single `previous_registration_id` as source of truth. Clear them on new drafts; ignore if present on old sessionStorage drafts.

Organization for Contestant-only checkout:

- If any attach lines exist, prefer organization from those registrations for display/payment labeling as needed per fan-out group.
- Standalone-only carts keep typed organization / registrant-driven org as today.

## Webhook fan-out

For `registration_type === "Contestant"`:

1. Partition contestant ticket lines by `previous_registration_id` (present vs absent).
2. **Attach groups:** for each distinct `previous_registration_id`, validate eligibility (`assertEligiblePreviousRegistration`), verify each line’s `source_ticket_id` refers to an Attendee/Vendor ticket on that registration, then `buildAttachedRegistrationUpdate` with that group’s payment share / line items.
3. **Standalone group:** Golfer + Fisher Contestant Only (+ any lines without attach id) → create one `type: "Contestant"` registration (existing create path).
4. **Payment:** one Authorize.net (or invoice) charge for the full wizard total before fan-out writes.
5. Fail the request if any attach validation fails (no partial writes after payment — mirror existing payment-then-write ordering carefully; prefer validate-all-attach-targets before charging).

Attendee/Vendor registrations: unchanged create path; contestant lines may include per-line extras and `source_ticket_id` pointing at cart tickets (no `previous_registration_id`).

## Validation (frontend)

- Contestant-only: ≥1 contestant.
- Fisher attach: org + source person required; copied fields not user-editable.
- Attendee/Vendor contestant: source person from current cart required.
- Mulligan only on Golfer; qty within `max_qty_each`.
- Existing red toast + `ValidationHighlight` patterns.

## Testing

- Unit: sport → ticket selection; Fisher tier name convention; person field copy; mulligan visibility Golfer vs Fisher.
- Webhook: mixed cart (org A fisher + org B fisher + standalone fisher + golfer); reject source person not on registration.
- Browser (Fall, admin view if Closed): Contestant-only path and Attendee path; Mulligan qty in modal.

## Implementation notes

- Prefer a new `ContestantModal` over overloading `TicketModal`.
- Reuse `isStandaloneContestantTicket`, `filterVisibleExtras`, `useGetRegistrations`, ticket name sport heuristics — extend helpers rather than hard-coding prices.
- Update `StepNavigation` / contestant validation to drop cart-level tier field requirements; validate per-line attach fields instead.
- Deploy frontend after webhook is live (mixed cart would break on old cart-level attach).
