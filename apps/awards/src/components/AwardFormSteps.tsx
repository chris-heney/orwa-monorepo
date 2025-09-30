import React from "react";
import { IStep } from "../types/types";
import NomineeDataStep from "./steps/NomineeDataStep";
import SystemDataStep from "./steps/SystemDataStep";
import EmployeeDataStep from "./steps/EmployeeDataStep";
import NominationDescriptionStep from "./steps/NominationDescriptionStep";
import SupportingDocumentsStep from "./steps/SupportingDocumentsStep";
import ReviewStep from "./steps/ReviewStep";

const AwardFormSteps: IStep[] = [
  {
    label: "Nominee Information",
    component: <NomineeDataStep />,
    active: true,
  },
  {
    label: "System Information",
    component: <SystemDataStep />,
    active: true,
  },
  {
    label: "Employee Counts",
    component: <EmployeeDataStep />,
    active: true,
  },
  {
    label: "Nomination Description",
    component: <NominationDescriptionStep />,
    active: true,
  },
  {
    label: "Supporting Documents",
    component: <SupportingDocumentsStep />,
    active: true,
  },
  {
    label: "Review & Submit",
    component: <ReviewStep />,
    active: true,
  },
];

export default AwardFormSteps;
