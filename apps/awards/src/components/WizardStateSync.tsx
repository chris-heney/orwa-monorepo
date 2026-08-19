import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  useEntryPayload,
  useFormSteps,
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

const FORM_ID = "orwa-awards";
const SOURCE = "online";

const WizardStateSync = () => {
  const { steps, stepIndex, setStepIndex } = useFormSteps();
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
    const nextIndex = resolveActiveStepIndex(
      activeSteps.map((step) => step.key),
      preferredKey
    );
    if (nextIndex !== stepIndex) setStepIndex(nextIndex);
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
      saveWizardDraft(FORM_ID, SOURCE, {
        stepKey: currentStepKey || preferredStepKeyRef.current || "system",
        values: (formValues || getValues()) as Record<string, unknown>,
      });
    }, 250);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [currentStepKey, entryPayload, formValues, getValues, isFormSubmitted]);

  useEffect(() => {
    if (!isFormSubmitted) return;
    clearWizardDraft(FORM_ID, SOURCE);
    setStepKeyInUrl(null);
  }, [isFormSubmitted]);

  return null;
};

export default WizardStateSync;
