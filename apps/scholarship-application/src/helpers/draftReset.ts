import { fileCache } from "./fileCache";
import { SAVED_FORM_STORAGE_KEY } from "./formPersistence";
import { setStepKeyInUrl, WIZARD_DRAFT_VERSION } from "./wizardPersistence";

/**
 * Identity of the public wizard draft in `@orwa/public-form` persistence.
 * Keep in sync with `WizardStateSync` / `SimpleStepNavigation`.
 */
export const SCHOLARSHIP_WIZARD_FORM_ID = "orwef-scholarship";
export const SCHOLARSHIP_WIZARD_SOURCE = "online";
export const SCHOLARSHIP_WIZARD_DRAFT_PREFIX = "orwa-scholarship-draft";

export type DraftStorageArea = "sessionStorage" | "localStorage";

export interface DraftStorageKey {
  storage: DraftStorageArea;
  key: string;
}

/**
 * Every Web Storage key the wizard writes while an applicant works through
 * the form:
 *
 * - sessionStorage: step-keyed draft written by `WizardStateSync`
 *   (`createWizardPersistence({ prefix })`, key = `prefix:v{version}:{formId}:{source}`)
 * - localStorage: "Previous Session" snapshot written by `useFormAutoSave`
 *   (`formPersistence.saveFormData`)
 *
 * Uploaded files are cached separately in IndexedDB (`fileCache`) and the
 * current step is mirrored into the `?step=` URL param — both cleared by
 * `clearScholarshipDrafts()` below.
 */
export const scholarshipDraftStorageKeys = (): DraftStorageKey[] => [
  {
    storage: "sessionStorage",
    key: `${SCHOLARSHIP_WIZARD_DRAFT_PREFIX}:v${WIZARD_DRAFT_VERSION}:${SCHOLARSHIP_WIZARD_FORM_ID}:${SCHOLARSHIP_WIZARD_SOURCE}`,
  },
  { storage: "localStorage", key: SAVED_FORM_STORAGE_KEY },
];

type StorageLike = Pick<Storage, "removeItem">;

/**
 * Pure: removes every draft key from the supplied storage areas. Missing or
 * throwing storages (private mode, quota) are ignored.
 */
export const clearScholarshipDraftStorage = (
  storages: Partial<Record<DraftStorageArea, StorageLike | null | undefined>>
): void => {
  for (const { storage, key } of scholarshipDraftStorageKeys()) {
    const area = storages[storage];
    if (!area) continue;
    try {
      area.removeItem(key);
    } catch {
      // ignore
    }
  }
};

const safeStorage = (area: DraftStorageArea): StorageLike | null => {
  try {
    if (typeof window === "undefined") return null;
    return window[area] ?? null;
  } catch {
    return null;
  }
};

/**
 * Fully forgets the in-progress / just-submitted application on this device:
 * Web Storage drafts, the IndexedDB file cache and the `?step=` URL param.
 * Called on successful submit and from "Start another application".
 */
export const clearScholarshipDrafts = async (): Promise<void> => {
  clearScholarshipDraftStorage({
    sessionStorage: safeStorage("sessionStorage"),
    localStorage: safeStorage("localStorage"),
  });
  setStepKeyInUrl(null);
  try {
    await fileCache.clearCache();
  } catch (error) {
    console.warn("Failed to clear file cache:", error);
  }
};
