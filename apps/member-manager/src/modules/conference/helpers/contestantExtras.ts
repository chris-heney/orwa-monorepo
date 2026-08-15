/**
 * Contestant extras: quantity extras (Mulligans) are stored as one
 * shared.field-meta row per unit. These helpers group, match, and rewrite
 * those rows for Conference Manager edit/create.
 */

export type ExtraRef = {
  id?: unknown;
  entityId?: unknown;
  documentId?: unknown;
  name?: string;
};

export type ContestantItemRow = {
  id?: number;
  key?: string;
  label?: string;
  value?: string;
  selection?: string | null;
  item?: ExtraRef | string | number | null;
};

export type ContestantExtraOption = {
  id: string | number;
  entityId?: number;
  documentId?: string;
  name: string;
  label?: string;
  context?: string;
  price_online?: number | null;
  price_event?: number | null;
  quantity_selection?: boolean | null;
  max_qty_each?: number | null;
  min_qty_each?: number | null;
  requires_selection?: boolean | null;
  selection_name?: string | null;
  selection_options?: unknown;
  excluded?: Array<ExtraRef | string | number> | null;
};

export const extraIds = (
  extra: ExtraRef | string | number | null | undefined
): Set<string> => {
  const ids = new Set<string>();
  if (extra == null || extra === "") return ids;
  if (typeof extra === "string" || typeof extra === "number") {
    ids.add(String(extra));
    return ids;
  }
  for (const value of [extra.documentId, extra.id, extra.entityId]) {
    if (value != null && value !== "") ids.add(String(value));
  }
  return ids;
};

export const extraRefId = (
  ref: ExtraRef | string | number | null | undefined
): string | undefined => {
  const ids = [...extraIds(ref)];
  return ids[0];
};

export const extraMatchesContestantContext = (extra: {
  context?: unknown;
}): boolean => {
  const ctx = String(extra.context ?? "");
  return ctx === "Contestant" || ctx === "Contestants";
};

export const quantitySelectionEnabled = (
  extra: ContestantExtraOption
): boolean => extra.quantity_selection ?? (extra.max_qty_each ?? 0) > 1;

export const minQtyFor = (extra: ContestantExtraOption): number =>
  Math.max(0, extra.min_qty_each ?? 0);

export const maxQtyFor = (extra: ContestantExtraOption): number =>
  Math.max(1, extra.max_qty_each ?? 1);

export const extraGroupKey = (item: ContestantItemRow): string => {
  const label = (item.label || "").trim();
  if (label) return label;
  return extraRefId(item.item) ?? (item.key || "Item").trim();
};

export const groupItemsByExtra = (
  items: ContestantItemRow[] | null | undefined
): Map<string, { label: string; count: number }> => {
  const grouped = new Map<string, { label: string; count: number }>();
  for (const item of items ?? []) {
    const label = (item.label || item.key || "Item").trim();
    const key = extraGroupKey(item);
    const existing = grouped.get(key);
    if (existing) existing.count += 1;
    else grouped.set(key, { label, count: 1 });
  }
  return grouped;
};

export const itemMatchesExtra = (
  item: ContestantItemRow,
  extra: ContestantExtraOption
): boolean => {
  const catalogIds = extraIds(extra);
  const itemIds = extraIds(
    typeof item.item === "object" && item.item != null
      ? item.item
      : { id: item.item }
  );
  for (const id of itemIds) {
    if (catalogIds.has(id)) return true;
  }
  if (itemIds.size === 0) {
    const name = extra.name;
    return item.label === name || (item.key ?? "").startsWith(name);
  }
  return false;
};

export const countForExtra = (
  items: ContestantItemRow[] | null | undefined,
  extra: ContestantExtraOption
): number =>
  (items ?? []).reduce(
    (count, item) => count + (itemMatchesExtra(item, extra) ? 1 : 0),
    0
  );

export const extraIsExcludedForTicket = (
  extra: ContestantExtraOption,
  ticketId: unknown
): boolean => {
  if (ticketId == null || ticketId === "") return false;
  const excluded = extra.excluded;
  if (!Array.isArray(excluded) || excluded.length === 0) return false;
  const ticketIds = extraIds(
    typeof ticketId === "object" && ticketId != null
      ? (ticketId as ExtraRef)
      : { id: ticketId }
  );
  return excluded.some((entry) => {
    const excludedIds = extraIds(
      typeof entry === "object" && entry != null ? entry : { id: entry }
    );
    for (const id of excludedIds) {
      if (ticketIds.has(id)) return true;
    }
    return false;
  });
};

export const shouldShowContestantExtra = (
  extra: ContestantExtraOption,
  items: ContestantItemRow[] | null | undefined,
  ticketId: unknown
): boolean => {
  if (!extraMatchesContestantContext(extra)) return false;
  if (countForExtra(items, extra) > 0) return true;
  return !extraIsExcludedForTicket(extra, ticketId);
};

export const selectionOptionsFor = (
  extra: ContestantExtraOption
): string[] =>
  (Array.isArray(extra.selection_options) ? extra.selection_options : [])
    .map((option) => String(option ?? "").trim())
    .filter((option) => option !== "");

export const requiresSelection = (extra: ContestantExtraOption): boolean =>
  !!extra.requires_selection && selectionOptionsFor(extra).length > 0;

export const applyExtraQuantity = (
  items: ContestantItemRow[] | null | undefined,
  extra: ContestantExtraOption,
  qty: number,
  selection?: string | null
): ContestantItemRow[] => {
  const max = quantitySelectionEnabled(extra) ? maxQtyFor(extra) : 1;
  const raw = Number.isFinite(qty) ? Math.floor(qty) : 0;
  const clamped = Math.max(0, Math.min(max, raw));
  const kept = (items ?? []).filter((item) => !itemMatchesExtra(item, extra));
  if (clamped === 0) return kept;

  const existing = (items ?? []).find((item) => itemMatchesExtra(item, extra));
  const value =
    existing?.value ?? String(extra.price_event ?? extra.price_online ?? 0);
  const sel = (selection ?? existing?.selection ?? "").trim();
  const writeId = extra.documentId ?? extra.id;
  const rows: ContestantItemRow[] = [];
  for (let i = 0; i < clamped; i += 1) {
    rows.push({
      key: `${extra.name} ${writeId}`,
      label: extra.name,
      value,
      ...(sel ? { selection: sel } : {}),
      item: writeId,
    });
  }
  return [...kept, ...rows];
};

export const missingSelectionExtras = (
  extras: ContestantExtraOption[],
  items: ContestantItemRow[] | null | undefined
): ContestantExtraOption[] =>
  extras.filter((extra) => {
    if (!requiresSelection(extra)) return false;
    if (countForExtra(items, extra) <= 0) return false;
    const row = (items ?? []).find((item) => itemMatchesExtra(item, extra));
    return !String(row?.selection ?? "").trim();
  });
