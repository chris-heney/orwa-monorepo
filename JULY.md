# July 2026 — work summary

Hours are estimates (nearest 0.25). Written for invoicing: what shipped, and why it mattered.

---

## Approved Grant Estimate

*Work that maps to the estimated-and-approved grant scope. Line-item hours include meetings, testing, one round of review, and final touchups.*

### Applicant self-service edits (before committee)

- 3.00 Users can make their own modifications online: enter email → one-time token link → edit the application — only while still before committee (“New Application”).
- 3.50 Secure edit-session APIs generate/validate the one-time token and block edits after committee.
- 1.50 Edit-link emails point at the live form, and the flow is documented for staff/support.
- 3.00 Additional contacts on the application (form + required + admin) so the edit email can reach more than a single POC.

### Fiscal-year funds & financial reporting

- 1.00 Admin funds roll over to the next fiscal year once the previous year is closed (so remaining money does not vanish or double-count).
- 1.00 Reporting attributes dollars to the application’s approval date—not the payout date—so a FY does not look overspent while the prior year looks short.

### Admin dashboard & Applications list

- 0.50 Admin Dashboard view update (Grant Manager shell and filter chrome staff use daily).
- 0.50 Sticky filters so dashboard/list choices survive navigating away and back.
- 1.00 Save column visibility on the Applications list.
- 1.00 Save column order (and related layout) on the Applications list.
- 1.50 New Dashboard Summary layout and widgets (pathways, Funds Explorer, glossary, metric cards).
- 2.00 Keep the new dashboard responsive by computing balances locally instead of flooding the server.
- 0.50 Keep compact dollar widgets accurate (e.g. $1.5K instead of rounding to $2K).

**Section total: 20.00 hrs**

---

## Other grant work (outside approved estimate)

### Public grant application (gapp-form)

- 4.00 Modernized the public grant application form so applicants can finish it without getting lost or missing required fields.
- 0.50 Fixed subdirectory hosting so the form loads correctly under orwa.org (blank page otherwise).
- 0.75 Embedded the grant map on the form so applicants can see geography in context while applying.

### Grant Manager (member-manager)

- 1.50 Added in-app preview for grant application files so reviewers do not download every attachment first.
- 0.50 Embedded the grant map flush in grant admin screens for geographic review.

### Grant map (gapp-map)

- 5.00 Redesigned the grant map into a clearer dashboard with county coloring so leadership can see where money is going.
- 1.50 Made large grant datasets load in stages so the map does not freeze on open.
- 2.00 Cut map API payloads dramatically so each page load is seconds instead of nearly a minute.
- 1.00 Restored district layer picking and a slide-away insights panel so map exploration matches how staff actually work.
- 1.00 Added session recovery and a loading overlay so expired logins and slow loads are obvious instead of “broken.”
- 0.75 Fixed the map canvas resizing when side panels open/close so geography stays aligned.
- 0.50 Fixed subdirectory hosting so the map loads under orwa.org.

### Grant scoring

- 3.00 Split the public scoresheet/directory viewer from the committee scoring tool so each audience gets the right app.
- 2.00 Brought scoring apps onto the current API shape so they keep working after the backend upgrade.
- 1.00 Added reliable deploy paths for both scoring apps so updates reach production safely.
- 0.50 Fixed subdirectory hosting so scoring apps do not load blank under orwa.org.

### Grant backend (non-estimate)

- 1.50 Fixed grant payout status changes that were erroring after the platform upgrade (staff could not update payouts).

**Section total: 27.00 hrs**

---

## Strapi (platform / CMS / API)

*Why this block exists: nearly every ORWA app talks to Strapi. July’s platform upgrade and follow-on fixes kept production admin, forms, conference, grants, and memberships working on the new version.*

### Platform upgrade & deploy

