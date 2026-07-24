import { useContext, useState } from "react";
import { useFormContext } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";
import {
  updateApplication,
  useGetApplicationId,
  useSubmitApplication,
} from "../data/API";
import { IGrantApplicationFormPayload } from "../types/types";
import { useNotify } from "../NotificationProvider";
import { uploadApplicantPDF } from "../helpers/uploadApplicantPdf";
import {
  FormSteps,
  useFormSubmittedContext,
  useScoringCriterias,
} from "../providers/AppContextProvider";
import { processAndUploadFiles } from "../helpers/processAndUploadFiles";
import { clearSavedFormData } from "../helpers/formPersistence";
import { fileCache } from "../helpers/fileCache";
import { useUserContext } from "../providers/UserContextProvider";
import { useEditSession } from "../providers/EditSessionProvider";
import {
  mapFormErrorsToValidationFields,
  useValidationHighlight,
} from "../helpers/validationHighlight";

const StepNavigation = () => {
  const { steps, stepIndex, setStepIndex } = useContext(FormSteps);
  const { getValues, watch, trigger, formState } = useFormContext();
  const { errors } = formState;
  const { notify } = useNotify();
  const { scoringCriterias } = useScoringCriterias();
  const { setIsFormSubmitted, isFormSubmitted } = useFormSubmittedContext();
  const { isAdminView } = useUserContext();
  const { isEditMode, editToken, rememberEditToken, invalidateSession } =
    useEditSession();
  const { showInvalid, clearAllInvalid } = useValidationHighlight();

  const applicationId = useGetApplicationId();
  const certifyChecked = watch("certify");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeSteps = steps.filter((step) => step.active);
  const currentKey = activeSteps[stepIndex]?.key;
  const isLast = stepIndex >= activeSteps.length - 1;

  const handleValidationFailure = () => {
    const fields = mapFormErrorsToValidationFields(errors);
    if (fields.length > 0) {
      showInvalid(...fields);
    }
    notify("Please fill out all required fields in this step.", "error");
  };

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      clearAllInvalid();
      if (!isLast) {
        setStepIndex(stepIndex + 1);
      }
    } else {
      handleValidationFailure();
    }
  };

  const handlePrevious = () => {
    if (stepIndex > 0) {
      clearAllInvalid();
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
    const isValid = await trigger();
    if (!isValid) {
      handleValidationFailure();
      return;
    }

    setIsSubmitting(true);
    const formPayload = getValues() as IGrantApplicationFormPayload;

    const submissionApplicationId = isEditMode
      ? (formPayload as Record<string, any>).application_id
      : applicationId.data;

    try {
      const processedPayload = await processAndUploadFiles(
        {
          ...formPayload,
          id: submissionApplicationId,
        },
        notify
      );

      const uploadedPDF = await uploadApplicantPDF(
        processedPayload,
        notify,
        getSelectedCriterias(getValues("selected_projects"))
      );

      const payload = {
        ...processedPayload,
        additional_funding_requested: Math.round(
          watch("additional_funding_requested")
        ),
        applicant_pdf: uploadedPDF,
        application_id: submissionApplicationId,
        engineering_report_deq_approved:
          watch("engineering_report_deq_approved") === "Yes",
      };

      const response =
        isEditMode && editToken
          ? await updateApplication(editToken, payload)
          : await useSubmitApplication(payload);

      if (response.message === "success") {
        setIsFormSubmitted(true);

        if (!isEditMode && response.editToken) {
          rememberEditToken(response.editToken);
        }

        clearSavedFormData();

        try {
          await fileCache.clearCache();
        } catch (error) {
          console.warn("Failed to clear file cache:", error);
        }

        notify(
          isEditMode
            ? "Your changes have been saved!"
            : "Application submitted successfully!",
          "success"
        );
      } else if (
        isEditMode &&
        (response.code === "invalid" || response.code === "locked")
      ) {
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
      notify("Error submitting application. Please try again later.", "error");
    }
  };

  if (isFormSubmitted) return null;

  const showSubmitOrNext = !(isAdminView && currentKey === "signature");

  return (
    <section className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-3 px-4 py-5">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={stepIndex === 0}
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Previous
        </button>

        {isSubmitting ? (
          <CircularProgress size={28} />
        ) : (
          showSubmitOrNext && (
            <button
              type="button"
              disabled={!certifyChecked && currentKey === "signature"}
              onClick={
                currentKey === "signature" ? handleSubmitPayload : handleNext
              }
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {currentKey === "signature"
                ? isEditMode
                  ? "Save Changes"
                  : "Submit Form"
                : "Next →"}
            </button>
          )
        )}
      </div>
    </section>
  );
};

export default StepNavigation;
