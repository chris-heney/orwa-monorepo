import { useContext, useEffect, useState } from "react";
import FormStepper from "./_components/FormStepper";
import { Form } from "../FormProvider";
import SimpleStepNavigation from "./SimpleStepNavigation";
import WizardStateSync from "./WizardStateSync";
import {
  FormSteps,
  useEntryPayload,
} from "../providers/AppContextProvider";
import { useUserContext } from "../providers/UserContextProvider";
import PreviousSessionModal from "./PreviousSessionModal";
import {
  getSavedFormData,
  clearSavedFormData,
  restoreFilesFromCache,
} from "../helpers/formPersistence";
import { loadWizardDraft } from "../helpers/wizardPersistence";
import { ValidationHighlightProvider } from "../helpers/validationHighlight";
import { scholarshipDefaultPayload } from "../helpers/scholarshipDefaultPayload";
import { hydrateFinancialResources } from "../helpers/mapScholarshipPayload";

const withFinancialResources = (payload: Record<string, any>) => ({
  ...payload,
  financial_resources: hydrateFinancialResources(payload),
});

const ScholarshipApplicationForm = () => {
  const { steps, setStepIndex, stepIndex } = useContext(FormSteps);
  const { entryPayload } = useEntryPayload();
  const { isAdminView, isLoggedIn } = useUserContext();
  
  const [showPreviousSessionModal, setShowPreviousSessionModal] = useState(false);
  const [savedTimestamp, setSavedTimestamp] = useState<number>(0);
  const [formDefaultValues, setFormDefaultValues] = useState<Record<string, any> | undefined>(
    withFinancialResources(entryPayload ?? scholarshipDefaultPayload)
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
      const wizardDraft = loadWizardDraft("orwef-scholarship", "online");
      if (wizardDraft?.values) {
        setFormDefaultValues(
          withFinancialResources({
            ...scholarshipDefaultPayload,
            ...wizardDraft.values,
          })
        );
      }
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
        setFormDefaultValues(withFinancialResources(restoredData));
        setStepIndex(savedData.stepIndex || 0);
        setFormKey(prev => prev + 1); // Force form re-render with new data
      } catch (error) {
        console.warn('Failed to restore files from cache:', error);
        // Fallback to data without files
        setFormDefaultValues(withFinancialResources(savedData.data));
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
      withFinancialResources(entryPayload ?? scholarshipDefaultPayload)
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
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Form Stepper */}
        <FormStepper stepIndex={stepIndex} setStepIndex={setStepIndex} />

        {/* Main Form Container */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Progress Bar */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-300 ease-out"
                style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
              />
            </div>

            {/* Form Content */}
            <div className="p-6 sm:p-8 lg:p-12">
              <Form
                key={formKey}
                defaultValues={formDefaultValues}
              >
                <ValidationHighlightProvider clearOn={stepIndex}>
                  <WizardStateSync />
                {/* Step Content */}
                <div className="min-h-[500px]">
                  {steps.filter((step) => step.active)[stepIndex]?.component}
                </div>
                
                {/* Navigation */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <SimpleStepNavigation />
                </div>
                </ValidationHighlightProvider>
              </Form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ScholarshipApplicationForm;
