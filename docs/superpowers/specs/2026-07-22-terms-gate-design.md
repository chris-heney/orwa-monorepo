# Terms Gate Design

## Goal

Reusable scroll-to-agree terms flow for ORWA apps, backed by a Strapi `term` collection and a shared NX library `TermsGate`. First consumers: conference-registration and member-manager (Conference Manager).

## Data model (Strapi `term`)

| Field | Type | Notes |
|-------|------|--------|
| `title` | string (required) | Modal header |
| `slug` | uid, unique | Auto from title; `localStorage` + audit key |
| `identifiers` | JSON `string[]` | Tags e.g. `Global`, `All Conferences`, `ORWA Conference ID #1` |
| `content` | richtext | Modal body |
| `updatedAt` | datetime | Built-in; version for re-acceptance |

No relation to conference — scoping is tag-only.

## Matching & order

```
needed = (global !== false ? ['Global'] : []) ∪ (terms ?? [])
include term iff identifiers ∩ needed ≠ ∅
```

If `needed` is empty → no overlay; render children.

Display order (bucket, then `updatedAt` ascending within bucket):

1. Identifier `Global`
2. Identifier `All Conferences`
3. All other matched identifiers (e.g. conference-specific)

## Library: `@orwa/terms-gate`

Path: `libs/terms-gate` (first shared NX lib; `tsconfig.base.json` path alias).

```tsx
<TermsGate
  terms={string[]}     // default []
  global={boolean}     // default true → always include "Global"
  apiEndpoint={string} // Strapi API base including /api
>
  {children}
</TermsGate>
```

### UX

- On load: locking full-screen overlay over children while pending terms remain.
- Modal: title header, `X of Y` upper-right, scrollable body, footer **Agree and Continue** disabled until body scrolled to bottom.
- Agree → persist acceptance, advance; after last → dismiss overlay.

### Client persistence

`localStorage` keyed by `slug`, value includes `updatedAt`. Content update (new `updatedAt`) forces re-agreement.

### Server audit (conference-registration)

Registration payload includes:

```ts
accepted_terms: { slug, title, updatedAt, agreedAt }[]
```

Persisted via existing conference-registration / webhook path. member-manager gate is UI + `localStorage` only for v1.

## Admin (member-manager)

Standalone **Terms** sidebar resource (not nested under Conference Manager):

- List / Create / Edit
- Fields: Title, auto slug, Identifiers chip input (Enter/Tab), Content (`RichTextInput`)

## App wiring

**conference-registration**

```tsx
<TermsGate
  terms={[`ORWA Conference ID #${conferenceId}`, 'All Conferences']}
  apiEndpoint={import.meta.env.VITE_API_ENDPOINT}
/>
```

**member-manager (Conference Manager)**

```tsx
<TermsGate
  terms={['All Conferences', 'ORWA Conference ID #' + conferenceId]}
  apiEndpoint={...}
/>
```

`global` defaults to `true` in both cases.

## Out of scope (v1)

- Strapi Admin custom UI (member-manager is the editor)
- Server-side ack for member-manager staff sessions
- Per-registration-type terms (Attendee vs Vendor) beyond identifier tags
