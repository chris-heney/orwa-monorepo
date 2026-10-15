import { PDFDocument } from "pdf-lib";
import { embedPrintFonts, type PrintFonts } from "../../../helpers/printBrandFonts";
// Import the pure helpers directly: the review-packet barrel also re-exports
// React/MUI components, which a PDF helper (and its Node tests) should not load.
import { asDateString } from "../../_components/review-packet/dateStrings";
import {
  EDUCATION_LABELS,
  RELATIONSHIP_LABELS,
  formatAddress,
  formatMoney,
  formatPersonName,
} from "../../_components/review-packet/formatters";
import {
  appendPacketAttachments,
  type AppendixOutcome,
  type PacketMediaFetcher,
} from "../../_components/review-packet/packetAppendix";
import {
  attachmentTypeLabel,
  orderPacketAttachments,
  type AttachmentSlot,
  type MediaEmbedResult,
  type OrderedAttachment,
  type PacketMediaFile,
} from "../../_components/review-packet/packetAttachments";
import { listFinancialResources } from "./financialResources";
import {
  ORWEF_LEGAL_NAME,
  SCHOLARSHIP_FOOTER_AWARD,
  SCHOLARSHIP_TITLE,
  drawLetterFooters,
  drawScholarshipApplicationForm,
  scholarshipRunningTitle,
  stackLines,
  type PrintCard,
  type PrintField,
  type ScholarshipPrintModel,
} from "./scholarshipPrintForm";
import {
  scholarshipPacketFilename,
  scholarshipPacketYear,
} from "./scholarshipPacketFilename";

export type ScholarshipMediaFile = PacketMediaFile;

export type ScholarshipPacketRecord = Record<string, unknown> & {
  applicant_first_name?: string | null;
  applicant_middle_name?: string | null;
  applicant_last_name?: string | null;
  applicant_email?: string | null;
  applicant_phone?: string | null;
  applicant_street?: string | null;
  applicant_city?: string | null;
  applicant_state?: string | null;
  applicant_zip?: string | null;
  submission_date?: string | null;
  createdAt?: string | null;
  /** Cycle year stamped on submit; NULL on applications from before the field. */
  scholarship_year?: number | string | null;
  system_name?: string | null;
  relationship?: string | null;
  eligible_participant_name?: { first?: string | null; last?: string | null } | null;
  eligible_participant_title?: string | null;
  eligible_participant_phone?: string | null;
  eligible_participant_email?: string | null;
  eligible_participant_address?: {
    street?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
  } | null;
  school_name?: string | null;
  graduation_date?: string | null;
  school_address?: {
    street?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
  } | null;
  gpa?: number | null;
  sat_score?: number | null;
  act_score?: number | null;
  first_year?: string | null;
  credits_completed?: number | null;
  credits_required?: number | null;
  college_gpa?: number | null;
  education_type?: string | null;
  major?: string | null;
  awards?: string | null;
  recommender1_name?: { first?: string | null; last?: string | null } | null;
  recommender1_email?: string | null;
  recommender1_phone?: string | null;
  recommender2_name?: { first?: string | null; last?: string | null } | null;
  recommender2_email?: string | null;
  recommender2_phone?: string | null;
  age_confirm?: string | null;
  applicant_certification?: boolean | null;
  applicant_certification_date?: string | null;
  guardian_name?: { first?: string | null; last?: string | null } | null;
  guardian_certification?: boolean | null;
  guardian_certification_date?: string | null;
  photograph?: ScholarshipMediaFile;
  transcript?: ScholarshipMediaFile;
  test_scores?: ScholarshipMediaFile;
  recommendation_letter_1?: ScholarshipMediaFile;
  recommendation_letter_2?: ScholarshipMediaFile;
  essay?: ScholarshipMediaFile;
  biography?: ScholarshipMediaFile;
  applicant_pdf?: ScholarshipMediaFile;
};

export type { MediaEmbedResult };

/**
 * Upload fields in the order the public form asks for them
 * (`apps/scholarship-application` steps: High School Data → Recommendations →
 * Essay → Biography → Photo). The appendix renders attachments in this order.
 * `applicant_pdf` is the PDF Strapi generated at submit time — it repeats this
 * form, so it is excluded unless the caller asks for it.
 */
export const SCHOLARSHIP_MEDIA_SLOTS: ReadonlyArray<
  AttachmentSlot<keyof ScholarshipPacketRecord & string>
