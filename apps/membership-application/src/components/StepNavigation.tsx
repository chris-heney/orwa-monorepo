import { useState } from "react";
import { useFormContext } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";

import {
  useFormSubmittedContext,
  useUserContext,
} from "../providers/MembershipContextProvider";
import { uploadService, useNotify } from "mj-react-form-builder";
import { WatersystemMembershipPayload } from "../types/WatersystemMebership";
import currencyFormatter from "../helpers/currencyFormatter";
import { StoredStrapiFile, StrapiFormattedFile } from "../types";
import { sendEmail, submitMembershipForm } from "../data/API";
import { useFormStepsContext } from "../providers/StepProvider";
import { AssociateMembershipPayload } from "../types/AssociateMembership";
import { validateDirectoryContacts } from "../helpers/validateDirectoryContacts";
import { useValidationHighlight } from "../helpers/validationHighlight";
// import { StrapiFormattedFile } from "../types";
// import { ManualUploadTest } from "../helpers/uploadApplicantPdfTest";

const StepNavigation = () => {
  const { steps, stepIndex, setStepIndex } = useFormStepsContext();
  const { getValues, watch, trigger } = useFormContext();
  const { notify } = useNotify();
  const { isLoggedIn, isAdminView } = useUserContext();
  const { isFormSubmitted, setIsFormSubmitted } = useFormSubmittedContext();
  const { showInvalid, clearAllInvalid } = useValidationHighlight();

  const payment_method = watch("payment_method");
  const path = window.location.hash.substring(2);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    const isValid = await trigger();

    if (steps[stepIndex]?.key === "associate-membership") {
      const selectedMembership = getValues("membership");

      if (selectedMembership === 0) {
        showInvalid("membership_packages");
        notify("Please select a membership package.", "error");
        return;
      }
    }

    if (isValid) {
      const activeSteps = steps.filter((step) => step.active);
      if (
        path.includes("watersystem") &&
        activeSteps[stepIndex]?.key === "directory-contacts"
      ) {
        const dcErr = validateDirectoryContacts(getValues("contacts"));
        if (dcErr) {
          showInvalid("directory_contacts");
          notify(dcErr, "error");
          return;
        }
      }
      clearAllInvalid();
      if (stepIndex < activeSteps.length - 1) {
        setStepIndex(stepIndex + 1);
      }
    } else {
      notify("Please fill out all required fields in this step.", "error");
    }
  };

  const handlePrevious = () => {
    if (stepIndex > 0) {
      clearAllInvalid();
      setStepIndex(stepIndex - 1);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processAndUploadFiles = async (payload: any) => {
    const processedPayload = { ...payload };

    for (const key in processedPayload) {
      if (Array.isArray(processedPayload[key])) {
        // If the key holds an array, check if it contains StrapiFormattedFiles
        const fileArray = processedPayload[key].filter(
          (file: StoredStrapiFile) => {
            return !file.id;
          }
        );

        if (fileArray.length > 0 && fileArray[0]?.rawFile) {
          try {
            const uploadedFiles = await uploadService.uploadFiles(
              fileArray.map((file: StrapiFormattedFile) => file.rawFile),
              import.meta.env.VITE_API_ENDPOINT,
              import.meta.env.VITE_API_KEY
            );
            processedPayload[key] = uploadedFiles.concat(
              processedPayload[key]
                .filter((file: StoredStrapiFile) => {
                  return file.id;
                })
                .map((file: StoredStrapiFile) => file.id)
            );
          } catch (error: unknown) {
            console.error(`Error uploading files for ${key}:`, error);
            notify(
              `Error uploading files for ${key}. Please try again later.`,
              "error"
            );
          }
        }
      } else if (processedPayload[key]?.rawFile) {
        // If the key holds a single StrapiFormattedFile
        if (processedPayload[key].id) {
          processedPayload[key] = processedPayload[key].id;
        } else {
          try {
            // uploadService.uploadFile resolves to the numeric file id;
            // link it directly (Strapi 5 media fields accept file ids in JSON writes)
            const uploadedFileId = await uploadService.uploadFile(
              processedPayload[key].rawFile,
              import.meta.env.VITE_API_ENDPOINT,
              import.meta.env.VITE_API_KEY
            );
            processedPayload[key] = uploadedFileId;
          } catch (error) {
            console.error(`Error uploading file for ${key}:`, error);
            notify(
              `Error uploading file for ${key}. Please try again later.`,
              "error"
            );
          }
        }
      }
    }

    return processedPayload;
  };

  const isEmailFieldKey = (key: string) =>
    key === "email" || key === "billing_email" || key.includes("email");

  const sanitizeEmailFieldsDeep = (value: unknown): unknown => {
    if (value == null) {
      return value;
    }
    if (Array.isArray(value)) {
      return value.map((item) => sanitizeEmailFieldsDeep(item));
    }
    if (typeof value === "object") {
      const obj = value as Record<string, unknown>;
      const out: Record<string, unknown> = { ...obj };
      for (const k of Object.keys(out)) {
        const v = out[k];
        if (typeof v === "string" && isEmailFieldKey(k)) {
          out[k] = v.replace(/\s/g, "");
        } else {
          out[k] = sanitizeEmailFieldsDeep(v);
        }
      }
      return out;
    }
    return value;
  };

  const sanitizeEmailFields = (
    payload: WatersystemMembershipPayload | AssociateMembershipPayload
  ) => {
    return sanitizeEmailFieldsDeep(
      payload
    ) as WatersystemMembershipPayload | AssociateMembershipPayload;
  };

  const handleSubmitMembership = async () => {
    const isValid = await trigger();

    if (isValid) {
      if (path.includes("watersystem")) {
        const dcErr = validateDirectoryContacts(getValues("contacts"));
        if (dcErr) {
          showInvalid("directory_contacts");
          notify(dcErr, "error");
          return;
        }
      }
      setIsSubmitting(true);
      const formPayload = getValues() as WatersystemMembershipPayload;

      const processedPayload = await processAndUploadFiles(formPayload);

      // Sanitize email fields
      const sanitizedPayload = sanitizeEmailFields(processedPayload);
      

      // If payment amount is null send an error notification

      if (
        formPayload.payment_amount === null ||
        isNaN(formPayload.payment_amount ?? NaN)
      ) {
        notify(
          "Payment amount error, reload the page if the error keeps occuring",
          "error"
        );
        sendEmail({
          to: "Marcosje2005@gmail.com",
          from: "website@orwa.org",
          subject: "Payment Processing Error Notification",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #d9534f;">Payment Processing Error</h2>
              <p>There was an error processing the payment. The payment amount is <strong>null</strong>. Please review the form data below and notify the user about the issue.</p>
              <hr style="border: 1px solid #ddd;">
              <h3 style="color: #5bc0de;">Browser and OS Information</h3>
              <p><strong>Browser:</strong> ${navigator.userAgent}</p>
              <hr style="border: 1px solid #ddd;">
              <h3 style="color: #5bc0de;">Form Data</h3>
              <pre style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border: 1px solid #ccc; overflow-x: auto;">
        ${JSON.stringify(
          { ...formPayload, payment_information: null },
          null,
          2
        )}
              </pre>
              <hr style="border: 1px solid #ddd;">
              <p style="color: #888; font-size: 0.9em;">This email was generated automatically. If you have any questions, please contact support.</p>
            </div>
          `,
        });
        setIsSubmitting(false);
        return;
      }

      try {
        const response = await submitMembershipForm({
          ...sanitizedPayload,
          mailing_address_state:
            (formPayload as unknown as AssociateMembershipPayload)
              .mailing_address_state !== ""
              ? (formPayload as unknown as AssociateMembershipPayload)
                  .mailing_address_state
              : null,
          fee_scholarship: isNaN(formPayload.fee_scholarship)
            ? 0
            : formPayload.fee_scholarship,
          payment_details: `==========\n${
            path.includes("watersystem")
              ? `Number of Connections: ${formPayload.meters} x $0.9\n`
              : ""
          }Base Membership Fee: ${currencyFormatter.format(
            formPayload.fee_membership
          )}\nScholarship Support: ${currencyFormatter.format(
            isNaN(formPayload.fee_scholarship) ? 0 : formPayload.fee_scholarship
          )}\n==========\nTotal: ${currencyFormatter.format(
            formPayload.payment_amount
          )}\n==========\nBilling Address: ${
            formPayload.address_billing_line1
          }, ${formPayload.address_billing_city}, ${
            formPayload.address_billing_state
          }, ${formPayload.address_billing_zip}\nBilling Email:${
            sanitizedPayload.billing_email
          }\nBilling Phone: ${formPayload.billing_phone}\nBilling First Name: ${
            formPayload.billing_first_name
          }\nBilling Last Name: ${formPayload.billing_last_name}\n==========`,
        } as unknown as WatersystemMembershipPayload);
        if (response.message === "success") {
          setIsFormSubmitted(true);
          setIsSubmitting(false);
          notify("Application submitted successfully!", "success");
        } else {
          setIsSubmitting(false);
          notify(
            `Error submitting application. Please try again later. Error: ${response.error}`,
            "error"
          );
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Submission error:", error);
        setIsSubmitting(false);
        notify(
          `Error submitting application. Please try again later. ${error.message}`,
          "error"
        );
      }
    } else {
      notify("Please fill out all required fields in this step.", "error");
    }
  };

  const activeSteps = steps.filter((step) => step.active);
  const isReviewStep = activeSteps[stepIndex]?.key === "review";

  return isFormSubmitted ? (
    <></>
  ) : (
    <section className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 px-4 py-5">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={stepIndex === 0}
          className="w-full rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 sm:w-40"
        >
          &larr; Previous
        </button>
        {isSubmitting ? (
          <CircularProgress size={28} />
        ) : (
          <button
            type="button"
            disabled={
              (payment_method.length === 0 && isReviewStep) ||
              (isLoggedIn && isAdminView && isReviewStep)
            }
            onClick={isReviewStep ? handleSubmitMembership : handleNext}
            className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 sm:w-40"
          >
            {isReviewStep ? "Submit Form" : "Next \u2192"}
          </button>
        )}
      </div>
    </section>
  );
};

export default StepNavigation;
