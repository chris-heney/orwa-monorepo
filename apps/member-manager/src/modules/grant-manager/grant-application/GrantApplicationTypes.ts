import { IContact } from '../../training/_types'
import { IGrantPayout } from '../grants/components/GrantTypes'
import { IProject } from '../types';

export type ProjectCostSource = 'applicant' | 'document' | 'even-split';

/** Denormalized per-project-type cost snapshot from grant.project-cost */
export interface IProjectCost {
  id?: number
  project_type_id: number
  name: string
  classification?: string
  amount: number | string
  source?: ProjectCostSource
}

export interface IGrantApplication {
  previous_application_id: string
  createdAt: string
  id? : number
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
  point_of_contact: IContact;
  chairman: IContact; 
  chairman_also_mayer_of_municipal_city: boolean;
  has_engineer: boolean;
  engineer: IContact; 
  additional_contacts: IContact[];
  email: string;
  drinking_or_wastewater: 'Drinking Water' | 'Wastewater';
  drinking_water_projects_selected: string;
  wastewater_projects_selected: string;
  other_describe: string;
  description_justification_estimated_cost: string;
  project_proposal_birds: string;
  combined_cost_of_projects: string;
  /** Per-type cost breakdown; when present, combined_cost_of_projects is Σ amounts */
  project_costs?: IProjectCost[];
  requested_grant_amount: string;
  portion_matched_by_recipient: string;
  minimum_utility_financial_contribution: string;
  engineering_report: string;
  upload_engineering_report: string;
  report_approved_by_deq: string;
  resolves_violation: string;
  notice_of_violation: string;
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
  change_order_request: string;
  grant: number;
  committee_date: string
  application_date: string
  status: {
    id: number
    name: string
    color: string
  }
  sub_status: {
    id: number
    name: string
  }
  consent_order_number: string
  additional_information: string
  approved_projects: IProject[]
  selected_projects: IProject[]
  application_id: number
  payouts: IGrantPayout[]
  // FIles
  award_letter: StrapiFile
  applicant_pdf: StrapiFile
  consent_order: StrapiFile
  proposals: StrapiFile[]
  uploaded_engineering_report: StrapiFile[]
  uploaded_notice_of_violation: StrapiFile[]
  uploaded_additional_files: StrapiFile[]
  closed_out: boolean
  balance?: number
}

export interface StrapiFile {
  id: number
  name: string
  url: string
}

export interface IProjectType {
  id: number
  name: string
  description: string
}