/**
 * Public form submissions for scholarship applications and award nominations.
 *
 * Uses Document Service + documentIds (never numeric ids as documentId).
 * Unknown payload keys are stripped via coerceToSchema.
 */

import { coerceToSchema } from "../../../utils/coerce-to-schema";
import {
  findOneById,
  resolveDocumentId,
  updateById,
} from "../../../utils/document-compat";
import {
  IAwardNominationPayload,
  IContactEntity,
  IScholarshipApplicationPayload,
} from "../../scholarship-application/types";
import { AdminOptions } from "../../membership-forms/types";
import {
  emptyToNull,
  isDocumentId,
  manyMedia,
  resolveFinancialResources,
  resolveGpa,
  resolveSystemName,
  singleMedia,
} from "../helpers";
import {
  sendAwardNominationEmails,
  sendScholarshipApplicationEmails,
} from "../form-email";

const SCHOLARSHIP_UID =
  "api::scholarship-application.scholarship-application" as const;
const AWARD_UID = "api::award-nomination.award-nomination" as const;
const CONTACT_UID = "api::contact.contact" as const;
const WATERSYSTEM_UID = "api::watersystem.watersystem" as const;
const FILE_UID = "plugin::upload.file" as const;

const FILE_BASE_URL =
  process.env.PUBLIC_URL || process.env.URL || "https://admin.orwa.org";

const fileUrl = (file: { url?: string } | null | undefined) => {
  if (!file?.url) return null;
  if (file.url.startsWith("http")) return file.url;
  return `${FILE_BASE_URL}${file.url}`;
};

