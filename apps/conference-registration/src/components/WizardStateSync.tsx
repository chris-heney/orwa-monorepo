import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  useConferenceId,
  useEntryPayload,
  useFormSubmitted,
  useRegistrationSource,
  useStepContext,
} from "../AppContextProvider";
import {
  clearWizardDraft,
  getStepKeyFromUrl,
  loadWizardDraft,
  resolveActiveStepIndex,
  saveWizardDraft,
  setStepKeyInUrl,
} from "../helpers/wizardPersistence";

const SAVE_DEBOUNCE_MS = 250;

/**
 * Persists wizard step + form draft to sessionStorage and `?step=` URL param.
 * Restores step index once active steps settle after registration type rehydration.
 */
const WizardStateSync = () => {
  const conferenceId = useConferenceId() ?? "2";
  const source = useRegistrationSource() || "online";
  const { steps, stepIndex, setStepIndex } = useStepContext();
  const { watch, getValues } = useFormContext();
  const { submitted } = useFormSubmitted();
  const { entryPayload } = useEntryPayload();

  // Capture preferred step once on mount — before URL sync can overwrite it.
  const preferredStepKeyRef = useRef<string | null>(
    entryPayload
      ? null
      : getStepKeyFromUrl() ||
          loadWizardDraft(conferenceId, source)?.stepKey ||
          null
  );
  const [hasRestoredStep, setHasRestoredStep] = useState(
    () => !preferredStepKeyRef.current || !!entryPayload
  );
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formValues = watch();

  const activeSteps = steps.filter((step) => step.active);
  const currentStepKey = activeSteps[stepIndex]?.key ?? null;

  // Restore step once active steps include the draft/URL target.
  useEffect(() => {
    if (hasRestoredStep || entryPayload) return;

    const preferredKey = preferredStepKeyRef.current;
    if (!preferredKey) {
      setHasRestoredStep(true);
      return;
    }

    const activeKeys = activeSteps.map((step) => step.key);
    const registrationType = getValues("registration_type");
    const pathReady =
      !registrationType ||
      activeKeys.includes("attendee_registration") ||
      activeKeys.includes("vendor_registration") ||
      activeKeys.includes("booth_registration") ||
      activeKeys.includes(preferredKey);

    if (!pathReady) return;

    const nextIndex = resolveActiveStepIndex(activeKeys, preferredKey);
    if (nextIndex !== stepIndex) {
      setStepIndex(nextIndex);
    }
    setHasRestoredStep(true);
  }, [
    activeSteps,
    entryPayload,
    getValues,
    hasRestoredStep,
    setStepIndex,
    stepIndex,
  ]);

  // Keep `?step=` in sync only after restore, so we don't clobber the target.
  useEffect(() => {
    if (!hasRestoredStep || !currentStepKey || entryPayload) return;
    setStepKeyInUrl(currentStepKey);
  }, [currentStepKey, entryPayload, hasRestoredStep]);

  // Debounced draft persistence for step + form values.
  useEffect(() => {
    if (entryPayload || submitted) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const stepKey =
        (hasRestoredStep && currentStepKey) ||
        preferredStepKeyRef.current ||
        currentStepKey ||
        "registration_type";
      saveWizardDraft(conferenceId, source, {
        stepKey,
        values: (formValues || getValues()) as Record<string, unknown>,
      });
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [
    conferenceId,
    currentStepKey,
    entryPayload,
    formValues,
    getValues,
    hasRestoredStep,
    source,
    submitted,
  ]);

  // Flush latest values immediately on hide/unload (covers HMR / accidental refresh).
  useEffect(() => {
    if (entryPayload) return;

    const flush = () => {
      const stepKey =
        (hasRestoredStep && currentStepKey) ||
        preferredStepKeyRef.current ||
        currentStepKey ||
        "registration_type";
      saveWizardDraft(conferenceId, source, {
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
  }, [
    conferenceId,
    currentStepKey,
    entryPayload,
    getValues,
    hasRestoredStep,
    source,
  ]);

  // Clear draft after successful submit
  useEffect(() => {
    if (!submitted) return;
    clearWizardDraft(conferenceId, source);
    setStepKeyInUrl(null);
  }, [conferenceId, source, submitted]);

  return null;
};

export default WizardStateSync;
