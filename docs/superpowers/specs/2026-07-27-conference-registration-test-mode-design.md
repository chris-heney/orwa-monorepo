# Conference Registration Test Mode (`&test`) — Design

**Date:** 2026-07-27  
**Status:** Implemented (2026-07-27)  
**Apps touched:** `apps/conference-registration` only  
**Related:** Authorize.NET sandbox token already implemented in `apps/strapi` (`payment-mode.ts`)

## Problem

Staff need to exercise the full public registration workflow against a conference that is not open for registration, without enabling Admin View (which exposes staff-only UI). Payment must hit Authorize.NET sandbox, while emails and all other registration side effects must run exactly as a live registration.

## Goals

1. Presence-only URL flag `&test` unlocks the public form when the conference status would otherwise show closed.
2. UX is the normal public registration path — not Admin View.
3. On submit, attach the existing `payload.test` sandbox token (MD5 of trimmed/lowercased registrant email) so production Strapi routes Card payments to Authorize.NET sandbox.
4. Do not skip any webhook pathways that create records or send emails.
5. Show a discreet persistent banner so staff know they are in test mode.

## Non-goals

- Strapi / webhook changes (sandbox check already exists).
- Shared secrets or auth gating for `&test`.
- Marking DB records as “test”.
- Suppressing, redirecting, or altering confirmation emails.
- Changing Invoice vs Card behavior beyond attaching the existing sandbox token.

## Approach

Frontend-only flag (Approach 1). Detection, open-gate bypass, admin suppression, banner, and submit-time token attachment live entirely in `conference-registration`.

## Detection & context

- Treat `&test` like `&admin=`: presence-only; value ignored (`?test`, `?test=`, `?test=1` all enable test mode).
- Read once in `AppContextProvider`; expose `isTestMode: boolean` via context.
- Add `test` to `PRESERVED_PARAMS` in `wizardPersistence` so `?step=` sync never drops it.

## Access & public UX

When `isTestMode` is true:

| Concern | Behavior |
|---------|----------|
| Open/closed gate | Treat as available even if status is closed / coming soon / kiosk-only-without-kiosk-source |
| TermsGate | Mount when the form is available via test mode (same as open registration) |
| Admin UI | Fully suppressed — no LoginModal from `&admin`, no ProfileMenu / notification settings, no entry list sidebar, no admin-only ticket options, no admin validation exceptions |
| `&admin=` coexistence | Test mode wins: public UX only; sandbox token still applies |
| Banner | Persistent discreet banner, e.g. “Test mode — sandbox payment” |

`isTestMode` is **not** an alias for `isAdminView`. Call sites that currently gate on `isAdminView` must continue to require real admin (validated login + Admin View), and must not treat test mode as admin.

## Submit + sandbox token

In `handleSubmitPayload` (and any other public submit path that posts to `conference-webhook`):

1. If `isTestMode` and `registrant.email` is non-empty after trim:
2. Normalize: trim + lowercase.
3. Set `payload.test` to MD5 hex digest of that string.
4. Submit through the normal `_postRegistration` / `conference-webhook` path — no skips.

Backend (`shouldUseAuthorizeNetTestMode`) already:

- Uses sandbox when `NODE_ENV === "development"`, or
- Uses sandbox in production when `test === md5(normalize(registrant.email))`.

Invoice payments still run the full create/email path; the token is unused for gateway selection.

Do **not** hash billing email — registrant email only (matches existing webhook).

## Error handling

Same as live:

- Step validation toasts and field highlights unchanged.
- Authorize.NET sandbox declines surface with the same error UI.
- No test-mode shortcuts past validation or payment.

## Testing

| Case | Expectation |
|------|-------------|
| `?test` / `?test=` / `?test=1` | `isTestMode === true` |
| No `test` param | `isTestMode === false` |
| Closed conference + `&test` | Form available; TermsGate mounts |
| Closed conference without `&test` or admin | Closed message (unchanged) |
| `&test` + `&admin=` | No login modal / ProfileMenu / admin ticket options; banner shown; form public |
| Submit with `&test` | Payload includes `test: md5(registrant.email)` |
| Submit without `&test` | Payload omits `test` (or leaves unset) |
| `wizardPersistence` step sync | `test` query param preserved |

## Files likely touched

- `AppContextProvider.tsx` — detect + expose `isTestMode`
- `App.tsx` — TermsGate when test mode unlocks form
- `ConferenceForm.tsx` — open-gate includes `isTestMode`; never unlock via admin when test mode forces public
- `LoginModal.tsx` — do not show for `&admin` when `isTestMode`
- `Header.tsx` / `ProfileMenu` usage — suppress admin chrome under test mode
- `StepNavigation.tsx` — attach MD5 token on submit; admin validation exceptions stay admin-only
- Ticket / step components that branch on `isAdminView` — leave as admin-only
- `wizardPersistence.ts` (+ spec) — preserve `test`
- New helper + spec: `isTestMode` detection and/or `buildSandboxTestToken(email)`

## Security note

Anyone with the URL can open a closed conference, create real registration records, and trigger real emails, with Card charges going to sandbox. Accepted trade-off for a staff URL tool, matching the low-friction pattern of `&admin=` (admin still requires login; test does not).
