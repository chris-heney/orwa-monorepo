/**
 * A set of functions called "actions" for `wp-grant-applications`
 */

import { AdminOptions } from "../../membership-forms/types";
import { IContactEntity, IGrantApplicationFormPayload } from "../types";

// get the contact
// create or update contact

export default ({ strapi }) => {
  const getUserIdByEmail = async (email) => {
    const users =
      (await strapi.plugins["users-permissions"].services.user.fetchAll({
        fields: ["id", "wp_uid"],
        filters: { email },
        limit: 1,
      })) || [];

    // console.log('User Search Results:', JSON.stringify(users), users.length);

    return users.length > 0
      ? {
          userId: users[0].id,
          wp_uid: users[0].wp_uid,
        }
      : { userId: null, wp_uid: null };
  };

  const getContact = async (email, contactData, userData) => {
    // console.log('Search for contact with email: ', email);

    const contactList =
      (await strapi.documents("api::contact.contact").findMany({
        fields: ["id", "first", "last", "phone", "contact_type"],
        filters: { email },
        limit: 1,
        populate: { user: true },
      })) || [];

    // console.log('Contact Search Results:', JSON.stringify(contactList));

    // Contact Not Found ... Creating One
    if (contactList.length === 0) {
      // console.log('No Contact Found.  Creating One.', JSON.stringify(contactData));
      contactList.push(
        await strapi.documents("api::contact.contact").create({
          data: contactData,
        })
      );
      // console.log('Contact created.', JSON.stringify(contactList[0]));
      // console.log('Now we will try to find a user.');
    }

    // Contact Found With User Included
    if (contactList[0].user) {
      // console.log('Returning contact with user: ', JSON.stringify({
      //   ...contactList[0],
      //   user: contactList[0].user?.id,
      //   passport: contactList[0].user?.wp_uid
      // }));

      // Update the contact found with missing informatioon

      console.log("Updating Contact:", JSON.stringify(contactList[0]));
      await updateContact(contactList[0].id, {
        first: contactData.first ? contactData.first : contactList[0].first,
        last: contactData.last ? contactData.last : contactList[0].last,
        phone: contactData.phone ? contactData.phone : contactList[0].phone,
      });

      return {
        ...contactList[0],
        user: contactList[0].user?.id,
        passport: contactList[0].user?.wp_uid,
      };
    }

    // Update the contact found with missing informatioon

    if (contactList[0].first || contactList[0].last || contactList[0].phone) {
      await updateContact(contactList[0].id, {
        first: contactList[0].first ? contactList[0].first : contactData.first,
        last: contactList[0].last ? contactList[0].last : contactData.last,
        phone: contactList[0].phone ? contactList[0].phone : contactData.phone,
      });
    }

    const { userId, wp_uid } = await getUserIdByEmail(email);

    // User Found: Return the contact with user
    if (userId) {
      // @TODO: Update the contact with the user

      await updateContact(contactList[0].id, {
        user: userId,
      });
      // await strapi.entityService.update('api::contact.contact', contactList[0].id, { data: { user: userId } });

      // console.log('Returning Contact with found user:', JSON.stringify({ ...contactList[0], userId, passport: wp_uid }));

      return {
        ...contactList[0],
        user: userId,
        passport: wp_uid,
      };
    }

    // User Not Found: Create user and return contact with the new user
    // console.log('User Not Found.  Creating One.', JSON.stringify(userData));
    const user = await strapi.plugins["users-permissions"].services.user.add(
      userData
    );
    // console.log('User Manually Created:', JSON.stringify(user));
    return {
      ...contactList[0],
      user: user.id,
      passport: null,
    };
  };

  const updateContact = async (
    contactId: number,
    contact: Partial<IContactEntity>
  ) => {
    // console.log('Updating Contact:', JSON.stringify(contact));
    const response = await strapi.documents("api::contact.contact").update({
      documentId: "__TODO__",
      data: contact
    });
    return response.data;
  };

  const logFormData = async (data: any, resource: string) => {
    await strapi.documents("api::log.log").create({
      data: {
        data,
        resource,
      },
    });
  };

  const user_base = {
    provider: "local",
    confirmed: true,
    blocked: false,
    role: 9,
    username: "",
    email: "",
    password: "password",
  };

  return {
    createGrantApplication: async (ctx) => {
      try {
        const {
          adminOptions,
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
          original_application_number,
          grant,
          selected_projects,
          uploaded_engineering_report,
          uploaded_notice_of_violation,
          uploaded_additional_files,
          satisfy_deq_issued_order,
          consent_order,
          consent_order_number,
          money_set_aside,
          additional_funding_requested,
          applied_to_other_loans,
          additional_information,
          applicant_pdf,
          other_entities,
          lrsp_plan,
          application_id,
        } = ctx.request.body as IGrantApplicationFormPayload;

        if ((adminOptions && adminOptions.resubmit) || !adminOptions) {
          logFormData(ctx.request.body, "grant-application");

          console.log("Point of Contact", point_of_contact);

          const regisgrantContact: IContactEntity = await getContact(
            point_of_contact.email,
            {
              first: point_of_contact.first,
              last: point_of_contact.last,
              email: point_of_contact.email,
              phone: point_of_contact.phone,
              title: point_of_contact.title,
            },
            {
              ...user_base,
              username: point_of_contact.email,
              email: point_of_contact.email,
              password: btoa(point_of_contact.email),
            }
          );

          console.log("- Point of Contact:", JSON.stringify(regisgrantContact));
          console.log(
            "-------------------------------------------------------------"
          );

          console.log("Chairman", chairman);

          const chairmanContact: IContactEntity = await getContact(
            chairman.email,
            {
              first: chairman.first,
              last: chairman.last,
              email: chairman.email,
              phone: chairman.phone,
              title: chairman.title,
            },
            {
              ...user_base,
              username: chairman.email,
              email: chairman.email,
              password: btoa(chairman.email),
            }
          );

          console.log("- Chairman:", JSON.stringify(chairmanContact));

          console.log(
            "-------------------------------------------------------------"
          );

          console.log("Engineer", engineer);

          let engineerContact: IContactEntity | null = null;

          if (has_engineer && engineer) {
            engineerContact = await getContact(
              engineer.email,
              {
                first: engineer.first,
                last: engineer.last,
                email: engineer.email,
                phone: engineer.phone,
                title: engineer.title,
              },
              {
                ...user_base,
                username: engineer.email,
                email: engineer.email,
                password: btoa(engineer.email),
              }
            );
          }

          console.log("- Engineer:", JSON.stringify(engineerContact));

          // Ensure required fields are provided
          if (!legal_entity_name || !point_of_contact || !selected_projects) {
            ctx.status = 400;
            ctx.body = { message: "Missing required fields." };
            return;
          }

          const projectIds = selected_projects.map((project) =>
            parseInt(project)
          );

          const data = {
            legal_entity_name,
            facility_id,
            population_served,
            previous_application_id: original_application_number,
            county,
            physical_address_street,
            physical_address_line_two,
            physical_address_city,
            physical_address_state,
            physical_address_zip: physical_address_zip.toString(),
            physical_same_as_mailing,
            mailing_address_street,
            mailing_address_line_two,
            mailing_address_city,
            mailing_address_state,
            mailing_address_zip: mailing_address_zip.toString(),
            point_of_contact: regisgrantContact.id,
            chairman: chairmanContact.id,
            engineer: engineerContact?.id ?? null,
            chairman_also_mayer_of_municipal_city,
            has_engineer,
            drinking_or_wastewater,
            other_describe,
            description_justification_estimated_cost,
            combined_cost_of_projects,
            requested_grant_amount,
            portion_matched_by_recipient,
            minimum_utility_financial_contribution:
              minimum_utility_financial_contribution.toString(),
            engineering_report,
            report_approved_by_deq,
            engineering_report_deq_approved,
            resolves_violation,
            signatory_name,
            signatory_title,
            signature,
            other_needs,
            change_order_request,
            application_id: application_id.toString(),
            grant,
            application_date: new Date(),
            status: 12,
            selected_projects: projectIds,
            satisfy_deq_issued_order,
            consent_order_number,
            money_set_aside,
            applied_to_other_loans,
            additional_funding_requested,
            additional_information,
            other_entities,
            // Files (if any)
            consent_order,
            proposals,
            uploaded_engineering_report,
            uploaded_notice_of_violation,
            uploaded_additional_files,
            applicant_pdf,
            lrsp_plan,
          };

          const grantApplication = await strapi.documents("api::grant-application-final.grant-application-final").create({
            data: data,
          });

          ctx.status = 200;
          ctx.body = {
            message: "success",
            grantApplication,
          };
        } else {
          // Send email functionality


        const emailTemplates = await strapi.documents("api::email-template.email-template").findMany({
          filters: {
            email_name: "Application Receipt",
          },
          populate: "*",
        });

        const emailTemplate = emailTemplates[0];

        const {
          legal_entity_name,
          point_of_contact,
          applicant_pdf,
        } = ctx.request.body as IGrantApplicationFormPayload;

        const fileData = await strapi.documents('plugin::upload.file').findOne({
          documentId: "__TODO__",
          populate: '*'
        });

        const variables = {
          point_of_contact_first: point_of_contact.first,
          point_of_contact_last: point_of_contact.last,
          legal_entity_name: legal_entity_name,
          application_id: application_id
        };

        const variableSearch = /{([^}]+)}/g;

        const html = emailTemplate.body.replace(
          variableSearch,
          (match, key) => {
            const replacement = variables[key.trim()];
            return replacement !== undefined ? replacement : match;
          }
        );

        const subject = emailTemplate.subject.replace(
          variableSearch,
          (match, key) => {
            const replacement = variables[key.trim()];
            return replacement !== undefined ? replacement : match;
          }
        );

        const emailPayload = (email: string) => ({
          to: email,
          from: emailTemplate.from_name + `<${emailTemplate.from_email}>`,
          subject: subject,
          html: html,
          attachment: [
            {
              name: `${legal_entity_name}.pdf`,
              url: `https://admin.orwa.org${fileData.url}`,
            },
          ],
        })

          await strapi.plugins["email"].services.email.send(emailPayload("marcosje2005@gmail.com"));

          if (adminOptions) {
            const { registrantNotification, adminNotification, customEmail } =
              adminOptions;

            if (registrantNotification && !customEmail) {
              await strapi.plugins["email"].services.email.send(
                emailPayload(point_of_contact.email)
              );
            }

            if (adminNotification && !customEmail) {
              await strapi.plugins["email"].services.email.send(emailPayload("rig@orwa.org"));
            }

            if (customEmail) {
              const emails = (customEmail as string).split(",");

              emails.forEach(async (email) => {
                await strapi.plugins["email"].services.email.send({
                  to: email.trim(),
                  from: "website@orwa.org",
                  subject,
                  html,
                  attachment: [
                    {
                      name: `${legal_entity_name}.pdf`,
                      url: `https://admin.orwa.org${fileData.url}`,
                    },
                  ],
                });
              });
            }
          } 

          ctx.body = {
            message: "success",
            // grantApplication,
          };

        }
      } catch (err) {
        console.error("Error:", err.message);
        ctx.status = 500;
        ctx.body = {
          message: "error",
          error: err.message,
        };
      }
    },
  };
};
