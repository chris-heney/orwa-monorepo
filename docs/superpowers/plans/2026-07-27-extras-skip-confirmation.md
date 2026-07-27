# Extras Skip Confirmation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Soft-confirm when Attendee/Vendor ticket save has no optional extras selected, listing unchecked optionals, with Continue / Go back (highlight) actions.

**Architecture:** Pure helper `getUncheckedOptionalExtras` (plus list formatter) decides whether to show the dialog. `TicketModal` gates Add/Update after existing validation; nested confirm overlay; local Extras highlight via `validationHighlightClassName` passed into `AddExtras`.

**Tech Stack:** React, react-hook-form, Vitest, existing `filterVisibleExtras` / `isExtraIncluded` / `validationHighlightClassName`.

## Global Constraints

- Scope: Attendee and Vendor `TicketModal` only (not Contestant, Booth, registration-level extras).
- Trigger only when zero **optional** extras are selected; included/default-checked do not suppress the dialog.
- Dialog copy: `Are you sure you do not want to add: {list}?`
- Buttons: **Continue without extras** / **Go back and choose** (not Yes/No).
- List grammar: 1 → `Lunch`; 2 → `Lunch or Dinner`; 3+ → `Lunch, Dinner, or Reception`.
- Do not use `window.confirm`.
- Keep A La Carte hard-fail before this soft confirm.
- Spec: `docs/superpowers/specs/2026-07-27-extras-skip-confirmation-design.md`

---

## File structure

| File | Responsibility |
|------|----------------|
| `apps/conference-registration/src/helpers/getUncheckedOptionalExtras.ts` | Pure: optional visibles not selected; English list formatter |
| `apps/conference-registration/src/helpers/getUncheckedOptionalExtras.spec.ts` | Vitest coverage for helper + formatter |
| `apps/conference-registration/src/components/_components/TicketModal.tsx` | Gate save; confirm overlay; highlight state; scroll |
| `apps/conference-registration/src/components/AddExtras.tsx` | Accept `highlightInvalid`; apply shared invalid styles |

---

### Task 1: `getUncheckedOptionalExtras` + list formatter (TDD)

**Files:**
- Create: `apps/conference-registration/src/helpers/getUncheckedOptionalExtras.ts`
- Create: `apps/conference-registration/src/helpers/getUncheckedOptionalExtras.spec.ts`

**Interfaces:**
- Consumes: `filterVisibleExtras`, `isExtraIncluded`, `IExtraOption`, `ITicketPayload`, `ExtraVisibilityContext`
- Produces:
  - `export type GetUncheckedOptionalExtrasArgs = { ticket: Pick<ITicketPayload, "extras" | "ticket_type">; extras: IExtraOption[] | undefined; context: "Attendee" | "Vendor" }`
  - `export const getUncheckedOptionalExtras = (args: GetUncheckedOptionalExtrasArgs): IExtraOption[]`
  - `export const formatExtrasConfirmList = (names: string[]): string`

**Behavior notes for implementer:**
- Normalize `Vendor` → `Attendee` for `filterVisibleExtras` (same as `AddExtras`).
- Optional = visible and `!isExtraIncluded(ticket as ITicketPayload, extras, extra.id)`.
- Selected check: `ticket.extras` array contains that extra’s id (`String` compare); quantity ≥ 1 counts.
- Return unchecked optionals only (empty ⇒ caller skips dialog).
- `formatExtrasConfirmList`: join with Oxford comma + `or` as in Global Constraints; empty → `""`.

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, expect, it } from "vitest";
import {
  formatExtrasConfirmList,
  getUncheckedOptionalExtras,
} from "./getUncheckedOptionalExtras";
import { IExtraOption, ITicketOption, ITicketPayload } from "../types/types";

const attendeeTicket = { id: 10, name: "Attendee" } as ITicketOption;

const lunch = {
  id: 37,
  name: "Lunch",
  context: "Attendee",
  included: [],
  excluded: [],
} as unknown as IExtraOption;

const dinner = {
  id: 38,
  name: "Dinner",
  context: "Attendee",
  included: [],
  excluded: [],
} as unknown as IExtraOption;

const reception = {
  id: 39,
  name: "Reception",
  context: "Attendee",
  included: [],
  excluded: [],
} as unknown as IExtraOption;

const includedMeal = {
  id: 40,
  name: "Included Breakfast",
  context: "Attendee",
  included: [attendeeTicket],
  excluded: [],
} as unknown as IExtraOption;

