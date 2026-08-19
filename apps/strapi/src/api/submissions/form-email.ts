/**
 * Email Manager–driven receipts for ORWEF scholarship applications and
 * ORWA award nominations. Bodies/subjects live on email-template rows;
 * this module interpolates {placeholders} and builds a readable {all_fields}
 * HTML table (not raw JSON).
 */

import { resolveFinancialResources } from "./helpers";

export const OFFICE_EMAIL = "office@orwa.org";
export const WEBSITE_FROM_EMAIL = "website@orwa.org";

export const SCHOLARSHIP_OFFICE_EMAIL_NAME =
  "Scholarship Application Office Notification";
export const SCHOLARSHIP_APPLICANT_EMAIL_NAME =
  "Scholarship Application Applicant Receipt";
export const SCHOLARSHIP_ELIGIBLE_EMAIL_NAME =
  "Scholarship Application Eligible Participant Receipt";
export const AWARD_ADMIN_EMAIL_NAME = "Award Nomination Admin Notification";

export const SCHOLARSHIP_FORM_TITLE = "ORWEF Scholarship Application";
export const AWARD_FORM_TITLE = "ORWA Awards Nomination";

export type EmailAttachment = { name: string; url: string } | null | undefined;

export type NotificationOptions = {
  registrantNotification?: boolean;
  adminNotification?: boolean;
  customEmail?: string;
};

export type NotificationPlan = {
  sendOffice: boolean;
  sendApplicant: boolean;
  sendEligible: boolean;
  customEmails: string[];
};

export type AllFieldsRow = {
  section?: string;
  label: string;
  value: unknown;
  kind?: "text" | "media";
};

type NameLike = { first?: string; last?: string };
type AddressLike = {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
};

const RELATIONSHIP_LABELS: Record<string, string> = {
  Self: "Self",
  DependentChild: "Dependent Child",
  DependentGrandchild: "Dependent Grandchild",
};

const EDUCATION_LABELS: Record<string, string> = {
  FourYearCollege: "4-Year College/University",
  TwoYearCollege: "2-Year Community/Junior College",
  VocationalSchool: "Vocational Technical School",
};

const SKIP_VARIABLE_KEYS = new Set([
  "adminOptions",
  "accepted_terms",
  "watersystem",
  "watersystem_id",
]);

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const interpolate = (
  template: string,
  variables: Record<string, string | undefined>
) =>
  template.replace(/{([^}]+)}/g, (match, rawKey) => {
    const key = String(rawKey).trim();
    const replacement = variables[key];
    return replacement !== undefined ? replacement : match;
  });

export const formatName = (name?: NameLike | null) =>
  [name?.first, name?.last].filter(Boolean).join(" ").trim();

export const formatAddress = (address?: AddressLike | null) =>
  [address?.street, address?.city, address?.state, address?.zip]
    .filter(Boolean)
    .join(", ");

const isName = (value: object): value is NameLike =>
  "first" in value || "last" in value;

const isAddress = (value: object): value is AddressLike =>
  "street" in value || "city" in value || "zip" in value;

