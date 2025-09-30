/**
 * A set of functions called "actions" for `scholarship-applications`
 */

import { IContactEntity, IScholarshipApplicationPayload } from "../../scholarship-application/types";
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

    return users.length > 0
      ? {
          userId: users[0].id,
          wp_uid: users[0].wp_uid,
        }
      : { userId: null, wp_uid: null };
  };

  const getContact = async (email, contactData, userData) => {
    const contactList =
      (await strapi.documents("api::contact.contact").findMany({
        fields: ["id", "first", "last", "phone", "contact_type"],
        filters: { email },
        limit: 1,
        populate: { user: true },
      })) || [];

    // Contact Not Found ... Creating One
    if (contactList.length === 0) {
      contactList.push(
        await strapi.documents("api::contact.contact").create({
          data: contactData,
        })
      );
    }

    // Contact Found With User Included
    if (contactList[0].user) {
      // Update the contact found with missing information
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

    // Update the contact found with missing information
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
      await updateContact(contactList[0].id, {
        user: userId,
      });

      return {
        ...contactList[0],
        user: userId,
        passport: wp_uid,
      };
    }

    // User Not Found: Create user and return contact with the new user
    const user = await strapi.plugins["users-permissions"].services.user.add(
      userData
    );
    
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
    const response = await strapi.documents("api::contact.contact").update({
      documentId: contactId,
      data: contact
    });
    return response;
  };

  const logFormData = async (data: Record<string, unknown>, resource: string) => {
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
    // Remove role assignment - let Strapi handle default role
    username: "",
    email: "",
    password: "password",
  };

  return {
    createScholarshipApplication: async (ctx) => {
      try {
        const {
          adminOptions,
          applicant_email,
          applicant_first_name,
          applicant_middle_name,
          applicant_last_name,
          applicant_phone,
          applicant_street,
          applicant_city,
          applicant_state,
          applicant_zip,
          watersystem,
          relationship,
          eligible_participant_name,
          eligible_participant_title,
          eligible_participant_phone,
          eligible_participant_email,
          eligible_participant_address,
          school_name,
          graduation_date,
          school_address,
          high_school_gpa,
          sat_score,
          act_score,
          transcript,
          test_scores,
          first_year,
          credits_completed,
          credits_required,
          college_gpa,
          education_type,
          major,
          awards,
          recommender1_name,
          recommender1_email,
          recommender1_phone,
          recommendation_letter_1,
          recommender2_name,
          recommender2_email,
          recommender2_phone,
          recommendation_letter_2,
          financial1_institution,
          financial1_amount,
          financial2_institution,
          financial2_amount,
          essay,
          biography,
          photograph,
          applicant_pdf,
          age_confirm,
          applicant_certification,
          applicant_certification_date,
          guardian_name,
          guardian_certification,
          guardian_certification_date,
        } = ctx.request.body as IScholarshipApplicationPayload;

        if ((adminOptions && adminOptions.resubmit) || !adminOptions) {
          logFormData(ctx.request.body, "scholarship-application");

          console.log("Applicant Contact", { applicant_email, applicant_first_name, applicant_last_name });

          const applicantContact: IContactEntity = await getContact(
            applicant_email,
            {
              first: applicant_first_name,
              last: applicant_last_name,
              email: applicant_email,
              phone: applicant_phone,
            },
            {
              ...user_base,
              username: applicant_email,
              email: applicant_email,
              password: btoa(applicant_email),
            }
          );

          console.log("- Applicant Contact:", JSON.stringify(applicantContact));
          console.log("-------------------------------------------------------------");

          // Get or create eligible participant contact (if different from applicant)
          let eligibleParticipantContact: IContactEntity | null = null;
          if (relationship !== "Self" && eligible_participant_name && eligible_participant_email) {
            console.log("Eligible Participant", eligible_participant_name);
            
            eligibleParticipantContact = await getContact(
              eligible_participant_email,
              {
                first: eligible_participant_name.first,
                last: eligible_participant_name.last,
                email: eligible_participant_email,
                phone: eligible_participant_phone,
              },
              {
                ...user_base,
                username: eligible_participant_email,
                email: eligible_participant_email,
                password: btoa(eligible_participant_email),
              }
            );
          }

          console.log("- Eligible Participant:", JSON.stringify(eligibleParticipantContact));

          // Ensure required fields are provided
          if (!applicant_email || !school_name || !high_school_gpa) {
            ctx.status = 400;
            ctx.body = { message: "Missing required fields." };
            return;
          }

          const data = {
            contact: applicantContact.id,
            watersystem: watersystem || null,
            relationship: relationship,
            eligible_participant_name: eligible_participant_name,
            eligible_participant_title: eligible_participant_title,
            eligible_participant_phone: eligible_participant_phone,
            eligible_participant_email: eligible_participant_email,
            eligible_participant_address: eligible_participant_address,
            
            // Applicant Data (individual fields as per schema)
            applicant_first_name: applicant_first_name,
            applicant_middle_name: applicant_middle_name,
            applicant_last_name: applicant_last_name,
            applicant_phone: applicant_phone,
            applicant_email: applicant_email,
            applicant_street: applicant_street,
            applicant_city: applicant_city,
            applicant_state: applicant_state,
            applicant_zip: applicant_zip,
            
            // Academic Data
            school_name: school_name,
            graduation_date: graduation_date,
            school_address: school_address,
            gpa: high_school_gpa, // Schema expects 'gpa', not 'high_school_gpa'
            system_name: school_name, // Required field - using school name as system name
            sat_score: sat_score,
            act_score: act_score,
            transcript: transcript,
            test_scores: test_scores,

            // College Data
            first_year: first_year,
            credits_completed: credits_completed,
            credits_required: credits_required,
            college_gpa: college_gpa,
            education_type: education_type,
            major: major,

            // Additional Info
            awards: awards,

            // Recommendations
            recommender1_name: recommender1_name,
            recommender1_email: recommender1_email,
            recommender1_phone: recommender1_phone,
            recommendation_letter_1: recommendation_letter_1,
            recommender2_name: recommender2_name,
            recommender2_email: recommender2_email,
            recommender2_phone: recommender2_phone,
            recommendation_letter_2: recommendation_letter_2,

            // Financial Aid
            financial1_institution: financial1_institution,
            financial1_amount: financial1_amount,
            financial2_institution: financial2_institution,
            financial2_amount: financial2_amount,

            // Uploads
            essay: essay,
            biography: biography,
            photograph: photograph,

            // Certification
            age_confirm: age_confirm,
            applicant_certification: applicant_certification,
            applicant_certification_date: applicant_certification_date,
            guardian_name: guardian_name,
            guardian_certification: guardian_certification,
            guardian_certification_date: guardian_certification_date ?? null,

            // Application Management
            application_status: "Submitted",
            applicant_pdf: applicant_pdf,
            submission_date: new Date(),
          };

          console.log("Data:", data);

          const scholarshipApplication = await strapi.documents("api::scholarship-application.scholarship-application").create({
            data: data,
          });

          ctx.status = 200;
          ctx.body = {
            message: "success",
            scholarshipApplication,
          };
        } else {
          // Send email functionality
          const emailTemplates = await strapi.documents("api::email-template.email-template").findMany({
            filters: {
              email_name: "Scholarship Application Receipt",
            },
            populate: "*",
          });

          const emailTemplate = emailTemplates[0];

          const {
            applicant_email,
            applicant_first_name,
            applicant_last_name,
          } = ctx.request.body as IScholarshipApplicationPayload;

          const fileData = await strapi.documents('plugin::upload.file').findOne({
            documentId: "__TODO__",
            populate: '*'
          });

          const variables = {
            applicant_first_name: applicant_first_name,
            applicant_last_name: applicant_last_name,
            applicant_email: applicant_email,
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
                name: `${applicant_first_name}_${applicant_last_name}_scholarship_application.pdf`,
                url: `https://admin.orwa.org${fileData.url}`,
              },
            ],
          });

          await strapi.plugins["email"].services.email.send(emailPayload("marcosje2005@gmail.com"));

          if (adminOptions) {
            const { registrantNotification, adminNotification, customEmail } = adminOptions;

            if (registrantNotification && !customEmail) {
              await strapi.plugins["email"].services.email.send(
                emailPayload(applicant_email)
              );
            }

            // if (adminNotification && !customEmail) {
            //   await strapi.plugins["email"].services.email.send(emailPayload("scholarships@orwa.org"));
            // }

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
                      name: `${applicant_first_name}_${applicant_last_name}_scholarship_application.pdf`,
                      url: `https://admin.orwa.org${fileData.url}`,
                    },
                  ],
                });
              });
            }
          }

          ctx.body = {
            message: "success",
          };
        }
      } catch (err) {
        console.error("Scholarship Application Error:", err.message);
        ctx.status = 500;
        ctx.body = {
          message: "error",
          error: err.message,
        };
      }
    },

    createAwardNomination: async (ctx) => {
      try {
        console.log("=== AWARD NOMINATION CONTROLLER CALLED ===");
        console.log("ctx.request.body", ctx.request?.body);

        const requestBody = ctx.request?.body;

        const {
          adminOptions,
          nominee_name,
          system_name,
          watersystem,
          county,
          address,
          city,
          state,
          zip,
          daytime_phone,
          email,
          operation_start_date,
          employment_date,
          current_members,
          beginning_members,
          clerical_employees,
          operation_maintenance_employees,
          management_employees,
          nomination_description,
          award_type,
          supporting_documents,
          nomination_pdf,
          award_year,
        } = requestBody;


        if ((adminOptions && adminOptions.resubmit) || !adminOptions) {
          console.log("ctx.request.body", requestBody);
          logFormData(requestBody, "award-nomination");

          console.log("Nominee Contact", { email, nominee_name });

          // Get or create contact for the nominator
          const nominatorContact = await getContact(
            email,
            {
              first: nominee_name.split(' ')[0] || nominee_name,
              last: nominee_name.split(' ').slice(1).join(' ') || '',
              email: email,
              phone: daytime_phone,
            },
            {
              ...user_base,
              username: email,
              email: email,
              password: btoa(email),
            }
          );

          console.log("- Nominator Contact:", JSON.stringify(nominatorContact));
          console.log("-------------------------------------------------------------");

          // Ensure required fields are provided
          if (!nominee_name || !system_name || !award_type || !nomination_description) {
            ctx.status = 400;
            ctx.body = { message: "Missing required fields." };
            return;
          }

          const data = {
            contact: nominatorContact.id,
            nominee_name: nominee_name,
            system_name: system_name,
            watersystem: watersystem || null,
            county: county,
            address: address,
            city: city,
            state: state || 'OK',
            zip: zip,
            daytime_phone: daytime_phone,
            email: email,
            operation_start_date: operation_start_date,
            employment_date: employment_date,
            current_members: current_members,
            beginning_members: beginning_members,
            clerical_employees: clerical_employees,
            operation_maintenance_employees: operation_maintenance_employees,
            management_employees: management_employees,
            nomination_description: nomination_description,
            award_type: award_type,
            supporting_documents: supporting_documents,
            nomination_pdf: nomination_pdf,
            award_year: award_year || new Date().getFullYear(),
            nomination_status: "Submitted",
            submission_date: new Date(),
          };

          console.log("Data:", data);

          const awardNomination = await strapi.documents("api::award-nomination.award-nomination").create({
            data: data,
          });

          ctx.status = 200;
          ctx.body = {
            message: "success",
            awardNomination,
          };
        } else {
          // Send email functionality
          const emailTemplates = await strapi.documents("api::email-template.email-template").findMany({
            filters: {
              email_name: "Award Nomination Receipt",
            },
            populate: "*",
          });

          const emailTemplate = emailTemplates[0];

          const { email, nominee_name } = requestBody;

          const fileData = nomination_pdf ? await strapi.documents('plugin::upload.file').findOne({
            documentId: nomination_pdf,
            populate: '*'
          }) : null;

          const variables = {
            nominee_name: nominee_name,
            email: email,
            award_type: award_type,
            system_name: system_name,
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

          const emailPayload = (emailTo: string) => ({
            to: emailTo,
            from: emailTemplate.from_name + `<${emailTemplate.from_email}>`,
            subject: subject,
            html: html,
            attachment: fileData ? [
              {
                name: `${nominee_name.replace(/\s+/g, '_')}_award_nomination.pdf`,
                url: `https://admin.orwa.org${fileData.url}`,
              },
            ] : [],
          });

          if (adminOptions) {
            const { registrantNotification, adminNotification, customEmail } = adminOptions;

            if (registrantNotification && !customEmail) {
              await strapi.plugins["email"].services.email.send(
                emailPayload(email)
              );
            }

            if (adminNotification && !customEmail) {
              await strapi.plugins["email"].services.email.send(emailPayload("awards@orwa.org"));
            }

            if (customEmail) {
              const emails = (customEmail as string).split(",");

              emails.forEach(async (emailAddr) => {
                await strapi.plugins["email"].services.email.send(
                  emailPayload(emailAddr.trim())
                );
              });
            }
          }

          ctx.body = {
            message: "success",
          };
        }
      } catch (err) {
        console.error("=== AWARD NOMINATION ERROR DETAILS ===");
        console.error("Full error object:", err.details?.errors);
        console.error("=====================================");
        
        ctx.status = 500;
        ctx.body = {
          message: "error",
          error: err.message,
          details: err.stack, // Include stack trace in response for debugging
        };
      }
    },
  };
};