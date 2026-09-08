# Conference Contestant Soft Cancellation

## Goal

Replace destructive contestant deletion with an auditable, recoverable
cancellation lifecycle. Cancelling a golfer must preserve every fact needed to
calculate, process, and audit a later refund while immediately removing that
golfer from active capacity, rosters, and reporting.

The first production use will cancel all golfers on conference registration
IDs 16781, 16792, and 16817. Refunds, registration totals, invoices, and payment
transactions are explicitly outside this operation.

## Data model

Add these fields to `conference-contestant`:

- `status`: enum `active | cancelled`, required, default `active`
- `cancelled_at`: datetime, nullable
- `cancelled_reason`: text, nullable
- `cancelled_by`: string, nullable, storing the authenticated actor identifier

Existing records become active through the schema default. Cancellation keeps
the contestant row, registration and ticket relations, `fee`, Mulligan
components, team history, contact details, and creation timestamps unchanged.

`cancelled_by` is denormalized rather than a user relation because production
operations may authenticate through more than one identity system or a shared
API token. The endpoint records the strongest available stable identity and
does not invent attribution when none exists.

## API lifecycle

Dedicated authenticated actions replace generic deletion:

- `POST /api/conference-contestants/:documentId/cancel`
- `POST /api/conference-contestants/:documentId/restore`

Cancel accepts a required reason. It is idempotent: cancelling an already
cancelled contestant does not adjust capacity twice. If the contestant's
Contestant-context ticket name contains `Golfer` case-insensitively, cancellation
atomically increments `conference.available_contestants` by one.

Restore is also idempotent. A golfer restore first runs the same authoritative
capacity check used by registration checkout, then atomically decrements
availability and returns the record to active status. A restore cannot exceed
capacity.

Generic hard DELETE for conference contestants will be blocked at the API so a
future UI or direct API call cannot bypass preservation. Whole-registration
deletion remains unchanged in this scope; the three requested operations do
not delete their parent registrations.

## Active versus historical views

Cancelled contestants are excluded from:

- Conference Manager active grids, headcounts, revenue metrics, and exports
- public conference/tournament rosters
- server summary counts

Conference Manager provides a `Show cancelled` view. Cancelled rows visibly
retain ticket fee and Mulligan details and expose cancellation metadata. Their
actions offer Restore, not Delete. Registration receipts retain the historical
contestant in a clearly labelled cancelled section so staff can validate a
refund without treating the person as active.

## Capacity reconciliation

The production counter already drifted because historical exact-name logic
missed `Golfer - Contestant Only` and old hard deletes did not return slots.
Before the first soft cancellations, compute the authoritative active golfer
count using the shared case-insensitive contains-`Golfer` predicate and set:

`available_contestants = configured maximum (36) - active golfer count`

Capture the before value and derivation. Then cancel the 12 golfers attached to
registrations 16781, 16792, and 16817 through the new endpoint. Each operation
returns one slot atomically. Finally verify the counter equals
`36 - remaining active golfers`.

This one-time reconciliation is part of the controlled production operation,
not a recurring alternate source of truth.

## Refund-data guarantees

Cancellation never changes:

- contestant `fee`
- Mulligan items, quantities, or extra relations
- registration `total`
- invoice records
- card transaction IDs or payment records

No refund, invoice adjustment, email, or payment-provider action occurs. The
preserved fields remain available for the later approved refund workflow.

## Error handling and concurrency

- Missing contestant or registration: return not found without side effects.
- Missing cancellation reason: reject without side effects.
- Repeated cancel/restore: return current state without changing capacity.
- Capacity update and status transition run in one database transaction.
- Restore uses the authoritative capacity gate and fails with the same
  plain-language sold-out error as registration.
- A partial batch failure stops further production operations and is reported;
  completed cancellations remain individually auditable and idempotent.

## Testing

Use test-driven development:

1. Cancel preserves fee, Mulligans, relations, and payment-linked parent data.
2. Cancelling a golfer increments capacity exactly once.
3. Cancelling Fisher/non-golf contestants does not adjust golf capacity.
4. Restore decrements once and rejects when sold out.
5. Repeated cancel/restore is idempotent.
6. Generic hard DELETE is blocked.
7. Active lists, metrics, exports, public rosters, and receipts handle cancelled
   contestants as designed.
8. Browser verification covers Cancel confirmation, Show cancelled, retained
   fee/Mulligans, and Restore in both light and dark modes.

## Deployment and production operation

Ship scoped Strapi and member-manager commits. Deploy Strapi through the
production Docker image/restart path and member-manager as a direct production
Vite build to WP Engine, followed by both required cache flushes and live bundle
verification.

After deployment:

1. Snapshot the 12 target golfers and their refund evidence.
2. Reconcile capacity from active golfer records.
3. Soft-cancel only golfers attached to registrations 16781, 16792, and 16817,
   with reason `2026 Fall golf overage — pending card refund`.
4. Verify all three parent registrations and their payments/totals are intact.
5. Verify the 12 contestants and Mulligans remain accessible as cancelled.
6. Verify active golfer count and capacity arithmetic.
7. Save a non-secret before/after audit under `tmp/golf-overage-2026-fall/`.

## Explicitly out of scope

- Processing or initiating refunds
- Adjusting invoices or registration totals
- Sending emails
- Soft deletion of whole conference registrations
- Unrelated contestant/team refactors