export const isPresentMedia = (value: unknown) => {
  if (value == null || value === "") return false;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

export const formatAllFieldsValue = (
  value: unknown,
  kind: AllFieldsRow["kind"] = "text"
) => {
  if (kind === "media") {
    return isPresentMedia(value) ? "Attached" : "—";
  }
  if (value == null || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") {
    if (isName(value)) {
      const name = formatName(value);
      return name ? escapeHtml(name) : "—";
    }
    if (isAddress(value)) {
      const address = formatAddress(value);
      return address ? escapeHtml(address) : "—";
    }
    return "—";
  }
  return escapeHtml(String(value)).replace(/\r?\n/g, "<br />");
};

export const buildAllFieldsHtml = (rows: AllFieldsRow[]) => {
  const parts = [
    '<table width="99%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#222222;">',
  ];
  let currentSection: string | undefined;
  for (const row of rows) {
    if (row.section && row.section !== currentSection) {
      currentSection = row.section;
      parts.push(
        `<tr><td colspan="2" style="padding:14px 8px 6px;border-bottom:2px solid #1a4a7a;font-weight:bold;font-size:15px;">${escapeHtml(
          currentSection
        )}</td></tr>`
      );
    }
    parts.push(
      `<tr><td style="padding:8px;border-bottom:1px solid #eeeeee;width:38%;font-weight:bold;vertical-align:top;">${escapeHtml(
        row.label
      )}</td><td style="padding:8px;border-bottom:1px solid #eeeeee;vertical-align:top;">${formatAllFieldsValue(
        row.value,
        row.kind
      )}</td></tr>`
    );
  }
  parts.push("</table>");
  return parts.join("");
};

export const shouldSendEligibleParticipantEmail = (payload: {
  relationship?: string | null;
  eligible_participant_email?: string | null;
}) => {
  if (!payload.relationship || payload.relationship === "Self") {
    return false;
  }
  const email = String(payload.eligible_participant_email || "").trim();
  return email.length > 0;
};

export const resolveNotificationPlan = (
  adminOptions?: NotificationOptions | null
): NotificationPlan => {
  if (!adminOptions) {
    return {
      sendOffice: true,
      sendApplicant: true,
      sendEligible: true,
      customEmails: [],
    };
  }

  const customEmails = String(adminOptions.customEmail || "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  if (customEmails.length > 0) {
    return {
      sendOffice: false,
      sendApplicant: false,
      sendEligible: false,
      customEmails,
    };
  }

  return {
    sendOffice: Boolean(adminOptions.adminNotification),
    sendApplicant: Boolean(adminOptions.registrantNotification),
    sendEligible: Boolean(adminOptions.registrantNotification),
    customEmails: [],
  };
};

export const scholarshipAllFieldsRows = (
  payload: Record<string, unknown>
): AllFieldsRow[] => [
  {
    section: "Applicant",
    label: "First name",
    value: payload.applicant_first_name,
  },
  {
    section: "Applicant",
    label: "Middle name",
    value: payload.applicant_middle_name,
  },
  {
    section: "Applicant",
    label: "Last name",
    value: payload.applicant_last_name,
  },
  { section: "Applicant", label: "Email", value: payload.applicant_email },
  { section: "Applicant", label: "Phone", value: payload.applicant_phone },
  {
    section: "Applicant",
    label: "Address",
    value: formatAddress({
      street: payload.applicant_street as string | undefined,
      city: payload.applicant_city as string | undefined,
      state: payload.applicant_state as string | undefined,
      zip: payload.applicant_zip as string | undefined,
    }),
  },
  {
    section: "Eligibility",
    label: "Water system",
    value: payload.system_name,
  },
  {
    section: "Eligibility",
    label: "Relationship",
    value:
      RELATIONSHIP_LABELS[String(payload.relationship || "")] ||
      payload.relationship,
  },
  {
    section: "Eligibility",
    label: "Eligible participant",
    value: payload.eligible_participant_name,
  },
  {
    section: "Eligibility",
    label: "Title",
    value: payload.eligible_participant_title,
  },
  {
    section: "Eligibility",
    label: "Participant email",
    value: payload.eligible_participant_email,
  },
  {
    section: "Eligibility",
    label: "Participant phone",
    value: payload.eligible_participant_phone,
  },
  {
    section: "Eligibility",
    label: "Participant address",
    value: payload.eligible_participant_address,
  },
  { section: "High School", label: "School", value: payload.school_name },
  {
    section: "High School",
    label: "Graduation date",
    value: payload.graduation_date,
  },
  {
    section: "High School",
    label: "School address",
    value: payload.school_address,
  },
  { section: "High School", label: "GPA", value: payload.gpa },
  { section: "High School", label: "SAT", value: payload.sat_score },
  { section: "High School", label: "ACT", value: payload.act_score },
  {
    section: "High School",
    label: "Transcript",
    value: payload.transcript,
    kind: "media",
  },
  {
    section: "High School",
    label: "Test scores",
    value: payload.test_scores,
    kind: "media",
  },
  {
    section: "College / University",
    label: "First year",
    value: payload.first_year,
  },
  {
    section: "College / University",
    label: "Credits completed",
    value: payload.credits_completed,
  },
  {
    section: "College / University",
    label: "Credits required",
    value: payload.credits_required,
  },
  {
    section: "College / University",
    label: "College GPA",
    value: payload.college_gpa,
  },
  {
    section: "College / University",
    label: "Education type",
    value:
      EDUCATION_LABELS[String(payload.education_type || "")] ||
      payload.education_type,
  },
  { section: "College / University", label: "Major", value: payload.major },
  { section: "College / University", label: "Awards", value: payload.awards },
  {
    section: "Recommendations",
    label: "Recommender 1",
    value: payload.recommender1_name,
  },
  {
    section: "Recommendations",
    label: "Recommender 1 email",
    value: payload.recommender1_email,
  },
  {
    section: "Recommendations",
    label: "Recommender 1 phone",
    value: payload.recommender1_phone,
  },
  {
    section: "Recommendations",
    label: "Recommendation letter 1",
    value: payload.recommendation_letter_1,
    kind: "media",
  },
  {
    section: "Recommendations",
    label: "Recommender 2",
    value: payload.recommender2_name,
  },
  {
    section: "Recommendations",
    label: "Recommender 2 email",
    value: payload.recommender2_email,
  },
  {
    section: "Recommendations",
    label: "Recommender 2 phone",
    value: payload.recommender2_phone,
  },
  {
    section: "Recommendations",
    label: "Recommendation letter 2",
    value: payload.recommendation_letter_2,
    kind: "media",
  },
  ...resolveFinancialResources(payload).flatMap((row, index) => [
    {
      section: "Financial aid",
      label: `Institution ${index + 1}`,
      value: row.institution,
    },
    {
      section: "Financial aid",
      label: `Amount ${index + 1}`,
      value: row.amount,
    },
  ]),
  {
    section: "Uploads",
    label: "Essay",
    value: payload.essay,
    kind: "media",
  },
  {
    section: "Uploads",
    label: "Biography",
    value: payload.biography,
    kind: "media",
  },
  {
    section: "Uploads",
    label: "Photograph",
    value: payload.photograph,
    kind: "media",
  },
  {
    section: "Uploads",
    label: "Application PDF",
    value: payload.applicant_pdf,
    kind: "media",
  },
  {
    section: "Certification",
    label: "Age confirmation",
    value: payload.age_confirm,
  },
  {
    section: "Certification",
    label: "Applicant certified",
    value: payload.applicant_certification,
  },
  {
    section: "Certification",
    label: "Certification date",
    value: payload.applicant_certification_date,
  },
  {
    section: "Certification",
    label: "Guardian",
    value: payload.guardian_name,
  },
  {
    section: "Certification",
    label: "Guardian certified",
    value: payload.guardian_certification,
  },
  {
    section: "Certification",
    label: "Guardian certification date",
    value: payload.guardian_certification_date,
  },
];

export const awardAllFieldsRows = (
  payload: Record<string, unknown>
): AllFieldsRow[] => [
  { section: "Nominee", label: "Name", value: payload.nominee_name },
  { section: "Nominee", label: "Award", value: payload.award_type },
  { section: "Nominee", label: "Year", value: payload.award_year },
  { section: "Nominee", label: "Email", value: payload.email },
  { section: "Nominee", label: "Phone", value: payload.daytime_phone },
  {
    section: "Nominee",
    label: "Address",
    value: [payload.address, payload.city, payload.state, payload.zip]
      .filter(Boolean)
      .join(", "),
  },
  { section: "Nominee", label: "County", value: payload.county },
  {
    section: "Nominator",
    label: "Name",
    value: [payload.nominator_first_name, payload.nominator_last_name]
      .filter(Boolean)
      .join(" "),
  },
  { section: "Nominator", label: "Email", value: payload.nominator_email },
  { section: "Nominator", label: "Phone", value: payload.nominator_phone },
  {
    section: "Nominator",
    label: "Address",
    value: [
      payload.nominator_address,
      payload.nominator_address_2,
      payload.nominator_city,
      payload.nominator_state,
      payload.nominator_zip,
      payload.nominator_country,
    ]
      .filter(Boolean)
      .join(", "),
  },
  { section: "System", label: "System name", value: payload.system_name },
  {
    section: "System",
    label: "Date system began operation",
    value: payload.operation_start_date,
  },
  {
    section: "System",
    label: "Date employed",
    value: payload.employment_date,
  },
  {
    section: "System",
    label: "Beginning meter connections",
    value: payload.beginning_members,
  },
  {
    section: "System",
    label: "Current meter connections",
    value: payload.current_members,
  },
  {
    section: "System",
    label: "Clerical employees",
    value: payload.clerical_employees,
  },
  {
    section: "System",
    label: "O&M employees",
    value: payload.operation_maintenance_employees,
  },
  {
    section: "System",
    label: "Management employees",
    value: payload.management_employees,
  },
  {
    section: "Nomination",
    label: "Description",
    value: payload.nomination_description,
  },
  {
    section: "Biography",
    label: "Method",
    value: payload.biography_method,
  },
  {
    section: "Biography",
    label: "Biography text",
    value: payload.biography_text,
  },
  {
    section: "Biography",
    label: "Biography file",
    value: payload.biography_file,
    kind: "media",
  },
  {
    section: "Photographs",
    label: "Photographs",
    value: payload.photographs,
    kind: "media",
  },
  {
    section: "Board",
    label: "Board list method",
    value: payload.board_list_method,
  },
  {
    section: "Board",
    label: "Board list file",
    value: payload.board_list_file,
    kind: "media",
  },
  {
    section: "Board",
    label: "Board members",
    value: Array.isArray(payload.board_members)
      ? payload.board_members
          .map((m: { first?: string; last?: string; title?: string }) =>
            [m.first, m.last, m.title].filter(Boolean).join(" ")
          )
          .filter(Boolean)
          .join("; ")
      : payload.board_members,
  },
  {
    section: "Documents",
    label: "Supporting documents",
    value: payload.supporting_documents,
    kind: "media",
  },
  {
    section: "Documents",
    label: "Nomination PDF",
    value: payload.nomination_pdf,
    kind: "media",
  },
];

const scalarVariables = (payload: Record<string, unknown>) => {
  const variables: Record<string, string> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (SKIP_VARIABLE_KEYS.has(key)) continue;
    if (value == null || value === "" || typeof value === "object") continue;
    variables[key] = String(value);
  }
  return variables;
};

