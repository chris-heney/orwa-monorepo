export const WIZARD_DRAFT_VERSION = 1;
export const WIZARD_STEP_PARAM = "step";

export type WizardDraft = {
  version: number;
  formId: string;
  source: string;
  stepKey: string;
  values: Record<string, unknown>;
  updatedAt: number;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

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
      const next = walk(value);
      if (next !== undefined) out[key] = next;
    }
    return out;
  };
  return walk(values) as Record<string, unknown>;
};

export const createWizardPersistence = (options: {
  prefix: string;
  preservedParams?: readonly string[];
}) => {
  const preserved = options.preservedParams ?? ["admin", "test", "source"];
  const storageKey = (formId: string, source: string) =>
    `${options.prefix}:v${WIZARD_DRAFT_VERSION}:${formId}:${source}`;

  const loadWizardDraft = (
    formId: string,
    source: string
  ): WizardDraft | null => {
    if (typeof sessionStorage === "undefined") return null;
    try {
      const raw = sessionStorage.getItem(storageKey(formId, source));
      if (!raw) return null;
      const parsed = JSON.parse(raw) as WizardDraft;
      if (
        !parsed ||
        parsed.version !== WIZARD_DRAFT_VERSION ||
        parsed.formId !== String(formId) ||
        parsed.source !== String(source)
      ) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  };

  const saveWizardDraft = (
    formId: string,
    source: string,
    draft: Omit<WizardDraft, "version" | "formId" | "source" | "updatedAt">
  ): void => {
    if (typeof sessionStorage === "undefined") return;
    try {
      sessionStorage.setItem(
        storageKey(formId, source),
        JSON.stringify({
          version: WIZARD_DRAFT_VERSION,
          formId: String(formId),
          source: String(source),
          stepKey: draft.stepKey,
          values: sanitizeDraftValues(draft.values),
          updatedAt: Date.now(),
        } satisfies WizardDraft)
      );
    } catch {
      // quota / private mode
    }
  };

  const clearWizardDraft = (formId: string, source: string): void => {
    if (typeof sessionStorage === "undefined") return;
    try {
      sessionStorage.removeItem(storageKey(formId, source));
    } catch {
      // ignore
    }
  };

  const getStepKeyFromUrl = (
    search = typeof window !== "undefined" ? window.location.search : ""
  ): string | null => {
    const step = new URLSearchParams(search).get(WIZARD_STEP_PARAM);
    return step && step.trim() ? step.trim() : null;
  };

  const setStepKeyInUrl = (stepKey: string | null): void => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (stepKey) url.searchParams.set(WIZARD_STEP_PARAM, stepKey);
    else url.searchParams.delete(WIZARD_STEP_PARAM);
    for (const key of preserved) {
      const current = new URLSearchParams(window.location.search).get(key);
      if (current != null && !url.searchParams.has(key)) {
        url.searchParams.set(key, current);
      }
    }
    window.history.replaceState(window.history.state, "", url.toString());
  };

  const resolveActiveStepIndex = (
    activeStepKeys: string[],
    preferredKey: string | null | undefined
  ): number => {
    if (!preferredKey) return 0;
    const index = activeStepKeys.indexOf(preferredKey);
    return index >= 0 ? index : 0;
  };

  return {
    loadWizardDraft,
    saveWizardDraft,
    clearWizardDraft,
    getStepKeyFromUrl,
    setStepKeyInUrl,
    resolveActiveStepIndex,
  };
};
