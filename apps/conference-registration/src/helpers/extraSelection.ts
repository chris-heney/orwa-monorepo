import { IExtraOption } from "../types/types";

/**
 * Quantity stepper visibility. Extras created after the "Include Quantity
 * Selection" toggle shipped carry an explicit boolean; legacy extras (null)
 * keep the old behavior of deriving it from max_qty_each > 1.
 */
export const quantitySelectionEnabled = (extra: IExtraOption): boolean =>
  extra.quantity_selection ?? (extra.max_qty_each ?? 0) > 1;

/** Minimum quantity once the registrant opts in (0 = no minimum). */
export const minQtyFor = (extra: IExtraOption): number =>
  Math.max(0, extra.min_qty_each ?? 0);

export const maxQtyFor = (extra: IExtraOption): number =>
  Math.max(1, extra.max_qty_each ?? 1);

/** Non-blank dropdown choices configured on the extra. */
export const selectionOptionsFor = (extra: IExtraOption): string[] =>
  (Array.isArray(extra.selection_options) ? extra.selection_options : [])
    .map((option) => String(option ?? "").trim())
    .filter((option) => option !== "");

/**
 * True when taking this extra requires choosing an option (e.g. shirt size).
 * An admin toggle without any usable options is treated as off so the
 * registrant is never blocked by an unanswerable dropdown.
 */
export const requiresSelection = (extra: IExtraOption): boolean =>
  !!extra.requires_selection && selectionOptionsFor(extra).length > 0;

/** Read the chosen option for one extra out of an `extra_selections` map. */
export const getExtraSelection = (
  selections: Record<string, string> | undefined | null,
  extraId: unknown
): string => {
  if (!selections || typeof selections !== "object") return "";
  const raw = selections[String(extraId)];
  return typeof raw === "string" ? raw : "";
};

/**
 * Selected extras (deduped — quantity extras repeat ids) that require a
 * selection but don't have one yet. Used for unmissable save validation.
 */
export const getMissingSelectionExtras = (
  extraIds: unknown[] | undefined | null,
  selections: Record<string, string> | undefined | null,
  resolveExtra: (id: unknown) => IExtraOption | undefined
): IExtraOption[] => {
  const seen = new Set<string>();
  const missing: IExtraOption[] = [];
  for (const id of extraIds ?? []) {
    const extra = resolveExtra(id);
    if (!extra) continue;
    const key = String(extra.id);
    if (seen.has(key)) continue;
    seen.add(key);
    if (requiresSelection(extra) && !getExtraSelection(selections, extra.id)) {
      missing.push(extra);
    }
  }
  return missing;
};
