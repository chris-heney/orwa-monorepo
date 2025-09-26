/**
 * A set of functions called "actions" for `scholarship-applications`
 */

import { AdminOptions } from "../../membership-forms/types";

// Define scholarship application payload interface
interface IScholarshipApplicationPayload {
  // Personal Data (from contact relationship)
  applicant_email: string;
  applicant_first_name: string;
  applicant_middle_name?: string;
  applicant_last_name: string;
  applicant_phone: string;
  applicant_street: string;
  applicant_city: string;
  applicant_state: string;
  applicant_zip: string;

  // Eligibility
  watersystem_id?: number;
  relationship: "Self" | "DependentChild" | "DependentGrandchild";
  eligible_participant_id?: number;
  eligible_participant_title: string;

  // Academic Data
  school_name: string;
  graduation_date: string;
  school_street: string;
  school_city: string;
  school_state: string;
  school_zip: string;
  high_school_gpa: number;
  sat_score: number;
  act_score: number;
  transcript: any;
  test_scores: any;

  // College Data
  first_year_higher_education: boolean;
  credits_completed: number;
  credits_required: number;
  college_gpa: number;
  education_type: "FourYearCollege" | "TwoYearCollege" | "VocationalSchool";
  major?: string;

  // Additional Info
  awards_recognition?: string;

  // Recommendations
  recommender1_first_name: string;
  recommender1_last_name: string;
  recommender1_email: string;
  recommender1_phone: string;
  recommendation_letter_1: any;
  recommender2_first_name: string;
  recommender2_last_name: string;
  recommender2_email: string;
  recommender2_phone: string;
  recommendation_letter_2: any;

  // Financial Aid
  financial_aid_1_institution?: string;
  financial_aid_1_amount?: number;
  financial_aid_2_institution?: string;
  financial_aid_2_amount?: number;

  // Uploads
  essay: any;
  biography: any;
  photograph: any;

  // Certification
  age_18_or_older: boolean;
  applicant_certification: boolean;
  applicant_certification_date: string;
  guardian_first_name?: string;
  guardian_last_name?: string;
  guardian_certification?: boolean;
  guardian_certification_date?: string;

  // Admin options
  adminOptions?: AdminOptions;
}

interface IContactEntity {
  id: number;
  first: string;
  last: string;
  email: string;
  phone?: string;
  title?: string;
  user?: number;
  passport?: string;
}

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
    createScholarshipApplication: async (ctx) => {
      try {
        const payload = ctx.request.body as IScholarshipApplicationPayload;
        const { adminOptions } = payload;

        if ((adminOptions && adminOptions.resubmit) || !adminOptions) {
          logFormData(ctx.request.body, "scholarship-application");

          // Get or create applicant contact
          const applicantContact: IContactEntity = await getContact(
            payload.applicant_email,
            {
              first: payload.applicant_first_name,
              last: payload.applicant_last_name,
              email: payload.applicant_email,
              phone: payload.applicant_phone,
              street: payload.applicant_street,
              city: payload.applicant_city,
              state: payload.applicant_state,
              zip: payload.applicant_zip,
            },
            {
              ...user_base,
              username: payload.applicant_email,
              email: payload.applicant_email,
              password: btoa(payload.applicant_email),
            }
          );

          // Get or create eligible participant contact (if different from applicant)
          let eligibleParticipantContact: IContactEntity | null = null;
          if (payload.relationship !== "Self" && payload.eligible_participant_id) {
            // For now, we'll reference existing contact by ID
            // In a full implementation, you might want to create/update this contact too
            eligibleParticipantContact = { id: payload.eligible_participant_id } as IContactEntity;
          }

          // Ensure required fields are provided
          if (!payload.applicant_email || !payload.school_name || !payload.high_school_gpa) {
            ctx.status = 400;
            ctx.body = { message: "Missing required fields." };
            return;
          }

          const data = {
            contact: applicantContact.id,
            watersystem: payload.watersystem_id || null,
            relationship: payload.relationship,
            eligible_participant: eligibleParticipantContact?.id || null,
            eligible_participant_title: payload.eligible_participant_title,
            
            // Academic Data
            school_name: payload.school_name,
            graduation_date: payload.graduation_date,
            school_street: payload.school_street,
            school_city: payload.school_city,
            school_state: payload.school_state,
            school_zip: payload.school_zip,
            high_school_gpa: payload.high_school_gpa,
            sat_score: payload.sat_score,
            act_score: payload.act_score,
            transcript: payload.transcript,
            test_scores: payload.test_scores,

            // College Data
            first_year_higher_education: payload.first_year_higher_education,
            credits_completed: payload.credits_completed,
            credits_required: payload.credits_required,
            college_gpa: payload.college_gpa,
            education_type: payload.education_type,
            major: payload.major,

            // Additional Info
            awards_recognition: payload.awards_recognition,

            // Recommendations
            recommender1_first_name: payload.recommender1_first_name,
            recommender1_last_name: payload.recommender1_last_name,
            recommender1_email: payload.recommender1_email,
            recommender1_phone: payload.recommender1_phone,
            recommendation_letter_1: payload.recommendation_letter_1,
            recommender2_first_name: payload.recommender2_first_name,
            recommender2_last_name: payload.recommender2_last_name,
            recommender2_email: payload.recommender2_email,
            recommender2_phone: payload.recommender2_phone,
            recommendation_letter_2: payload.recommendation_letter_2,

            // Financial Aid
            financial_aid_1_institution: payload.financial_aid_1_institution,
            financial_aid_1_amount: payload.financial_aid_1_amount,
            financial_aid_2_institution: payload.financial_aid_2_institution,
            financial_aid_2_amount: payload.financial_aid_2_amount,

            // Uploads
            essay: payload.essay,
            biography: payload.biography,
            photograph: payload.photograph,

            // Certification
            age_18_or_older: payload.age_18_or_older,
            applicant_certification: payload.applicant_certification,
            applicant_certification_date: payload.applicant_certification_date,
            guardian_first_name: payload.guardian_first_name,
            guardian_last_name: payload.guardian_last_name,
            guardian_certification: payload.guardian_certification,
            guardian_certification_date: payload.guardian_certification_date,

            // Application Management
            application_status: "Submitted",
            submission_date: new Date(),
          };

          const scholarshipApplication = await strapi.documents("api::scholarship-application.scholarship-application").create({
            data: data,
          });

          ctx.status = 200;
          ctx.body = {
            message: "success",
            scholarshipApplication,
          };
        } else {
          // Email notification functionality could go here
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
  };
};