import { PDFDocument } from "pdf-lib";
import { IScholarshipApplicationPayload } from "../types/types";
import { asFinancialResources } from "./mapScholarshipPayload";
import { embedPrintFonts } from "./printBrandFonts";
import {
  ORWEF_LEGAL_NAME,
  SCHOLARSHIP_FOOTER_AWARD,
  SCHOLARSHIP_TITLE,
  drawLetterFooters,
  drawScholarshipApplicationForm,
  stackLines,
  type PrintCard,
  type PrintField,
  type ScholarshipPrintModel,
} from "./scholarshipPrintForm";

const fullName = (name?: { first?: string; last?: string }) =>
  [name?.first, name?.last].filter(Boolean).join(" ").trim();

const display = (value: unknown): string => {
  if (value === undefined || value === null || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
};

const kv = (label: string, value: unknown): PrintField => ({
  kind: "kv",
  label,
  value: display(value),
});

const contact = (...lines: Array<string | null | undefined>): PrintField => ({
  kind: "contact",
  lines: stackLines(...lines),
});

const addressStack = (
  street?: string | null,
  city?: string | null,
  state?: string | null,
  zip?: string | null
): PrintField => {
  const cityLine = [city, state].filter(Boolean).join(", ");
  return contact(street, [cityLine, zip].filter(Boolean).join(" "));
};

const EDUCATION_LABELS: Record<string, string> = {
  FourYearCollege: "4-Year College/University",
  TwoYearCollege: "2-Year Community/Junior College",
  VocationalSchool: "Vocational Technical School",
};

const RELATIONSHIP_LABELS: Record<string, string> = {
  Self: "Self",
  DependentChild: "Dependent Child",
  DependentGrandchild: "Dependent Grandchild",
};

const buildModel = (
  payload: IScholarshipApplicationPayload
): ScholarshipPrintModel => {
  const applicantName =
    [
      payload.applicant_first_name,
      payload.applicant_middle_name,
      payload.applicant_last_name,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() || "Applicant";
  const financialResources = asFinancialResources(
    payload as IScholarshipApplicationPayload & Record<string, unknown>
  );
  const financialFields: PrintField[] =
    financialResources.length === 0
      ? [kv("Financial aid", null)]
      : financialResources.map((row) =>
          contact(row.institution || "—", row.amount != null ? String(row.amount) : "—")
        );

  const cards: PrintCard[] = [
    {
      title: "Personal Data",
      fields: [
        kv("Name", applicantName === "Applicant" ? null : applicantName),
        kv("Email", payload.applicant_email),
        kv("Phone", payload.applicant_phone),
        addressStack(
          payload.applicant_street,
          payload.applicant_city,
          payload.applicant_state,
          payload.applicant_zip
        ),
      ],
    },
    {
      title: "Eligibility Criteria",
      fields: [
        kv("Water system", payload.system_name),
        kv(
          "Relationship",
          payload.relationship
            ? RELATIONSHIP_LABELS[payload.relationship] || payload.relationship
            : null
        ),
        contact(
          fullName(payload.eligible_participant_name),
          payload.eligible_participant_title,
          payload.eligible_participant_email,
          payload.eligible_participant_phone
        ),
        addressStack(
          payload.eligible_participant_address?.street,
          payload.eligible_participant_address?.city,
          payload.eligible_participant_address?.state,
          payload.eligible_participant_address?.zip
        ),
      ],
    },
    {
      title: "High School Data",
      fields: [
        kv("School", payload.school_name),
        kv("Graduation", payload.graduation_date),
        addressStack(
          payload.school_address?.street,
          payload.school_address?.city,
          payload.school_address?.state,
          payload.school_address?.zip
        ),
        kv("GPA", payload.gpa),
        kv("SAT", payload.sat_score),
        kv("ACT", payload.act_score),
      ],
    },
    {
      title: "College / University",
      fields: [
        kv("First year", payload.first_year),
        kv(
          "Education type",
          payload.education_type
            ? EDUCATION_LABELS[payload.education_type] || payload.education_type
            : null
        ),
        kv("Credits done", payload.credits_completed),
        kv("Credits needed", payload.credits_required),
        kv("College GPA", payload.college_gpa),
        kv("Major", payload.major),
      ],
    },
    {
      title: "Recommender 1",
      fields: [
        contact(
          fullName(payload.recommender1_name),
          payload.recommender1_email,
          payload.recommender1_phone
        ),
      ],
    },
    {
      title: "Recommender 2",
      fields: [
        contact(
          fullName(payload.recommender2_name),
          payload.recommender2_email,
          payload.recommender2_phone
        ),
      ],
    },
    {
      title: "Financial Data",
      fields: financialFields,
    },
    {
      title: "Certification",
      fields: [
        kv("Age 18+", payload.age_confirm),
        kv("Certified", payload.applicant_certification),
        kv("Cert. date", payload.applicant_certification_date),
        kv("Guardian", fullName(payload.guardian_name) || null),
      ],
    },
    {
      title: "Awards and Recognition",
      fields: [{ kind: "body", text: payload.awards?.trim() ? String(payload.awards) : "—" }],
    },
  ];

  return {
    applicantName,
    cycleYear: String(new Date().getFullYear()),
    cards,
    fullWidth: [],
  };
};

export async function generateScholarshipApplicationPDF(
  payload: IScholarshipApplicationPayload
) {
  const pdfDoc = await PDFDocument.create();
  const fonts = await embedPrintFonts(pdfDoc);
  const model = buildModel(payload);
  pdfDoc.setTitle(`ORWEF Scholarship Application — ${model.applicantName}`);
  pdfDoc.setAuthor(ORWEF_LEGAL_NAME);
  pdfDoc.setSubject(SCHOLARSHIP_TITLE);
  drawScholarshipApplicationForm(pdfDoc, fonts, model);
  drawLetterFooters(pdfDoc, fonts, model.applicantName, SCHOLARSHIP_FOOTER_AWARD);
  const bytes = await pdfDoc.save();
  return new Blob([bytes], { type: "application/pdf" });
}