export const buildScholarshipVariables = (
  payload: Record<string, unknown>,
  options?: { currentYear?: number }
) => {
  const year = String(options?.currentYear ?? new Date().getFullYear());
  const applicantFirst = String(payload.applicant_first_name || "");
  const applicantLast = String(payload.applicant_last_name || "");
  const eligibleName = (payload.eligible_participant_name || {}) as NameLike;
  const eligibleFirst = eligibleName.first || "";
  const eligibleLast = eligibleName.last || "";

  return {
    ...scalarVariables(payload),
    currentYear: year,
    all_fields: buildAllFieldsHtml(scholarshipAllFieldsRows(payload)),
    form_title: SCHOLARSHIP_FORM_TITLE,
    "Applicant first name": escapeHtml(applicantFirst),
    "Applicant first": escapeHtml(applicantFirst),
    applicant_first_name: escapeHtml(applicantFirst),
    "Applicant last": escapeHtml(applicantLast),
    "Applicant last name": escapeHtml(applicantLast),
    applicant_last_name: escapeHtml(applicantLast),
    "Eligible Participant first name": escapeHtml(eligibleFirst),
    "Eligible Participant first": escapeHtml(eligibleFirst),
    eligible_participant_first: escapeHtml(eligibleFirst),
    "Eligible Participant last": escapeHtml(eligibleLast),
    eligible_participant_last: escapeHtml(eligibleLast),
  };
};

