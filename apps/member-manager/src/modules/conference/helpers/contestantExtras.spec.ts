import { describe, expect, it } from "vitest";
import {
  applyExtraQuantity,
  countForExtra,
  extraMatchesContestantContext,
  extraIsExcludedForTicket,
  groupItemsByExtra,
  itemMatchesExtra,
  maxQtyFor,
  minQtyFor,
  missingSelectionExtras,
  quantitySelectionEnabled,
  shouldShowContestantExtra,
  type ContestantExtraOption,
  type ContestantItemRow,
} from "./contestantExtras";

const mulligan: ContestantExtraOption = {
  id: "mulligandocid0001",
  entityId: 3,
  documentId: "mulligandocid0001",
  name: "Mulligan",
  context: "Contestants",
  price_event: 25,
  price_online: 25,
  quantity_selection: true,
  max_qty_each: 4,
  min_qty_each: 0,
};

const pin: ContestantExtraOption = {
  id: "closestpin0000001",
  entityId: 8,
  documentId: "closestpin0000001",
  name: "Closest to Pin",
  context: "Contestant",
  price_event: 10,
  quantity_selection: false,
};

const lunch: ContestantExtraOption = {
  id: "lunchdocid0000001",
  name: "Lunch",
  context: "Attendee",
};

const shirt: ContestantExtraOption = {
  id: "shirtdocid0000001",
  name: "Contestant Shirt",
  context: "Contestant",
  requires_selection: true,
  selection_name: "Size",
  selection_options: ["S", "M", "L"],
  quantity_selection: false,
};

const fishingTicket = { id: "fisherticket00001", entityId: 23 };
const golferTicket = { id: "golferticket00001", entityId: 21 };

const mulliganExcludedOnFisher: ContestantExtraOption = {
  ...mulligan,
  excluded: [fishingTicket],
};

const fourMulligans: ContestantItemRow[] = [
  { label: "Mulligan", key: "Mulligan 3", value: "25", item: { id: "mulligandocid0001", entityId: 3 } },
  { label: "Mulligan", key: "Mulligan 3", value: "25", item: 3 },
  { label: "Mulligan", key: "Mulligan 3", value: "25", item: "mulligandocid0001" },
  { label: "Mulligan", key: "Mulligan 3", value: "25", item: { documentId: "mulligandocid0001" } },
];

describe("extraMatchesContestantContext", () => {
  it("accepts Contestant and Contestants", () => {
    expect(extraMatchesContestantContext({ context: "Contestant" })).toBe(true);
    expect(extraMatchesContestantContext({ context: "Contestants" })).toBe(true);
    expect(extraMatchesContestantContext({ context: "Attendee" })).toBe(false);
  });
});

describe("quantitySelectionEnabled / min / max", () => {
  it("uses the explicit toggle, else max_qty_each > 1", () => {
    expect(quantitySelectionEnabled(mulligan)).toBe(true);
    expect(quantitySelectionEnabled(pin)).toBe(false);
    expect(quantitySelectionEnabled({ ...mulligan, quantity_selection: null })).toBe(true);
    expect(
      quantitySelectionEnabled({
        id: 1,
        name: "Legacy",
        quantity_selection: null,
        max_qty_each: 1,
      })
    ).toBe(false);
  });

  it("clamps min at 0 and max at least 1", () => {
    expect(minQtyFor(mulligan)).toBe(0);
    expect(maxQtyFor(mulligan)).toBe(4);
    expect(maxQtyFor(pin)).toBe(1);
  });
});

describe("groupItemsByExtra / countForExtra / itemMatchesExtra", () => {
  it("groups mixed id shapes as one Mulligan (x4)", () => {
    const grouped = groupItemsByExtra(fourMulligans);
    expect([...grouped.values()]).toEqual([{ label: "Mulligan", count: 4 }]);
    expect(countForExtra(fourMulligans, mulligan)).toBe(4);
    expect(itemMatchesExtra(fourMulligans[1], mulligan)).toBe(true);
  });
});

describe("applyExtraQuantity", () => {
  it("adds rows up to max and writes a scalar item id", () => {
    const next = applyExtraQuantity([], mulligan, 3);
    expect(next).toHaveLength(3);
    expect(next.every((row) => row.item === "mulligandocid0001")).toBe(true);
    expect(next[0]).toMatchObject({
      label: "Mulligan",
      value: "25",
    });
  });

  it("clamps above max and treats non-numbers as 0", () => {
    expect(applyExtraQuantity([], mulligan, 9)).toHaveLength(4);
    expect(applyExtraQuantity(fourMulligans, mulligan, Number.NaN)).toHaveLength(0);
  });

  it("reduces quantity and leaves other extras in place", () => {
    const withPin: ContestantItemRow[] = [
      ...fourMulligans,
      { label: "Closest to Pin", item: "closestpin0000001", value: "10" },
    ];
    const next = applyExtraQuantity(withPin, mulligan, 1);
    expect(countForExtra(next, mulligan)).toBe(1);
    expect(countForExtra(next, pin)).toBe(1);
  });

  it("boolean extras are 0 or 1 even if max_qty_each is higher", () => {
    const next = applyExtraQuantity([], { ...pin, max_qty_each: 5 }, 5);
    expect(next).toHaveLength(1);
  });
});

describe("shouldShowContestantExtra", () => {
  it("hides attendee extras and ticket-excluded extras unless already owned", () => {
    expect(shouldShowContestantExtra(lunch, [], golferTicket)).toBe(false);
    expect(
      shouldShowContestantExtra(mulliganExcludedOnFisher, [], fishingTicket)
    ).toBe(false);
    expect(
      shouldShowContestantExtra(mulliganExcludedOnFisher, [], golferTicket)
    ).toBe(true);
    expect(
      shouldShowContestantExtra(
        mulliganExcludedOnFisher,
        fourMulligans,
        fishingTicket
      )
    ).toBe(true);
  });

  it("matches excluded ticket by numeric entityId", () => {
    expect(extraIsExcludedForTicket(mulliganExcludedOnFisher, 23)).toBe(true);
    expect(extraIsExcludedForTicket(mulliganExcludedOnFisher, 21)).toBe(false);
  });
});

describe("missingSelectionExtras", () => {
  it("flags taken extras that still need a choice", () => {
    const taken = applyExtraQuantity([], shirt, 1);
    expect(missingSelectionExtras([shirt], taken).map((e) => e.name)).toEqual([
      "Contestant Shirt",
    ]);
    const sized = applyExtraQuantity([], shirt, 1, "M");
    expect(missingSelectionExtras([shirt], sized)).toEqual([]);
  });
});
