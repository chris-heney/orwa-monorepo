import { Dispatch, SetStateAction } from "react";
import SystemInfoStep from "../watersystem-steps/SystemInfoStep";
import OfficeDetails from "../watersystem-steps/OfficeDetails";
import MembershipInfo from "../watersystem-steps/MembershipInfo";
import DirectoryContactsStep from "../watersystem-steps/DirectoryContactsStep";
import WatersystemReviewStep from "../watersystem-steps/WatersystemReviewStep";
import AssociateInfoStep from "../associate-steps/AssociateInfoStep";
import AssociateReviewStep from "../associate-steps/AssociateReviewStep";
import AssociateContactInfoStep from "../associate-steps/AssociateContactInfo";
import AddressStep from "../associate-steps/AddressStep";
import AssociateMembershipStep from "../associate-steps/AssociateMembershipStep";

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

  const path = window.location.hash.substring(2); 

  const WaterSystemMebershipSteps = [
    {
      label: "System",
      key: "system-contact",
      component: <SystemInfoStep />,
      active: true,
    },
    {
      label: "Office Details",
      key: "office-details",
      component: <OfficeDetails />,
      active: true,
    },
    {
      label: "Contacts",
      key: "directory-contacts",
      component: <DirectoryContactsStep />,
      active: true,
    },
    {
      label: "Membership",
      key: "membership-info",
      component: <MembershipInfo />,
      active: true,
    },
    {
      label: "Review",
      key: "review",
      component: <WatersystemReviewStep/>,
      active: true,
    },
  ];

  // Associate Info
  // Media
  // Billing

  const AssociateMembershipSteps = [
    {
      label: "Associate Info",
      key: "associate-info",
      component: <AssociateInfoStep/>,
      active: true,
    },
    {
      label: "Address",
      key: "address",
      component: <AddressStep/>,
      active: true,
    },
    {
      label: "Contact Info",
      key: "contact-info",
      component: <AssociateContactInfoStep/>,
      active: true,
    },
    {
      label: "Membership",
      key: "associate-membership",
      component: <AssociateMembershipStep/>,
      active: true,
    },
    {
      label: "Review",
      key: "review",
      component: <AssociateReviewStep />,
      active: true,
    },
  ]

  // Default Steps

  const DefaultSteps = [
    {
      label: "Choose Membership",
      key: "choose-membership",
      // component: <ChooseMembershipStep />,
      component: <>Choose Membership Placeholder</>,
      active: true,
    }
  ]

  return path.includes('watersystem')
  ? WaterSystemMebershipSteps
  : path.includes('associate')
  ? AssociateMembershipSteps
  : DefaultSteps;  
};

export default DefualtFormSteps;
