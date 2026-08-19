import React from "react";
import { IStep } from "../types/types";
import NomineeDataStep from "./steps/NomineeDataStep";
import NominatorDataStep from "./steps/NominatorDataStep";
import SystemDataStep from "./steps/SystemDataStep";
import JustificationStep from "./steps/JustificationStep";
import BiographyStep from "./steps/BiographyStep";
import PhotographsStep from "./steps/PhotographsStep";
import ReviewStep from "./steps/ReviewStep";

const AwardFormSteps: IStep[] = [
  {
    label: "System Information",
    key: "system",
    component: <SystemDataStep />,
    active: true,
  },
  {
    label: "Nominee Information",
    key: "nominee",
    component: <NomineeDataStep />,
    active: true,
  },
  {
    label: "Nominator Information",
    key: "nominator",
    component: <NominatorDataStep />,
    active: true,
  },
  {
    label: "Justification",
    key: "justification",
    component: <JustificationStep />,
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
    label: "Review & Submit",
    key: "review",
    component: <ReviewStep />,
    active: true,
  },
];

export default AwardFormSteps;
