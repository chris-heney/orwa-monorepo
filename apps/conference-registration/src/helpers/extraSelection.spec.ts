import { describe, expect, it } from "vitest";
import {
  getExtraSelection,
  getMissingSelectionExtras,
  maxQtyFor,
  minQtyFor,
  quantitySelectionEnabled,
  requiresSelection,
  selectionOptionsFor,
} from "./extraSelection";
import { IExtraOption } from "../types/types";

const makeExtra = (overrides: Partial<IExtraOption>): IExtraOption =>
  ({
    id: 1,
    context: "Attendee",
    name: "Extra",
    price_online: 0,
    price_event: 0,
    included: [],
    excluded: [],
    ...overrides,
  } as unknown as IExtraOption);

const shirt = makeExtra({
  id: 7,
  name: "Free T-Shirt",
  requires_selection: true,
  selection_name: "Shirt Size",
  selection_options: ["SM", "MD", "LG", "XL", "2XL", "3XL", "4XL"],
});

const mulligan = makeExtra({ id: 3, name: "Mulligan", max_qty_each: 4 });

describe("quantitySelectionEnabled", () => {
  it("derives from max_qty_each for legacy extras (null toggle)", () => {
    expect(quantitySelectionEnabled(mulligan)).toBe(true);
    expect(quantitySelectionEnabled(makeExtra({ max_qty_each: 1 }))).toBe(false);
    expect(quantitySelectionEnabled(makeExtra({}))).toBe(false);
  });

  it("explicit toggle wins over max_qty_each", () => {
    expect(
      quantitySelectionEnabled(
        makeExtra({ quantity_selection: false, max_qty_each: 5 })
      )
    ).toBe(false);
    expect(
      quantitySelectionEnabled(
        makeExtra({ quantity_selection: true, max_qty_each: 5 })
      )
    ).toBe(true);
  });
});

describe("min/max quantity", () => {
  it("defaults min to 0 and max to at least 1", () => {
    expect(minQtyFor(mulligan)).toBe(0);
    expect(maxQtyFor(mulligan)).toBe(4);
    expect(maxQtyFor(makeExtra({}))).toBe(1);
  });

  it("clamps negative minimums to 0", () => {
    expect(minQtyFor(makeExtra({ min_qty_each: -2 }))).toBe(0);
    expect(minQtyFor(makeExtra({ min_qty_each: 2 }))).toBe(2);
  });
});

describe("requiresSelection", () => {
  it("is on only when the toggle is set AND usable options exist", () => {
    expect(requiresSelection(shirt)).toBe(true);
    expect(
      requiresSelection(
        makeExtra({ requires_selection: true, selection_options: [] })
      )
    ).toBe(false);
    expect(
      requiresSelection(
        makeExtra({ requires_selection: true, selection_options: ["", "  "] })
      )
    ).toBe(false);
    expect(
      requiresSelection(
        makeExtra({ requires_selection: false, selection_options: ["SM"] })
      )
    ).toBe(false);
  });

  it("filters blank options", () => {
    expect(
      selectionOptionsFor(
        makeExtra({ selection_options: [" SM ", "", "LG", null as never] })
      )
    ).toEqual(["SM", "LG"]);
  });
});

describe("getExtraSelection", () => {
  it("reads by stringified id and tolerates missing maps", () => {
    expect(getExtraSelection({ "7": "LG" }, 7)).toBe("LG");
    expect(getExtraSelection({ "7": "LG" }, "7")).toBe("LG");
    expect(getExtraSelection(undefined, 7)).toBe("");
    expect(getExtraSelection({}, 7)).toBe("");
  });
});

describe("getMissingSelectionExtras", () => {
  const catalog = new Map<string, IExtraOption>([
    [String(shirt.id), shirt],
    [String(mulligan.id), mulligan],
  ]);
  const resolve = (id: unknown) => catalog.get(String(id));

  it("flags selected selection-extras without a chosen option", () => {
    expect(getMissingSelectionExtras([7], undefined, resolve)).toEqual([shirt]);
    expect(getMissingSelectionExtras([7], { "7": "LG" }, resolve)).toEqual([]);
  });

  it("ignores non-selection extras and dedupes quantity ids", () => {
    expect(getMissingSelectionExtras([3, 3, 3], undefined, resolve)).toEqual([]);
    expect(getMissingSelectionExtras([7, 7], undefined, resolve)).toHaveLength(1);
  });

  it("skips unknown/orphan ids", () => {
    expect(getMissingSelectionExtras([999], undefined, resolve)).toEqual([]);
  });
});
