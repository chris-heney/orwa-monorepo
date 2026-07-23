import { useContext, useState } from "react";

import { Button } from "@mui/material";
import { useFormContext } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";
import { updateApplication, useGetApplicationId, useSubmitApplication } from "../data/API";
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
import { useEditSession } from "../providers/EditSessionProvider";
// import { ManualUploadTest } from "../helpers/uploadApplicantPdfTest";

const StepNavigation = () => {
  const { steps, stepIndex, setStepIndex } = useContext(FormSteps);
  const { getValues, watch, trigger } = useFormContext();
  const { notify } = useNotify();
  const { scoringCriterias } = useScoringCriterias();
  const { setIsFormSubmitted, isFormSubmitted } = useFormSubmittedContext();
  const { isAdminView } = useUserContext();
  const { isEditMode, editToken, rememberEditToken, invalidateSession } =
    useEditSession();

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

      // Editing keeps the application's original id; new submissions get the next one
      const submissionApplicationId = isEditMode
        ? (formPayload as Record<string, any>).application_id
        : applicationId.data;

      try {
        // Process the payload and upload files if necessary
        const processedPayload = await processAndUploadFiles({
          ...formPayload,
          id: submissionApplicationId,
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
          application_id: submissionApplicationId,
          engineering_report_deq_approved: watch("engineering_report_deq_approved") === "Yes" ? true : false,
        };

        // Submit the processed payload (update in place when editing)
        const response = isEditMode && editToken
          ? await updateApplication(editToken, payload)
          : await useSubmitApplication(payload);

        if (response.message === "success") {
          setIsFormSubmitted(true);

          // Keep the edit token so the applicant can come back and modify
          // this application later from the same device
          if (!isEditMode && response.editToken) {
            rememberEditToken(response.editToken);
          }

          clearSavedFormData(); // Clear saved form data on successful submission
          
          // Clear file cache on successful submission
          try {
            await fileCache.clearCache();
          } catch (error) {
            console.warn('Failed to clear file cache:', error);
          }
          
          notify(
            isEditMode
              ? "Your changes have been saved!"
              : "Application submitted successfully!",
            "success"
          );
        } else if (isEditMode && (response.code === "invalid" || response.code === "locked")) {
          setIsSubmitting(false);
          invalidateSession(
            response.code === "locked"
              ? "Your application is already being processed and cannot be modified at this time."
              : "Your edit link is no longer valid. Please verify your email to receive a new one."
          );
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
              ? isEditMode
                ? "Save Changes"
                : "Submit Form"
              : "Next »"}
          </Button>
        )}
      </div>
      {/* <ManualUploadTest /> */}
    </section>
  );
};

export default StepNavigation;