export const buildAwardVariables = (
  payload: Record<string, unknown>,
  options?: { currentYear?: number }
) => {
  const year = String(
    options?.currentYear ?? payload.award_year ?? new Date().getFullYear()
  );

  return {
    ...scalarVariables(payload),
    currentYear: year,
    all_fields: buildAllFieldsHtml(awardAllFieldsRows(payload)),
    form_title: AWARD_FORM_TITLE,
  };
};

export type EmailTemplateSeed = {
  email_name: string;
  module: string;
  resource: string;
  to: string;
  from_name: string;
  from_email: string;
  subject: string;
  body: string;
};

export const ORWEF_EMAIL_TEMPLATE_SEEDS: EmailTemplateSeed[] = [
  {
    email_name: SCHOLARSHIP_OFFICE_EMAIL_NAME,
    module: "Scholarships",
    resource: "scholarship-applications",
    to: OFFICE_EMAIL,
    from_name: "ORWEF Scholarships",
    from_email: WEBSITE_FROM_EMAIL,
    subject: "New Scholarship Application - {currentYear}",
    body: "{all_fields}",
  },
  {
    email_name: SCHOLARSHIP_APPLICANT_EMAIL_NAME,
    module: "Scholarships",
    resource: "scholarship-applications",
    to: "",
    from_name: "ORWEF Scholarships",
    from_email: WEBSITE_FROM_EMAIL,
    subject: "Application Received",
    body:
      "<p>{Applicant first name},</p>" +
      "<p>We have received your completed ORWEF scholarship application. Below is a copy for your records. Scholarship recipients will be notified in late spring. We wish you the best of luck!</p>" +
      "{all_fields}",
  },
  {
    email_name: SCHOLARSHIP_ELIGIBLE_EMAIL_NAME,
    module: "Scholarships",
    resource: "scholarship-applications",
    to: "",
    from_name: "ORWEF Scholarships",
    from_email: WEBSITE_FROM_EMAIL,
    subject: "Application Received",
    body:
      "<p>{Eligible Participant first name},</p>" +
      "<p>We have received a completed ORWEF scholarship application from {Applicant first} {Applicant last}. Below is a copy for your records. Scholarship recipients will be notified in late spring. We wish your applicant the best of luck!</p>" +
      "{all_fields}",
  },
  {
    email_name: AWARD_ADMIN_EMAIL_NAME,
    module: "Awards",
    resource: "award-nominations",
    to: OFFICE_EMAIL,
    from_name: "ORWA Awards Nomination",
    from_email: WEBSITE_FROM_EMAIL,
    subject: "New submission from {form_title}",
    body: "{all_fields}",
  },
];

