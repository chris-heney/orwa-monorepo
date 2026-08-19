import React from "react";
import { IStep } from "../types/types";
import NomineeDataStep from "./steps/NomineeDataStep";
import NominatorDataStep from "./steps/NominatorDataStep";
import SystemDataStep from "./steps/SystemDataStep";
import EmployeeDataStep from "./steps/EmployeeDataStep";
import NominationDescriptionStep from "./steps/NominationDescriptionStep";
import BiographyStep from "./steps/BiographyStep";
import PhotographsStep from "./steps/PhotographsStep";
import SupportingDocumentsStep from "./steps/SupportingDocumentsStep";
import ReviewStep from "./steps/ReviewStep";

const AwardFormSteps: IStep[] = [
  {
    label: "System Information",
    key: "system",
    component: <SystemDataStep />,
    active: true,
  },
  {
    label: "Nominator Information",
    key: "nominator",
    component: <NominatorDataStep />,
    active: true,
  },
  {
    label: "Nominee Information",
    key: "nominee",
    component: <NomineeDataStep />,
    active: true,
  },
  {
    label: "Employee Counts",
    key: "employees",
    component: <EmployeeDataStep />,
    active: true,
  },
  {
    label: "Nomination Description",
    key: "description",
    component: <NominationDescriptionStep />,
    active: true,
  },
  {
    label: "Biography",
    key: "biography",
    component: <BiographyStep />,
    active: true,
  },
  {
    label: "Photographs",
    key: "photographs",
    component: <PhotographsStep />,
    active: true,
  },
  {
    label: "Supporting Documents",
    key: "documents",
    component: <SupportingDocumentsStep />,
    active: true,
  },
  {
    label: "Review & Submit",
    key: "review",
    component: <ReviewStep />,
    active: true,
  },
];

export default AwardFormSteps;
