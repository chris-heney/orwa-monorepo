/**
 * Public-form award type options.
 *
 * Source of truth is Strapi `award-types` with nominatable=true, sorted by
 * `order`. FALLBACK_NOMINATABLE_AWARD_TYPES is the previous hardcoded wizard
 * list — used only when GET /award-types fails or returns no nominatable
 * rows, so the select is not blank. Callers must toast on fallback.
 */

export type AwardTypeRecord = {
  id?: string | number;
  documentId?: string;
  name?: string | null;
  description?: string | null;
  nominatable?: boolean | null;
  order?: number | null;
};

export const FALLBACK_NOMINATABLE_AWARD_TYPES = [
  "System of the Year",
  "Excellence in Operations",
  "Excellence in Management",
  "Excellence in Office Operations",
] as const;

export const sortAwardTypes = <T extends AwardTypeRecord>(rows: T[]): T[] =>
  [...rows].sort((a, b) => {
    const byOrder = (a.order ?? 0) - (b.order ?? 0);
    if (byOrder !== 0) return byOrder;
    return String(a.name || "").localeCompare(String(b.name || ""));
  });

export const nominatableAwardTypes = (rows: AwardTypeRecord[] | undefined) =>
  sortAwardTypes((rows || []).filter((row) => row.nominatable && row.name));

export const toAwardTypeSelectOptions = (
  rows: AwardTypeRecord[] | undefined,
  currentValue?: string | null
) => {
  const nominatable = nominatableAwardTypes(rows);
  const names = nominatable.map((row) => String(row.name));
  const source = names.length
    ? names
    : [...FALLBACK_NOMINATABLE_AWARD_TYPES];
  const options = source.map((name) => ({ value: name, label: name }));
  if (currentValue && !options.some((option) => option.value === currentValue)) {
    options.push({ value: currentValue, label: currentValue });
  }
  return {
    options,
    usedFallback: names.length === 0,
  };
};