- 12.00 Replaced the backend with Strapi 5 based on production so the CMS stays supported and secure instead of aging out on v4.
- 6.00 Reworked custom server logic for Strapi 5’s document APIs so existing business features keep functioning.
- 2.00 Added compatibility helpers so older numeric IDs in URLs/bodies still resolve (otherwise edits and links break).
- 2.50 Added middleware so v4-style clients continue to work during the transition.
- 3.00 Standardized Docker/GHCR builds and push targets so backend releases are repeatable and match production.
- 1.50 Fixed the Strapi admin panel pointing at localhost in production (admin was unusable behind the real domain).
- 0.50 Trusted the reverse proxy correctly so HTTPS and real client IPs work in production.
- 0.50 Updated plugin admin entrypoints so the Strapi admin UI builds on v5.
- 1.00 Synced ID/draft-publish compatibility into activity and grant plugins so plugin screens stay consistent with core.
- 2.00 Audited create/update payloads across APIs after v5 started rejecting fields v4 silently ignored (saves were failing).
- 0.75 Fixed Conference Summary loading forever after v5 rejected an invalid “load everything” query form.
- 1.50 Switched database driver and cleaned obsolete packages required by the v5 upgrade path.
- 1.00 Adjusted uploads/cron config for v5 so scheduled jobs and large files keep working.
- 0.50 Excluded test files from production builds so deploys do not fail on specs.
- 0.25 Stopped committing uploaded media into git.
- 0.25 Ignored upload folders so secrets/media stay off the repo.

### Conference-related backend

- 1.50 Stored terms acceptance on registrations and added a terms content type so legal acknowledgements are auditable.
- 1.00 Added Contestant as a registration type and routed name-only contestant tickets into contestant records (golf/fishing headcounts).
- 1.50 Built checkout logic so contestant-only carts create the right records even when mixed with other registration types.
- 1.00 Split contestant purchases across the correct parent registrations when attaching to existing attendees/vendors.
- 0.50 Added Sponsor Only as a registration type on the backend.
- 0.75 Allowed custom sponsorship donation amounts to be stored and charged correctly.
- 1.00 Fixed payment gateway billing address/name fields so Authorize.Net authorizations stop failing on incomplete bill-to data.
- 1.00 Showed mulligans and other quantity extras with correct quantities and dollars on confirmation emails (receipts were wrong).
- 0.75 Grouped quantity extras as “(xN)” on contestant records so staff see how many were purchased.
- 0.75 Removed unused booth secondary email field that confused exports and emails.

### Membership / training / associates backend

- 1.50 Fixed financial audit date windows so membership money is attributed to the right period.
- 1.00 Added a training event status cron so event lists stay current without manual status babysitting.
- 0.50 Added “Drone Cleaning” as an associate category (and regenerated API types) so the directory can list that trade.

### Member-manager fixes driven by Strapi 5 behavior

- 2.00 Stopped the admin data layer from wiping nested “repeater” fields on save after the upgrade.
- 2.50 Always re-fetched related data after save so linked records (contacts, tickets, etc.) do not silently disappear on the next edit.
- 1.00 Normalized empty relation/component values from Strapi 5 so forms do not crash on nulls.
- 1.00 Fixed accordion/content builders that broke when save responses changed shape.
- 1.00 Hardened Conference Manager against empty relation arrays that Strapi 5 now returns as null.
- 1.50 Made admin login still succeed if role/profile metadata fails after auth (staff were locked out despite valid passwords).
- 0.75 Stopped production builds of member-manager from accidentally shipping “localhost” API URLs.

**Section total: 57.75 hrs**

---

## Conference registration (public)

