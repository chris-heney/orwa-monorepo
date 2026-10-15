import { useContext, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormSteps,
  useEntryPayload,
  useFormSubmittedContext,
} from "../providers/AppContextProvider";
import {
  clearWizardDraft,
  getStepKeyFromUrl,
  loadWizardDraft,
  resolveActiveStepIndex,
  saveWizardDraft,
  setStepKeyInUrl,
} from "../helpers/wizardPersistence";
import {
  SCHOLARSHIP_WIZARD_FORM_ID as FORM_ID,
  SCHOLARSHIP_WIZARD_SOURCE as SOURCE,
} from "../helpers/draftReset";

const SAVE_DEBOUNCE_MS = 250;

const WizardStateSync = () => {
  const { steps, stepIndex, setStepIndex } = useContext(FormSteps);
  const { watch, getValues } = useFormContext();
  const { isFormSubmitted } = useFormSubmittedContext();
  const { entryPayload } = useEntryPayload();

  const preferredStepKeyRef = useRef<string | null>(
    entryPayload
      ? null
      : getStepKeyFromUrl() || loadWizardDraft(FORM_ID, SOURCE)?.stepKey || null
  );
  const [hasRestoredStep, setHasRestoredStep] = useState(
    () => !preferredStepKeyRef.current || !!entryPayload
  );
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formValues = watch();

  const activeSteps = steps.filter((step) => step.active);
  const currentStepKey = activeSteps[stepIndex]?.key ?? null;

  useEffect(() => {
    if (hasRestoredStep || entryPayload) return;
    const preferredKey = preferredStepKeyRef.current;
    if (!preferredKey) {
      setHasRestoredStep(true);
      return;
    }
    const activeKeys = activeSteps.map((step) => step.key);
    const nextIndex = resolveActiveStepIndex(activeKeys, preferredKey);
    if (nextIndex !== stepIndex) {
      setStepIndex(nextIndex);
    }
    setHasRestoredStep(true);
  }, [activeSteps, entryPayload, hasRestoredStep, setStepIndex, stepIndex]);

  useEffect(() => {
    if (!hasRestoredStep || !currentStepKey || entryPayload) return;
    setStepKeyInUrl(currentStepKey);
  }, [currentStepKey, entryPayload, hasRestoredStep]);

  useEffect(() => {
    if (entryPayload || isFormSubmitted) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const stepKey =
        (hasRestoredStep && currentStepKey) ||
        preferredStepKeyRef.current ||
        currentStepKey ||
        "personal-data";
      saveWizardDraft(FORM_ID, SOURCE, {
        stepKey,
        values: (formValues || getValues()) as Record<string, unknown>,
      });
    }, SAVE_DEBOUNCE_MS);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [
    currentStepKey,
    entryPayload,
    formValues,
    getValues,
    hasRestoredStep,
    isFormSubmitted,
  ]);

  useEffect(() => {
    // Never re-persist a submitted application on pagehide/beforeunload —
    // that would resurrect the draft the submit just cleared.
    if (entryPayload || isFormSubmitted) return;
    const flush = () => {
      const stepKey =
        (hasRestoredStep && currentStepKey) ||
        preferredStepKeyRef.current ||
        currentStepKey ||
        "personal-data";
      saveWizardDraft(FORM_ID, SOURCE, {
        stepKey,
        values: getValues() as Record<string, unknown>,
      });
    };
    window.addEventListener("pagehide", flush);
    window.addEventListener("beforeunload", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("beforeunload", flush);
    };
  }, [currentStepKey, entryPayload, getValues, hasRestoredStep, isFormSubmitted]);

  useEffect(() => {
    if (!isFormSubmitted) return;
    clearWizardDraft(FORM_ID, SOURCE);
    setStepKeyInUrl(null);
  }, [isFormSubmitted]);

  return null;
};

export default WizardStateSync;
