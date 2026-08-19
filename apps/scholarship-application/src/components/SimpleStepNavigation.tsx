import { useContext, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FormSteps } from "../providers/AppContextProvider";
import { useNotify } from "../NotificationProvider";
import { useFormSubmittedContext } from "../providers/AppContextProvider";
import { fileCache } from "../helpers/fileCache";
import { clearSavedFormData } from "../helpers/formPersistence";
import { submitApplication } from "../data/API";
import { uploadApplicantPDF } from "../helpers/uploadApplicantPdf";
import { processAndUploadFiles } from "../helpers/processAndUploadFiles";
import { mapScholarshipPayload } from "../helpers/mapScholarshipPayload";
import { clearWizardDraft, setStepKeyInUrl } from "../helpers/wizardPersistence";
import {
  mapFormErrorsToValidationFields,
  useValidationHighlight,
  type ValidationField,
} from "../helpers/validationHighlight";
import { IScholarshipApplicationPayload } from "../types/types";

const SimpleStepNavigation = () => {
  const { steps, stepIndex, setStepIndex } = useContext(FormSteps);
  const { trigger, getValues, formState } = useFormContext();
  const { notify } = useNotify();
  const { setIsFormSubmitted } = useFormSubmittedContext();
  const { showInvalid } = useValidationHighlight();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fail = (message: string | null, fields: ValidationField[]) => {
    if (fields.length > 0) {
      showInvalid(...fields);
    }
    if (message) {
      notify(message, "error");
    }
    return false;
  };

  const handleNext = async () => {
    const isValid = await trigger();
    if (!isValid) {
      return fail(
        "Please fix the highlighted fields before continuing.",
        mapFormErrorsToValidationFields(formState.errors)
      );
    }

    const values = getValues() as IScholarshipApplicationPayload;
    const currentKey = steps[stepIndex]?.key;

    if (currentKey === "certification") {
      if (!values.applicant_certification) {
        return fail("Please certify the application.", [
          "applicant_certification",
        ]);
      }
      if (
        values.age_confirm === "No, I am under the age of 18" &&
        !values.guardian_name?.first
      ) {
        return fail("Guardian name is required for applicants under 18.", [
          "guardian_name",
        ]);
      }
    }

    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
      return;
    }

    await handleSubmitPayload();
  };

  const handlePrevious = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const handleSubmitPayload = async () => {
    const isValid = await trigger();
    if (!isValid) {
      fail(
        "Please fix the highlighted fields before submitting.",
        mapFormErrorsToValidationFields(formState.errors)
      );
      return;
    }

    setIsSubmitting(true);
    const formPayload = getValues() as IScholarshipApplicationPayload;

    try {
      const uploadedPDF = await uploadApplicantPDF(formPayload, notify);
      const processedPayload = await processAndUploadFiles(
        {
          ...formPayload,
          applicant_pdf: uploadedPDF,
        } as unknown as Record<string, unknown>,
        notify
      );
      const finalPayload = mapScholarshipPayload({
        ...(processedPayload as unknown as IScholarshipApplicationPayload),
        applicant_pdf: uploadedPDF,
      });

      const response = await submitApplication(
        finalPayload as IScholarshipApplicationPayload
      );

      if (response && response.message === "success") {
        setIsFormSubmitted(true);
        clearSavedFormData();
        clearWizardDraft("orwef-scholarship", "online");
        setStepKeyInUrl(null);
        try {
          await fileCache.clearCache();
        } catch (error) {
          console.warn("Failed to clear file cache:", error);
        }
        notify("Application submitted successfully!", "success");
      } else {
        notify(
          response?.error ||
            "Error submitting application. Please try again later.",
          "error"
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      notify("Error submitting application. Please try again later.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === steps.length - 1;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <button
        type="button"
        onClick={handlePrevious}
        disabled={isFirstStep}
        className={`w-full sm:w-auto px-8 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
          isFirstStep
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 cursor-pointer"
        }`}
      >
        Previous
      </button>

      <div className="hidden sm:flex items-center space-x-2">
        <div className="text-sm text-gray-600 font-medium">
          Step {stepIndex + 1} of {steps.length}
        </div>
      </div>

      <button
        type="button"
        onClick={handleNext}
        disabled={isSubmitting}
        className={`w-full sm:w-auto px-8 py-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
          isSubmitting
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : isLastStep
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {isSubmitting
          ? "Submitting..."
          : isLastStep
            ? "Submit Application"
            : "Next"}
      </button>
    </div>
  );
};

export default SimpleStepNavigation;
