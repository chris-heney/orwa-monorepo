# Exports: UI-state column order, blank relation columns, and the N+1 query storm

Three defects in the CSV export path, one root cause each. Decisions and the
evidence behind them, for the next person who touches this.

## 1. Exports ignored the user's column order

**Symptom.** Toggling and dragging columns in the Columns picker changed the
grid but not the CSV.

**Cause.** Every exporter selected its columns with

```ts
availableColumns.filter(column => columnIds.includes(column.index))
```

`Array.filter` preserves the order of the array it filters — `availableColumns`,
i.e. the order the columns are *declared in the panel*. The user's order lives
in `columnIds`.

Both grid implementations render `columnIds.map(index => children[index])`:

- `ra-ui-materialui/.../DatagridConfigurable.js` → `columns.map(index => childrenArray[index])`
- `src/modules/_components/AgDatagrid/AgDatagrid.tsx` → `columnIds.map(index => fieldChildren[Number(index)])`

So `preferences.<key>.columns` **is** the on-screen order, and the CSV has to
map over it too.

**Decision.** One shared `selectExportColumns(availableColumns, columnIds)` in
`src/helpers/fetchRelatedRecord.ts`, applied to all 10 standard exporters.
Empty/absent `columnIds` still means "everything", and indices that no longer
resolve are dropped rather than emitting holes.

**Naylor is deliberately excluded** (`naylorExportWaterSystem.ts`): its column
order is a contractual directory format with its own title-priority sort, not a
reflection of the screen.

### Sub-decision: `exportRegistrations` lost its `.slice(8, 11)`

That exporter filtered the columns and then took *positions 8–10*, so it emitted
three columns regardless of what the user selected. A positional slice cannot
survive user-controlled ordering — with the ordering fix it would have sliced an
arbitrary window. Removed; the export now emits the selected columns in the
user's order like every other list.

## 2. Phone (and any relation column) exported blank

**Symptom.** Grant application exports had an empty Phone column while the grid
showed phone numbers. Email only worked because the exporter had a hand-written
special case that re-fetched the contact.

**Two independent causes, both fixed:**

**(a) The export runs a different query than the grid.** `ExportButton` issues
its *own* `dataProvider.getList` and passes only its own `meta` prop — it does
not inherit `ListBase`'s. With no meta the export fetched with `raw: false`, and
`DataProviderFactory.formatResponseRA` collapses every populated relation back
to a documentId string:

```ts
if (!Array.isArray(value) && isRelationOrMedia(value)) {
  raRecord[key] = this.relationRefId(value);   // object -> "abc123..."
}
```

So `point_of_contact` arrived as a bare string and there was no `.phone` to
read. This is why `BALANCE_META` has always set `raw: true`.

*Fix:* `ListManifest.exportMeta` (defaulting to `meta`), passed into
`ExportButton` by `ExportActionComponent` and `GrantExportAction`.

**(b) Dotted sources were never resolved.** The column is
`<TextField source="point_of_contact.phone" />`, but `readExportField` did a
flat `record[source]` lookup. Added `readPath` so the CSV walks the path the
same way the grid's field does.

Both were needed: (a) without (b) yields an object, (b) without (a) yields a
string.

### Behaviour change worth knowing: Email precedence

The old exporter preferred the *contact's* email; the grid prefers the
*application's* (`record.email ? record.email : record.point_of_contact?.email`).
The export now matches the grid, because "the CSV is what you see on screen" is
the invariant this whole change is built on.

## 3. One request per row (the real cause of slow exports)

**Symptom.** Network tab full of
`/grant-application-finals/<documentId>?populate[payouts][populate][payout_status]=true`,
one per record, and an export that took minutes with no indication it was working.

**Cause.** `ExportApplications` did **four** round trips per row:

| per-row call | what for |
| --- | --- |
| `getOne("contacts", point_of_contact)` | Email |
| `getOne("grant-statuses", status)` | Status |
| `balance(...)` → `getOne("grant-application-finals", id)` | Balance |
| `totalPaidOut(...)` → `getList("grant-payouts", …)` | Total Paid Out |

500 applications ⇒ ~2000 requests.

**Decision — populate once, compute locally.** `APPLICATION_EXPORT_META`
populates the contact, the status, both project relations and `payouts` (nested
`payout_status`), so the whole export is **one** request. `Balance` and
`Total Paid Out` become arithmetic on the row via the existing
`computeBalance` / `sumPayoutAmounts` helpers, which already read that shape.

Every populated key was checked against
`apps/strapi/.../grant-application-final/schema.json` — an unknown populate key
400s the whole request. `payouts` is populated nested, never `payouts=*`:
Strapi 5 walks the inverse `application` relation and errors
(`Invalid key application at payouts.application`).

*Consequence:* Total Paid Out now derives from the same populated payouts the
on-screen Balance uses, instead of a separate `getList` capped at
`perPage: 100`. Screen and CSV can no longer disagree.

**Decision — a generic fallback for the other exporters.** Hand-tuning populate
for every module is not worth it, so `buildExportRelationCache` collects the
id-shaped values the chosen columns point at, de-duplicates them per resource,
and issues **one `getMany` per relation type**. `resolveExportCell` consults
that cache before falling back to the old per-record `getOne`, so a cache miss
or a failed batch degrades to previous behaviour rather than breaking the
download.

### Still N+1: the Award Payouts tab

`exportPayouts.tsx` still calls `balance()` and `totalPaidOut()` per row, so the
Payouts tab keeps its per-record request storm. Left alone deliberately — the
reported problem was the Applications export, and payouts needs the same
populate/compute treatment as a separate change.

### Not affected: the Naylor and Water Systems exports

`MembershipExportAction` runs its **own** `dataProvider.getList` with its own
hardcoded meta and never goes through `ExportButton`, so `exportMeta` cannot
reach it. `defaultWatersystemExport` / `defaultAssociateExport` still pick up
the column-ordering fix; `naylorExportWaterSystem` keeps its contractual order.

## 4. No progress indication

`ExportAction` now announces the row count on click and confirms when the file
is written, wrapping whichever exporter is in play. A CSV download is otherwise
silent between click and file, which on a large list reads as a dead button.

## Verification

- `tsc --noEmit`: **147 errors, zero in any touched file** — matches the
  documented pre-existing baseline. (A worktree needs
  `apps/member-manager/node_modules` symlinked from the main checkout first;
  without it the count balloons to ~1256 unresolved-type errors.)
- `vitest`: **348/354 assertions pass, +11 new tests**. Set-diffed against
  `main`: no new failing tests except
  `award-nominations/helpers/documentText.spec.ts`, which reads an untracked
  fixture from `tmp/` that no worktree has.
- `vite build --mode production`: succeeds.
- **Not visually verified** — this environment has no backend, no `.env` and no
  browser driver. The claims above rest on mechanism, types, tests and build.
