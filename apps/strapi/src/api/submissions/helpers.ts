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

type NameLike = { first?: string; last?: string } | null | undefined;
type AddressLike =
  | { street?: string; city?: string; state?: string; zip?: string }
  | null
  | undefined;

const blank = (value: unknown) =>
  value == null || (typeof value === "string" && value.trim() === "");

const blankName = (name: NameLike) => !name || (blank(name.first) && blank(name.last));

const blankAddress = (address: AddressLike) =>
  !address || (blank(address.street) && blank(address.city) && blank(address.zip));

export type SelfEligibleFields = {
  relationship?: string | null;
  applicant_first_name?: string;
  applicant_last_name?: string;
  applicant_email?: string;
  applicant_phone?: string;
  applicant_street?: string;
  applicant_city?: string;
  applicant_state?: string;
  applicant_zip?: string;
  eligible_participant_name?: NameLike;
  eligible_participant_phone?: string | null;
  eligible_participant_email?: string | null;
  eligible_participant_address?: AddressLike;
};

/**
 * When the applicant IS the eligible participant (`relationship: "Self"` — a
 * member-system employee/director applying for themselves), the public wizard
 * only asks for the participant's title; name, email, phone and address are
 * the applicant's own. The schema still (rightly) requires participant email
 * and phone, so fill them from the applicant here. Anything the client did
 * send is kept. Non-Self relationships are returned untouched.
 */
export const applySelfEligibleParticipant = <T extends SelfEligibleFields>(
  payload: T
): T => {
  if (payload.relationship !== "Self") return payload;
  const next: T = { ...payload };
  if (blankName(next.eligible_participant_name)) {
    next.eligible_participant_name = {
      first: payload.applicant_first_name || "",
      last: payload.applicant_last_name || "",
    };
  }
  if (blank(next.eligible_participant_email)) {
    next.eligible_participant_email = payload.applicant_email;
  }
  if (blank(next.eligible_participant_phone)) {
    next.eligible_participant_phone = payload.applicant_phone;
  }
  if (blankAddress(next.eligible_participant_address)) {
    next.eligible_participant_address = {
      street: payload.applicant_street || "",
      city: payload.applicant_city || "",
      state: payload.applicant_state || "",
      zip: payload.applicant_zip || "",
    };
  }
  return next;
};

/**
 * Strapi's Document Service throws a yup `ValidationError` whose top-level
 * message is just "N errors occurred"; the field paths live in
 * `details.errors[]`. Turn that into something the public form can show.
 * Returns null for anything that is not a validation error.
 */
export const validationErrorMessage = (err: unknown): string | null => {
  if (!err || typeof err !== "object") return null;
  const error = err as {
    name?: string;
    message?: string;
    details?: { errors?: Array<{ path?: unknown; message?: string }> };
  };
  if (error.name !== "ValidationError") return null;
  const errors = Array.isArray(error.details?.errors)
    ? error.details!.errors!
    : [];
  const parts = errors
    .map((item) => {
      const path = Array.isArray(item.path)
        ? item.path.join(".")
        : typeof item.path === "string"
          ? item.path
          : "";
      const message = String(item.message || "").trim();
      if (path && message && !message.startsWith(path)) {
        return `${path}: ${message}`;
      }
      return message || path;
    })
    .filter(Boolean);
  if (parts.length === 0) {
    return error.message || "Validation failed.";
  }
  return `Please check the following: ${parts.join("; ")}.`;
};

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
