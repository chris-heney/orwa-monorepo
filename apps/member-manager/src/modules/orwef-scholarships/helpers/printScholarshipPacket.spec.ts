import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument } from "pdf-lib";
import { setPrintFontLoader } from "../../../helpers/printBrandFonts";
import { extractPdfPlainText } from "../../award-nominations/helpers/documentText";
import {
  SCHOLARSHIP_MEDIA_SLOTS,
  buildScholarshipPrintModel,
  generateScholarshipPacketPdf,
  orderScholarshipAttachments,
  scholarshipPacketYear,
  type ScholarshipPacketRecord,
} from "./printScholarshipPacket";

const here = dirname(fileURLToPath(import.meta.url));
const tmpDir = resolve(here, "../../../../../../tmp");

// Node's fetch rejects file: URLs; read the vendored Liberation Sans TTFs from disk.
beforeAll(() =>
  setPrintFontLoader(async (url) => new Uint8Array(await readFile(fileURLToPath(url))))
);
afterAll(() => setPrintFontLoader());

// 1x1 opaque PNG.
const PNG_1X1 = Uint8Array.from(
  Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==",
    "base64"
  )
);

const makePdf = async (text: string) => {
  const doc = await PDFDocument.create();
  doc.addPage([400, 300]).drawText(text, { x: 40, y: 200, size: 18 });
  return doc.save();
};

const sampleRecord = (): ScholarshipPacketRecord => ({
  applicant_first_name: "Jordan",
  applicant_middle_name: "Lee",
  applicant_last_name: "Harper",
  applicant_email: "jordan.harper@example.com",
  applicant_phone: "(918) 555-0142",
  applicant_street: "214 Oak Street",
  applicant_city: "Afton",
  applicant_state: "OK",
  applicant_zip: "74331",
  submission_date: "2026-08-19",
  system_name: "Afton PWA",
  relationship: "Self",
  eligible_participant_name: { first: "Jordan", last: "Harper" },
  eligible_participant_title: "Operator",
  eligible_participant_email: "jordan.harper@example.com",
  eligible_participant_phone: "(918) 555-0142",
  eligible_participant_address: {
    street: "214 Oak Street",
    city: "Afton",
    state: "OK",
    zip: "74331",
  },
  school_name: "Afton High School",
  graduation_date: "2025-05-16",
  school_address: {
    street: "100 School Road",
    city: "Afton",
    state: "OK",
    zip: "74331",
  },
  gpa: 3.41,
  sat_score: 1057,
  act_score: 25,
  first_year: "Yes",
  education_type: "FourYearCollege",
  credits_completed: 12,
  credits_required: 120,
  college_gpa: 3.6,
  major: "Environmental Engineering",
  awards: "National Honor Society. Regional science fair finalist.",
  recommender1_name: { first: "Pat", last: "Nguyen" },
  recommender1_email: "pat.nguyen@example.com",
  recommender1_phone: "(918) 555-0190",
  recommender2_name: { first: "Riley", last: "Brooks" },
  recommender2_email: "riley.brooks@example.com",
  recommender2_phone: "(918) 555-0191",
  financial_resources: [{ institution: "ORWEF", amount: 1500 }],
  age_confirm: "Yes",
  applicant_certification: true,
  applicant_certification_date: "2026-08-19",
});

const withUploads = (): ScholarshipPacketRecord => ({
  ...sampleRecord(),
  // Deliberately out of form order to prove the slot order wins.
  photograph: { url: "/uploads/photo.png", name: "photo.png", mime: "image/png" },
  biography: { url: "/uploads/bio.pdf", name: "bio.pdf", mime: "application/pdf" },
  transcript: { url: "/uploads/transcript.pdf", name: "transcript.pdf", mime: "application/pdf" },
  essay: { url: "/uploads/essay.pdf", name: "essay.pdf", mime: "application/pdf" },
  applicant_pdf: { url: "/uploads/system.pdf", name: "harper_application.pdf", mime: "application/pdf" },
});

