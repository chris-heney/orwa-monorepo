import { useState } from "react";
import {
  useConferenceId,
  useFormSubmitted,
  useRegistrationOptions,
  useRegistrationSource,
  useStepContext,
  useUserContext,
} from "../AppContextProvider";
import { Button } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useSubmitRegistration2 } from "../data/API";
import CircularProgress from "@mui/material/CircularProgress";
import { useNotify } from "mj-react-form-builder";
import { IRegistrationPayload } from "../types/types";
import { calculateSubtotal } from "../helpers/calculateSubtotal";
import { processAndUploadFiles } from "../helpers/processAndUploadFiles";
import {
  clearWizardDraft,
  setStepKeyInUrl,
} from "../helpers/wizardPersistence";
import {
  collectFormErrorMessages,
  mapFormErrorsToValidationFields,
  useValidationHighlight,
  type ValidationField,
} from "../helpers/validationHighlight";

const StepNavigation = () => {
  const { steps, stepIndex, setStepIndex } = useStepContext();
  const { ConferenceOptions, ExtraOptions } = useRegistrationOptions();
  const { setSubmitted } = useFormSubmitted();
  const { isAdminView, isLoggedIn } = useUserContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const registrationSource = useRegistrationSource();
  const conferenceId = useConferenceId() ?? "2";
  const { getValues, trigger, getFieldState, formState } = useFormContext();
  // Subscribe so formState.errors stays current after await trigger().
  const { errors } = formState;
  const { notify } = useNotify();
  const { showInvalid, clearAllInvalid } = useValidationHighlight();

  const payload = getValues() as IRegistrationPayload;

  if (!payload) return null;

  const activeSteps = steps.filter((step) => step.active);
  const currentStepLabel = activeSteps[stepIndex]?.label;

  const fail = (
    message: string | null,
    fields: ValidationField[],
    { toast = true }: { toast?: boolean } = {}
  ) => {
    if (fields.length > 0) {
      showInvalid(...fields);
    }
    if (toast && message) {
      notify(message, "error");
    }
    return false;
  };

  const boothValid = (toast = true): boolean => {
    if (
      payload.booths.length === 0 &&
      currentStepLabel === "Booths"
    ) {
      return fail("Please add at least one booth", ["booths"], { toast });
    }
    return true;
  };

  const contestantValid = (toast = true): boolean => {
    if (
      payload?.registrationAddonIds?.length === 0 &&
      currentStepLabel === "Contestants"
    ) {
      return fail(
        "You must select water taste test option",
        ["contestants"],
        { toast }
      );
    }
    return true;
  };

  const ticketAttendeeValid = (toast = true): boolean => {
    const tickets = payload.tickets;

    const guestCount = tickets.filter(
      (ticket) => ticket.ticket_type.name === "Guest"
    ).length;

    const attendeeCount = tickets.filter((ticket) =>
      ticket.ticket_type.name.toLowerCase().includes("registration") ||
      ticket.ticket_type.name.toLowerCase().includes("attendee")
    ).length;

    if (
      attendeeCount === 0 &&
      currentStepLabel === "Attendees" &&
      guestCount === 0 &&
      (!isAdminView || !isLoggedIn)
    ) {
      return fail("Please add at least one Attendee", ["attendees"], {
        toast,
      });
    }

    if (
      guestCount > 0 &&
      attendeeCount < guestCount &&
      (!isAdminView || !isLoggedIn)
    ) {
      return fail(
        "Guest registration must accompany a full or partial registration.",
        ["attendees"],
        { toast }
      );
    }

    return true;
  };

  const ticketVendorValid = (toast = true): boolean => {
    if (
      payload.tickets.filter((ticket) => ticket.type === "Vendor").length ===
        0 &&
      currentStepLabel === "Vendors"
    ) {
      return fail("Please add at least one Vendor", ["vendors"], { toast });
    }
    return true;
  };

  const isRegistrationStepValid = (toast = true): boolean => {
    const registrationType = payload.registration_type;
    const hasAttendeeOrVendor =
      registrationType === "Attendee" || registrationType === "Vendor";

    if (currentStepLabel === "Type") {
      if (hasAttendeeOrVendor) {
        return true;
      }
      return fail(
        "Please select Attendee or Vendor registration to continue",
        ["registration_type"],
        { toast }
      );
    }

    const hasTypePath = activeSteps.some((step) =>
      ["Attendees", "Vendors", "Contestants"].includes(step.label)
    );
    if (!hasTypePath && !hasAttendeeOrVendor) {
      return fail(
        "Please go back and select Attendee or Vendor registration",
        ["registration_type"],
        { toast }
      );
    }

    return true;
  };

  const handleFormFieldErrors = (): boolean => {
    const fieldByPath: Record<string, ValidationField> = {
      registration_type: "registration_type",
      member_status: "member_status",
      agency: "agency",
      vendor_participation_acknowledgement: "vendor_acknowledgement",
      organization: "organization",
      logo: "sponsor_details",
      "registrant.first": "contact",
      "registrant.last": "contact",
      "registrant.email": "contact",
      "registrant.phone": "contact",
      paymentType: "billing",
      "paymentData.cardNumber": "billing",
      "paymentData.expirationDate": "billing",
      "paymentData.cardCode": "billing",
      registrationAddonIds: "contestants",
    };

    const highlightFields = new Set<ValidationField>(
      mapFormErrorsToValidationFields(errors)
    );
    const messages: string[] = [];

    for (const [path, field] of Object.entries(fieldByPath)) {
      const { error } = getFieldState(path);
      if (error) {
        highlightFields.add(field);
        if (error.message) {
          messages.push(String(error.message));
        }
      }
    }

    if (highlightFields.size > 0) {
      showInvalid(...highlightFields);
    }

    const allMessages =
      messages.length > 0 ? messages : collectFormErrorMessages(errors);

    notify(
      allMessages[0] ||
        "Please correct the errors in the form before continuing",
      "error"
    );
    return false;
  };

  const handleNext = async () => {
    const isValid = await trigger();
    if (!isValid) {
      handleFormFieldErrors();
      // Also toast/highlight step-specific list rules so every problem is obvious.
      ticketAttendeeValid();
      ticketVendorValid();
      boothValid();
      isRegistrationStepValid();
      contestantValid();
      return;
    }

    const stepChecksOk =
      ticketAttendeeValid() &&
      ticketVendorValid() &&
      boothValid() &&
      isRegistrationStepValid() &&
      contestantValid();

    if (!stepChecksOk) {
      return;
    }

    if (stepIndex < activeSteps.length - 1) {
      clearAllInvalid();
      setStepIndex(stepIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (stepIndex > 0) {
      clearAllInvalid();
      setStepIndex(stepIndex - 1);
    }
  };

  const handleSubmitPayload = async () => {
    const isValid = await trigger();
    if (!isValid) {
      handleFormFieldErrors();
      return;
    }

    setIsSubmitting(true);

    const processedPayload = await processAndUploadFiles(payload, notify);

    // Format card expiration from MM/YY to YYYY-MM
    const cardExpiration = (() => {
      const expirationDate = getValues("paymentData.expirationDate"); // e.g., "09/25"
      if (!expirationDate) return ""; // Handle missing input gracefully
      const [month, year] = expirationDate.split("/"); // Split into MM and YY
      return `20${year}-${month}`; // Combine into YYYY-MM
    })();

    // Sponsorships are vendor-only — strip any leftover packages for attendees.
    const sponsorsForSubmit =
      processedPayload.registration_type === "Vendor"
        ? processedPayload.sponsors
        : [];
    const payloadForSubmit = {
      ...processedPayload,
      sponsors: sponsorsForSubmit,
    };

    const updatedRegistrationPayload = {
      ...payloadForSubmit,
      paymentData: {
        ...payloadForSubmit.paymentData,
        cardNumber: getValues("paymentData.cardNumber")?.replaceAll(" ", ""),
        expirationDate: cardExpiration,
        amount: calculateSubtotal(
          payloadForSubmit,
          registrationSource,
          getValues("agency") === "false" &&
            getValues("member_status") === "Non Member"
            ? ConferenceOptions.non_member_fee
            : 0,
          ExtraOptions
        ),
      },
      secondary_email:
        getValues("secondary_email") && getValues("secondary_email").length > 0
          ? getValues("secondary_email")
          : null,
      nonMemberFee:
        getValues("agency") === "false" &&
        getValues("member_status") === "Non Member",
      // paymentType: getValues("paymentType"),
      registrationSource,
      // organization: getValues("organization"),
      team: getValues("team"),
    };

    const submitResponse = await useSubmitRegistration2(
      updatedRegistrationPayload
    );

    setIsSubmitting(false);

    if (submitResponse.result === "success") {
      clearWizardDraft(String(conferenceId), registrationSource || "online");
      setStepKeyInUrl(null);
      setSubmitted(true);
      notify(submitResponse.message, "success");
    } else {
      notify(
        submitResponse.message || "An error occurred during submission",
        "error"
      );
      if (submitResponse.data?.transactionResponse?.errors?.length > 0) {
        notify(
          submitResponse.data.transactionResponse.errors[0].errorText,
          "error"
        );
      }
    }
  };

  return !ConferenceOptions || !payload ? null : (
    <section className="w-full mt-auto self-end place-self-end py-4 px-4">
      <div className="max-w-3xl mx-auto flex gap-3 justify-center">
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
        {isSubmitting ? (
          <CircularProgress />
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={
              activeSteps[stepIndex].key === "billing_step"
                ? handleSubmitPayload
                : handleNext
            }
            className="w-full sm:w-36"
          >
            {activeSteps[stepIndex].key === "billing_step"
              ? "Submit Form"
              : "Next »"}
          </Button>
        )}
      </div>
    </section>
  );
};

export default StepNavigation;
