export type SponsorLineInput = {
  id: string | number;
  name?: string;
  description?: string;
  available?: string | number;
  amount: number;
};

export type SponsorshipCatalogRow = {
  id?: string | number;
  documentId?: string;
  name?: string;
  amount?: number | string | null;
  allow_custom_amount?: boolean | null;
  available?: number | null;
};

export class SponsorAmountError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SponsorAmountError";
  }
}

const toNumber = (value: unknown): number => {
  const n = typeof value === "number" ? value : parseFloat(String(value ?? ""));
  return Number.isFinite(n) ? n : NaN;
};

/**
 * Resolve each submitted sponsor line against the catalog:
 * - custom-amount packages: keep client amount, reject below minimum
 * - fixed packages: force catalog amount (ignore client under/overpay)
 * Also collapses duplicate custom-amount selections to a single line.
 */
export function normalizeSponsorAmounts(
  sponsors: SponsorLineInput[] | null | undefined,
  catalogById: Map<string, SponsorshipCatalogRow>
): SponsorLineInput[] {
  if (!sponsors?.length) return [];

  const normalized: SponsorLineInput[] = [];
  const seenCustom = new Set<string>();

  for (const sponsor of sponsors) {
    const key = String(sponsor.id);
    const catalog = catalogById.get(key);
    if (!catalog) {
      throw new SponsorAmountError(
        `Sponsorship package not found (id: ${sponsor.id}).`
      );
    }

    const minimum = toNumber(catalog.amount);
    if (!Number.isFinite(minimum) || minimum < 0) {
      throw new SponsorAmountError(
        `Sponsorship "${catalog.name ?? key}" has an invalid catalog amount.`
      );
    }

    if (catalog.allow_custom_amount) {
      if (seenCustom.has(key)) {
        // Custom-amount packages are qty-forced to 1.
        continue;
      }
      seenCustom.add(key);

      const submitted = toNumber(sponsor.amount);
      if (!Number.isFinite(submitted)) {
        throw new SponsorAmountError(
          `Enter a valid donation amount for "${catalog.name ?? key}".`
        );
      }
      if (submitted < minimum) {
        throw new SponsorAmountError(
          `"${catalog.name ?? key}" requires a minimum of $${minimum.toFixed(2)}.`
        );
      }

      normalized.push({
        ...sponsor,
        amount: submitted,
      });
      continue;
    }

    normalized.push({
      ...sponsor,
      amount: minimum,
    });
  }

  return normalized;
}
