export const MAX_FINANCIAL_RESOURCES = 10;

export type FinancialResource = {
  institution?: string | null;
  amount?: number | string | null;
};

const hasAid = (row?: FinancialResource | null) => {
  if (row == null) return false;
  if (row.institution != null && String(row.institution).trim() !== "") {
    return true;
  }
  return row.amount != null && row.amount !== "";
};

const asAmount = (value: unknown): number | null => {
  if (value == null || value === "") return null;
  if (value instanceof Date) return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

/**
 * Prefer `financial_resources`. Fall back to leftover financial1/2 on
 * older records. Cap at 10. Amounts stay numbers, never Date.
 */
export const listFinancialResources = (
  record?: Record<string, unknown> | null
): FinancialResource[] => {
  const rows = Array.isArray(record?.financial_resources)
    ? (record.financial_resources as FinancialResource[])
    : [];
  const mapped = rows.filter(hasAid).slice(0, MAX_FINANCIAL_RESOURCES);
  if (mapped.length > 0) {
    return mapped.map((row) => ({
      institution: row.institution ?? "",
      amount: asAmount(row.amount),
    }));
  }

  const leftover: FinancialResource[] = [];
  const first = {
    institution: record?.financial1_institution as string | undefined,
    amount: asAmount(record?.financial1_amount),
  };
  const second = {
    institution: record?.financial2_institution as string | undefined,
    amount: asAmount(record?.financial2_amount),
  };
  if (hasAid(first)) leftover.push(first);
  if (hasAid(second)) leftover.push(second);
  return leftover;
};
