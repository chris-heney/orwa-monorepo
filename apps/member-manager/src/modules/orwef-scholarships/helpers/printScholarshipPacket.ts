import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
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
import { scholarshipPacketFilename } from "./scholarshipPacketFilename";

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
  const token = CookieStore.getCookie("token");
  if (token) return { Authorization: `Bearer ${token}` };
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

const wrapLines = (text: string, font: PDFFont, size: number, maxWidth: number) => {
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

const drawCoverPage = async (
  pdfDoc: PDFDocument,
  record: ScholarshipPacketRecord
) => {
  const regular = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  let page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const margin = 50;
  const size = 11;
  const line = 16;
  const maxWidth = width - margin * 2;
  let y = height - margin;

  const ensureSpace = (needed = line) => {
    if (y - needed < margin) {
      page = pdfDoc.addPage();
      y = height - margin;
    }
  };

  const write = (text: string, options: { header?: boolean } = {}) => {
    const font = options.header ? bold : regular;
    const fontSize = options.header ? 13 : size;
    const lines = wrapLines(text, font, fontSize, maxWidth);
    for (const row of lines) {
      ensureSpace(fontSize + 6);
      page.drawText(row, {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      y -= options.header ? line + 4 : line;
    }
  };

  const field = (label: string, value: unknown) => {
    write(`${label}: ${display(value)}`);
  };

  page.drawText("Oklahoma Rural Water Foundation", {
    x: margin,
    y,
    size: 12,
    font: bold,
    color: rgb(0.07, 0.35, 0.55),
  });
  y -= 18;
  page.drawText("ORWEF Scholarship Application", {
    x: margin,
    y,
    size: 18,
    font: bold,
  });
  y -= 22;
  page.drawText(
    `Submitted ${
      asDateString(record.submission_date) ||
      asDateString(record.createdAt) ||
      "—"
    }`,
    { x: margin, y, size, font: regular }
  );
  y -= 28;

  write("Personal Data", { header: true });
  field(
    "Name",
    [
      record.applicant_first_name,
      record.applicant_middle_name,
      record.applicant_last_name,
    ]
      .filter(Boolean)
      .join(" ")
  );
  field("Email", record.applicant_email);
  field("Phone", record.applicant_phone);
  field(
    "Address",
    [
      record.applicant_street,
      [record.applicant_city, record.applicant_state].filter(Boolean).join(", "),
      record.applicant_zip,
    ]
      .filter(Boolean)
      .join(", ")
  );

  write("Eligibility Criteria", { header: true });
  field("Water system", record.system_name);
  field(
    "Relationship",
    record.relationship
      ? RELATIONSHIP_LABELS[record.relationship] || record.relationship
      : null
  );
  field(
    "Eligible participant",
    formatPersonName(record.eligible_participant_name)
  );
  field("Title", record.eligible_participant_title);
  field("Participant email", record.eligible_participant_email);
  field("Participant phone", record.eligible_participant_phone);
  field(
    "Participant address",
    formatAddress(record.eligible_participant_address)
  );

  write("High School Data", { header: true });
  field("School", record.school_name);
  field("Graduation date", asDateString(record.graduation_date));
  field("School address", formatAddress(record.school_address));
  field("GPA", record.gpa);
  field("SAT", record.sat_score);
  field("ACT", record.act_score);

  write("College / University Data", { header: true });
  field("First year", record.first_year);
  field(
    "Education type",
    record.education_type
      ? EDUCATION_LABELS[record.education_type] || record.education_type
      : null
  );
  field("Credits completed", record.credits_completed);
  field("Credits required", record.credits_required);
  field("College GPA", record.college_gpa);
  field("Major", record.major);

  write("Awards and Recognition", { header: true });
  if (record.awards) {
    String(record.awards)
      .split("\n")
      .forEach((row) => write(row || " "));
  } else {
    field("Awards", null);
  }

  write("Letters of Recommendation", { header: true });
  field("Recommender 1", formatPersonName(record.recommender1_name));
  field("Recommender 1 email", record.recommender1_email);
  field("Recommender 1 phone", record.recommender1_phone);
  field("Recommender 2", formatPersonName(record.recommender2_name));
  field("Recommender 2 email", record.recommender2_email);
  field("Recommender 2 phone", record.recommender2_phone);

  write("Financial Data", { header: true });
  const financialResources = listFinancialResources(record);
  if (financialResources.length === 0) {
    field("Financial aid", null);
  } else {
    financialResources.forEach((row, index) => {
      field(`Aid ${index + 1} institution`, row.institution);
      field(`Aid ${index + 1} amount`, formatMoney(row.amount));
    });
  }

  write("Certification", { header: true });
  field("Age confirmation", record.age_confirm);
  field("Applicant certified", record.applicant_certification);
  field(
    "Certification date",
    asDateString(record.applicant_certification_date)
  );
  field("Guardian", formatPersonName(record.guardian_name));
  field("Guardian certified", record.guardian_certification);
  field(
    "Guardian certification date",
    asDateString(record.guardian_certification_date)
  );

  write("Attached Documents", { header: true });
  for (const slot of SCHOLARSHIP_MEDIA_SLOTS) {
    const items = asMediaItems(
      record[slot.key] as ScholarshipMediaFile | ScholarshipMediaFile[] | undefined
    );
    field(
      slot.label,
      items.length === 0
        ? null
        : items.map((item) => item.name || "Attachment").join(", ")
    );
  }
};

const addLinkPage = (
  pdfDoc: PDFDocument,
  page: PDFPage,
  fonts: { regular: PDFFont; bold: PDFFont },
  label: string,
  fileName: string,
  href: string
) => {
  const { width, height } = page.getSize();
  const margin = 50;
  let y = height - margin;
  page.drawText(label, {
    x: margin,
    y,
    size: 14,
    font: fonts.bold,
  });
  y -= 24;
  page.drawText(`File: ${fileName.slice(0, 90)}`, {
    x: margin,
    y,
    size: 11,
    font: fonts.regular,
  });
  y -= 18;
  page.drawText(
    "This file type cannot be embedded. Open it in Media Library or via:",
    {
      x: margin,
      y,
      size: 11,
      font: fonts.regular,
    }
  );
  y -= 18;
  const linkLines = wrapLines(href, fonts.regular, 9, width - margin * 2);
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
  fonts: { regular: PDFFont; bold: PDFFont }
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

  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const margin = 40;
  page.drawText(label, {
    x: margin,
    y: height - margin,
    size: 12,
    font: fonts.bold,
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
  record: ScholarshipPacketRecord
): Promise<Record<string, MediaEmbedResult>> => {
  const regular = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fonts = { regular, bold };
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
          const page = pdfDoc.addPage();
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

      const page = pdfDoc.addPage();
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
): Promise<{ blob: Blob; filename: string; media: Record<string, MediaEmbedResult> }> => {
  const pdfDoc = await PDFDocument.create();
  await drawCoverPage(pdfDoc, record);
  const media = await appendScholarshipMedia(pdfDoc, record);
  const bytes = await pdfDoc.save();
  return {
    blob: new Blob([new Uint8Array(bytes)], { type: "application/pdf" }),
    filename: scholarshipPacketFilename(record),
    media,
  };
};

export const printScholarshipPacket = async (
  record: ScholarshipPacketRecord
) => {
  const { blob, filename, media } = await generateScholarshipPacketPdf(record);
  downloadBlob(blob, filename);
  return { filename, media, byteLength: blob.size };
};
