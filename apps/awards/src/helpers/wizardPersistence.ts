import { createWizardPersistence } from "@orwa/public-form";

export {
  WIZARD_DRAFT_VERSION,
  WIZARD_STEP_PARAM,
  sanitizeDraftValues,
  type WizardDraft,
} from "@orwa/public-form";

const persistence = createWizardPersistence({
  prefix: "orwa-awards-draft",
});

export const loadWizardDraft = persistence.loadWizardDraft;
export const saveWizardDraft = persistence.saveWizardDraft;
export const clearWizardDraft = persistence.clearWizardDraft;
export const getStepKeyFromUrl = persistence.getStepKeyFromUrl;
export const setStepKeyInUrl = persistence.setStepKeyInUrl;
export const resolveActiveStepIndex = persistence.resolveActiveStepIndex;
