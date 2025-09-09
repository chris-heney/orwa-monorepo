import { useContext, useState } from "react";

import { Button } from "@mui/material";
import { useFormContext } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";
import { useGetApplicationId, useSubmitApplication } from "../data/API";
import {
  IGrantApplicationFormPayload,
} from "../types/types";
import { useNotify } from "../NotificationProvider";
import { uploadApplicantPDF } from "../helpers/uploadApplicantPdf";
import { FormSteps, useFormSubmittedContext, useScoringCriterias } from "../providers/AppContextProvider";
import { processAndUploadFiles } from "../helpers/processAndUploadFiles";
import { clearSavedFormData } from "../helpers/formPersistence";
import { fileCache } from "../helpers/fileCache";
import { useUserContext } from "../providers/UserContextProvider";
// import { ManualUploadTest } from "../helpers/uploadApplicantPdfTest";

const StepNavigation = () => {
  const { steps, stepIndex, setStepIndex } = useContext(FormSteps);
  const { getValues, watch, trigger } = useFormContext();
  const { notify } = useNotify();
  const { scoringCriterias } = useScoringCriterias();
  const { setIsFormSubmitted, isFormSubmitted } = useFormSubmittedContext();
  const { isAdminView } = useUserContext();

  const applicationId = useGetApplicationId();

  const certifyChecked = watch("certify");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    // Trigger form validation
    const isValid = await trigger();
    if (isValid) {
      if (stepIndex < steps.filter((step) => step.active).length - 1) {
        setStepIndex(stepIndex + 1);
      }
    } else {
      notify("Please fill out all required fields in this step.", "error");
    }
  };

  const handlePrevious = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  
  const getSelectedCriterias = (selectedProjects: string[]) => {
    return scoringCriterias
      .filter((criteria) => {
        return (
          criteria.project_type.data &&
          criteria.project_type.data.classification ===
            getValues("drinking_or_wastewater")
        );
      })
      .map((criteria) => {
        const included = () => {
          return (
            criteria.project_type.data &&
            selectedProjects.includes(criteria.project_type.data.id.toString())
          );
        };

        return [criteria.order, criteria.label, included()];
      });
  };

  const handleSubmitPayload = async () => {
    // Trigger form validation
    const isValid = await trigger();
    if (isValid) {
      setIsSubmitting(true);
      const formPayload = getValues() as IGrantApplicationFormPayload;

      try {
        // Process the payload and upload files if necessary
        const processedPayload = await processAndUploadFiles({
          ...formPayload,
          id: applicationId.data,
        }, notify);

        // Generate the applicant PDF and upload it
        const uploadedPDF = await uploadApplicantPDF(
          processedPayload,
          notify,
          getSelectedCriterias(getValues("selected_projects"))
        );

        // Add the uploaded PDF id to the payload
        const payload = {
          ...processedPayload,
          additional_funding_requested: Math.round(watch("additional_funding_requested")),
          applicant_pdf: uploadedPDF,
          application_id: applicationId.data,
          engineering_report_deq_approved: watch("engineering_report_deq_approved") === "Yes" ? true : false,
        };

        // Submit the processed payload
        const response = await useSubmitApplication(payload);

        if (response.message === "success") {
          setIsFormSubmitted(true);
          clearSavedFormData(); // Clear saved form data on successful submission
          
          // Clear file cache on successful submission
          try {
            await fileCache.clearCache();
          } catch (error) {
            console.warn('Failed to clear file cache:', error);
          }
          
          notify("Application submitted successfully!", "success");
        } else {
          setIsSubmitting(false);
          notify(
            "Error submitting application. Please try again later.",
            "error"
          );
        }
      } catch (error) {
        console.error("Submission error:", error);
        setIsSubmitting(false);
        notify(
          "Error submitting application. Please try again later.",
          "error"
        );
      }
    }
  };

  return isFormSubmitted ? (
    <></>
  ) : (
    <section className="w-full p-3 md:py-6 lg:py-12 mt-auto self-end place-self-end">
      <div className="max-w-3xl mx-auto flex gap-3 justify-center">
        {/* Previous Button */}
        <Button
          type="button"
          variant="contained"
          color="inherit"
          onClick={handlePrevious}
          disabled={stepIndex === 0}
          className="w-full sm:w-36 bg-slate-300"
        >
          &laquo; Previous
        </Button>
        {/* Next Button */}
        {isSubmitting ? (
          <CircularProgress />
        ) : !(isAdminView && steps.filter((step) => step.active)[stepIndex].key === "signature") && (
          <Button
            variant="contained"
            color="primary"
            disabled={
              !certifyChecked &&
              steps.filter((step) => step.active)[stepIndex].key === "signature"
            }
            onClick={
              steps.filter((step) => step.active)[stepIndex].key === "signature"
                ? handleSubmitPayload
                : handleNext
            }
            className="w-full sm:w-36"
          >
            {steps.filter((step) => step.active)[stepIndex].key === "signature"
              ? "Submit Form"
              : "Next »"}
          </Button>
        )}
      </div>
      {/* <ManualUploadTest /> */}
    </section>
  );
};

export default StepNavigation;
