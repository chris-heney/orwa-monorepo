/**
 * Award-type catalog helpers.
 *
 * Source of truth is Strapi `award-types` (Settings tab).
 * FALLBACK_AWARD_TYPE_CHOICES is the previous hardcoded enum — used only
 * when GET /award-types fails or returns no rows, so admin filters/forms
 * are not blank. A toast should accompany any fallback.
 */

export type AwardTypeRecord = {
  id: string | number;
  name?: string | null;
  description?: string | null;
  nominatable?: boolean | null;
  order?: number | null;
};

export const FALLBACK_AWARD_TYPE_CHOICES = [
  { id: "System of the Year", name: "System of the Year" },
  {
    id: "Water/Wastewater System of the Year",
    name: "Water/Wastewater System of the Year (legacy)",
  },
  { id: "Excellence in Operations", name: "Excellence in Operations" },
  { id: "Excellence in Management", name: "Excellence in Management" },
  {
    id: "Excellence in Office Operations",
    name: "Excellence in Office Operations",
  },
];

export const sortAwardTypes = <T extends AwardTypeRecord>(rows: T[]): T[] =>
  [...rows].sort((a, b) => {
    const byOrder = (a.order ?? 0) - (b.order ?? 0);
    if (byOrder !== 0) return byOrder;
    return String(a.name || "").localeCompare(String(b.name || ""));
  });

export const awardTypeChoices = (
  rows: AwardTypeRecord[] | undefined,
  currentValue?: string | null
) => {
  const sorted = sortAwardTypes(rows || []).filter((row) => row.name);
  const choices = sorted.map((row) => ({
    id: String(row.name),
    name: String(row.name),
  }));
  if (currentValue && !choices.some((choice) => choice.id === currentValue)) {
    choices.push({ id: currentValue, name: currentValue });
  }
  return choices.length ? choices : FALLBACK_AWARD_TYPE_CHOICES;
};

/** @deprecated Use awardTypeChoices() from Strapi. Kept as the documented fallback. */
export const AWARD_TYPE_CHOICES = FALLBACK_AWARD_TYPE_CHOICES;
