import { describe, expect, it } from "vitest";
import { PDFArray, PDFDocument, PDFRawStream, decodePDFRawStream } from "pdf-lib";
import {
  applicantPdfFileName,
  applicationToPdfInput,
  renderApplicantPdf,
  selectScoringCriteria,
} from "./index";

const SCORINGS = [
  { order: "1.1", label: "Water Lines", project_type: { id: 18, classification: "Drinking Water" } },
  { order: "1.2", label: "Storage", project_type: { id: 19, classification: "Drinking Water" } },
  { order: "2.1", label: "Lagoon", project_type: { data: { id: 30, classification: "Wastewater" } } },
];

const APPLICATION = {
  id: 20404,
  application_id: "20404",
  application_date: "2026-08-26",
  legal_entity_name: "Taft Public Works Authority",
  facility_id: "OK3005118",
  county: "Muskogee",
  population_served: 250,
  physical_address_street: "1 Main",
  physical_address_city: "Taft",
  physical_address_state: "Oklahoma",
  physical_address_zip: "74463",
  point_of_contact: { first: "Kim", last: "Lee", email: "klee@taftok.gov", phone: "(918) 683-2203" },
  chairman: { first: "Elsie", last: "Ceasar" },
  additional_contacts: [{ first: "D", last: "Culton", email: "dculton@taftok.gov" }],
  has_engineer: false,
  change_order_request: "No",
  drinking_or_wastewater: "Drinking Water",
  selected_projects: [{ id: 18 }],
  engineering_report: "No",
  report_approved_by_deq: "No",
  resolves_violation: "No",
  satisfy_deq_issued_order: false,
  money_set_aside: true,
  applied_to_other_loans: false,
  project_costs: [{ project_type_id: 18, name: "Financial Auditing", amount: 25850 }],
  combined_cost_of_projects: "25900",
  description_justification_estimated_cost: "Line one\nLine two",
  signatory_name: "Kim Lee",
  signatory_title: "Clerk",
  signature: null,
};

const pdfText = async (bytes: Uint8Array) => {
  // pdf-lib does not extract text; decode the (flate) page content streams —
  // standard-font text is kept as literal strings in parentheses.
  const doc = await PDFDocument.load(bytes);
  expect(doc.getPageCount()).toBeGreaterThanOrEqual(1);
  const chunks: string[] = [];
  for (const page of doc.getPages()) {
    const contents = page.node.Contents();
    const streams =
      contents instanceof PDFArray
        ? contents.asArray().map((ref) => doc.context.lookup(ref))
        : [contents];
    for (const stream of streams) {
      if (stream instanceof PDFRawStream) {
        chunks.push(Buffer.from(decodePDFRawStream(stream).decode()).toString("latin1"));
      }
    }
  }
  // Text operands are hex strings: `<4170…> Tj`
  return chunks
    .join("\n")
    .replace(/<([0-9A-Fa-f]+)>\s*Tj/g, (_, hex) => Buffer.from(hex, "hex").toString("latin1"));
};

describe("selectScoringCriteria", () => {
  it("filters by classification and checks selected ids (v4 + v5 shapes)", () => {
    expect(selectScoringCriteria(["18"], SCORINGS, "Drinking Water")).toEqual([
      ["1.1", "Water Lines", true],
      ["1.2", "Storage", false],
    ]);
    expect(selectScoringCriteria([{ id: 30 }], SCORINGS, "Wastewater")).toEqual([
      ["2.1", "Lagoon", true],
    ]);
  });
});

describe("applicationToPdfInput", () => {
  it("uses application_id and application_date from the record", () => {
    const input = applicationToPdfInput(APPLICATION, SCORINGS);
    expect(input.applicationNumber).toBe("20404");
    expect(input.applicationDate).toBe("2026-08-26");
    expect(input.scoringCriteria).toEqual([
      ["1.1", "Water Lines", true],
      ["1.2", "Storage", false],
    ]);
    expect(input.projectStatus.moneySetAside).toBe(true);
    expect(input.combinedCostOfProjects).toBe(25900);
  });
});

describe("renderApplicantPdf", () => {
  it("stamps the application number and the application date, not today", async () => {
    const bytes = await renderApplicantPdf(applicationToPdfInput(APPLICATION, SCORINGS));
    const raw = await pdfText(bytes);
    expect(raw).toContain("Application # 20404");
    expect(raw).toContain("Date Received: August 26, 2026");
    expect(raw).toContain("8/26/2026");
    expect(raw).not.toContain(new Date().toLocaleDateString("en-US"));
  });

  it("stamps a Revised line only when revisedDate is given", async () => {
    const today = new Date().toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const revised = await pdfText(
      await renderApplicantPdf({
        ...applicationToPdfInput(APPLICATION, SCORINGS),
        revisedDate: new Date(),
      })
    );
    expect(revised).toContain(`Revised: ${today}`);
    expect(revised).toContain("Date Received: August 26, 2026");

    const plain = await pdfText(await renderApplicantPdf(applicationToPdfInput(APPLICATION, SCORINGS)));
    expect(plain).not.toContain("Revised:");
  });

  it("renders without a signature image and with a PNG data URL", async () => {
    const noSig = await renderApplicantPdf(applicationToPdfInput(APPLICATION, SCORINGS));
    expect(noSig.byteLength).toBeGreaterThan(1000);

    const png = await PDFDocument.create();
    // 1x1 transparent PNG
    const dataUrl =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
    expect(() => png.embedPng(dataUrl)).not.toThrow();
    const withSig = await renderApplicantPdf(
      applicationToPdfInput({ ...APPLICATION, signature: dataUrl }, SCORINGS)
    );
    expect(withSig.byteLength).toBeGreaterThan(noSig.byteLength);
  });

  it("names the file after the legal entity", () => {
    expect(applicantPdfFileName("Taft Public Works Authority")).toBe(
      "Taft Public Works Authority-application.pdf"
    );
  });
});
