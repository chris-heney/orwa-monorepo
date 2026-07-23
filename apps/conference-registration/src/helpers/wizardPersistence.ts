export const WIZARD_DRAFT_VERSION = 1;
export const WIZARD_STEP_PARAM = "step";

export type WizardDraft = {
  version: number;
  conferenceId: string;
  source: string;
  stepKey: string;
  values: Record<string, unknown>;
  updatedAt: number;
};

const storageKey = (conferenceId: string, source: string) =>
  `orwa-conf-reg-draft:v${WIZARD_DRAFT_VERSION}:${conferenceId}:${source}`;

/** Query params that must never be wiped when syncing step. */
const PRESERVED_PARAMS = [
  "admin",
  "conference_id",
  "source",
  "passport_id",
  "edit_token",
] as const;

const SENSITIVE_PAYMENT_KEYS = [
  "cardNumber",
  "cardCode",
  "cvv",
  "expirationDate",
] as const;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Drop non-serializable / sensitive fields before writing to sessionStorage.
 */
export const sanitizeDraftValues = (
  values: Record<string, unknown>
): Record<string, unknown> => {
  const walk = (input: unknown): unknown => {
    if (typeof File !== "undefined" && input instanceof File) return undefined;
    if (typeof Blob !== "undefined" && input instanceof Blob) return undefined;
    if (typeof FileList !== "undefined" && input instanceof FileList) {
      return undefined;
    }
    if (Array.isArray(input)) {
      return input.map(walk).filter((item) => item !== undefined);
    }
    if (!isPlainObject(input)) return input;

    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      if (key === "logo") continue;
      const next = walk(value);
      if (next !== undefined) out[key] = next;
    }
    return out;
  };

  const cloned = walk(values) as Record<string, unknown>;
  const paymentData = cloned.paymentData;
  if (isPlainObject(paymentData)) {
    for (const key of SENSITIVE_PAYMENT_KEYS) {
      delete paymentData[key];
    }
    cloned.paymentData = paymentData;
  }
  return cloned;
};

export const loadWizardDraft = (
  conferenceId: string,
  source: string
): WizardDraft | null => {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(storageKey(conferenceId, source));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WizardDraft;
    if (
      !parsed ||
      parsed.version !== WIZARD_DRAFT_VERSION ||
      parsed.conferenceId !== String(conferenceId) ||
      parsed.source !== String(source)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const saveWizardDraft = (
  conferenceId: string,
  source: string,
  draft: Omit<WizardDraft, "version" | "conferenceId" | "source" | "updatedAt">
): void => {
  if (typeof sessionStorage === "undefined") return;
  const payload: WizardDraft = {
    version: WIZARD_DRAFT_VERSION,
    conferenceId: String(conferenceId),
    source: String(source),
    stepKey: draft.stepKey,
    values: sanitizeDraftValues(draft.values),
    updatedAt: Date.now(),
  };
  try {
    sessionStorage.setItem(
      storageKey(conferenceId, source),
      JSON.stringify(payload)
    );
  } catch {
    // Quota / private mode — ignore
  }
};

export const clearWizardDraft = (
  conferenceId: string,
  source: string
): void => {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.removeItem(storageKey(conferenceId, source));
  } catch {
    // ignore
  }
};

export const getStepKeyFromUrl = (
  search = typeof window !== "undefined" ? window.location.search : ""
): string | null => {
  const params = new URLSearchParams(search);
  const step = params.get(WIZARD_STEP_PARAM);
  return step && step.trim() ? step.trim() : null;
};

/**
 * Update `?step=` via replaceState without dropping admin/conference/source params.
 */
export const setStepKeyInUrl = (stepKey: string | null): void => {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (stepKey) {
    url.searchParams.set(WIZARD_STEP_PARAM, stepKey);
  } else {
    url.searchParams.delete(WIZARD_STEP_PARAM);
  }
  // Ensure preserved params are not accidentally dropped by callers who rebuild URLs.
  for (const key of PRESERVED_PARAMS) {
    const current = new URLSearchParams(window.location.search).get(key);
    if (current != null && !url.searchParams.has(key)) {
      url.searchParams.set(key, current);
    }
  }
  window.history.replaceState(window.history.state, "", url.toString());
};

export const resolveActiveStepIndex = (
  activeStepKeys: string[],
  preferredKey: string | null | undefined
): number => {
  if (!preferredKey) return 0;
  const index = activeStepKeys.indexOf(preferredKey);
  return index >= 0 ? index : 0;
};