const boothExtra = {
  id: 1,
  name: "Table skirt",
  context: "Booth",
  included: [],
  excluded: [],
} as unknown as IExtraOption;

const qtyExtra = {
  id: 50,
  name: "Extra Meal Ticket",
  context: "Attendee",
  max_qty_each: 5,
  included: [],
  excluded: [],
} as unknown as IExtraOption;

const baseTicket = {
  extras: [] as (string | number)[],
  ticket_type: attendeeTicket,
} as Pick<ITicketPayload, "extras" | "ticket_type">;

describe("getUncheckedOptionalExtras", () => {
  it("returns all optional visibles when none selected", () => {
    const result = getUncheckedOptionalExtras({
      ticket: baseTicket,
      extras: [lunch, dinner, includedMeal, boothExtra],
      context: "Attendee",
    });
    expect(result.map((e) => e.name).sort()).toEqual(["Dinner", "Lunch"]);
  });

  it("returns empty when at least one optional is selected", () => {
    const result = getUncheckedOptionalExtras({
      ticket: { ...baseTicket, extras: [37] },
      extras: [lunch, dinner],
      context: "Attendee",
    });
    expect(result).toEqual([]);
  });

  it("ignores included selections — still returns unchecked optionals", () => {
    const result = getUncheckedOptionalExtras({
      ticket: { ...baseTicket, extras: [40] },
      extras: [lunch, dinner, includedMeal],
      context: "Attendee",
    });
    expect(result.map((e) => e.name).sort()).toEqual(["Dinner", "Lunch"]);
  });

  it("returns empty when no visible extras for context", () => {
    const result = getUncheckedOptionalExtras({
      ticket: baseTicket,
      extras: [boothExtra],
      context: "Attendee",
    });
    expect(result).toEqual([]);
  });

  it("Vendor context uses Attendee extras visibility", () => {
    const result = getUncheckedOptionalExtras({
      ticket: baseTicket,
      extras: [lunch, boothExtra],
      context: "Vendor",
    });
    expect(result.map((e) => e.name)).toEqual(["Lunch"]);
  });

  it("quantity optional with qty >= 1 counts as selected", () => {
    const result = getUncheckedOptionalExtras({
      ticket: { ...baseTicket, extras: [50, 50] },
      extras: [lunch, qtyExtra],
      context: "Attendee",
    });
    expect(result).toEqual([]);
  });
});

