import { Dispatch, SetStateAction } from "react"


interface IStatus {
  data: {
    id: number
    name: string
  }
}

export interface StrapiFiles {
  data: {
    id: number
    name: string;
    url: string;
  }[]
}

export interface StrapiFile {
  data: {
    length: number;
    map: any;
    id: number
    name: string
    url: string
  }
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
  committee_date: Date;
  application_date: Date | string;
  status: Identifier | IStatus;
  selected_projects: {data: IProject[]};
  proposals: StrapiFiles
  uploaded_engineering_report: StrapiFiles;
  uploaded_notice_of_violation:  StrapiFiles;
  uploaded_additional_files: StrapiFiles;
  satisfy_deq_issued_order: boolean;
  consent_order: StrapiFile;
  consent_order_number: string;
  money_set_aside: boolean;
  applied_to_other_loans: boolean;
  additional_information: string;
  lrsp_plan: boolean;
  more_info_lrsp: boolean;
  project_proposal_birds: string;
  approved_projects: {data : IProject[]};
  application_id: number;
  createdAt: Date;
  // Files
  award_letter?: StrapiFile;
  applicant_pdf?: StrapiFile;
  grant_application_score: {
    data: {
      id: number
      score: number
      approved: boolean
      other_describe: string
      other_describe_2: string
      orwa_signature: string
      orwa_member_name: string
      deq_signature: string
      deq_member_name: string
      createdAt: Date
    }
  }
}

export type Identifier = number

export interface IProject {
    id: number
    name: string
    description: string
    classification: 'Drinking Water' | 'Wastewater'
    context: 'Project Type' | 'Project Status and Impact'
}

export interface IApplicationScore {
  approved: boolean
  score: number
}

export interface IGrant {
  name: string
  status: string
  reimbursement_type: string
  opens: Date
  closes: Date
  type: IGrantType
  grant_amount: number
  funds_approved: number
  funds_provided: number
}

export interface IGrantType {
  id: number
  name: string
  description: string
}

export default interface IContact {
  id: Identifier
  data: {
    avatar: IAvatar[]
    id: number
    first: string
    last: string
    email: string
    phone: string
    title: string
    contact_type: string
  }
}

export interface IScoringCriteria {
  id: number;
  order: string;
  label: string;
  score: number;
  project_type:  {data : IProject}
}

interface IAvatar {
  url: string
}

export interface IScoring {
  order: string // 1.1 ect this allowing me to sort by 1.20 by removing period and number before it and then sorting by the number
  label: string
  score: number
  grant: IGrant
}

export interface DirectoryContextProvider {
  user: IContact
  setUser: Dispatch<SetStateAction<IContact>>
  // grant: IGrant for the future when we have multiple grants
  // setGrant: Dispatch<SetStateAction<IGrant>>
  applications: IGrantApplication[]
  setApplications: Dispatch<SetStateAction<IGrantApplication[]>>
  setApplicationIndex: Dispatch<SetStateAction<number>>
  applicationIndex: number
  score: IApplicationScore
  setScore: Dispatch<SetStateAction<IApplicationScore>>
  // token: string
}

export const YearMonthDayMinute: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
}
