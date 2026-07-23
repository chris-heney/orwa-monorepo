/**
 * A set of functions called "actions" for `wp-grant-applications`
 */

import crypto from "crypto";

import { AdminOptions } from "../../membership-forms/types";
import { IContactEntity, IGrantApplicationFormPayload } from "../types";
import { findOneById, updateById } from "../../../utils/document-compat";
import { coerceToSchema } from "../../../utils/coerce-to-schema";

const GRANT_APPLICATION_UID =
  "api::grant-application-final.grant-application-final" as const;

const NEW_APPLICATION_STATUS = "New Application";

const EDIT_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// Public URL of the grant application frontend (used in edit-link emails)
const GRANT_APP_URL =
  process.env.GRANT_APP_URL || "https://orwa.org/grant-application";

// Base URL for building absolute file URLs sent back to the form
const FILE_BASE_URL =
  process.env.PUBLIC_URL || process.env.URL || "https://admin.orwa.org";

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
    const response = await updateById("api::contact.contact", contactId, {
      data: contact,
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

  /** Upsert a contact (and backing user) from a form contact payload. */
  const upsertFormContact = async (contact): Promise<IContactEntity | null> => {
    if (!contact?.email) return null;
    return getContact(
      contact.email,
      {
        first: contact.first,
        last: contact.last,
        email: contact.email,
        phone: contact.phone,
        title: contact.title,
      },
      {
        ...user_base,
        username: contact.email,
        email: contact.email,
        password: btoa(contact.email),
      }
    );
  };

  const upsertAdditionalContacts = async (
    additional_contacts
  ): Promise<number[]> => {
    const ids: number[] = [];
    for (const contact of additional_contacts ?? []) {
      const upserted = await upsertFormContact(contact);
      if (upserted) ids.push(upserted.id);
    }
    return ids;
  };

  /** Most recent application where any contact matches the given email. */
  const findApplicationByContactEmail = async (email: string) => {
    const applications = await strapi
      .documents(GRANT_APPLICATION_UID)
      .findMany({
        filters: {
          $or: [
            { point_of_contact: { email: { $eqi: email } } },
            { chairman: { email: { $eqi: email } } },
            { engineer: { email: { $eqi: email } } },
            { additional_contacts: { email: { $eqi: email } } },
          ],
        },
        sort: { createdAt: "desc" },
        limit: 1,
        populate: { status: true },
      });
    return applications[0] ?? null;
  };

  const findApplicationByEditToken = async (token: string) => {
    const applications = await strapi
      .documents(GRANT_APPLICATION_UID)
      .findMany({
        filters: { edit_token: token },
        limit: 1,
        populate: {
          status: true,
          grant: true,
          point_of_contact: true,
          chairman: true,
          engineer: true,
          additional_contacts: true,
          selected_projects: true,
          proposals: true,
          uploaded_engineering_report: true,
          uploaded_notice_of_violation: true,
          uploaded_additional_files: true,
          consent_order: true,
        },
      });
    return applications[0] ?? null;
  };

  const isTokenExpired = (application) =>
    !application.edit_token_expires ||
    new Date(application.edit_token_expires).getTime() < Date.now();

  const isNewApplication = (application) =>
    application.status?.name === NEW_APPLICATION_STATUS;

  const newEditToken = () => crypto.randomBytes(32).toString("hex");

  const editTokenExpiry = () =>
    new Date(Date.now() + EDIT_TOKEN_TTL_MS).toISOString();

  /** Reuse a still-valid token or issue a fresh one; extends expiry either way. */
  const ensureEditToken = async (application): Promise<string> => {
    const token =
      application.edit_token && !isTokenExpired(application)
        ? application.edit_token
        : newEditToken();

    await strapi.documents(GRANT_APPLICATION_UID).update({
      documentId: application.documentId,
      data: {
        edit_token: token,
        edit_token_expires: editTokenExpiry(),
      },
    });

    return token;
  };

  const sendEditLinkEmail = async (email: string, application, token) => {
    const editLink = `${GRANT_APP_URL}/?edit_token=${token}`;

    const variables = {
      legal_entity_name: application.legal_entity_name ?? "",
      application_id: application.application_id ?? "",
      edit_link: editLink,
    };

    const templates = await strapi
      .documents("api::email-template.email-template")
      .findMany({
        filters: { email_name: "Application Edit Link" },
        limit: 1,
      });

    const template = templates[0];
    const variableSearch = /{([^}]+)}/g;
    const replaceVariables = (text: string) =>
      text.replace(variableSearch, (match, key) => {
        const replacement = variables[key.trim()];
        return replacement !== undefined ? replacement : match;
      });

    const subject = template
      ? replaceVariables(template.subject)
      : "Modify Your ORWA Grant Application";

    const html = template
      ? replaceVariables(template.body)
      : `<p>Hello,</p>
         <p>We received a request to modify the grant application for
         <strong>${variables.legal_entity_name}</strong>
         (Application #${variables.application_id}).</p>
         <p><a href="${editLink}">Click here to modify your application</a></p>
         <p>This link is valid for 30 days, as long as your application has not
         yet entered processing. If you did not request this, you can safely
         ignore this email.</p>
         <p>&mdash; Oklahoma Rural Water Association</p>`;

    await strapi.plugins["email"].services.email.send({
      to: email,
      from: template
        ? `${template.from_name} <${template.from_email}>`
        : "ORWA <website@orwa.org>",
      subject,
      html,
    });
  };

  const toFormContact = (contact) => ({
    first: contact?.first ?? "",
    last: contact?.last ?? "",
    email: contact?.email ?? "",
    phone: contact?.phone ?? "",
    title: contact?.title ?? "",
  });

  const toFormFile = (file) =>
    file
      ? {
          id: file.id,
          src: file.url?.startsWith("http")
            ? file.url
            : `${FILE_BASE_URL}${file.url}`,
          title: file.name,
          mime: file.mime,
        }
      : null;

  const toFormFiles = (files) => (files ?? []).map(toFormFile);

  /** Shape a populated application record like IGrantApplicationFormPayload. */
  const toFormPayload = (a) => ({
    legal_entity_name: a.legal_entity_name ?? "",
    facility_id: a.facility_id ?? "",
    population_served: a.population_served ?? 0,
    county: a.county ?? "",
    physical_address_street: a.physical_address_street ?? "",
    physical_address_line_two: a.physical_address_line_two ?? "",
    physical_address_city: a.physical_address_city ?? "",
    physical_address_state: a.physical_address_state ?? "Oklahoma",
    physical_address_zip: a.physical_address_zip ?? "",
    physical_same_as_mailing: !!a.physical_same_as_mailing,
    mailing_address_street: a.mailing_address_street ?? "",
    mailing_address_line_two: a.mailing_address_line_two ?? "",
    mailing_address_city: a.mailing_address_city ?? "",
    mailing_address_state: a.mailing_address_state ?? "Oklahoma",
    mailing_address_zip: a.mailing_address_zip ?? "",
    point_of_contact: toFormContact(a.point_of_contact),
    chairman: toFormContact(a.chairman),
    chairman_also_mayer_of_municipal_city:
      !!a.chairman_also_mayer_of_municipal_city,
    has_engineer: !!a.has_engineer,
    engineer: toFormContact(a.engineer),
    additional_contacts: (a.additional_contacts ?? []).map(toFormContact),
    drinking_or_wastewater: a.drinking_or_wastewater ?? "Drinking Water",
    other_describe: a.other_describe ?? "",
    description_justification_estimated_cost:
      a.description_justification_estimated_cost ?? "",
    combined_cost_of_projects: Number(a.combined_cost_of_projects ?? 0),
    requested_grant_amount: Number(a.requested_grant_amount ?? 0),
    minimum_utility_financial_contribution:
      a.minimum_utility_financial_contribution ?? "",
    engineering_report: a.engineering_report ?? "No",
    report_approved_by_deq: a.report_approved_by_deq ?? "No",
    engineering_report_deq_approved: a.engineering_report_deq_approved
      ? "Yes"
      : "No",
    resolves_violation: a.resolves_violation ?? "No",
    signatory_name: a.signatory_name ?? "",
    signatory_title: a.signatory_title ?? "",
    signature: a.signature ?? "",
    other_needs: a.other_needs ?? "",
    change_order_request: a.change_order_request ?? "No",
    original_application_number: a.previous_application_id ?? "",
    grant: a.grant?.id ?? 4,
    application_date: a.application_date,
    status: 12,
    application_id: a.application_id ?? "",
    selected_projects: (a.selected_projects ?? []).map((p) => String(p.id)),
    proposals: toFormFiles(a.proposals),
    uploaded_engineering_report: toFormFiles(a.uploaded_engineering_report),
    uploaded_notice_of_violation: toFormFiles(a.uploaded_notice_of_violation),
    uploaded_additional_files: toFormFiles(a.uploaded_additional_files),
    satisfy_deq_issued_order: !!a.satisfy_deq_issued_order,
    // The form's FileInput keeps single-file fields as one-element arrays
    consent_order: a.consent_order ? [toFormFile(a.consent_order)] : [],
    consent_order_number: a.consent_order_number ?? "",
    money_set_aside: !!a.money_set_aside,
    applied_to_other_loans: !!a.applied_to_other_loans,
    additional_information: a.additional_information ?? "",
    additional_funding_requested: a.additional_funding_requested ?? 0,
    other_entities: a.other_entities ?? "",
    lrsp_plan: !!a.lrsp_plan,
  });

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
          additional_contacts,
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
              email: point_of_contact?.email,
              phone: point_of_contact.phone,
              title: point_of_contact.title,
            },
            {
              ...user_base,
              username: point_of_contact.email,
              email: point_of_contact?.email,
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

          const additionalContactIds = await upsertAdditionalContacts(
            additional_contacts
          );

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
            additional_contacts: additionalContactIds,
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
            // Allow the applicant to modify the application while it is still
            // a "New Application" (token returned below + emailed on request)
            edit_token: newEditToken(),
            edit_token_expires: editTokenExpiry(),
          };

          // Strapi 5 validates payload types strictly (v4 silently coerced).
          // The public form sends booleans/numbers for several schema string
          // fields and vice versa; coerceToSchema coerces primitives to the
          // schema types and strips keys that are not schema attributes.
          const grantApplication = await strapi.documents("api::grant-application-final.grant-application-final").create({
            data: coerceToSchema(
              "api::grant-application-final.grant-application-final",
              data
            ),
          });

          ctx.status = 200;
          ctx.body = {
            message: "success",
            grantApplication,
            editToken: data.edit_token,
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

        const fileData = await findOneById('plugin::upload.file', applicant_pdf, {
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
        console.error(require("util").inspect(err, { depth: 4 }));
        ctx.status = 500;
        ctx.body = {
          message: "error",
          error: err.message,
        };
      }
    },

    /**
     * POST /grant-application/request-edit  { email }
     *
     * Emails a tokenized edit link when the address matches any contact on
     * an application still in "New Application" status.
     */
    requestEdit: async (ctx) => {
      try {
        const { email } = (ctx.request.body ?? {}) as { email?: string };

        if (!email || typeof email !== "string" || !email.includes("@")) {
          ctx.status = 400;
          ctx.body = { code: "invalid_request", message: "Email is required." };
          return;
        }

        const application = await findApplicationByContactEmail(email.trim());

        if (!application) {
          ctx.body = { code: "not_found" };
          return;
        }

        if (!isNewApplication(application)) {
          ctx.body = { code: "locked" };
          return;
        }

        const token = await ensureEditToken(application);
        await sendEditLinkEmail(email.trim(), application, token);

        ctx.body = { code: "sent" };
      } catch (err) {
        console.error("requestEdit error:", err.message);
        ctx.status = 500;
        ctx.body = { code: "error", error: err.message };
      }
    },

    /**
     * GET /grant-application/edit-session?token=...
     *
     * Re-validates the token AND status on every load (the link itself is
     * never trusted) and returns the application shaped like the form payload.
     */
    getEditSession: async (ctx) => {
      try {
        const token = ctx.query?.token;

        if (!token || typeof token !== "string") {
          ctx.status = 400;
          ctx.body = { code: "invalid_request", message: "Token is required." };
          return;
        }

        const application = await findApplicationByEditToken(token);

        if (!application || isTokenExpired(application)) {
          ctx.status = 404;
          ctx.body = { code: "invalid" };
          return;
        }

        if (!isNewApplication(application)) {
          ctx.status = 409;
          ctx.body = { code: "locked" };
          return;
        }

        ctx.body = { code: "ok", application: toFormPayload(application) };
      } catch (err) {
        console.error("getEditSession error:", err.message);
        ctx.status = 500;
        ctx.body = { code: "error", error: err.message };
      }
    },

    /**
     * PUT /grant-application/edit-session  { token, ...form payload }
     *
     * Re-validates token + status server-side, upserts contacts the same way
     * the create path does, and updates the application in place. Status,
     * application_id, and application_date are never touched; no emails sent.
     */
    updateEditSession: async (ctx) => {
      try {
        const { token, ...payload } = (ctx.request.body ??
          {}) as IGrantApplicationFormPayload & { token?: string };

        if (!token || typeof token !== "string") {
          ctx.status = 400;
          ctx.body = { code: "invalid_request", message: "Token is required." };
          return;
        }

        const application = await findApplicationByEditToken(token);

        if (!application || isTokenExpired(application)) {
          ctx.status = 404;
          ctx.body = { code: "invalid" };
          return;
        }

        if (!isNewApplication(application)) {
          ctx.status = 409;
          ctx.body = { code: "locked" };
          return;
        }

        if (!payload.legal_entity_name || !payload.point_of_contact) {
          ctx.status = 400;
          ctx.body = { code: "invalid_request", message: "Missing required fields." };
          return;
        }

        logFormData(ctx.request.body, "grant-application-edit");

        const pocContact = await upsertFormContact(payload.point_of_contact);
        const chairmanContact = await upsertFormContact(payload.chairman);
        const engineerContact =
          payload.has_engineer && payload.engineer
            ? await upsertFormContact(payload.engineer)
            : null;
        const additionalContactIds = await upsertAdditionalContacts(
          (payload as any).additional_contacts
        );

        const data: Record<string, unknown> = {
          ...payload,
          previous_application_id: payload.original_application_number,
          point_of_contact: pocContact?.id ?? null,
          chairman: chairmanContact?.id ?? null,
          engineer: engineerContact?.id ?? null,
          additional_contacts: additionalContactIds,
          selected_projects: (payload.selected_projects ?? []).map((project) =>
            parseInt(project)
          ),
        };

        // Fields the applicant must never change through this endpoint.
        // (coerceToSchema strips form-only keys like `certify`, but these are
        // real schema attributes and have to be removed explicitly.)
        delete data.status;
        delete data.application_id;
        delete data.application_date;
        delete data.edit_token;
        delete data.edit_token_expires;
        delete data.adminOptions;

        const grantApplication = await strapi
          .documents(GRANT_APPLICATION_UID)
          .update({
            documentId: application.documentId,
            data: coerceToSchema(GRANT_APPLICATION_UID, data),
          });

        ctx.body = { message: "success", code: "ok", grantApplication };
      } catch (err) {
        console.error("updateEditSession error:", err.message);
        console.error(require("util").inspect(err, { depth: 4 }));
        ctx.status = 500;
        ctx.body = { code: "error", message: "error", error: err.message };
      }
    },
  };
};
