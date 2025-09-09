/**
 * wp-grant-applications service
 */

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
  consesnt_order: StrapiFormattedFile;
  consent_order_number: string;
  money_set_aside: boolean;
  applied_to_other_loans: boolean;
  proposals: StrapiFormattedFile[];
}

export default ({ strapi }) => ({
  createGrantApplication: async (ctx) => {
    const {
      legal_entity_name,
      facility_id,
      population_served,
      county,
      physical_address_street,
      physical_address_line_two,
      physical_address_city,
      physical_address_state,
      physical_address_zip,
      physical_same_as_mailing,
      mailing_address_street,
      mailing_address_line_two,
      mailing_address_city,
      mailing_address_state,
      mailing_address_zip,
      point_of_contact,
      chairman,
      chairman_also_mayer_of_municipal_city,
      has_engineer,
      engineer,
      drinking_or_wastewater,
      other_describe,
      description_justification_estimated_cost,
      proposals,
      combined_cost_of_projects,
      requested_grant_amount,
      portion_matched_by_recipient,
      minimum_utility_financial_contribution,
      engineering_report,
      upload_engineering_report,
      report_approved_by_deq,
      engineering_report_deq_approved,
      resolves_violation,
      signatory_name,
      signatory_title,
      signature,
      other_needs,
      change_order_request,
      grant,
      selected_projects,
      proposal,
      uploaded_engineering_report,
      uploaded_notice_of_violation,
      uploaded_additional_files,
      satisfy_deq_issued_order,
      consesnt_order,
      consent_order_number,
      money_set_aside,
      applied_to_other_loans,
    } = ctx.request.body as IGrantApplicationFormPayload;

    let contactId = 0;
    let chairmanId = 0;
    let engineerId = 0;

    //return an id of the status
    const getStatus = async (status: string) => {
      try {
        const fetchedStatus = await strapi.documents("api::grant-status.grant-status").findMany({
          filters: {
            name: status,
          },
        });
        return fetchedStatus[0].id as number;
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const findApplicationAndSetToChangeOrder = async (
      applicationId: string
    ) => {
      if (ctx.request.body.data.change_order_request === "No") return null;
      console.log("setting application to change order", applicationId);
      const statusId = await getStatus("Revised per COR");

      try {
        const fetchedApplication = await strapi.documents("api::grant-application-final.grant-application-final").findMany({
          filters: {
            application_id: applicationId,
          },
        });

        // set the application to change order

        await strapi.documents("api::grant-application-final.grant-application-final").update({
          documentId: "__TODO__",

          data: {
            status: statusId,
          }
        });

        return fetchedApplication[0].application_id;
      } catch (error) {
        console.error("Error:", error);
      }
    };

    // for change order request set old application to change order set the new application to status revised

    // const checkForContact = async (
    //   email: string
    // ): Promise<{ success: boolean; data?: any; error?: any }> => {
    //   console.log("email", email);
    //   try {
    //     const fetchedContact = await strapi.entityService.findMany(
    //       "api::contact.contact",
    //       {
    //         filters: {
    //           email: email,
    //         },
    //       }
    //     );
    //     // Assuming the API returns the contact object in the `data` property

    //     return { success: true, data: fetchedContact, error: null };
    //   } catch (error) {
    //     console.error("Error:", error);
    //     return { success: false, data: null, error };
    //   }
    // };

    try {
      const statusId = await getStatus("New Application");

      const projectIds = selected_projects.map((project) => parseInt(project));
      console.log("projectIds", projectIds);
      console.log("proposals", proposals);
      // const applicationId = await findApplicationAndSetToChangeOrder(ctx.request.body.data.application_id)

      console.log("data", ctx.request.body);
      const date = new Date();

      await strapi.documents("api::grant-application-final.grant-application-final").create({
        data: {
          legal_entity_name,
          facility_id,
          population_served,
          county,
          physical_address_street,
          physical_address_line_two,
          physical_address_city,
          physical_address_state,
          physical_address_zip,
          physical_same_as_mailing,
          mailing_address_street,
          mailing_address_line_two,
          mailing_address_city,
          mailing_address_state,
          mailing_address_zip,
          // point_of_contact: contactId,
          // chairman: chairmanId,
          // engineer: engineerId,
          chairman_also_mayer_of_municipal_city,
          has_engineer,
          drinking_or_wastewater,
          other_describe,
          description_justification_estimated_cost,
          combined_cost_of_projects,
          requested_grant_amount,
          portion_matched_by_recipient,
          minimum_utility_financial_contribution,
          engineering_report,
          report_approved_by_deq,
          engineering_report_deq_approved,
          resolves_violation,
          signatory_name,
          signatory_title,
          signature,
          other_needs,
          change_order_request,
          grant,
          application_date: new Date(),
          status: statusId,
          selected_projects: projectIds,
          proposal,
          satisfy_deq_issued_order,
          consesnt_order,
          consent_order_number,
          money_set_aside,
          applied_to_other_loans,
          // Files
          // uploaded_additional_files,
          // uploaded_notice_of_violation,
          // uploaded_engineering_report,
          // upload_engineering_report,
          proposals,
        },
      });
    }  catch (err) {
      console.error("Error:", err.message);
      ctx.status = 400;
      ctx.body = err;
    }
  },
});
