# Fishing-Only Contestant Registration — Design

**Date:** 2026-07-24
**Status:** Approved (user: "this needs to go live ASAP")
**Apps touched:** `apps/strapi`, `apps/conference-registration`, `apps/member-manager`

## Problem

ORWA is selling only the **fishing** tournament this year (no golf). The current system:

- Has no standalone "contestant" registration — contestants ride along on an
  Attendee or Vendor registration via the Contestants wizard step.
- Hard-codes "Golf & Bass Tournament" copy, golf team rules, and Golfer-name
  inventory decrements.
- Has no public path for someone **already registered** as an attendee/vendor
  to come back and buy a fishing ticket.

New business rules:

1. Everything must be manageable through Conference Manager (member-manager).
2. Attendees/Vendors — registering now **or already registered** — buy the
   fishing ticket at **$75**.
3. A **contestant-only** registration must exist at **$150**.

## Design

### Data model (ERD)

Only one schema change:

- `conference-registration.type` enum: `Attendee | Vendor` → `Attendee |
  Vendor | Contestant`. (Commit regenerated `contentTypes.d.ts`.)

Everything else is data — two `conference-ticket` rows attached to the Fall
conference, both `context: "Contestant"`:

| Ticket name | price_online / price_event | Who sees it |
|---|---|---|
| `Fishing Tournament` | 75 / 75 | Attendee/Vendor wizard Contestants step; Contestant-only flow when buyer self-identifies as (already/concurrently) registered |
| `Fishing Tournament - Contestant Only` | 150 / 150 | Contestant-only flow when buyer is NOT otherwise registered |

No new collections. Contestant people continue to land in
`conference-contestant`; admin already has a Contestants tab.

### Eligibility for the $75 price

**Self-identification, not verification.** The contestant-only flow asks
"Are you (or your organization) already registered — or registering
separately — as an Attendee or Vendor for this conference?" Yes → the $75
ticket is offered; No → the $150 ticket. Organization is required, so staff
can audit mismatches in Conference Manager and follow up. No tokens, no
lookup endpoints. (Chosen over email-lookup verification for speed and
because POC email frequently differs from the fisher's email.)

### Registration wizard (`conference-registration`)

1. **Type step**: third option "Contestant Only" (fishing) alongside
   Attendee/Vendor, shown only when the conference has Contestant-context
   tickets. Selecting it hides Attendees, Booths, Vendors, and Sponsorship
   steps → flow is Type → Contestants → Billing.
2. **Contestants step**:
   - Header/copy derived from available contestant tickets rather than
     hard-coded "Golf & Bass Tournament" (golf-era conferences still render
     correctly for resubmits).
   - In contestant-only mode: the already-registered toggle (above tickets)
     controls which fishing ticket the Add flow offers; switching modes
     clears tickets of the other price to prevent mixed carts. Step is
     required (≥1 contestant) in contestant-only mode; remains skippable for
     Attendee/Vendor.
   - Golf team-name rule stays keyed to ≥2 tickets named "Golfer" (inert for
     fishing-only data).
3. **Submission**: registration `type: "Contestant"`; contestants ride in
   `tickets` as today. Registration-level contestant extras write to
   `registrationExtrasIds` (fixing the existing mismatch where
   `registrationExtras` never billed).

### Strapi webhook fixes

- Accept `type: "Contestant"` registrations.
- Route tickets to `conference-contestant` using the same context-or-name
  matching the frontend uses (`context === "Contestant"` OR name in
  Golfer/Fisher/Contestant/Fishing…) — fixes latent bug where name-only
  contestant tickets were stored as attendees.
- Keep Golfer-only team/`available_contestants` logic unchanged (inert when
  no golf tickets exist).
- Confirmation email works unchanged (line items from tickets).

### Conference Manager (`member-manager`)

- Registrations list/edit: show and filter the `Contestant` type.
- Contestants tab: replace the Fall-only hard-coded Golfer/Fisher filter with
  a dynamic filter built from the conference's Contestant-context tickets;
  keep CSV export.
- Conference Edit: relabel "Available Golfers" → "Available Contestant Slots
  (golf inventory)" note, unchanged behavior.
- Pricing management: staff edit the two fishing ticket rows in the existing
  Tickets tab — no new admin surface needed.

### Rollout

1. Deploy Strapi (docker-push + compose pull/up on admin.orwa.org).
2. Build both frontends with `npx vite build` from app dirs (never `nx
   build`), grep bundles for `localhost:1337`, rsync to WP Engine.
3. Create the two ticket rows on the Fall conference in production and link
   them; verify wizard end-to-end and admin visibility.
4. Non-destructive smoke test after deploy.

### Testing

- Unit: `ticketMatchesContext` additions; contestant-only step gating.
- Headless browser: (a) Attendee flow adds $75 fishing ticket; (b)
  Contestant-only flow at $150; (c) toggle switches to $75; (d) admin
  Contestants/Registrations views in light + dark mode.

### Explicitly out of scope

- Tokenized "amend my registration" infrastructure.
- Server-side cart total recomputation (existing client-trust pattern kept).
- Removing golf code paths (left inert for historical data/resubmits).
