import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { embedPrintFonts, type PrintFonts } from "../../../helpers/printBrandFonts";
import CookieStore from "../../../helpers/ra-strapi-data-provider/src/CookieStore";
import {
  EDUCATION_LABELS,
  RELATIONSHIP_LABELS,
  asDateString,
  formatAddress,
  formatMoney,
  formatPersonName,
} from "../../_components/review-packet";
import { listFinancialResources } from "./financialResources";
import { resolveMediaUrl } from "./resolveMediaUrl";
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
import { scholarshipPacketFilename } from "./scholarshipPacketFilename";
import { yearOf } from "./metrics";

export type ScholarshipMediaFile = {
  url?: string | null;
  name?: string | null;
  mime?: string | null;
} | null;

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

export type MediaEmbedResult = "embedded" | "merged" | "linked" | "skipped";

export const SCHOLARSHIP_MEDIA_SLOTS: Array<{
  key: keyof ScholarshipPacketRecord;
  label: string;
}> = [
  { key: "photograph", label: "Photograph" },
  { key: "transcript", label: "High School Transcript" },
  { key: "test_scores", label: "SAT/ACT Score File" },
  { key: "recommendation_letter_1", label: "Recommendation Letter 1" },
  { key: "recommendation_letter_2", label: "Recommendation Letter 2" },
  { key: "essay", label: "Essay" },
  { key: "biography", label: "Biography" },
  { key: "applicant_pdf", label: "Submitted Application PDF" },
];

const authHeaders = (): HeadersInit => {
  try {
    const token = CookieStore.getCookie("token");
    if (token) return { Authorization: `Bearer ${token}` };
  } catch {
    // Node / unit tests have no `document`.
  }
  const apiKey = import.meta.env.VITE_API_KEY;
  if (apiKey) return { Authorization: `Bearer ${apiKey}` };
  return {};
};

const asMediaItems = (
  file: ScholarshipMediaFile | ScholarshipMediaFile[] | undefined
): NonNullable<ScholarshipMediaFile>[] =>
  (Array.isArray(file) ? file : [file]).filter(
    (item): item is NonNullable<ScholarshipMediaFile> =>
      item != null && Boolean(item.url)
  );

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

const cycleYear = (record: ScholarshipPacketRecord) =>
  String(
    yearOf({
      id: "print",
      submission_date: record.submission_date,
      createdAt: record.createdAt,
    }) || new Date().getFullYear()
  );

