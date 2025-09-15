import { Dispatch, SetStateAction } from "react";


export type Identifier = number;


export interface IContactPayload {
  first: string;
  last: string;
  email: string;
  phone: string;
}

export interface IGrantApplicationFormPayload {
  legal_entity_name: string;
  facility_id: string;
  population_served: number;
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
  point_of_contact: IContactPayload;
  chairman: IContactPayload;
  chairman_also_mayer_of_municipal_city: boolean;
  has_engineer: boolean;
  engineer: IContactPayload;
  drinking_or_wastewater: "Drinking Water" | "Wastewater";
  other_describe: string;
  description_justification_estimated_cost: string;
  combined_cost_of_projects: number;
  requested_grant_amount: number;
  portion_matched_by_recipient: number;
  minimum_utility_financial_contribution?: number;
  engineering_report: "Yes" | "No" | "N/A";
  report_approved_by_deq: string;
  engineering_report_deq_approved: boolean;
  resolves_violation: string;
  signatory_name: string;
  signatory_title: string;
  signature: string;
  other_needs: string;
  change_order_request: "Yes" | "No";
  grant: Identifier;
  // committee_date: Date
  application_date: Date;
  status: Identifier;
  selected_projects: string[];
  proposals: StrapiFormattedFile[];
  uploaded_engineering_report: StrapiFormattedFile[];
  uploaded_notice_of_violation: StrapiFormattedFile[];
  uploaded_additional_files: StrapiFormattedFile[];
  satisfy_deq_issued_order: boolean;
  consent_order: StrapiFormattedFile;
  consent_order_number: string;
  money_set_aside: boolean;
  applied_to_other_loans: boolean;
  additional_information: string;
}

export interface StrapiFormattedFile {
  rawFile: File;
  src: string;
  title: string;
  name?: string
}

export interface IScoringCriteria {
  id: number;
  order: string;
  label: string;
  project_type: {
    data : IProject
  };
}

export interface IProject {
  order: string
  id: number;
  name: string;
  description: string;
  classification: "Drinking Water" | "Wastewater" | "Both";
}