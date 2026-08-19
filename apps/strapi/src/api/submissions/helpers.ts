const DOCUMENT_ID_RE = /^[a-z0-9]{16,64}$/i;

export const emptyToNull = (value: unknown) =>
  value === "" || value === undefined ? null : value;

export const singleMedia = (value: unknown): unknown => {
  if (value == null || value === "") return null;
  if (Array.isArray(value)) {
    return value.length > 0 ? singleMedia(value[0]) : null;
  }
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (obj.documentId) return obj.documentId;
    if (obj.id !== undefined) return obj.id;
  }
  return value;
};

export const manyMedia = (value: unknown): unknown => {
  if (value == null || value === "") return null;
  if (Array.isArray(value)) {
    return value.map((item) => singleMedia(item)).filter((item) => item != null);
  }
  return [singleMedia(value)];
};

export const isDocumentId = (value: unknown): value is string =>
  typeof value === "string" && DOCUMENT_ID_RE.test(value);

export const resolveGpa = (payload: {
  gpa?: number | string | null;
  high_school_gpa?: number | string | null;
}) => {
  const raw = payload.gpa ?? payload.high_school_gpa;
  if (raw == null || raw === "") return null;
  const numeric = Number(raw);
  return Number.isNaN(numeric) ? null : numeric;
};

export const resolveSystemName = (payload: {
  system_name?: string | null;
  school_name?: string | null;
  watersystemName?: string | null;
}) => payload.system_name || payload.watersystemName || "";

export const MAX_FINANCIAL_RESOURCES = 10;

export type FinancialResource = {
  institution?: string;
  amount?: number;
};

const asFinancialAmount = (value: unknown): number | undefined => {
  if (value === "" || value == null) return undefined;
  if (value instanceof Date) return undefined;
  const numeric = Number(value);
  return Number.isNaN(numeric) ? undefined : numeric;
};

const asFinancialResource = (value: unknown): FinancialResource | null => {
  if (!value || typeof value !== "object") return null;
  const row = value as { institution?: unknown; amount?: unknown };
  const institution =
    row.institution === "" || row.institution == null
      ? undefined
      : String(row.institution);
  const amount = asFinancialAmount(row.amount);
  if (institution == null && amount == null) return null;
  return {
    ...(institution != null ? { institution } : {}),
    ...(amount != null ? { amount } : {}),
  };
};

/**
 * Prefer `financial_resources` (capped at 10). If that list is empty,
 * bridge leftover financial1/2 draft keys so old sessions still land.
 * Amounts stay numbers — never Date instances.
 */
export const resolveFinancialResources = (
  payload: Record<string, unknown>
): FinancialResource[] => {
  const rows = Array.isArray(payload.financial_resources)
    ? payload.financial_resources
    : [];
  const mapped = rows
    .map(asFinancialResource)
    .filter((row): row is FinancialResource => row != null)
    .slice(0, MAX_FINANCIAL_RESOURCES);

  if (mapped.length > 0) return mapped;

  const leftover = [
    asFinancialResource({
      institution: payload.financial1_institution,
      amount: payload.financial1_amount,
    }),
    asFinancialResource({
      institution: payload.financial2_institution,
      amount: payload.financial2_amount,
    }),
  ].filter((row): row is FinancialResource => row != null);

  return leftover.slice(0, MAX_FINANCIAL_RESOURCES);
};
