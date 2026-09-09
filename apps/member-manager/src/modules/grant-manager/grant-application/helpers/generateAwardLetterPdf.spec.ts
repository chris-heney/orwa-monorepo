import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";
import { IGrantApplication } from "../GrantApplicationTypes";
import {
  AwardLetterDataError,
  buildAgreementBlocks,
  buildAwardLetterModel,
  generateAwardLetterDocument,
} from "./generateAwardLetterPdf";

// Shape mirrors a populated grant-application-final record (see Creek County
// RWD #1 / app 20362 in production).
const application = {
  legal_entity_name: "Creek County Rural Water District #1",
  application_id: 20362,
  county: "Creek",
  physical_address_state: "Oklahoma",
  chairman: { first: "Stanley", last: "Storer", title: "Chairman" },
  point_of_contact: { first: "Mitch", last: "Conley", title: "Manager" },
  signatory_name: "Mitch Conley ",
  signatory_title: "Manager ",
  award_amount: 100000,
  expected_utility_match: 46027,
  approved_project_cost: 146027,
  portion_matched_by_recipient: null,
} as unknown as IGrantApplication;

const textOf = (blocks: ReturnType<typeof buildAgreementBlocks>) =>
  blocks
    .map((block) => ("runs" in block ? block.runs.map((r) => r.text).join("") : ""))
    .join("\n");

describe("buildAwardLetterModel", () => {
  it("resolves every merge tag from the application record", () => {
    const model = buildAwardLetterModel(application);
    expect(model).toEqual({
      entityName: "Creek County Rural Water District #1",
      applicationId: "20362",
      chairmanName: "Stanley Storer",
      attestName: "Mitch Conley",
      attestTitle: "Manager",
      grantAmount: "$100,000",
      matchAmount: "$46,027",
      totalProjectCost: "$146,027",
    });
  });

  it("falls back to portion_matched_by_recipient and grant + match totals", () => {
    const model = buildAwardLetterModel({
      ...application,
      expected_utility_match: null,
      portion_matched_by_recipient: "25000",
      approved_project_cost: null,
    } as unknown as IGrantApplication);
    expect(model.matchAmount).toBe("$25,000");
    expect(model.totalProjectCost).toBe("$125,000");
  });

  it("derives the match from total − grant for legacy records that store 0", () => {
    // e.g. app 6340: award 40,000 / match 0 / total 50,000
    const model = buildAwardLetterModel({
      ...application,
      award_amount: 40000,
      expected_utility_match: 0,
      portion_matched_by_recipient: "0",
      approved_project_cost: 50000,
    } as unknown as IGrantApplication);
    expect(model.matchAmount).toBe("$10,000");
    expect(model.totalProjectCost).toBe("$50,000");
  });

  it("refuses when the match cannot be determined at all", () => {
    expect(() =>
      buildAwardLetterModel({
        ...application,
        expected_utility_match: 0,
        portion_matched_by_recipient: null,
        approved_project_cost: null,
      } as unknown as IGrantApplication)
    ).toThrow(/Expected Utility Match/);
  });

  it("lists every missing required field instead of printing blanks", () => {
    const attempt = () =>
      buildAwardLetterModel({
        ...application,
        chairman: null,
        award_amount: null,
        expected_utility_match: null,
      } as unknown as IGrantApplication);
    expect(attempt).toThrow(AwardLetterDataError);
    try {
      attempt();
    } catch (error) {
      expect((error as AwardLetterDataError).missing).toEqual([
        "Chairman",
        "Award Amount",
        "Expected Utility Match",
      ]);
    }
  });

  it("leaves attest name/title optional (handwritten at signing)", () => {
    const model = buildAwardLetterModel({
      ...application,
      signatory_name: null,
      signatory_title: undefined,
    } as unknown as IGrantApplication);
    expect(model.attestName).toBe("");
    expect(model.attestTitle).toBe("");
  });
});

describe("buildAgreementBlocks", () => {
  it("places resolved values where the source document has [tags]", () => {
    const text = textOf(buildAgreementBlocks(buildAwardLetterModel(application)));
    expect(text).toContain("RIG RECIPIENT\nCreek County Rural Water District #1");
    expect(text).toContain("between Creek County Rural Water District #1");
    expect(text).toContain(
      "I, Stanley Storer, duly authorized Chairman of the Creek County Rural Water District #1"
    );
    expect(text).toContain('"Application #20362,"');
    expect(text).toContain("shall not exceed $100,000.");
    expect(text).toContain("20% match requirement for this grant is $46,027.");
    expect(text).toContain("Grant Amount: $100,000");
    expect(text).toContain("Match Amount: $46,027");
    expect(text).toContain("Total Project Cost: $146,027");
    // No leftover bracket tags or the page footer from the source doc.
    expect(text).not.toMatch(/\[[^\]]+\]/);
    expect(text).not.toContain("RIG Agreement Page");
  });

  it("keeps the 13 numbered sections in order", () => {
    const titles = buildAgreementBlocks(buildAwardLetterModel(application))
      .flatMap((block) => ("runs" in block ? block.runs : []))
      .filter((run) => run.bold && /^\d+\. /.test(run.text))
      .map((run) => Number(run.text.split(".")[0]));
    expect(titles).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  });
});

describe("generateAwardLetterDocument", () => {
  it("renders the agreement on exactly one letter page", async () => {
    const { bytes, fontSize } = await generateAwardLetterDocument(application);
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(1);
    const { width, height } = doc.getPage(0).getSize();
    expect([width, height]).toEqual([612, 792]);
    // Legibility floor: the fit must not have to shrink below 8pt for a
    // typical record.
    expect(fontSize).toBeGreaterThanOrEqual(8);
  });

  it("still fits one page with a very long entity name and large amounts", async () => {
    const { bytes } = await generateAwardLetterDocument({
      ...application,
      legal_entity_name:
        "The Consolidated Rural Water, Sewer, Gas and Solid Waste Management District No. 12 of Pottawatomie County, Oklahoma",
      chairman: { first: "Bartholomew", last: "Featherstonehaugh-Montgomery" },
      signatory_name: "Alexandria Constantinopolous-Whitaker",
      signatory_title: "Office Manager / Bookkeeper / District Clerk-Treasurer",
      award_amount: 1000000,
      expected_utility_match: 11081897,
      approved_project_cost: 12081897,
    } as unknown as IGrantApplication);
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(1);
  });
});
