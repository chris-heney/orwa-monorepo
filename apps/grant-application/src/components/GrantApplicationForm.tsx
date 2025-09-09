import { Divider } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import FormStepper from "./_components/FormStepper";
// import StepNavigation from "./StepNavigation";
import { Form } from "../FormProvider";
import StepNavigation from "./StepNavigation";
import {
  FormSteps,
  PayloadProvider,
  useEntryPayload,
} from "../providers/AppContextProvider";
import { useUserContext } from "../providers/UserContextProvider";
import EntryListSidebar from "../entries/EntryListSidebar";
import { ManualUploadTest } from "../helpers/uploadApplicantPdfTest";
import PreviousSessionModal from "./PreviousSessionModal";
import { 
  getSavedFormData, 
  clearSavedFormData,
  restoreFilesFromCache
} from "../helpers/formPersistence";
// import { ManualUploadTest } from "../helpers/uploadApplicantPdfTest";
// import { ManualUploadTest } from "../helpers/uploadApplicantPdfTest";

const GrantApplicationForm = () => {
  const { steps, setStepIndex, stepIndex } = useContext(FormSteps);
  const payload = useContext(PayloadProvider);
  const { entryPayload } = useEntryPayload();
  const { isAdminView, isLoggedIn } = useUserContext();
  
  const [showPreviousSessionModal, setShowPreviousSessionModal] = useState(false);
  const [savedTimestamp, setSavedTimestamp] = useState<number>(0);
  const [formDefaultValues, setFormDefaultValues] = useState<Record<string, any> | undefined>(
    entryPayload ?? (payload.grantApplicationFormPayload as Record<string, any>)
  );
  const [formKey, setFormKey] = useState(0); // Force form re-render when needed

  // Check for saved form data on component mount
  useEffect(() => {
    // Clean expired files on mount
    const cleanupFiles = async () => {
      try {
        const { fileCache } = await import("../helpers/fileCache");
        await fileCache.cleanExpiredFiles();
      } catch (error) {
        console.warn('Failed to clean expired files:', error);
      }
    };

    cleanupFiles();

    // Only check for saved data if we're not in admin view and no entryPayload exists
    if (!isAdminView && !entryPayload) {
      const savedData = getSavedFormData();
      if (savedData) {
        setSavedTimestamp(savedData.timestamp);
        setShowPreviousSessionModal(true);
      }
    }
  }, []);

  const handleContinuePreviousSession = async () => {
    const savedData = getSavedFormData(); 
    if (savedData) {
      try {
        // Restore files from cache before setting form data
        const restoredData = await restoreFilesFromCache(savedData.data);
        setFormDefaultValues(restoredData);
        setStepIndex(savedData.stepIndex || 0);
        setFormKey(prev => prev + 1); // Force form re-render with new data
      } catch (error) {
        console.warn('Failed to restore files from cache:', error);
        // Fallback to data without files
        setFormDefaultValues(savedData.data);
        setStepIndex(savedData.stepIndex || 0);
        setFormKey(prev => prev + 1);
      }
    }
    setShowPreviousSessionModal(false);
  };

  const handleStartFresh = () => {
    clearSavedFormData();
    setShowPreviousSessionModal(false);
    // Reset to default values
    setFormDefaultValues(
      entryPayload ?? (payload.grantApplicationFormPayload as Record<string, any>)
    );
    setStepIndex(0);
    setFormKey(prev => prev + 1); // Force form re-render with fresh data
  };

  return (
    <>
      <PreviousSessionModal
        open={showPreviousSessionModal}
        savedTimestamp={savedTimestamp}
        onContinue={handleContinuePreviousSession}
        onStartFresh={handleStartFresh}
      />
      <main className="flex flex-col text-center">
        {/* Form Stepper */}

        <FormStepper stepIndex={stepIndex} setStepIndex={setStepIndex} />

        <Divider />

        {/* Active Step */}
        <section className="min-h-96 p-3 md:py-6">
          <Form
            key={formKey}
            defaultValues={formDefaultValues}
          >
            <div className="gap-4 grid grid-cols-12 align-middle p-5">
              <div className={`${(isLoggedIn  && isAdminView)  ? "col-span-9" : "col-span-12"}`}>
                {steps.filter((step) => step.active)[stepIndex].component}
              </div>
              {(isLoggedIn  && isAdminView) && <EntryListSidebar />}
            </div>
            <StepNavigation />
            {(isLoggedIn  && isAdminView) && <ManualUploadTest/>}
          </Form>
          {/* <DevTool control={form.control} placement='top-right' /> */}
        </section>
      </main>
    </>
  );
};

export default GrantApplicationForm;