describe("buildScholarshipPrintModel", () => {
  it("uses contact cards instead of Recommender 1 email labels", () => {
    const model = buildScholarshipPrintModel(sampleRecord());
    const labels = model.cards.flatMap((card) =>
      card.fields.filter((field) => field.kind === "kv").map((field) => field.label)
    );
    expect(labels.join(" ")).not.toMatch(/Recommender 1 email/i);
    expect(model.cards.some((card) => card.title === "Recommender 1")).toBe(true);
    expect(model.applicantName).toBe("Jordan Lee Harper");
  });

  it("prints the stamped scholarship_year when present", () => {
    expect(buildScholarshipPrintModel({ ...sampleRecord(), scholarship_year: 2027 }).year).toBe("2027");
    expect(buildScholarshipPrintModel({ ...sampleRecord(), scholarship_year: "2028" }).year).toBe("2028");
    expect(scholarshipPacketYear({ scholarship_year: 2027, submission_date: "2026-10-15" })).toBe("2027");
  });

  it("falls back to the cycle year of the submission for legacy rows (May rollover)", () => {
    // Aug 19 2026 → next conference is 2027.
    expect(buildScholarshipPrintModel(sampleRecord()).year).toBe("2027");
    expect(scholarshipPacketYear({ scholarship_year: null, submission_date: "2026-08-19" })).toBe("2027");
    // Jan–Apr stay in the same calendar year.
    expect(
      buildScholarshipPrintModel({ ...sampleRecord(), submission_date: null, createdAt: "2027-01-05T10:00:00.000Z" }).year
    ).toBe("2027");
    expect(scholarshipPacketYear({ submission_date: "2026-04-30" })).toBe("2026");
    expect(scholarshipPacketYear({ submission_date: "2026-05-01" })).toBe("2027");
  });

  it("indexes attachments in public-form order and leaves the system PDF out", () => {
    const model = buildScholarshipPrintModel(withUploads());
    const card = model.cards.find((item) => item.title.startsWith("Attached Documents"));
    expect(card?.title).toBe("Attached Documents (4)");
    const values = (card?.fields || []).map((field) => (field.kind === "kv" ? `${field.label}: ${field.value}` : ""));
    expect(values).toEqual([
      "Attachment 1: High School Transcript  ·  transcript.pdf (PDF)",
      "Attachment 2: Essay  ·  essay.pdf (PDF)",
      "Attachment 3: Biography  ·  bio.pdf (PDF)",
      "Attachment 4: Photograph  ·  photo.png (PNG image)",
    ]);
    expect(values.join(" ")).not.toMatch(/harper_application/);
  });
});

describe("orderScholarshipAttachments", () => {
  it("matches the upload steps of apps/scholarship-application", () => {
    expect(SCHOLARSHIP_MEDIA_SLOTS.map((slot) => slot.key)).toEqual([
      "transcript",
      "test_scores",
      "recommendation_letter_1",
      "recommendation_letter_2",
      "essay",
      "biography",
      "photograph",
      "applicant_pdf",
    ]);
    expect(SCHOLARSHIP_MEDIA_SLOTS.filter((slot) => slot.system).map((slot) => slot.key)).toEqual([
      "applicant_pdf",
    ]);
    const ordered = orderScholarshipAttachments(withUploads());
    expect(ordered.map((item) => item.key)).toEqual(["transcript", "essay", "biography", "photograph"]);
    const withSystem = orderScholarshipAttachments(withUploads(), { includeSubmissionPdf: true });
    expect(withSystem.map((item) => item.key)).toContain("applicant_pdf");
  });
});

