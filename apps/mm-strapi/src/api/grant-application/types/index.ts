import { AdminOptions } from "../../membership-forms/types";

export interface IContactEntity {
    id: number;
    first: string;
    last: string;
    email: string;
    phone: string;
    contact_type:
      | "associate"
      | "watersystem"
      | "instructor"
      | "staff"
      | "administrator";
    title?: string;
    license?: string;
    user: number;
    passport: number | null;
  }
  
  type Identifier = number;
  
  interface IContactPayload {
    first: string;
    last: string;
    email: string;
    phone: string;
    title: string;
  }
  
  export interface StrapiFormattedFile {
    rawFile: File;
    src: string;
    title: string;
  }
  
  export interface IGrantApplicationFormPayload {
    adminOptions?: AdminOptions;
    legal_entity_name: string;
    facility_id: string;
    population_served: string;
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
    drinking_water_projects_selected: string;
    wastewater_projects_selected: string;
    other_describe: string;
    description_justification_estimated_cost: string;
    project_proposal_birds: StrapiFormattedFile[];
    combined_cost_of_projects: number;
    requested_grant_amount: string;
    portion_matched_by_recipient: string;
    minimum_utility_financial_contribution: string;
    engineering_report: "Yes" | "No" | "N/A";
    upload_engineering_report: StrapiFormattedFile;
    report_approved_by_deq: string;
    engineering_report_deq_approved: boolean;
    resolves_violation: string;
    signatory_name: string;
    signatory_title: string;
    signature: string;
    other_needs: string;
    additional_files: StrapiFormattedFile[];
    change_order_request: "Yes" | "No";
    original_application_number: string;
    grant: Identifier;
    // committee_date: Date
    application_date: Date;
    status: Identifier;
    selected_projects: string[];
    proposal: StrapiFormattedFile[];
    uploaded_engineering_report: StrapiFormattedFile[];
    uploaded_notice_of_violation: StrapiFormattedFile[];
    uploaded_additional_files: StrapiFormattedFile[];
    satisfy_deq_issued_order: boolean;
    consent_order: StrapiFormattedFile;
    consent_order_number: string;
    money_set_aside: boolean;
    applied_to_other_loans: boolean;
    proposals: StrapiFormattedFile[];
    additional_information: string;
    additional_funding_requested: number;
    applicant_pdf: Identifier
    other_entities: string;
    lrsp_plan: boolean
    application_id: string
  }
  