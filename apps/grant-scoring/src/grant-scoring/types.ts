import { Dispatch, SetStateAction } from "react";

interface IStatus {
  id: number;
  name: string;
}

export interface StrapiFiles {
  id: number
  name: string;
  url: string;
}

export interface StrapiFile {
  [x: string]: any;
  id: number
  name: string
  url: string
}

export interface IGrantApplication {
  id: number;
  legal_entity_name: string;
  facility_id: string;
  population_served: number
  county: string;
  physical_address_street: string;
  physical_address_line_two: string;
  physical_address_city: string;
  physical_address_state: string;
  physical_address_zip: string;
  physical_same_as_mailing: boolean;
  mailing_address_street: string;
  mailing_address_line_two: string;
  mailing_address_city: string;
  mailing_address_state: string;
  mailing_address_zip: string;
  point_of_contact: IContact;
  chairman: IContact;
  chairman_also_mayer_of_municipal_city: boolean;
  has_engineer: boolean;
  engineer: IContact;
  drinking_or_wastewater: "Drinking Water" | "Wastewater";
  drinking_water_projects_selected?: string;
  wastewater_projects_selected?: string;
  other_describe: string;
  description_justification_estimated_cost: string;
  combined_cost_of_projects: number;
  requested_grant_amount: number
  portion_matched_by_recipient: number
  minimum_utility_financial_contribution: string
  engineering_report: "Yes" | "No" | "N/A"
  upload_engineering_report: string;
  report_approved_by_deq: string;
  engineering_report_deq_approved: boolean;
  notice_of_violation :string
  resolves_violation: "Yes - a current violation" | "Yes - a potential violation" | "No";
  signatory_name: string;
  signatory_title: string;
  signature: string;
  application_status: string;
  approved_project_cost: number;
  award_amount: number;
  expected_utility_match: number;
  projects_approved: string;
  remaining_grant_funds: number;
  other_needs: string;
  additional_files: string;
  change_order_request: "Yes" | "No" 
  original_application_number: string;
  grant: Identifier | IGrant;
  committee_date?: Date;
  application_date: Date | string;
  status: Identifier | IStatus;
  selected_projects: IProjects[];
  proposals: StrapiFiles[] | null
  uploaded_engineering_report: StrapiFiles[] | null;
  uploaded_notice_of_violation:  StrapiFiles[] | null;
  uploaded_additional_files: StrapiFiles[] | null;
  satisfy_deq_issued_order: boolean;
  consent_order: StrapiFile;
  consent_order_number: string;
  money_set_aside: boolean;
  applied_to_other_loans: boolean;
  additional_information: string;
  lrsp_plan: boolean;
  more_info_lrsp: boolean;
  project_proposal_birds: string;
  grant_application_score: {
    id: number;
    other_describe_2?: string;
    other_describe: string;
    score: number;
    approved: boolean;
  } | null;
  approved_projects: IProjects[];
  application_id: number;
  createdAt: Date;
  // Files
  award_letter?: StrapiFile;
  applicant_pdf?: StrapiFile;
}
export type Identifier = number;

export interface IProjects {
  id: number;
  name: string;
  description: string;
  classification: "Drinking Water" | "Wastewater";
}

export interface IApplicationScore {
  approved: boolean;
  score: number;
}

export interface IGrant {
  name: string;
  status: string;
  reimbursement_type: string;
  opens: Date;
  closes: Date;
  type: IGrantType;
  grant_amount: number;
  funds_approved: number;
  funds_provided: number;
}

export interface IGrantType {
  id: number;
  name: string;
  description: string;
}

export default interface IContact {
  id: number;
  avatar: IAvatar[];
  first: string;
  last: string;
  email: string;
  phone: string;
  title: string;
  contact_type: string;
}

interface IAvatar {
  url: string;
}

export interface IScoring {
  order: string; // 1.1 ect this allowing me to sort by 1.20 by removing period and number before it and then sorting by the number
  label: string;
  score: number;
  grant: IGrant;
}

export interface IToken {
  name: string;
  public_key: string;
  private_key: string;
  /** Strapi v5 flat relation (or legacy numeric id) */
  application_status: { id: number; name?: string } | Identifier;
  order: number;
  next_status: { id: number; name?: string };
  default_member_name: string;
  default_member_email: string;
}

export interface StepData {
  id: number; // Token ID
  statusId: number; // Status ID
  color: string;
  description: string;
  label: string;
  name: string;
  order: number;
}

export interface ApplicationScoringContextProvider {
  user: IContact;
  setUser: Dispatch<SetStateAction<IContact>>;
  applications: IGrantApplication[];
  setApplications: Dispatch<SetStateAction<IGrantApplication[]>>;
  applicationIndex: number;
  setApplicationIndex: Dispatch<SetStateAction<number>>;
  score: number;
  setScore: Dispatch<SetStateAction<number>>;
  token: IToken;
  setToken: Dispatch<SetStateAction<IToken>>;
  steps: StepData[];
  setSteps: Dispatch<SetStateAction<StepData[]>>;
  status: Identifier;
  setStatus: Dispatch<SetStateAction<Identifier>>;
  notApprovedId: Identifier;
  identity: any;
  setIdentity: Dispatch<SetStateAction<any>>;
}

export interface EmailPayload {
  to: string;
  from: string;
  html: string;
  subject: string;
}
