/**
 * A set of functions called "actions" for `wp-grant-applications`
 */

interface strapiData {
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
  point_of_contact: string; // Assuming it's a string, you can replace it with the actual type
  chairman: string; // Assuming it's a string, you can replace it with the actual type
  chairman_also_mayer_of_municipal_city: boolean;
  has_engineer: boolean;
  engineer: string; // Assuming it's a string, you can replace it with the actual type
  drinking_or_wastewater: "Drinking Water" | "Wastewater";
  drinking_water_projects_selected: string;
  wastewater_projects_selected: string;
  other_describe: string;
  description_justification_estimated_cost: string;
  project_proposal_birds: string;
  combined_cost_of_projects: string;
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
  deq_action: string;
  grant: number
  committee_date: string;
  application_date: string;
}


// get the contact
// create or update contact 

export default ({strapi}) => ({
  createGrantApplication: async (ctx) => {

    await strapi.service('api::wp-grant-applications.wp-grant-applications').createGrantApplication(ctx)

  }})