- 1.50 Create workflows allowing anyone to sponsor, and to have sponsor-only registrations.
- 1.00 Allow sponsors to enter a custom donation amount when packages do not fit.
- 0.75 Explain sponsorship benefits and deadline so vendors understand what they are buying.
- 3.00 Put sponsorship on its own wizard step and persist progress so people do not lose work on refresh/back.
- 2.00 Make validation obvious (toasts + highlighted fields) for an older registrant audience.
- 2.00 Clarify checkout line items and mark free meals/tickets as “Included” instead of $0.00.
- 1.50 Gate registration behind scroll-to-agree terms so acknowledgements are intentional and recorded.
- 0.50 Do not show the terms overlay when registration is closed (people were blocked from even reading the closed message).
- 1.50 Require vendor participation acknowledgement on booth registration for compliance.
- 1.50 Survive “resubmit / edit” carts that still pointed at deleted extras or tickets from another year.
- 2.50 Restore golf and bass contestant registration with clear billing contact fields.
- 2.00 Refine the contestants step (counts, team name, extras) so tournament staff get usable rosters.
- 2.50 Support contestant-only fishing registration with Already-Registered vs Contestant-Only pricing.
- 1.50 Let reduced-price fishing tickets attach to an existing Attendee/Vendor registration (prevents price abuse).
- 2.50 Add a Participants-focused contestant modal driven by ticket types from Conference Manager.
- 0.75 Keep free meal/RSVP extras selectable for headcounts even when they cost nothing.
- 1.50 Ask for confirmation when Attendee/Vendor skip optional extras so headcounts are not silently incomplete.
- 0.75 Highlight missing extras and make the confirm dialog keyboard-accessible.
- 3.00 Add a public test mode for end-to-end registration against sandbox payments without admin chrome.
- 1.00 Fix free Vendor tickets bundled with booths so pricing and receipts say “Included with booth.”
- 1.00 Fix Admin View so newly created registrations appear in the registrant list.
- 0.50 Clean up type-card layout and copy (SELECTED badge, Golf capitalization, padding).
- 3.00 Adapt the public app to the new API response shapes so logos, booths, and tickets keep loading after the upgrade.
- 1.50 Fix hosting under orwa.org subdirectory paths (blank pages from wrong asset URLs).

**Section total: 39.25 hrs**

---

## Conference Manager (member-manager)

- 6.00 Rebuild Conference Summary as an Event Command Center so staff see crowd, revenue, sponsors, and logistics in one place.
- 1.50 Add plain-language glossary and header metrics so the dashboard is usable without tribal knowledge.
- 1.00 Add Crowd, Logistics, Revenue Mix, and Sponsor Spotlight panels for day-of and pre-event ops.
- 1.50 Wire summary metrics to live registration data.
- 1.50 Support Contestant registration type and dynamic contestant ticket filters for golf/fishing ops.
- 0.75 Support Sponsor Only registrations in admin.
- 0.50 Show custom sponsorship amounts on admin receipts/forms.
- 0.50 Label free booth-bundled Vendor tickets as included.
- 0.75 Fix booth-bundled free Vendor pricing in admin ticket displays.
- 0.50 Show quantity extras on contestants as “(xN).”
- 0.50 Remove unused booth secondary email from admin and exports.
- 0.50 Polish conference header/icons for readability in light and dark mode.

**Section total: 15.50 hrs**

---

## Conference hub

- 4.00 Bring the public conference hub into the monorepo so it can be maintained and deployed with everything else.
- 1.00 Add production deploy to WP Engine for the hub site.
- 2.50 Refresh hub layout and shared visual tokens so the public conference site looks consistent and current.

**Section total: 7.50 hrs**

---

## Memberships & people (member-manager)

- 3.00 Modernize Membership Reporting to match the Grant dashboard so staff get the same clarity of metrics.
- 2.50 Combine People directory widgets on one dashboard so contacts are easier to find.
- 1.00 Standardize dashboard card layout for scannable membership ops.
- 2.00 Add a membership roster sunburst so membership mix is visible at a glance.
- 1.00 Fix Financial Audit date handling so membership money is attributed correctly.
- 1.00 Fix sunburst sizing so the chart fits its panel.

**Section total: 10.50 hrs**

---

## Training Manager (member-manager)

- 5.00 Overhaul Training Manager around a clear workflow and work queue so staff know what needs review next.
- 1.50 Add pipeline header, status chips, and a stats strip for at-a-glance training ops.
- 1.00 Modernize event list/show/edit so creating and running sessions is less clunky.
- 0.75 Retire redundant “waiting review” card now covered by the work queue.

**Section total: 8.25 hrs**

---

## Terms, assets, and shared admin UX (member-manager)