describe("formatExtrasConfirmList", () => {
  it("formats one, two, and three-plus names", () => {
    expect(formatExtrasConfirmList(["Lunch"])).toBe("Lunch");
    expect(formatExtrasConfirmList(["Lunch", "Dinner"])).toBe(
      "Lunch or Dinner"
    );
    expect(formatExtrasConfirmList(["Lunch", "Dinner", "Reception"])).toBe(
      "Lunch, Dinner, or Reception"
    );
  });

  it("returns empty string for empty input", () => {
    expect(formatExtrasConfirmList([])).toBe("");
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd apps/conference-registration && npx vitest run src/helpers/getUncheckedOptionalExtras.spec.ts
```

Expected: FAIL (module / exports not found).

- [ ] **Step 3: Write minimal implementation**

```ts
// apps/conference-registration/src/helpers/getUncheckedOptionalExtras.ts
import { filterVisibleExtras } from "./filterVisibleExtras";
import { isExtraIncluded } from "./isExtraIncluded";
import { IExtraOption, ITicketPayload } from "../types/types";

export type GetUncheckedOptionalExtrasArgs = {
  ticket: Pick<ITicketPayload, "extras" | "ticket_type">;
  extras: IExtraOption[] | undefined;
  context: "Attendee" | "Vendor";
};

const isSelected = (
  ticketExtras: ITicketPayload["extras"] | undefined,
  extraId: IExtraOption["id"]
): boolean => {
  if (!Array.isArray(ticketExtras)) return false;
  return ticketExtras.some((id) => String(id) === String(extraId));
};

export const getUncheckedOptionalExtras = ({
  ticket,
  extras,
  context,
}: GetUncheckedOptionalExtrasArgs): IExtraOption[] => {
  const visibilityContext = context === "Vendor" ? "Attendee" : context;
  const visible = filterVisibleExtras({
    extras,
    context: visibilityContext,
    ticketTypeId: ticket.ticket_type?.id,
  });

  const optionals = visible.filter(
    (extra) =>
      !isExtraIncluded(ticket as ITicketPayload, extras, extra.id)
  );

  const hasOptionalPick = optionals.some((extra) =>
    isSelected(ticket.extras, extra.id)
  );
  if (hasOptionalPick) return [];

  return optionals.filter((extra) => !isSelected(ticket.extras, extra.id));
};

export const formatExtrasConfirmList = (names: string[]): string => {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} or ${names[1]}`;
  const head = names.slice(0, -1).join(", ");
  return `${head}, or ${names[names.length - 1]}`;
};
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
cd apps/conference-registration && npx vitest run src/helpers/getUncheckedOptionalExtras.spec.ts
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/conference-registration/src/helpers/getUncheckedOptionalExtras.ts \
  apps/conference-registration/src/helpers/getUncheckedOptionalExtras.spec.ts
git commit -m "conference-registration: helper for unchecked optional extras confirm"
```

---

### Task 2: `AddExtras` highlight support

**Files:**
- Modify: `apps/conference-registration/src/components/AddExtras.tsx`

**Interfaces:**
- Consumes: `validationHighlightClassName` from `../helpers/validationHighlight`
- Produces: optional prop `highlightInvalid?: boolean` on `AddExtras`
- When `highlightInvalid` is true and `visibleExtras.length > 0`, wrap/root the extras block with `validationHighlightClassName` and `data-validation-field="ticket-extras"`.

- [ ] **Step 1: Add prop and apply highlight**

Update the component signature:

```tsx
const AddExtras = ({
  field,
  fieldIndex,
  context,
  useYesNo = false,
  highlightInvalid = false,
}: {
  field: string;
  fieldIndex?: number;
  context: "Attendee" | "Vendor" | "Registration" | "Contestant" | "Booth";
  useYesNo?: boolean;
  highlightInvalid?: boolean;
}) => {
```

Import:

```tsx
import { validationHighlightClassName } from "../helpers/validationHighlight";
```

Change the outer return wrapper (the `visibleExtras.length > 0` branch) from `<div>` to:

```tsx
return visibleExtras.length > 0 ? (
  <div
    data-validation-field="ticket-extras"
    className={highlightInvalid ? validationHighlightClassName : undefined}
  >
    {/* existing heading + grid unchanged */}
```

- [ ] **Step 2: Smoke-check TypeScript on the file**

```bash
cd apps/conference-registration && npx tsc -p tsconfig.app.json --noEmit 2>&1 | head -40
```

Expected: no new errors in `AddExtras.tsx` (existing project errors elsewhere may appear; ignore unrelated).

- [ ] **Step 3: Commit**

```bash
git add apps/conference-registration/src/components/AddExtras.tsx
git commit -m "conference-registration: AddExtras invalid highlight for ticket extras"
```

---

### Task 3: Wire confirm dialog into `TicketModal`

**Files:**
- Modify: `apps/conference-registration/src/components/_components/TicketModal.tsx`

**Interfaces:**
- Consumes: `getUncheckedOptionalExtras`, `formatExtrasConfirmList` from Task 1; `highlightInvalid` on `AddExtras` from Task 2
- Produces: Soft-confirm gate on Attendee/Vendor save only

- [ ] **Step 1: Add imports and local state**

Near other imports:

```tsx
import {
  formatExtrasConfirmList,
  getUncheckedOptionalExtras,
} from "../../helpers/getUncheckedOptionalExtras";
```

Inside the component (with other `useState`):

```tsx
const [extrasConfirmOpen, setExtrasConfirmOpen] = useState(false);
const [highlightExtras, setHighlightExtras] = useState(false);
const [pendingUncheckedExtras, setPendingUncheckedExtras] = useState<
  IExtraOption[]
>([]);
```

- [ ] **Step 2: Extract `commitSave` and gate `handleSave`**

Refactor the successful-save tail of `handleSave` (append/update + close modal) into:

```tsx
const commitSave = () => {
  const updatedTicket = { ...ticket, price: calculateSubtotal() };
  if (ticketIndex === -1) append(updatedTicket);
  else update(ticketIndex, updatedTicket);
  setExtrasConfirmOpen(false);
  setHighlightExtras(false);
  setPendingUncheckedExtras([]);
  setIsOpen({
    open: false,
    context: "create",
  });
};
```

After the existing A La Carte hard-fail block (and only once all prior validation has passed), add:

```tsx
if (type === "Attendee" || type === "Vendor") {
  const unchecked = getUncheckedOptionalExtras({
    ticket,
    extras: ExtraOptions,
    context: type,
  });
  if (unchecked.length > 0) {
    setPendingUncheckedExtras(unchecked);
    setExtrasConfirmOpen(true);
    return;
  }
}

commitSave();
```

Remove the previous inline append/update/close from `handleSave` (now only via `commitSave`).

- [ ] **Step 3: Clear highlight when an optional extra is selected**

```tsx
useEffect(() => {
  if (!highlightExtras) return;
  if (type !== "Attendee" && type !== "Vendor") return;
  const unchecked = getUncheckedOptionalExtras({
    ticket,
    extras: ExtraOptions,
    context: type,
  });
  if (unchecked.length === 0) {
    setHighlightExtras(false);
  }
}, [highlightExtras, ticket?.extras, ticket?.ticket_type?.id, type, ExtraOptions]);
```

Also reset confirm/highlight state in `closeModal`:

```tsx
setExtrasConfirmOpen(false);
setHighlightExtras(false);
setPendingUncheckedExtras([]);
```

- [ ] **Step 4: Pass highlight into AddExtras**

```tsx
<AddExtras
  field={"tickets"}
  fieldIndex={ticketIndex}
  context={type}
  highlightInvalid={highlightExtras}
/>
```

- [ ] **Step 5: Render nested confirm overlay**

Inside the outer TicketModal root (sibling to the main dialog panel, still under the fixed inset container — or as a second fixed layer with higher z-index), when `extrasConfirmOpen`:

```tsx
{extrasConfirmOpen && (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="extras-confirm-title"
      className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
    >
      <h2
        id="extras-confirm-title"
        className="text-lg font-semibold text-slate-900"
      >
        Extras
      </h2>
      <p className="mt-3 text-base text-slate-700">
        Are you sure you do not want to add:{" "}
        {formatExtrasConfirmList(
          pendingUncheckedExtras.map((e) => e.name)
        )}
        ?
      </p>
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          onClick={() => {
            setExtrasConfirmOpen(false);
            setHighlightExtras(true);
            requestAnimationFrame(() => {
              document
                .querySelector('[data-validation-field="ticket-extras"]')
                ?.scrollIntoView({ behavior: "smooth", block: "center" });
            });
          }}
        >
          Go back and choose
        </button>
        <button
          type="button"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          onClick={commitSave}
        >
          Continue without extras
        </button>
      </div>
    </div>
  </div>
)}
```

Place this overlay as a React fragment sibling wrapping is fine: change the outermost return to a fragment `<>...</>` containing the existing modal div plus this overlay, **or** nest the overlay as the last child of the outer `fixed inset-0` wrapper with `z-[60]` so it stacks above the ticket panel.

- [ ] **Step 6: Manual browser check**

1. Run conference-registration locally (vite on its configured port).
2. Open Attendee modal for a conference with optional Lunch/Dinner; leave them unchecked; click Add Attendee.
3. Confirm dialog lists them; **Go back and choose** highlights Extras; **Continue without extras** saves.
4. Repeat with Vendor; Contestant path must not show this dialog.

- [ ] **Step 7: Commit**

```bash
git add apps/conference-registration/src/components/_components/TicketModal.tsx \
  apps/conference-registration/src/components/AddExtras.tsx
git commit -m "conference-registration: confirm when Attendee/Vendor skip optional extras"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Soft confirm when no optional extras | Task 1 + 3 |
| List unchecked optionals in copy | Task 1 formatter + Task 3 UI |
| Continue without extras → save | Task 3 |
| Go back → highlight + stay open | Task 2 + 3 |
| Included defaults do not count as user picks | Task 1 |
| Attendee/Vendor only | Task 3 `type` gate |
| Nested overlay, not `window.confirm` | Task 3 |
| A La Carte hard-fail first | Task 3 order in `handleSave` |
| Clear highlight on fix / close | Task 3 |
| Unit tests for helper | Task 1 |

## Self-review notes

- No placeholders left in steps.
- Helper return type `IExtraOption[]` is consistent across Task 1 and Task 3.
- `data-validation-field="ticket-extras"` is shared between AddExtras and scroll selector.
- Vendor→Attendee visibility normalization lives in the helper (single source of truth with AddExtras behavior).