describe("generateScholarshipPacketPdf", () => {
  it("builds a branded letter packet with Enrichment, sans fonts, and a footer", async () => {
    const { blob, filename, fontFamily } = await generateScholarshipPacketPdf(
      sampleRecord()
    );
    expect(filename).toBe("ORWEF-Scholarship-Harper-2027-2028.pdf");
    expect(fontFamily).toBe("Liberation Sans");

    const bytes = new Uint8Array(await blob.arrayBuffer());
    const loaded = await PDFDocument.load(bytes);
    expect(loaded.getPageCount()).toBe(1);
    expect(loaded.getAuthor()).toBe("Oklahoma Rural Water Enrichment Foundation");
    const page = loaded.getPage(0);
    expect(page.getSize().width).toBe(612);
    expect(page.getSize().height).toBe(792);

    const text = await extractPdfPlainText(bytes);
    if (text) {
      expect(text).toMatch(/ENRICHMENT FOUNDATION|Scholarship Application/);
      expect(text).toMatch(/Page 1 of/);
      expect(text).not.toMatch(/Recommender 1 email/i);
      expect(text).not.toMatch(/Aid 1 institution/i);
    }
    expect(loaded.getTitle()).toContain("Jordan Lee Harper");
    expect(loaded.getKeywords()).toContain("2027");

    await mkdir(tmpDir, { recursive: true });
    await writeFile(resolve(tmpDir, "orwef-scholarship-harper-2026.pdf"), Buffer.from(bytes));
  });

  it("prints the form once, then uploads in submission order, never the system PDF", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    // Helvetica so the page text can be read back by extractPdfPlainText.
    setPrintFontLoader(async () => {
      throw new Error("spec: Helvetica fallback");
    });
    const bytesByName: Record<string, Uint8Array> = {
      "photo.png": PNG_1X1,
      "bio.pdf": await makePdf("Biography upload"),
      "transcript.pdf": await makePdf("Transcript upload"),
      "essay.pdf": await makePdf("Essay upload"),
      "harper_application.pdf": await makePdf("SYSTEM GENERATED COPY"),
    };
    const fetched: string[] = [];
    const { blob, media, attachments } = await generateScholarshipPacketPdf(withUploads(), {
      fetchBytes: async (file) => {
        fetched.push(String(file.name));
        return bytesByName[String(file.name)] ?? null;
      },
    });

    expect(attachments.map((item) => item.attachment.key)).toEqual([
      "transcript",
      "essay",
      "biography",
      "photograph",
    ]);
    expect(media).toEqual({
      transcript: "merged",
      test_scores: "skipped",
      recommendation_letter_1: "skipped",
      recommendation_letter_2: "skipped",
      essay: "merged",
      biography: "merged",
      photograph: "embedded",
    });
    expect(media).not.toHaveProperty("applicant_pdf");
    expect(fetched).not.toContain("harper_application.pdf");

    const bytes = new Uint8Array(await blob.arrayBuffer());
    const loaded = await PDFDocument.load(bytes);
    // 1 form page + 4 attachment pages, all letter.
    expect(loaded.getPageCount()).toBe(5);
    expect(loaded.getPages().every((page) => page.getSize().width === 612)).toBe(true);

    const text = await extractPdfPlainText(bytes);
    // submission_date 2026-08-19 → 2027 conference cycle.
    expect(text).toMatch(/Year: 2027/);
    expect(text).not.toMatch(/Year: 2026/);
    expect(text).not.toMatch(/Cycle 202/);
    expect(text).not.toMatch(/SYSTEM GENERATED COPY/);
    // The form appears exactly once.
    expect(text.match(/Personal Data/g)?.length).toBe(1);
    // Embedded PDF pages live in Form XObjects (not page streams), so check the dividers.
    const order = [1, 2, 3, 4].map((n) => text.indexOf(`Attachment ${n} of 4`));
    expect(order.every((pos) => pos >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    expect(text).toMatch(/Attachment 1 of 4\s+[·-]\s+High School Transcript/);

    await mkdir(tmpDir, { recursive: true });
    await writeFile(resolve(tmpDir, "orwef-scholarship-harper-2026-with-uploads.pdf"), Buffer.from(bytes));
    setPrintFontLoader(async (url) => new Uint8Array(await readFile(fileURLToPath(url))));
  });
});
