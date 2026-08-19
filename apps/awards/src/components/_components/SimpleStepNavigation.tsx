import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useFormSteps, useFormSubmittedContext } from "../../providers/AppContextProvider";
import { useNotify } from "../../NotificationProvider";
import { IAwardNominationPayload } from "../../types/types";
import { processAndUploadFiles } from "../../helpers/processAndUploadFiles";
import { uploadNominationPDF } from "../../helpers/uploadNominationPdf";
import { mapAwardNominationPayload } from "../../helpers/mapAwardNominationPayload";
import { submitAwardNomination } from "../../data/API";
import { clearWizardDraft, setStepKeyInUrl } from "../../helpers/wizardPersistence";
import { fileCache } from "../../helpers/fileCache";
import {
  mapFormErrorsToValidationFields,
  useValidationHighlight,
  type ValidationField,
} from "../../helpers/validationHighlight";

const SimpleStepNavigation = () => {
  const { steps, stepIndex, setStepIndex } = useFormSteps();
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
    const formPayload = getValues() as IAwardNominationPayload;

    try {
      const uploadedPDF = await uploadNominationPDF(formPayload, notify);
      const processedPayload = await processAndUploadFiles(
        {
          ...formPayload,
          nomination_pdf: uploadedPDF,
        } as unknown as Record<string, unknown>,
        notify
      );
      const finalPayload = mapAwardNominationPayload({
        ...(processedPayload as unknown as IAwardNominationPayload),
        nomination_pdf: uploadedPDF,
      });

      const response = await submitAwardNomination(
        finalPayload as unknown as IAwardNominationPayload
      );

      if (response && response.message === "success") {
        setIsFormSubmitted(true);
        clearWizardDraft("orwa-awards", "online");
        setStepKeyInUrl(null);
        try {
          await fileCache.clearCache();
        } catch (error) {
          console.warn("Failed to clear file cache:", error);
        }
        notify("Award nomination submitted successfully!", "success");
      } else {
        notify(
          response?.error ||
            "Error submitting award nomination. Please try again later.",
          "error"
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      notify("Error submitting award nomination. Please try again later.", "error");
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
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {isSubmitting
          ? "Submitting..."
          : isLastStep
            ? "Submit Nomination"
            : "Next"}
      </button>
    </div>
  );
};

export default SimpleStepNavigation;
