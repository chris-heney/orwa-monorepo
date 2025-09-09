import { Dispatch, SetStateAction } from "react";
import StepRegistration from "../steps/RegistrationStep";
import StepAttendees from "../steps/StepAttendees";
import StepBooths from "../steps/StepBooths";
import StepVendors from "../steps/StepVendor";
import StepBilling from "../steps/StepBilling";
import StepSponsorship from "../steps/StepSponsorship";
// import StepContestants from "../steps/StepContestants";
import StepWaterContestant from "../steps/StepWaterContestant";

export interface IFormStep {
  label: string;
  key: string;
  component: JSX.Element;
  active: boolean;
}

export interface IFormStepContext {
  stepIndex: number;
  steps: IFormStep[];
  setFormSteps: Dispatch<SetStateAction<IFormStep[]>>;
  setStepIndex: Dispatch<SetStateAction<number>>;
}

const DefualtFormSteps = () => {
  const DefualtFormSteps = [
    {
      label: "Type",
      key: "registration_type",
      component: (
        <>
          <StepRegistration />
        </>
      ),
      active: true,
    },
    {
      label: "Attendees",
      key: "attendee_registration",
      component: (
        <>
          <StepAttendees />
        </>
      ),
      active: false,
    },
    {
      label: "Booths",
      key: "booth_registration",
      component: (
        <>
          <StepBooths />
        </>
      ),
      active: false,
    },
    {
      label: "Vendors",
      key: "vendor_registration",
      component: (
        <>
          <StepVendors />
        </>
      ),
      active: false,
    },
    {
      label: "Sponsorships",
      key: "sponsorship",
      component: (
        <>
          <StepSponsorship />
        </>
      ),
      active: false,
    },
    {
      label: "Contestants",
      key: "contestant_registration",
      component: (
        <>
          <StepWaterContestant />
        </>
      ),
      active: false,
    },
    {
      label: "Billing",
      key: "billing_step",
      component: (
        <>
          <StepBilling />
        </>
      ),
      active: true,
    },
  ];

  return DefualtFormSteps;
};

export default DefualtFormSteps;
