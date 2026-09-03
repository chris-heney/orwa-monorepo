import { describe, expect, it } from "vitest";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument } from "pdf-lib";
import { extractPdfPlainText } from "../../award-nominations/helpers/documentText";
import {
  buildScholarshipPrintModel,
  generateScholarshipPacketPdf,
  type ScholarshipPacketRecord,
} from "./printScholarshipPacket";

const here = dirname(fileURLToPath(import.meta.url));
const tmpDir = resolve(here, "../../../../../../tmp");

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
});

describe("generateScholarshipPacketPdf", () => {
  it("builds a branded letter packet with Enrichment, sans fonts, and a footer", async () => {
    const { blob, filename, fontFamily } = await generateScholarshipPacketPdf(
      sampleRecord()
    );
    expect(filename).toBe("ORWEF-Scholarship-Harper-2026.pdf");
    expect(["Arial", "Helvetica"]).toContain(fontFamily);

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

    await mkdir(tmpDir, { recursive: true });
    await writeFile(resolve(tmpDir, "orwef-scholarship-harper-2026.pdf"), Buffer.from(bytes));
  });
});
