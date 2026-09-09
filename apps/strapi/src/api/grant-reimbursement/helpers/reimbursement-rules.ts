/**
 * Pure rules for applicant-submitted RIG reimbursement requests.
 *
 * Everything here is deliberately framework-free so the money math and the
 * payload validation can be unit tested without booting Strapi. The controller
 * (controllers/grant-reimbursement.ts) is the only consumer.
 */

import crypto from "crypto";

// ---------------------------------------------------------------------------
// Eligibility
// ---------------------------------------------------------------------------

/**
 * Application statuses that may draw reimbursements. Mirrors
 * member-manager `PAYOUT_ELIGIBLE_STATUS_NAMES` (payoutCreateDefaults.ts);
 * the " PFY" (previous fiscal year) variants qualify the same way.
 */
export const REIMBURSEMENT_ELIGIBLE_STATUS_NAMES = [
  "Grant Agreement Signed/Sealed/Returned",
  "Revised per COR",
] as const;

export const isReimbursementEligibleStatusName = (
  statusName?: string | null
): boolean => {
  if (!statusName) return false;
  return (REIMBURSEMENT_ELIGIBLE_STATUS_NAMES as readonly string[]).includes(
    statusName.replace(/ PFY$/, "")
  );
};

// ---------------------------------------------------------------------------
// Balance math (must agree with member-manager payoutAmounts.ts so the
// applicant never sees a different "remaining" than the Grant Manager).
// ---------------------------------------------------------------------------

const REJECTED_PAYOUT_STATUSES = new Set(["Not Approved", "Denied"]);

export type PayoutLike = {
  amount?: unknown;
  type?: unknown;
  status?: unknown;
  payout_status?: { name?: unknown } | null;
};

