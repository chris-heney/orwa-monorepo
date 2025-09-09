import { useState } from "react";
import {
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

const StepNavigation = () => {
  const { steps, stepIndex, setStepIndex } = useStepContext();
  const { ConferenceOptions, ExtraOptions } = useRegistrationOptions();
  const { setSubmitted } = useFormSubmitted();
  const { isAdminView, isLoggedIn } = useUserContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const registrationSource = useRegistrationSource();
  const { getValues, trigger } = useFormContext();
  const { notify } = useNotify();

  const payload = getValues() as IRegistrationPayload;

  if (!payload) return null;

  const boothValid = () => {
    if (
      payload.booths.length === 0 &&
      steps.filter((step) => step.active)[stepIndex].label === "Booths"
    ) {
      notify("Please add at least one booth", "error");
      return;
    }
    return true;
  };

  const contestantValid = () => {
    // if (
    //   payload.tickets.filter((ticket) => ticket.type === "Contestant").length ===
    //     0 &&
    //   steps.filter((step) => step.active)[stepIndex].label === "Contestants"
    // ) {
    //   notify("Please add at least one Contestant", "error");
    //   return;
    // }
    // return true;
    if (
      payload?.registrationAddonIds?.length === 0 &&
      steps.filter((step) => step.active)[stepIndex].label === "Contestants"
    ) {
      notify("You must select water taste test option", "error");
      return;
    }
    return true;
  };

  const ticketAttendeeValid = () => {
    const currentStepLabel = steps.filter((step) => step.active)[stepIndex]
      .label;

    const tickets = payload.tickets;

    const guestCount = tickets.filter(
      (ticket) => ticket.ticket_type.name === "Guest"
    ).length;

    const attendeeCount = tickets.filter((ticket) =>
      (ticket.ticket_type.name.toLowerCase().includes("registration") || ticket.ticket_type.name.toLowerCase().includes("attendee"))
    ).length;

    // Case 1: No Attendee ticket selected on the Attendees step
    if ((attendeeCount === 0 && currentStepLabel === "Attendees" && guestCount === 0) && (!isAdminView || !isLoggedIn)) {
      notify("Please add at least one Attendee", "error");
      return false;
    }

    if (
      guestCount > 0 &&
      attendeeCount < guestCount &&
      (!isAdminView || !isLoggedIn)
    ) {
      notify(
        "Guest registration must accompany a full or partial registration.",
        "error"
      );
      return false;
    }

    return true;
  };

  const ticketVendorValid = () => {
    if (
      payload.tickets.filter((ticket) => ticket.type === "Vendor").length ===
        0 &&
      steps.filter((step) => step.active)[stepIndex].label === "Vendors"
    ) {
      notify("Please add at least one Vendor", "error");
      return;
    }
    return true;
  };

  const isRegistrationStepValid = () => {
    const isValid = steps
      .filter((step) => step.active)
      .some((step) => {
        return (
          step.label === "Attendees" ||
          step.label === "Vendors" ||
          step.label === "Sponsorships" ||
          step.label === "Contestants"
        );
      });
    if (!isValid) {
      notify(
        "Please select one of Attendee, Vendor, Sponsor or Contestant",
        "error"
      );
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    const isValid = await trigger();
    if (
      isValid &&
      ticketAttendeeValid() &&
      ticketVendorValid() &&
      boothValid() &&
      isRegistrationStepValid() &&
      contestantValid()
    ) {
      if (stepIndex < steps.filter((step) => step.active).length - 1) {
        setStepIndex(stepIndex + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const handleSubmitPayload = async () => {
    const isValid = await trigger();
    if (!isValid) {
      notify(
        "Please correct the errors in the form before submitting",
        "error"
      );
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

    const updatedRegistrationPayload = {
      ...processedPayload,
      paymentData: {
        ...processedPayload.paymentData,
        cardNumber: getValues("paymentData.cardNumber")?.replaceAll(" ", ""),
        expirationDate: cardExpiration,
        amount: calculateSubtotal(
          processedPayload,
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
              steps.filter((step) => step.active)[stepIndex].key ===
              "billing_step"
                ? handleSubmitPayload
                : handleNext
            }
            className="w-full sm:w-36"
          >
            {steps.filter((step) => step.active)[stepIndex].key ===
            "billing_step"
              ? "Submit Form"
              : "Next »"}
          </Button>
        )}
      </div>
    </section>
  );
};

export default StepNavigation;