export const buildScholarshipPrintModel = (
  record: ScholarshipPacketRecord
): ScholarshipPrintModel => {
  const financialResources = listFinancialResources(record);
  const financialFields: PrintField[] =
    financialResources.length === 0
      ? [kv("Financial aid", null)]
      : financialResources.map((row) =>
          contact(row.institution || "—", formatMoney(row.amount))
        );

  const presentAttachments = SCHOLARSHIP_MEDIA_SLOTS.map((slot) => {
    const items = asMediaItems(
      record[slot.key] as ScholarshipMediaFile | ScholarshipMediaFile[] | undefined
    );
    return kv(
      slot.label,
      items.length === 0 ? null : items.map((item) => item.name || "Attachment").join(", ")
    );
  }).filter((field) => field.kind === "kv" && field.value !== "—");
  const attachmentFields: PrintField[] =
    presentAttachments.length > 0 ? presentAttachments : [kv("Attachments", "None")];

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
      title: "Attached Documents",
      fields: attachmentFields,
    },
  ];

  const fullWidth: PrintCard[] = [];

  return {
    applicantName: applicantName(record),
    cycleYear: cycleYear(record),
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

const fetchMediaBytes = async (
  file: NonNullable<ScholarshipMediaFile>
): Promise<{ bytes: Uint8Array; href: string } | null> => {
  const href = resolveMediaUrl(file.url);
  if (!href) return null;
  const response = await fetch(href, { headers: authHeaders() });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${file.name || href} (${response.status})`);
  }
  const buffer = await response.arrayBuffer();
  return { bytes: new Uint8Array(buffer), href };
};

const wrapLink = (text: string, font: PDFFont, size: number, maxWidth: number) => {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];
  const lines: string[] = [];
  let current = words[0];
  for (let i = 1; i < words.length; i += 1) {
    const next = `${current} ${words[i]}`;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
    } else {
      lines.push(current);
      current = words[i];
    }
  }
  lines.push(current);
  return lines;
};

const addLinkPage = (
  pdfDoc: PDFDocument,
  page: PDFPage,
  fonts: PrintFonts,
  label: string,
  fileName: string,
  href: string
) => {
  const { width, height } = page.getSize();
  const margin = 54;
  let y = height - 72;
  page.drawText(label, {
    x: margin,
    y,
    size: 14,
    font: fonts.bold,
    color: rgb(0.08, 0.2, 0.36),
  });
  y -= 24;
  page.drawText(`File: ${fileName.slice(0, 90)}`, {
    x: margin,
    y,
    size: 11,
    font: fonts.regular,
  });
  y -= 18;
  page.drawText("This file type cannot be embedded. Open it in Media Library or via:", {
    x: margin,
    y,
    size: 11,
    font: fonts.regular,
  });
  y -= 18;
  const linkLines = wrapLink(href, fonts.regular, 9, width - margin * 2);
  for (const row of linkLines.slice(0, 6)) {
    page.drawText(row, {
      x: margin,
      y,
      size: 9,
      font: fonts.regular,
      color: rgb(0.05, 0.25, 0.55),
    });
    y -= 12;
  }
};

const appendImagePage = async (
  pdfDoc: PDFDocument,
  label: string,
  bytes: Uint8Array,
  mime: string,
  fonts: PrintFonts
): Promise<boolean> => {
  let image;
  try {
    if (mime.includes("png")) {
      image = await pdfDoc.embedPng(bytes);
    } else if (mime.includes("jpeg") || mime.includes("jpg")) {
      image = await pdfDoc.embedJpg(bytes);
    } else {
      return false;
    }
  } catch {
    return false;
  }

  const page = pdfDoc.addPage([612, 792]);
  const { width, height } = page.getSize();
  const margin = 54;
  page.drawText(label, {
    x: margin,
    y: height - margin,
    size: 12,
    font: fonts.bold,
    color: rgb(0.08, 0.2, 0.36),
  });
  const maxW = width - margin * 2;
  const maxH = height - margin * 2 - 24;
  const scale = Math.min(maxW / image.width, maxH / image.height, 1);
  const drawW = image.width * scale;
  const drawH = image.height * scale;
  page.drawImage(image, {
    x: margin,
    y: height - margin - 20 - drawH,
    width: drawW,
    height: drawH,
  });
  return true;
};

export const appendScholarshipMedia = async (
  pdfDoc: PDFDocument,
  record: ScholarshipPacketRecord,
  fonts: PrintFonts
): Promise<Record<string, MediaEmbedResult>> => {
  const results: Record<string, MediaEmbedResult> = {};

  for (const slot of SCHOLARSHIP_MEDIA_SLOTS) {
    const items = asMediaItems(
      record[slot.key] as ScholarshipMediaFile | ScholarshipMediaFile[] | undefined
    );
    if (items.length === 0) {
      results[slot.key] = "skipped";
      continue;
    }

    let outcome: MediaEmbedResult = "linked";
    for (const item of items) {
      const fetched = await fetchMediaBytes(item);
      if (!fetched) {
        outcome = "linked";
        continue;
      }
      const mime = (item.mime || "").toLowerCase();
      const fileName = item.name || "attachment";

      if (mime.includes("pdf")) {
        try {
          const src = await PDFDocument.load(fetched.bytes, {
            ignoreEncryption: true,
          });
          const copied = await pdfDoc.copyPages(src, src.getPageIndices());
          for (const p of copied) pdfDoc.addPage(p);
          outcome = "merged";
          continue;
        } catch {
          const page = pdfDoc.addPage([612, 792]);
          addLinkPage(pdfDoc, page, fonts, slot.label, fileName, fetched.href);
          outcome = "linked";
          continue;
        }
      }

      if (mime.startsWith("image/")) {
        const embedded = await appendImagePage(
          pdfDoc,
          slot.label,
          fetched.bytes,
          mime,
          fonts
        );
        if (embedded) {
          outcome = "embedded";
          continue;
        }
      }

      const page = pdfDoc.addPage([612, 792]);
      addLinkPage(pdfDoc, page, fonts, slot.label, fileName, fetched.href);
      outcome = "linked";
    }
    results[slot.key] = outcome;
  }

  return results;
};

/** Build a full scholarship packet PDF (form pages + uploaded media). */
export const generateScholarshipPacketPdf = async (
  record: ScholarshipPacketRecord
): Promise<{
  blob: Blob;
  filename: string;
  media: Record<string, MediaEmbedResult>;
  fontFamily: PrintFonts["family"];
}> => {
  const pdfDoc = await PDFDocument.create();
  const fonts = await embedPrintFonts(pdfDoc);
  const model = buildScholarshipPrintModel(record);
  const filename = scholarshipPacketFilename(record);
  pdfDoc.setTitle(`ORWEF Scholarship Application — ${model.applicantName}`);
  pdfDoc.setAuthor(ORWEF_LEGAL_NAME);
  pdfDoc.setSubject(SCHOLARSHIP_TITLE);
  pdfDoc.setKeywords(["ORWEF", "Scholarship", model.cycleYear]);

  drawScholarshipApplicationForm(pdfDoc, fonts, model);
  const media = await appendScholarshipMedia(pdfDoc, record, fonts);
  drawLetterFooters(pdfDoc, fonts, model.applicantName, SCHOLARSHIP_FOOTER_AWARD);
  const bytes = await pdfDoc.save();
  return {
    blob: new Blob([new Uint8Array(bytes)], { type: "application/pdf" }),
    filename,
    media,
    fontFamily: fonts.family,
  };
};

export const printScholarshipPacket = async (
  record: ScholarshipPacketRecord
) => {
  const { blob, filename, media, fontFamily } = await generateScholarshipPacketPdf(
    record
  );
  downloadBlob(blob, filename);
  return { filename, media, byteLength: blob.size, fontFamily };
};