const findEmailTemplate = async (strapi: any, emailName: string) => {
  const templates = await strapi
    .documents("api::email-template.email-template")
    .findMany({
      filters: { email_name: emailName },
      populate: "*",
    });
  return templates?.[0] || null;
};

export const sendNamedTemplateEmail = async (
  strapi: any,
  options: {
    emailName: string;
    variables: Record<string, string | undefined>;
    to?: string | null;
    fallbackTo?: string;
    attachment?: EmailAttachment;
  }
) => {
  const template = await findEmailTemplate(strapi, options.emailName);
  if (!template?.body || !template?.subject) {
    strapi.log.warn(
      `No email template named "${options.emailName}"; skipping send.`
    );
    return { sent: false, reason: "missing_template" as const };
  }

  const to = options.to || template.to || options.fallbackTo;
  if (!to) {
    strapi.log.warn(
      `No recipient for email template "${options.emailName}"; skipping send.`
    );
    return { sent: false, reason: "missing_recipient" as const };
  }

  const fromName = template.from_name || "ORWA";
  const fromEmail = template.from_email || WEBSITE_FROM_EMAIL;
  const html = interpolate(template.body, options.variables);
  const subject = interpolate(template.subject, options.variables);
  const attachments =
    options.attachment?.url
      ? [{ name: options.attachment.name, url: options.attachment.url }]
      : [];

  try {
    await strapi.plugins["email"].services.email.send({
      to,
      from: `${fromName}<${fromEmail}>`,
      replyTo: fromEmail,
      subject,
      html,
      cc: template.cc || undefined,
      bcc: template.bcc || undefined,
      attachment: attachments,
    });
    return { sent: true as const, to };
  } catch (err) {
    strapi.log.warn(
      `Failed sending ${options.emailName} to ${to}: ${err.message}`
    );
    return { sent: false, reason: "send_failed" as const };
  }
};

