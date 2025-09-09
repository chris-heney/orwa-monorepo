import IContact from "./IContact";
import IGrant from "./IGrant";
import IGrantApplicationStatus from "./IGrantApplicationStatus";

export default interface IGrantApplication {
  id: number;
  legal_entity_name: string;
  facility_id: string;
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
  point_of_contact: IContact | number;
  chairman: IContact | number;
  chairman_also_mayer_of_municipal_city: boolean;
  has_engineer: boolean;
  engineer: IContact | number;
  drinking_or_wastewater: "Drinking Water" | "Wastewater";
  drinking_water_projects_selected: string;
  wastewater_projects_selected: string;
  other_describe: string;
  description_justification_estimated_cost: string;
  project_proposal_birds: string;
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
  other_needs: string;
  additional_files: string;
  change_order_request: string;
  population_served: number;
  combined_cost_of_projects: number;
  requested_grant_amount: number;
  portion_matched_by_recipient: number;
  minimum_utility_financial_contribution: string;
  deq_action: string;
  grant: IGrant;
  committee_date: Date;
  application_date: Date;
  status: IGrantApplicationStatus;
  sub_status: IGrantApplicationStatus;
  payouts: {
    data: {
      amount: number;
      transaction_date: Date;
      currentApplication: IGrantApplication | number;
      grant: IGrant | number;
      status: IGrantApplicationStatus;
      supporting_documents?: unknown;
      date_approvied: Date;
      comments: string;
      grant_status: IGrantApplicationStatus;
    }[];
  };
  email: string;
  application_id: string;
  location: {
    lat: number;
    lng: number;
  };
  approved_projects: {
    data: {
      name: string;
      classification: "Drinking Water" | "Wastewater" | "Both";
      context: "Project Type" | "Project Status and Impact";
    }[];
  };
  selected_projects: {
    data: {
      name: string;
      classification: "Drinking Water" | "Wastewater";
    }[];
  };
  regions: {
    [key: string]: string;
  };
}