> = [
  { key: "transcript", label: "High School Transcript" },
  { key: "test_scores", label: "SAT/ACT Score File" },
  { key: "recommendation_letter_1", label: "Recommendation Letter 1" },
  { key: "recommendation_letter_2", label: "Recommendation Letter 2" },
  { key: "essay", label: "Essay" },
  { key: "biography", label: "Biography" },
  { key: "photograph", label: "Photograph" },
  { key: "applicant_pdf", label: "Submitted Application PDF", system: true },
];

export const orderScholarshipAttachments = (
  record: ScholarshipPacketRecord,
  options: { includeSubmissionPdf?: boolean } = {}
): OrderedAttachment[] =>
  orderPacketAttachments(record, SCHOLARSHIP_MEDIA_SLOTS, {
    includeSystem: options.includeSubmissionPdf,
  });

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

const applicantName = (record: ScholarshipPacketRecord) =>
  [record.applicant_first_name, record.applicant_middle_name, record.applicant_last_name]
    .filter(Boolean)
    .join(" ")
    .trim() || "Applicant";

export { scholarshipPacketYear };

export const buildScholarshipPrintModel = (
  record: ScholarshipPacketRecord,
  attachments: ReadonlyArray<OrderedAttachment> = orderScholarshipAttachments(record)
): ScholarshipPrintModel => {
  const financialResources = listFinancialResources(record);
  const financialFields: PrintField[] =
    financialResources.length === 0
      ? [kv("Financial aid", null)]
      : financialResources.map((row) =>
          contact(row.institution || "—", formatMoney(row.amount))
        );

  // Index of the appendix: "Attachment 1 · High School Transcript · file.pdf (PDF)".
  const attachmentFields: PrintField[] =
    attachments.length > 0
      ? attachments.map((item) =>
          kv(
            `Attachment ${item.ordinal}`,
            `${item.label}  ·  ${item.fileName} (${attachmentTypeLabel(item.mime, item.ext)})`
          )
        )
      : [kv("Attachments", "None uploaded")];

  const cards: PrintCard[] = [
    {
      title: "Personal Data",
      fields: [
        kv("Name", applicantName(record) === "Applicant" ? null : applicantName(record)),
        kv("Email", record.applicant_email),
        kv("Phone", record.applicant_phone),
        addressStack(
          record.applicant_street,
          record.applicant_city,
          record.applicant_state,
          record.applicant_zip
        ),
      ],
    },
    {
      title: "Eligibility Criteria",
      fields: [
        kv("Water system", record.system_name),
        kv(
          "Relationship",
          record.relationship
            ? RELATIONSHIP_LABELS[record.relationship] || record.relationship
            : null
        ),
        contact(
          formatPersonName(record.eligible_participant_name),
          record.eligible_participant_title,
          record.eligible_participant_email,
          record.eligible_participant_phone
        ),
        contact(formatAddress(record.eligible_participant_address)),
      ],
    },
    {
      title: "High School Data",
      fields: [
        kv("School", record.school_name),
        kv("Graduation", asDateString(record.graduation_date) || null),
        contact(formatAddress(record.school_address)),
        kv("GPA", record.gpa),
        kv("SAT", record.sat_score),
        kv("ACT", record.act_score),
      ],
    },
    {
      title: "College / University",
      fields: [
        kv("First year", record.first_year),
        kv(
          "Education type",
          record.education_type
            ? EDUCATION_LABELS[record.education_type] || record.education_type
            : null
        ),
        kv("Credits done", record.credits_completed),
        kv("Credits needed", record.credits_required),
        kv("College GPA", record.college_gpa),
        kv("Major", record.major),
      ],
    },
    {
      title: "Recommender 1",
      fields: [
        contact(
          formatPersonName(record.recommender1_name),
          record.recommender1_email,
          record.recommender1_phone
        ),
      ],
    },
    {
      title: "Recommender 2",
      fields: [
        contact(
          formatPersonName(record.recommender2_name),
          record.recommender2_email,
          record.recommender2_phone
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
        kv("Age 18+", record.age_confirm),
        kv("Certified", record.applicant_certification),
        kv("Cert. date", asDateString(record.applicant_certification_date) || null),
        ...[
          kv("Guardian", formatPersonName(record.guardian_name)),
          kv("Guardian certified", record.guardian_certification),
          kv("Guardian date", asDateString(record.guardian_certification_date) || null),
        ].filter((field) => field.kind === "kv" && field.value !== "—"),
      ],
    },
    {
      title: "Awards and Recognition",
      fields: [{ kind: "body", text: record.awards?.trim() ? String(record.awards) : "—" }],
    },
    {
      title: `Attached Documents (${attachments.length})`,
      fields: attachmentFields,
    },
  ];

  const fullWidth: PrintCard[] = [];

  return {
    applicantName: applicantName(record),
    year: scholarshipPacketYear(record),
    cards,
    fullWidth,
  };
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

export type ScholarshipPrintOptions = {
  /**
   * Also append the PDF Strapi generated at submit time (`applicant_pdf`).
   * Off by default: it repeats the form rendered above and was the source of
   * the "application appears at the beginning and the end" report. The
   * record's show page links to it.
   */
  includeSubmissionPdf?: boolean;
  /** Test seam — defaults to an authenticated Strapi media fetch. */
  fetchBytes?: PacketMediaFetcher;
};

/** Append uploads in submission order (shared appendix renderer). */
export const appendScholarshipMedia = async (
  pdfDoc: PDFDocument,
  record: ScholarshipPacketRecord,
  fonts: PrintFonts,
  options: ScholarshipPrintOptions & { model?: ScholarshipPrintModel } = {}
): Promise<AppendixOutcome & { media: Record<string, MediaEmbedResult> }> => {
  const attachments = orderScholarshipAttachments(record, {
    includeSubmissionPdf: options.includeSubmissionPdf,
  });
  const model = options.model ?? buildScholarshipPrintModel(record, attachments);
  const appendix = await appendPacketAttachments(pdfDoc, fonts, attachments, {
    runningTitle: scholarshipRunningTitle(model),
    fetchBytes: options.fetchBytes,
  });
  const media: Record<string, MediaEmbedResult> = {};
  for (const slot of SCHOLARSHIP_MEDIA_SLOTS) {
    if (slot.system && !options.includeSubmissionPdf) continue;
    media[slot.key] = appendix.bySlot[slot.key] ?? "skipped";
  }
  return { ...appendix, media };
};

/** Build a full scholarship packet PDF (form pages + uploaded media). */
export const generateScholarshipPacketPdf = async (
  record: ScholarshipPacketRecord,
  options: ScholarshipPrintOptions = {}
): Promise<{
  blob: Blob;
  filename: string;
  media: Record<string, MediaEmbedResult>;
  attachments: AppendixOutcome["files"];
  fontFamily: PrintFonts["family"];
}> => {
  const pdfDoc = await PDFDocument.create();
  const fonts = await embedPrintFonts(pdfDoc);
  const attachments = orderScholarshipAttachments(record, {
    includeSubmissionPdf: options.includeSubmissionPdf,
  });
  const model = buildScholarshipPrintModel(record, attachments);
  const filename = scholarshipPacketFilename(record);
  pdfDoc.setTitle(`ORWEF Scholarship Application — ${model.applicantName}`);
  pdfDoc.setAuthor(ORWEF_LEGAL_NAME);
  pdfDoc.setSubject(SCHOLARSHIP_TITLE);
  pdfDoc.setKeywords(["ORWEF", "Scholarship", model.year]);

  // The form, exactly once — then every upload behind its own divider.
  drawScholarshipApplicationForm(pdfDoc, fonts, model);
  const appendix = await appendScholarshipMedia(pdfDoc, record, fonts, {
    ...options,
    model,
  });
  drawLetterFooters(pdfDoc, fonts, model.applicantName, SCHOLARSHIP_FOOTER_AWARD);
  const bytes = await pdfDoc.save();
  return {
    blob: new Blob([new Uint8Array(bytes)], { type: "application/pdf" }),
    filename,
    media: appendix.media,
    attachments: appendix.files,
    fontFamily: fonts.family,
  };
};

export const printScholarshipPacket = async (
  record: ScholarshipPacketRecord,
  options: ScholarshipPrintOptions = {}
) => {
  const { blob, filename, media, fontFamily } = await generateScholarshipPacketPdf(
    record,
    options
  );
  downloadBlob(blob, filename);
  return { filename, media, byteLength: blob.size, fontFamily };
};
