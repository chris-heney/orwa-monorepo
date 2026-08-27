import { useEffect, useState } from "react";
import FormStepper from "./_components/FormStepper";
import { Form } from "../providers/FormProvider";
import {
  useFormSteps,
  useEntryPayload,
  useFormSubmittedContext,
} from "../providers/AppContextProvider";
import { useUserContext } from "../providers/UserContextProvider";
import { awardDefaultPayload } from "../helpers/awardDefaultPayload";
import { nextConferenceYear } from "../helpers/nextConferenceYear";
import { loadWizardDraft } from "../helpers/wizardPersistence";
import SimpleStepNavigation from "./_components/SimpleStepNavigation";
import WizardStateSync from "./WizardStateSync";
import { ValidationHighlightProvider } from "../helpers/validationHighlight";
import EntryListSidebar from "../entries/EntryListSidebar";

const GRANT_LEFTOVER_STORAGE_KEY = "grant_application_form_data";

const ScholarshipApplicationForm = () => {
  const { steps, stepIndex, setStepIndex } = useFormSteps();
  const activeSteps = steps.filter((step) => step.active);
  const { entryPayload } = useEntryPayload();
  const { isAdminView, isLoggedIn } = useUserContext();
  const { isFormSubmitted } = useFormSubmittedContext();
  const showAdminSidebar = isLoggedIn && isAdminView;
  const [formDefaultValues] = useState<Record<string, any> | undefined>(() => {
    const conferenceYear = nextConferenceYear();
    if (entryPayload) return entryPayload;
    if (isAdminView) {
      return { ...awardDefaultPayload, award_year: conferenceYear };
    }
    const wizardDraft = loadWizardDraft("orwa-awards", "online");
    if (wizardDraft?.values) {
      return {
        ...awardDefaultPayload,
        ...wizardDraft.values,
        award_year: conferenceYear,
      };
    }
    return { ...awardDefaultPayload, award_year: conferenceYear };
  });

  useEffect(() => {
    const cleanupFiles = async () => {
      try {
        const { fileCache } = await import("../helpers/fileCache");
        await fileCache.cleanExpiredFiles();
      } catch (error) {
        console.warn('Failed to clean expired files:', error);
      }
    };

    cleanupFiles();

    try {
      localStorage.removeItem(GRANT_LEFTOVER_STORAGE_KEY);
    } catch {
      // ignore quota / private mode
    }
  }, []);

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
                Nomination Submitted Successfully!
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                Thank you for submitting your award nomination. We have received it and will review it carefully.
              </p>
              
              {/* Additional Information */}
              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold text-blue-900 mb-3">What happens next?</h2>
                <ol
                  className="text-left text-blue-800 space-y-2"
                  style={{ listStyleType: 'decimal', listStylePosition: 'outside', paddingLeft: '1.625rem', margin: 0 }}
                >
                  <li style={{ display: 'list-item' }}>You will receive an email confirmation shortly</li>
                  <li style={{ display: 'list-item' }}>We will contact you if we need any additional information</li>
                  <li style={{ display: 'list-item' }}>Your nomination will be reviewed by the awards committee</li>
                  <li style={{ display: 'list-item' }}>Awards will be presented at the ORWA Annual Conference in April</li>
                </ol>
              </div>
              
              {/* Contact Information */}
              <div className="text-sm text-gray-500">
                <p>If you have any questions, please contact us at:</p>
                <p className="font-semibold">office@orwa.org</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Form Stepper */}
        <FormStepper stepIndex={stepIndex} setStepIndex={setStepIndex} />

        {/* Main Form Container */}
        <div
          className={`${
            showAdminSidebar ? "max-w-7xl" : "max-w-4xl"
          } mx-auto px-4 sm:px-6 lg:px-8 py-8`}
        >
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Progress Bar */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-300 ease-out"
                style={{
                  width: `${
                    ((stepIndex + 1) / Math.max(activeSteps.length, 1)) * 100
                  }%`
                }}
              />
            </div>

            {/* Form Content */}
            <div className="p-6 sm:p-8 lg:p-12">
              <Form
                defaultValues={formDefaultValues}
              >
                <ValidationHighlightProvider clearOn={stepIndex}>
                <WizardStateSync />
                <div className="grid grid-cols-12 gap-4 min-h-[500px]">
                  <div
                    className={
                      showAdminSidebar ? "col-span-12 lg:col-span-9" : "col-span-12"
                    }
                  >
                    {activeSteps[stepIndex]?.component}
                  </div>
                  {showAdminSidebar && <EntryListSidebar />}
                </div>
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
