import { useContext, useEffect, useState } from "react";
import FormStepper from "./_components/FormStepper";
import { Form } from "../FormProvider";
import StepNavigation from "./StepNavigation";
import {
  FormSteps,
  PayloadProvider,
  useEntryPayload,
} from "../providers/AppContextProvider";
import { useUserContext } from "../providers/UserContextProvider";
import EntryListSidebar from "../entries/EntryListSidebar";
import ApplicationPdfActions from "./_components/ApplicationPdfActions";
import PreviousSessionModal from "./PreviousSessionModal";
import {
  getSavedFormData,
  clearSavedFormData,
  restoreFilesFromCache,
} from "../helpers/formPersistence";
import { useEditSession } from "../providers/EditSessionProvider";
import { ValidationHighlightProvider } from "../helpers/validationHighlight";
import { projectCostsToFormMap } from "../helpers/projectCosts";

/** Ensure project_costs is always the form map shape (edit-session returns an array). */
const withFormProjectCosts = (
  data: Record<string, any> | null | undefined
): Record<string, any> | undefined => {
  if (!data) return undefined;
  return {
    ...data,
    project_costs: projectCostsToFormMap(data.project_costs),
  };
};

const GrantApplicationForm = () => {
  const { steps, setStepIndex, stepIndex } = useContext(FormSteps);
  const payload = useContext(PayloadProvider);
  const { entryPayload } = useEntryPayload();
  const { isAdminView, isLoggedIn } = useUserContext();
  const { isEditMode, editPayload, sessionNotice } = useEditSession();

  const [showPreviousSessionModal, setShowPreviousSessionModal] =
    useState(false);
  const [savedTimestamp, setSavedTimestamp] = useState<number>(0);
  const [formDefaultValues, setFormDefaultValues] = useState<
    Record<string, any> | undefined
  >(
    withFormProjectCosts(editPayload as Record<string, any> | null) ??
      withFormProjectCosts(entryPayload as Record<string, any> | null) ??
      withFormProjectCosts(
        payload.grantApplicationFormPayload as Record<string, any>
      )
  );
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (isEditMode && editPayload) {
      setFormDefaultValues(
        withFormProjectCosts(editPayload as Record<string, any>)
      );
      setStepIndex(0);
      setFormKey((prev) => prev + 1);
    }
  }, [isEditMode, editPayload, setStepIndex]);

  useEffect(() => {
    const cleanupFiles = async () => {
      try {
        const { fileCache } = await import("../helpers/fileCache");
        await fileCache.cleanExpiredFiles();
      } catch (error) {
        console.warn("Failed to clean expired files:", error);
      }
    };

    cleanupFiles();

    if (!isAdminView && !entryPayload && !isEditMode) {
      const savedData = getSavedFormData();
      if (savedData) {
        setSavedTimestamp(savedData.timestamp);
        setShowPreviousSessionModal(true);
      }
    }
  }, [isAdminView, entryPayload, isEditMode]);

  const handleContinuePreviousSession = async () => {
    const savedData = getSavedFormData();
    if (savedData) {
      try {
        const restoredData = await restoreFilesFromCache(savedData.data);
        setFormDefaultValues(withFormProjectCosts(restoredData));
        setStepIndex(savedData.stepIndex || 0);
        setFormKey((prev) => prev + 1);
      } catch (error) {
        console.warn("Failed to restore files from cache:", error);
        setFormDefaultValues(withFormProjectCosts(savedData.data));
        setStepIndex(savedData.stepIndex || 0);
        setFormKey((prev) => prev + 1);
      }
    }
    setShowPreviousSessionModal(false);
  };

  const handleStartFresh = () => {
    clearSavedFormData();
    setShowPreviousSessionModal(false);
    setFormDefaultValues(
      withFormProjectCosts(entryPayload as Record<string, any> | null) ??
        withFormProjectCosts(
          payload.grantApplicationFormPayload as Record<string, any>
        )
    );
    setStepIndex(0);
    setFormKey((prev) => prev + 1);
  };

  const activeStep = steps.filter((step) => step.active)[stepIndex];

  return (
    <>
      <PreviousSessionModal
        open={showPreviousSessionModal}
        savedTimestamp={savedTimestamp}
        onContinue={handleContinuePreviousSession}
        onStartFresh={handleStartFresh}
      />
      <main className="flex min-h-0 flex-col text-left">
        <FormStepper stepIndex={stepIndex} setStepIndex={setStepIndex} />

        {sessionNotice && (
          <div className="mx-auto mt-4 max-w-6xl px-4">
            <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              {sessionNotice}
            </p>
          </div>
        )}

        <section className="min-h-96 flex-1">
          <Form
            key={formKey}
            defaultValues={formDefaultValues}
            autoSave={!isEditMode}
          >
            <ValidationHighlightProvider clearOn={stepIndex}>
              <div className="mx-auto grid max-w-6xl grid-cols-12 gap-4 px-4 py-2">
                <div
                  className={
                    isLoggedIn && isAdminView ? "col-span-9" : "col-span-12"
                  }
                >
                  {activeStep?.component}
                </div>
                {isLoggedIn && isAdminView && <EntryListSidebar />}
              </div>
              {isEditMode && !(isLoggedIn && isAdminView) && (
                <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 pb-2">
                  <p className="text-sm text-slate-600">
                    Preview your application as a PDF. The copy on file updates
                    automatically when you save.
                  </p>
                  <ApplicationPdfActions layout="inline" />
                </div>
              )}
              <StepNavigation />
            </ValidationHighlightProvider>
          </Form>
        </section>
      </main>
    </>
  );
};

export default GrantApplicationForm;