- 2.50 Add a Terms Manager so ORWA can publish and update legal/acknowledgement text without a developer.
- 1.00 Support multiple identifiers per term so the same text can apply across apps.
- 0.75 Standardize black page heading bars (actions + Back) like Media Library for consistent admin chrome.
- 1.00 Polish Asset Manager list/forms to the same heading pattern.
- 3.00 Make member-manager work properly in both light and dark mode (staff were getting unreadable screens).
- 2.00 Remove hardcoded light-only colors across shared surfaces.
- 0.75 Fix contact page crash when badge icons were missing.
- 0.50 Hide scrollbars while keeping scroll (cleaner admin on Windows/macOS).
- 1.00 Vendor premium admin modules locally after the vendor registry token expired (builds were blocked).
- 0.25 Disable third-party admin telemetry.

**Section total: 12.75 hrs**

---

## Membership application, associates, scholarship

- 4.00 Replace the membership-application stub with the real membership forms app so production signup lives in the monorepo.
- 2.00 Bring associate-directory onto the current API and merge newer directory features.
- 0.75 Harden associate directory loading when the API fails (blank/error states instead of a dead page).
- 1.00 Fix subdirectory hosting across associate/scholarship apps so they load under orwa.org.
- 1.00 Keep membership and scholarship write paths working after the Strapi upgrade.

**Section total: 8.75 hrs**

---

## Shared library & tooling

- 2.50 Build a reusable scroll-to-agree TermsGate so conference (and future apps) can require acknowledgements consistently.
- 3.00 Unify frontend Docker/build packaging so releases match how production is hosted.
- 1.50 Align production compose topology with the live server layout.
- 2.00 Rebuild local interactive-dev so restarting apps does not leave orphan processes or starve the API.
- 1.00 Stop tracking real `.env` files in git so secrets and localhost URLs cannot be pushed by mistake.
- 1.00 Clean stale Dockerfiles/scripts/docs that caused wrong-path deploys.
- 2.50 Capture design notes (contestants, test mode, extras confirmation, terms, AGENTS) so “why we built it” is not lost.

**Section total: 13.50 hrs**

---

## Totals

- **Approved Grant Estimate: 20.00 hrs**
- **Other grant work: 27.00 hrs**
- **All grants combined: 47.00 hrs**
- **Everything else: 173.75 hrs**
- **Grand total: 220.75 hrs**

---

## AI Cost (est.) — Claude Fable 5

*Estimated API-equivalent cost for AI-assisted work in July. Model used: **Claude Fable 5** (Cursor “Other Models” pool). Not a Cursor invoice export — token counts are estimated from billable hours.*

### Rates (per 1M tokens)

| | Rate |
| --- | --- |
| Input | **$10** |
| Output | **$50** |

Source: [Cursor — Claude Fable 5](https://cursor.com/docs/models/claude-fable-5)

### Token estimate assumptions

For agentic Cursor work in this monorepo (tools, large context, multi-step edits):

- **~750,000 input tokens / hour**
- **~150,000 output tokens / hour**
- **≈ $15.00 / hour** at list rates  
  (`0.75×$10` + `0.15×$50`)

Prompt-cache discounts (when Cursor/Anthropic apply them) can lower real input cost; figures below are **list-rate / worst-case** for invoicing transparency.

### Cost by rollup

| Scope | Hours | Est. input tokens | Est. output tokens | Est. AI cost |
| --- | ---: | ---: | ---: | ---: |
| Approved Grant Estimate | 20.00 | 15.0M | 3.0M | **$300.00** |
| Other grant work | 27.00 | 20.25M | 4.05M | **$405.00** |
| **All grants** | **47.00** | **35.25M** | **7.05M** | **$705.00** |
| Everything else | 173.75 | 130.31M | 26.06M | **$2,606.25** |
| **Grand total** | **220.75** | **165.56M** | **33.11M** | **$3,311.25** |

### Notes

- Hours above are the same engineering estimates used in this document (meetings/testing/review folded into line items).
- Actual billed usage depends on plan (included Max/premium pool vs prepaid credits), cache hits, thinking effort, and how many parallel agents ran — treat this as an **order-of-magnitude API-equivalent** figure for “what Fable 5 tokens for this work would cost at published rates.”
