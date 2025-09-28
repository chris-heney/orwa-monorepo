import { useContext, useEffect, useState } from "react";
import FormStepper from "./_components/FormStepper";
import { Form } from "../providers/FormProvider";
import SimpleStepNavigation from "./SimpleStepNavigation";
import {
  useFormSteps,
  usePayload,
  useEntryPayload,
  useFormSubmittedContext,
} from "../providers/AppContextProvider";
import { useUserContext } from "../providers/UserContextProvider";
import PreviousSessionModal from "./PreviousSessionModal";
import { 
  getSavedFormData, 
  clearSavedFormData,
  restoreFilesFromCache
} from "../helpers/formPersistence";
import { scholarshipDefaultPayload } from "../helpers/scholarshipDefaultPayload";

const ScholarshipApplicationForm = () => {
  const { steps, setStepIndex, stepIndex } = useFormSteps();
  const payload = usePayload();
  const { entryPayload } = useEntryPayload();
  const { isAdminView, isLoggedIn } = useUserContext();
  const { isFormSubmitted } = useFormSubmittedContext();
  
  const [showPreviousSessionModal, setShowPreviousSessionModal] = useState(false);
  const [savedTimestamp, setSavedTimestamp] = useState<number>(0);
  const [formDefaultValues, setFormDefaultValues] = useState<Record<string, any> | undefined>(
    entryPayload ?? scholarshipDefaultPayload
  );
  const [formKey, setFormKey] = useState(0); 

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
      entryPayload ?? scholarshipDefaultPayload
    );
    setStepIndex(0);
    setFormKey(prev => prev + 1); // Force form re-render with fresh data
  };

  // Show confirmation screen if form is submitted
  if (isFormSubmitted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden text-center">
            <div className="p-8 sm:p-12">
              {/* Success Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {/* Success Message */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Application Submitted Successfully!
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                Thank you for submitting your scholarship application. We have received your application and will review it carefully.
              </p>
              
              {/* Additional Information */}
              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold text-blue-900 mb-3">What happens next?</h2>
                <ul className="text-left text-blue-800 space-y-2">
                  <li>• Your application will be reviewed by our scholarship committee</li>
                  <li>• You will receive an email confirmation shortly</li>
                  <li>• We will contact you if we need any additional information</li>
                  <li>• Award decisions will be announced by the specified deadline</li>
                </ul>
              </div>
              
              {/* Contact Information */}
              <div className="text-sm text-gray-500">
                <p>If you have any questions, please contact us at:</p>
                <p className="font-semibold">scholarships@orwa.org</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

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
                test={true}
              >
                {/* Step Content */}
                <div className="min-h-[500px]">
                  {steps.filter((step) => step.active)[stepIndex].component}
                </div>
                
                {/* Navigation */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <SimpleStepNavigation />
                </div>
              </Form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ScholarshipApplicationForm;