export const sendScholarshipApplicationEmails = async (
  strapi: any,
  options: {
    payload: Record<string, unknown>;
    adminOptions?: NotificationOptions | null;
    attachment?: EmailAttachment;
  }
) => {
  const variables = buildScholarshipVariables(options.payload);
  const plan = resolveNotificationPlan(options.adminOptions);
  const sendOffice = (to?: string) =>
    sendNamedTemplateEmail(strapi, {
      emailName: SCHOLARSHIP_OFFICE_EMAIL_NAME,
      variables,
      to,
      fallbackTo: OFFICE_EMAIL,
      attachment: options.attachment,
    });

  if (plan.customEmails.length) {
    for (const email of plan.customEmails) {
      await sendOffice(email);
    }
    return;
  }

  if (plan.sendOffice) {
    await sendOffice();
  }

  if (plan.sendApplicant) {
    await sendNamedTemplateEmail(strapi, {
      emailName: SCHOLARSHIP_APPLICANT_EMAIL_NAME,
      variables,
      to: options.payload.applicant_email as string | undefined,
      attachment: options.attachment,
    });
  }

  if (
    plan.sendEligible &&
    shouldSendEligibleParticipantEmail({
      relationship: options.payload.relationship as string | undefined,
      eligible_participant_email: options.payload
        .eligible_participant_email as string | undefined,
    })
  ) {
    await sendNamedTemplateEmail(strapi, {
      emailName: SCHOLARSHIP_ELIGIBLE_EMAIL_NAME,
      variables,
      to: options.payload.eligible_participant_email as string | undefined,
      attachment: options.attachment,
    });
  }
};

export const sendAwardNominationEmails = async (
  strapi: any,
  options: {
    payload: Record<string, unknown>;
    adminOptions?: NotificationOptions | null;
    attachment?: EmailAttachment;
  }
) => {
  const variables = buildAwardVariables(options.payload);
  const plan = resolveNotificationPlan(options.adminOptions);
  const sendOffice = (to?: string) =>
    sendNamedTemplateEmail(strapi, {
      emailName: AWARD_ADMIN_EMAIL_NAME,
      variables,
      to,
      fallbackTo: OFFICE_EMAIL,
      attachment: options.attachment,
    });

  if (plan.customEmails.length) {
    for (const email of plan.customEmails) {
      await sendOffice(email);
    }
    return;
  }

  if (plan.sendOffice) {
    await sendOffice();
  }
};

export const seedOrwefEmailTemplates = async (strapi: any) => {
  const uid = "api::email-template.email-template";
  for (const template of ORWEF_EMAIL_TEMPLATE_SEEDS) {
    const existing = await strapi.documents(uid).findMany({
      filters: { email_name: template.email_name },
      limit: 1,
    });
    if (existing?.length) {
      continue;
    }
    await strapi.documents(uid).create({ data: template });
    strapi.log.info(`Seeded email template "${template.email_name}"`);
  }
};
