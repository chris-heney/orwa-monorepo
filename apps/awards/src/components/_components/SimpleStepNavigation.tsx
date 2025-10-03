import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useFormSteps, useFormSubmittedContext } from "../../providers/AppContextProvider";
import { useNotify } from "../../NotificationProvider";
import { IAwardNominationPayload } from "../../types/types";
import { processAndUploadFiles } from "../../helpers/processAndUploadFiles";
// import { uploadApplicantPDF } from "../../helpers/uploadApplicantPdf";
import { submitAwardNomination } from "../../data/API";
import { clearSavedFormData } from "../../helpers/formPersistence";
import { fileCache } from "../../helpers/fileCache";

const SimpleStepNavigation = () => {
  const { steps, stepIndex, setStepIndex } = useFormSteps();
  const { trigger, getValues } = useFormContext();
  const { notify } = useNotify();
  const { setIsFormSubmitted } = useFormSubmittedContext();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    // Trigger form validation for current step
    const isValid = await trigger();
    
    if (isValid) {
      if (stepIndex < steps.length - 1) {
        setStepIndex(stepIndex + 1);
      } else {
        // Final step - handle form submission
        handleSubmitPayload();
      }
    } else {
      notify("Please fix the errors above before continuing.", "error");
    }
  };

  const handlePrevious = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const handleSubmitPayload = async () => {
    // Trigger form validation
    const isValid = await trigger();
    if (isValid) {
      setIsSubmitting(true);
      const formPayload = getValues() as IAwardNominationPayload;

      try {
        // Process the payload and upload files if necessary
        const processedPayload = await processAndUploadFiles({
          ...formPayload,
        }, notify);

        // Add the uploaded PDF id to the payload
        const finalPayload = {
          ...processedPayload,
        };

        // Submit the processed payload
        const response = await submitAwardNomination(finalPayload);

        if (response && response.message === "success") {
          setIsFormSubmitted(true);
          setIsSubmitting(false); // Reset loading state
          clearSavedFormData(); // Clear saved form data on successful submission
          
          // Clear file cache on successful submission
          try {
            await fileCache.clearCache();
          } catch (error) {
            console.warn('Failed to clear file cache:', error);
          }
          
          notify("Award nomination submitted successfully!", "success");
        } else {
          setIsSubmitting(false);
          notify(
            "Error submitting award nomination. Please try again later.",
            "error"
          );
        }
      } catch (error) {
        console.error("Submission error:", error);
        setIsSubmitting(false);
        notify(
          "Error submitting award nomination. Please try again later.",
          "error"
        );
      }
    }
  };

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === steps.length - 1;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      {/* Previous Button */}
      <button
        type="button"
        onClick={handlePrevious}
        disabled={isFirstStep}
        className={`w-full sm:w-auto px-8 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
          isFirstStep
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        }`}
      >
        ← Previous
      </button>

      {/* Progress Indicator */}
      <div className="hidden sm:flex items-center space-x-2">
        <div className="text-sm text-gray-600 font-medium">
          Step {stepIndex + 1} of {steps.length}
        </div>
        <div className="flex space-x-1">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index <= stepIndex ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Next/Submit Button */}
      <button
        type="button"
        onClick={handleNext}
        disabled={isSubmitting}
        className={`w-full sm:w-auto px-8 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
          isSubmitting
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : isLastStep
            ? "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg"
            : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
        }`}
      >
        {isSubmitting ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Submitting...</span>
          </div>
        ) : isLastStep ? (
              "Submit Award Nomination ✓"
        ) : (
          "Next →"
        )}
      </button>
    </div>
  );
};

export default SimpleStepNavigation;