export default ({ strapi }) => {
  const resolveRelation = async (
    uid: string,
    value: unknown
  ): Promise<string | null> => {
    if (value == null || value === "") return null;
    if (typeof value === "object") {
      const obj = value as Record<string, unknown>;
      if (typeof obj.documentId === "string") return obj.documentId;
      if (obj.id !== undefined) return resolveRelation(uid, obj.id);
    }
    if (isDocumentId(value)) {
      return value;
    }
    return resolveDocumentId(uid, value as string | number);
  };

  const resolveFile = async (value: unknown) => {
    const raw = singleMedia(value);
    if (raw == null) return null;
    if (isDocumentId(raw)) {
      return strapi.documents(FILE_UID).findOne({
        documentId: raw,
      });
    }
    return findOneById(FILE_UID, raw as string | number);
  };

  // Upload plugin files are keyed by numeric PK. Document Service
  // validate+create rejects both documentId strings and those ids on
  // media ("relation(s) of type plugin::upload.file ... do not exist").
  const mediaId = async (value: unknown): Promise<number | null> => {
    const raw = singleMedia(value);
    if (raw == null) return null;
    if (typeof raw === "number" && Number.isFinite(raw)) return raw;
    if (typeof raw === "string" && /^\d+$/.test(raw)) return Number(raw);
    if (isDocumentId(raw)) {
      const row = await strapi.db.query(FILE_UID).findOne({
        where: { documentId: raw },
        select: ["id"],
      });
      return row?.id ?? null;
    }
    return null;
  };

  const mediaIds = async (value: unknown): Promise<number[] | null> => {
    const list = manyMedia(value);
    if (!Array.isArray(list) || list.length === 0) return null;
    const ids = (await Promise.all(list.map((item) => mediaId(item)))).filter(
      (id): id is number => id != null
    );
    return ids.length > 0 ? ids : null;
  };

  const attachMedia = async (
    uid: string,
    relatedId: number,
    field: string,
    fileIds: number | number[] | null
  ) => {
    const ids = fileIds == null ? [] : Array.isArray(fileIds) ? fileIds : [fileIds];
    const knex = strapi.db.connection;
    for (let i = 0; i < ids.length; i += 1) {
      await knex("files_related_mph").insert({
        file_id: ids[i],
        related_id: relatedId,
        related_type: uid,
        field,
        order: i + 1,
      });
    }
  };

  const getUserIdByEmail = async (email: string) => {
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

  const updateContact = async (
    contactId: number | string,
    contact: Partial<IContactEntity>
  ) => {
    return updateById(CONTACT_UID, contactId, {
      data: coerceToSchema(CONTACT_UID, contact as Record<string, unknown>),
    });
  };

  const getContact = async (
    email: string,
    contactData: Record<string, unknown>,
    userData: Record<string, unknown>
  ): Promise<IContactEntity> => {
    const contactList =
      (await strapi.documents(CONTACT_UID).findMany({
        fields: ["id", "documentId", "first", "last", "phone", "contact_type"],
        filters: { email },
        limit: 1,
        populate: { user: true },
      })) || [];

    if (contactList.length === 0) {
      contactList.push(
        await strapi.documents(CONTACT_UID).create({
          data: coerceToSchema(CONTACT_UID, contactData),
        })
      );
    }

    const existing = contactList[0];

    if (existing.user) {
      await updateContact(existing.id, {
        first: (contactData.first as string) || existing.first,
        last: (contactData.last as string) || existing.last,
        phone: (contactData.phone as string) || existing.phone,
      });

      return {
        ...existing,
        user: existing.user?.id,
        passport: existing.user?.wp_uid,
      };
    }

    if (existing.first || existing.last || existing.phone) {
      await updateContact(existing.id, {
        first: existing.first || (contactData.first as string),
        last: existing.last || (contactData.last as string),
        phone: existing.phone || (contactData.phone as string),
      });
    }

    const { userId, wp_uid } = await getUserIdByEmail(email);

    if (userId) {
      await updateContact(existing.id, { user: userId });
      return {
        ...existing,
        user: userId,
        passport: wp_uid,
      };
    }

    const user = await strapi.plugins["users-permissions"].services.user.add(
      userData
    );

    return {
      ...existing,
      user: user.id,
      passport: null,
    };
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
    username: "",
    email: "",
    password: "password",
  };

  const shouldCreateRecord = (adminOptions?: AdminOptions) =>
    !adminOptions || Boolean(adminOptions.resubmit);

  const lookupWatersystem = async (raw: unknown) => {
    const documentId = await resolveRelation(WATERSYSTEM_UID, raw);
    if (!documentId) return null;
    return strapi.documents(WATERSYSTEM_UID).findOne({
      documentId,
      fields: ["id", "documentId", "name"],
    });
  };

  return {
    createScholarshipApplication: async (ctx) => {
      try {
        const body = ctx.request.body as IScholarshipApplicationPayload;
        const { adminOptions } = body;

        if (shouldCreateRecord(adminOptions)) {
          await logFormData(body as unknown as Record<string, unknown>, "scholarship-application");

          const gpa = resolveGpa(body);
          if (!body.applicant_email || !body.school_name || gpa == null) {
            ctx.status = 400;
            ctx.body = { message: "Missing required fields." };
            return;
          }

          const applicantContact = await getContact(
            body.applicant_email,
            {
              first: body.applicant_first_name,
              last: body.applicant_last_name,
              email: body.applicant_email,
              phone: body.applicant_phone,
            },
            {
              ...user_base,
              username: body.applicant_email,
              email: body.applicant_email,
              password: btoa(body.applicant_email),
            }
          );

          if (
            body.relationship !== "Self" &&
            body.eligible_participant_name &&
            body.eligible_participant_email
          ) {
            await getContact(
              body.eligible_participant_email,
              {
                first: body.eligible_participant_name.first,
                last: body.eligible_participant_name.last,
                email: body.eligible_participant_email,
                phone: body.eligible_participant_phone,
              },
              {
                ...user_base,
                username: body.eligible_participant_email,
                email: body.eligible_participant_email,
                password: btoa(body.eligible_participant_email),
              }
            );
          }

          const watersystem = await lookupWatersystem(
            body.watersystem ?? body.watersystem_id
          );
          const systemName = resolveSystemName({
            system_name: body.system_name,
            watersystemName: watersystem?.name,
          });

          if (!systemName) {
            ctx.status = 400;
            ctx.body = { message: "Missing required field: system_name." };
            return;
          }

          const contactDocumentId =
            applicantContact.documentId ||
            (await resolveDocumentId(CONTACT_UID, applicantContact.id));

          const data = coerceToSchema(SCHOLARSHIP_UID, {
            contact: contactDocumentId,
            watersystem: watersystem?.documentId ?? null,
            relationship: body.relationship,
            eligible_participant_name: body.eligible_participant_name,
            eligible_participant_title: body.eligible_participant_title,
            eligible_participant_phone: body.eligible_participant_phone,
            eligible_participant_email: body.eligible_participant_email,
            eligible_participant_address: body.eligible_participant_address,
            applicant_first_name: body.applicant_first_name,
            applicant_middle_name: body.applicant_middle_name,
            applicant_last_name: body.applicant_last_name,
            applicant_phone: body.applicant_phone,
            applicant_email: body.applicant_email,
            applicant_street: body.applicant_street,
            applicant_city: body.applicant_city,
            applicant_state: body.applicant_state,
            applicant_zip: body.applicant_zip,
            school_name: body.school_name,
            graduation_date: emptyToNull(body.graduation_date),
            school_address: body.school_address,
            gpa,
            system_name: systemName,
            sat_score: emptyToNull(body.sat_score),
            act_score: emptyToNull(body.act_score),
            transcript: await mediaId(body.transcript),
            test_scores: await mediaId(body.test_scores),
            first_year: body.first_year,
            credits_completed: body.credits_completed,
            credits_required: body.credits_required,
            college_gpa: body.college_gpa,
            education_type: body.education_type,
            major: body.major,
            awards: body.awards,
            recommender1_name: body.recommender1_name,
            recommender1_email: body.recommender1_email,
            recommender1_phone: body.recommender1_phone,
            recommendation_letter_1: await mediaId(body.recommendation_letter_1),
            recommender2_name: body.recommender2_name,
            recommender2_email: body.recommender2_email,
            recommender2_phone: body.recommender2_phone,
            recommendation_letter_2: await mediaId(body.recommendation_letter_2),
            financial_resources: resolveFinancialResources(
              body as unknown as Record<string, unknown>
            ),
            essay: await mediaId(body.essay),
            biography: await mediaId(body.biography),
            photograph: await mediaId(body.photograph),
            applicant_pdf: await mediaId(body.applicant_pdf),
            age_confirm: body.age_confirm,
            applicant_certification: body.applicant_certification,
            applicant_certification_date: emptyToNull(
              body.applicant_certification_date
            ),
            guardian_name: body.guardian_name,
            guardian_certification: body.guardian_certification,
            guardian_certification_date: emptyToNull(
              body.guardian_certification_date
            ),
            application_status: "Submitted",
            submission_date: new Date().toISOString(),
          });

          const scholarshipMedia: Record<string, number | number[] | null> = {
            transcript: data.transcript as number | null,
            test_scores: data.test_scores as number | null,
            recommendation_letter_1: data.recommendation_letter_1 as number | null,
            recommendation_letter_2: data.recommendation_letter_2 as number | null,
            essay: data.essay as number | null,
            biography: data.biography as number | null,
            photograph: data.photograph as number | null,
            applicant_pdf: data.applicant_pdf as number | null,
          };
          for (const key of Object.keys(scholarshipMedia)) {
            delete data[key];
          }

          const scholarshipApplication = await strapi
            .documents(SCHOLARSHIP_UID)
            .create({ data });

          const scholarshipEntityId = Number(scholarshipApplication.id);
          if (Number.isFinite(scholarshipEntityId)) {
            await Promise.all(
              Object.entries(scholarshipMedia).map(([field, ids]) =>
                attachMedia(SCHOLARSHIP_UID, scholarshipEntityId, field, ids)
              )
            );
          }

          const pdfFile = await resolveFile(body.applicant_pdf);
          await sendScholarshipApplicationEmails(strapi, {
            payload: body as unknown as Record<string, unknown>,
            adminOptions,
            attachment: pdfFile
              ? {
                  name: `${body.applicant_first_name}_${body.applicant_last_name}_scholarship_application.pdf`,
                  url: fileUrl(pdfFile) || "",
                }
              : null,
          });

          ctx.status = 200;
          ctx.body = {
            message: "success",
            scholarshipApplication,
          };
          return;
        }

        const pdfFile = await resolveFile(body.applicant_pdf);
        await sendScholarshipApplicationEmails(strapi, {
          payload: body as unknown as Record<string, unknown>,
          adminOptions,
          attachment: pdfFile
            ? {
                name: `${body.applicant_first_name}_${body.applicant_last_name}_scholarship_application.pdf`,
                url: fileUrl(pdfFile) || "",
              }
            : null,
        });

        ctx.body = { message: "success" };
      } catch (err) {
        strapi.log.error(`Scholarship Application Error: ${err.message}`);
        ctx.status = 500;
        ctx.body = {
          message: "error",
          error: err.message,
        };
      }
    },

    createAwardNomination: async (ctx) => {
      try {
        const body = ctx.request.body as IAwardNominationPayload;
        const { adminOptions } = body;

        if (shouldCreateRecord(adminOptions)) {
          await logFormData(body as unknown as Record<string, unknown>, "award-nomination");

          if (
            !body.nominee_name ||
            !body.system_name ||
            !body.award_type ||
            !(body.justification || body.nomination_description)
          ) {
            ctx.status = 400;
            ctx.body = { message: "Missing required fields." };
            return;
          }

          const nameParts = String(body.nominee_name).trim().split(/\s+/);
          const nominatorEmail = body.nominator_email || body.email;
          const nominatorContact = await getContact(
            nominatorEmail,
            {
              first:
                body.nominator_first_name ||
                nameParts[0] ||
                body.nominee_name,
              last:
                body.nominator_last_name ||
                nameParts.slice(1).join(" ") ||
                "",
              email: nominatorEmail,
              phone: body.nominator_phone || body.daytime_phone,
            },
            {
              ...user_base,
              username: nominatorEmail,
              email: nominatorEmail,
              password: btoa(nominatorEmail),
            }
          );

          const watersystem = await lookupWatersystem(
            body.watersystem ?? body.watersystem_id
          );

          const contactDocumentId =
            nominatorContact.documentId ||
            (await resolveDocumentId(CONTACT_UID, nominatorContact.id));

          const data = coerceToSchema(AWARD_UID, {
            contact: contactDocumentId,
            nominee_name: body.nominee_name,
            system_name: body.system_name,
            award_name_printed:
              body.award_name_printed || body.system_name,
            watersystem: watersystem?.documentId ?? null,
            county: emptyToNull(body.county),
            address: body.address,
            city: body.city,
            state: body.state || "OK",
            zip: body.zip,
            daytime_phone: body.daytime_phone,
            email: body.email,
            nominator_first_name: body.nominator_first_name,
            nominator_last_name: body.nominator_last_name,
            nominator_address: body.nominator_address,
            nominator_address_2: body.nominator_address_2,
            nominator_city: body.nominator_city,
            nominator_state: body.nominator_state,
            nominator_zip: body.nominator_zip,
            nominator_country: body.nominator_country || "United States",
            nominator_phone: body.nominator_phone,
            nominator_email: body.nominator_email,
            operation_start_date: emptyToNull(body.operation_start_date),
            employment_date: emptyToNull(body.employment_date),
            current_members: emptyToNull(body.current_members),
            beginning_members: emptyToNull(body.beginning_members),
            clerical_employees: emptyToNull(body.clerical_employees),
            operation_maintenance_employees: emptyToNull(
              body.operation_maintenance_employees
            ),
            management_employees: emptyToNull(body.management_employees),
            justification: body.justification || body.nomination_description,
            award_type:
              body.award_type === "Water/Wastewater System of the Year"
                ? "System of the Year"
                : body.award_type,
            biography_method: emptyToNull(body.biography_method),
            biography_text: emptyToNull(body.biography_text),
            biography_file: await mediaId(body.biography_file),
            photographs: await mediaIds(body.photographs),
            board_list_method: emptyToNull(body.board_list_method),
            board_list_file: await mediaId(body.board_list_file),
            board_members: body.board_members ?? null,
            supporting_documents: await mediaIds(body.supporting_documents),
            nomination_pdf: await mediaId(body.nomination_pdf),
            award_year: body.award_year || new Date().getFullYear(),
            nomination_status: "Submitted",
            submission_date: new Date().toISOString(),
          });

          const awardMedia: Record<string, number | number[] | null> = {
            supporting_documents: data.supporting_documents as number[] | null,
            nomination_pdf: data.nomination_pdf as number | null,
            biography_file: data.biography_file as number | null,
            photographs: data.photographs as number[] | null,
            board_list_file: data.board_list_file as number | null,
          };
          for (const key of Object.keys(awardMedia)) {
            delete data[key];
          }

          const awardNomination = await strapi.documents(AWARD_UID).create({
            data,
          });

          const awardEntityId = Number(awardNomination.id);
          if (Number.isFinite(awardEntityId)) {
            await Promise.all(
              Object.entries(awardMedia).map(([field, ids]) =>
                attachMedia(AWARD_UID, awardEntityId, field, ids)
              )
            );
          }

          const pdfFile = await resolveFile(body.nomination_pdf);
          await sendAwardNominationEmails(strapi, {
            payload: body as unknown as Record<string, unknown>,
            adminOptions,
            attachment: pdfFile
              ? {
                  name: `${String(body.nominee_name).replace(/\s+/g, "_")}_award_nomination.pdf`,
                  url: fileUrl(pdfFile) || "",
                }
              : null,
          });

          ctx.status = 200;
          ctx.body = {
            message: "success",
            awardNomination,
          };
          return;
        }

        const pdfFile = await resolveFile(body.nomination_pdf);
        await sendAwardNominationEmails(strapi, {
          payload: body as unknown as Record<string, unknown>,
          adminOptions,
          attachment: pdfFile
            ? {
                name: `${String(body.nominee_name).replace(/\s+/g, "_")}_award_nomination.pdf`,
                url: fileUrl(pdfFile) || "",
              }
            : null,
        });

        ctx.body = { message: "success" };
      } catch (err) {
        strapi.log.error(`Award Nomination Error: ${err.message}`);
        ctx.status = 500;
        ctx.body = {
          message: "error",
          error: err.message,
        };
      }
    },
  };
};