export const toMoney = (value: unknown): number => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const n = parseFloat(value.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

/** Round to cents; avoids 0.1 + 0.2 style drift in totals. */
export const roundMoney = (value: number): number =>
  Math.round((value + Number.EPSILON) * 100) / 100;

const payoutStatusName = (payout: PayoutLike): string => {
  const rel = payout.payout_status;
  if (rel && typeof rel === "object" && "name" in rel) {
    return String(rel.name ?? "");
  }
  if (typeof payout.status === "string") return payout.status;
  return "";
};

/** Reimbursement draws that have not been rejected count against the award. */
export const isCountableTowardAward = (payout: PayoutLike): boolean => {
  if (payout.type === "Administrative") return false;
  return !REJECTED_PAYOUT_STATUSES.has(payoutStatusName(payout));
};

export const isPaidReimbursement = (payout: PayoutLike): boolean =>
  payout.type !== "Administrative" && payoutStatusName(payout) === "Paid";

export const sumPayouts = (
  payouts: PayoutLike[] | null | undefined,
  predicate: (payout: PayoutLike) => boolean
): number =>
  roundMoney(
    (payouts ?? []).reduce(
      (sum, payout) => (predicate(payout) ? sum + toMoney(payout.amount) : sum),
      0
    )
  );

export interface AwardBalance {
  award: number;
  /** Paid reimbursements only. */
  paid: number;
  /** Requested/Approved reimbursements that are not yet paid. */
  pending: number;
  /** award - (paid + pending). Never below 0. */
  remaining: number;
}

export const computeAwardBalance = (application: {
  award_amount?: unknown;
  payouts?: PayoutLike[] | null;
}): AwardBalance => {
  const award = roundMoney(toMoney(application.award_amount));
  const paid = sumPayouts(application.payouts, isPaidReimbursement);
  const countable = sumPayouts(application.payouts, isCountableTowardAward);
  const pending = roundMoney(countable - paid);
  return {
    award,
    paid,
    pending,
    remaining: Math.max(0, roundMoney(award - countable)),
  };
};

// ---------------------------------------------------------------------------
// Stateless, signed session tokens (email + expiry, HMAC-SHA256)
// ---------------------------------------------------------------------------

export const REIMBURSEMENT_TOKEN_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

const b64url = (input: Buffer | string) =>
  Buffer.from(input).toString("base64url");

const sign = (payload: string, secret: string) =>
  crypto.createHmac("sha256", secret).update(payload).digest("base64url");

export const createReimbursementToken = (
  email: string,
  secret: string,
  now = Date.now(),
  ttlMs = REIMBURSEMENT_TOKEN_TTL_MS
): string => {
  const payload = `${b64url(email.trim().toLowerCase())}.${now + ttlMs}`;
  return `${payload}.${sign(payload, secret)}`;
};

export interface ParsedReimbursementToken {
  email: string;
  expires: number;
}

/** Returns null for malformed, tampered, or expired tokens. */
export const verifyReimbursementToken = (
  token: unknown,
  secret: string,
  now = Date.now()
): ParsedReimbursementToken | null => {
  if (typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [emailPart, expiresPart, signature] = parts;
  const payload = `${emailPart}.${expiresPart}`;
  const expected = sign(payload, secret);
  if (
    signature.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    return null;
  }
  const expires = Number(expiresPart);
  if (!Number.isFinite(expires) || expires < now) return null;
  let email: string;
  try {
    email = Buffer.from(emailPart, "base64url").toString("utf8");
  } catch {
    return null;
  }
  if (!email.includes("@")) return null;
  return { email, expires };
};

// ---------------------------------------------------------------------------
// Submission validation
// ---------------------------------------------------------------------------

export const MAX_INVOICE_LINES = 25;
export const MAX_SIGNATURE_LENGTH = 400_000; // ~300KB PNG data URL

export interface ReimbursementInvoiceInput {
  vendor: string;
  invoice_number: string;
  amount: number;
  description?: string;
}

export interface ReimbursementSubmissionInput {
  application: string;
  invoices: ReimbursementInvoiceInput[];
  requester_name: string;
  requester_title: string;
  requester_email: string;
  requester_phone: string;
  requester_signature: string;
  certified: boolean;
  applicant_notes: string;
  paid_invoices: number[];
  proof_of_payment: number[];
  project_photos: number[];
  photos_not_applicable: boolean;
  portal_submission_id: string;
}

export type ValidationResult =
  | { ok: true; value: ReimbursementSubmissionInput; invoice_total: number }
  | { ok: false; errors: string[] };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const str = (value: unknown, max: number): string =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const idList = (value: unknown): number[] => {
  if (!Array.isArray(value)) return [];
  const ids = value
    .map((v) => {
      if (typeof v === "number") return v;
      if (typeof v === "string" && /^\d+$/.test(v)) return parseInt(v, 10);
      if (v && typeof v === "object" && "id" in v) {
        const id = (v as { id: unknown }).id;
        return typeof id === "number" ? id : Number(id);
      }
      return NaN;
    })
    .filter((n) => Number.isInteger(n) && n > 0);
  return Array.from(new Set(ids));
};

export const normalizePhone = (value: unknown): string => {
  const digits = str(value, 40).replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return normalizePhone(digits.slice(1));
  }
  return str(value, 40);
};

/**
 * Normalize + validate the applicant payload. Returns a cleaned copy (trimmed
 * strings, numeric cents, de-duplicated file ids) or a list of human-readable
 * errors suitable for the red toast on the form.
 */
export const validateReimbursementSubmission = (
  body: unknown
): ValidationResult => {
  const errors: string[] = [];
  const b = (body ?? {}) as Record<string, unknown>;

  const application = str(b.application, 64);
  if (!application) errors.push("Select the grant application to reimburse.");

  const rawInvoices = Array.isArray(b.invoices) ? b.invoices : [];
  if (rawInvoices.length === 0) {
    errors.push("Add at least one paid invoice.");
  }
  if (rawInvoices.length > MAX_INVOICE_LINES) {
    errors.push(`Enter no more than ${MAX_INVOICE_LINES} invoices per request.`);
  }

  const invoices: ReimbursementInvoiceInput[] = [];
  rawInvoices.slice(0, MAX_INVOICE_LINES).forEach((raw, index) => {
    const row = (raw ?? {}) as Record<string, unknown>;
    const line = index + 1;
    const vendor = str(row.vendor, 120);
    const invoice_number = str(row.invoice_number, 60);
    const amountRaw =
      typeof row.amount === "number" ? row.amount : toMoney(row.amount);
    const amount = roundMoney(amountRaw);
    if (!vendor) errors.push(`Invoice ${line}: vendor name is required.`);
    if (!invoice_number) errors.push(`Invoice ${line}: invoice # is required.`);
    if (!Number.isFinite(amount) || amount <= 0) {
      errors.push(`Invoice ${line}: amount must be greater than $0.`);
    }
    invoices.push({
      vendor,
      invoice_number,
      amount,
      description: str(row.description, 255) || undefined,
    });
  });

  const seen = new Set<string>();
  for (const inv of invoices) {
    const key = `${inv.vendor.toLowerCase()}|${inv.invoice_number.toLowerCase()}`;
    if (inv.vendor && inv.invoice_number) {
      if (seen.has(key)) {
        errors.push(
          `Invoice ${inv.invoice_number} from ${inv.vendor} is listed more than once.`
        );
      }
      seen.add(key);
    }
  }

  const invoice_total = roundMoney(
    invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0)
  );

  const requester_name = str(b.requester_name, 120);
  const requester_title = str(b.requester_title, 120);
  const requester_email = str(b.requester_email, 254).toLowerCase();
  const requester_phone = normalizePhone(b.requester_phone);
  if (!requester_name) errors.push("Requester name is required.");
  if (!requester_title) errors.push("Requester title is required.");
  if (!requester_email || !EMAIL_RE.test(requester_email)) {
    errors.push("A valid requester email is required.");
  }

  const requester_signature =
    typeof b.requester_signature === "string" ? b.requester_signature : "";
  if (!requester_signature.startsWith("data:image/")) {
    errors.push("Please sign the certification.");
  } else if (requester_signature.length > MAX_SIGNATURE_LENGTH) {
    errors.push("Signature image is too large. Please clear and sign again.");
  }

  const certified = b.certified === true || b.certified === "true";
  if (!certified) {
    errors.push("You must certify that the information provided is true and correct.");
  }

  const paid_invoices = idList(b.paid_invoices);
  const proof_of_payment = idList(b.proof_of_payment);
  const project_photos = idList(b.project_photos);
  const photos_not_applicable =
    b.photos_not_applicable === true || b.photos_not_applicable === "true";

  if (paid_invoices.length === 0) {
    errors.push("Attach a copy of all paid invoices / pay applications.");
  }
  if (proof_of_payment.length === 0) {
    errors.push("Attach proof of payment (cleared check, card receipt, ACH, etc.).");
  }
  if (project_photos.length === 0 && !photos_not_applicable) {
    errors.push(
      "Attach project photos, or confirm that photos are not applicable to this request."
    );
  }

  const portal_submission_id = str(b.portal_submission_id, 64);
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(portal_submission_id)) {
    errors.push("Submission id is missing. Please reload the page and try again.");
  }

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    invoice_total,
    value: {
      application,
      invoices,
      requester_name,
      requester_title,
      requester_email,
      requester_phone,
      requester_signature,
      certified: true,
      applicant_notes: str(b.applicant_notes, 2000),
      paid_invoices,
      proof_of_payment,
      // Uploaded photos always win over a stray "not applicable" tick.
      project_photos,
      photos_not_applicable: project_photos.length === 0 && photos_not_applicable,
      portal_submission_id,
    },
  };
};

/**
 * The reimbursement actually requested from ORWA: invoices paid, capped at the
 * remaining award balance (the applicant may have paid more than the grant
 * covers; the excess is theirs). Returns 0 when nothing remains.
 */
export const computeRequestedAmount = (
  invoiceTotal: number,
  remaining: number
): number => roundMoney(Math.max(0, Math.min(invoiceTotal, remaining)));

/** Subject line the RIG shared inbox expects (see the printed PDF form). */
export const reimbursementSubjectLine = (
  systemName: string,
  applicationId: string
): string =>
  `REIMBURSEMENT REQUEST | ${systemName.trim() || "Unknown System"} | ${
    String(applicationId ?? "").trim() || "N/A"
  }`;
