"use strict";
import { findOneById } from "./utils/document-compat";

// I want to create a new grant management plugin
// this plugin will have a new content type called "grant-application-final"
// I want this plugin to access onCreate, onUpdate lifecycle hooks and sends emails based on the status of the grant application

// Statuses

// New Application
// Change Order
// Revised
// Insufficient
// Over Population Limit
// Withdrawn
// On Hold
// Tabled Application
// Not Approved	red
// Approved

// When the status of the grant application is "New Application", I want to send an email to the grant applicant // email name : "Application Receipt" // and change order request is no

// When status is "approved" , I want to send an email to the grant applicant // email name : "Award Letter"

export default async ({ strapi }: { strapi: any }) => {
  strapi.db.lifecycles.subscribe({
    afterCreate: async (event: any) => {
      if (event.model.singularName === "grant-application-final") {
        // send email to grant applican

        const emailTemplates = await strapi.documents("api::email-template.email-template").findMany({
          filters: {
            email_name: "Application Receipt",
          },
          populate: "*",
        });

        const emailTemplate = emailTemplates[0];

        const application = await findOneById("api::grant-application-final.grant-application-final", event.result.id, {
          populate: "*"
        });

        // point_of_contact / applicant_pdf can be null (e.g. WP-form intake);
        // an uncaught throw here aborts the whole create request.
        const variables = {
          point_of_contact_first: application.point_of_contact?.first ?? "",
          point_of_contact_last: application.point_of_contact?.last ?? "",
          legal_entity_name: application.legal_entity_name,
          application_id: event.result.id,
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
        try {
          // applicant_pdf is optional (WP-form intake has none); reading .url
          // of null threw and aborted the whole application create.
          const attachment = application.applicant_pdf?.url
            ? [
                {
                  name: `${application.legal_entity_name}.pdf`,
                  url: `https://admin.orwa.org${application.applicant_pdf.url}`,
                },
              ]
            : undefined;

          const payload = {
            // to: application.point_of_contact ? application.point_of_contact.email : application.email ? application.email : null,
            to: "marcosje2005@gmail.com",
            from: emailTemplate.from_name + `<${emailTemplate.from_email}>`,
            subject: subject,
            html: html,
            attachment,
          };     
          const payload2 = {
            to: application.point_of_contact ? application.point_of_contact.email : application.email ? application.email : null,
            // to: `${application.point_of_contact.email}`,
            // to: "marcosje2005@gmail.com",
            from: emailTemplate.from_name + `<${emailTemplate.from_email}>`,
            subject: subject,
            html: html,
            attachment,
          }; 

          const payload3 = {
            to: 'rig@orwa.org',
            // to: "marcosje2005@gmail.com",
            from: emailTemplate.from_name + `<${emailTemplate.from_email}>`,
            subject: subject,
            html: html,
            attachment,
          }; 
                    
          await strapi.plugins["email"].services.email.send(payload);
          await strapi.plugins["email"].services.email.send(payload2);
          await strapi.plugins["email"].services.email.send(payload3);

          console.log("emails sent");

        } catch (error) {
          console.log(error);
        }
      }
    },
  });
};
