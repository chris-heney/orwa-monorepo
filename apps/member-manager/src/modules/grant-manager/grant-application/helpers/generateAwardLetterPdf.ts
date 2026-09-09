import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import { IGrantApplication } from "../GrantApplicationTypes";
import { formatNumber } from "../../../../helpers/Formators";

/**
 * RIG Agreement (the PDF attached to the "Grant Award Letter" email).
 *
 * Source text: ORWA "RIG AGREEMENT" (2026-27 revision). Bracketed merge tags in
 * that document resolve as follows — keep this table in sync with the text:
 *
 *   [Entity Name]               -> legal_entity_name
 *   [APP #]                     -> application_id
 *   [AMOUNT] / [Grant Amount]   -> award_amount
 *   [Match Amount]              -> expected_utility_match (fallbacks: portion_matched_by_recipient, total − grant)
 *   [Total Project Cost]        -> approved_project_cost (fallback: grant + match)
 *   "I, ____, duly authorized Chairman" / By: [Signer's Name] -> chairman.first + chairman.last
 *   Attest: [Person's Name]     -> signatory_name  (the applicant's signatory: manager / clerk)
 *   Title: [Title of Person Signing] -> signatory_title
 *
 * Layout constraint: the agreement must fit on ONE letter page (no footer).
 * The body font is shrunk in small steps until the whole document fits.
 */

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 40;
const LINE_HEIGHT_RATIO = 1.17;
/** Body font search range; the largest size that fits a single page wins. */
const MAX_FONT_SIZE = 11;
const MIN_FONT_SIZE = 7.5;
const FONT_SIZE_STEP = 0.1;

export class AwardLetterDataError extends Error {
  missing: string[];
  constructor(missing: string[]) {
    super(`Cannot generate RIG Agreement — missing: ${missing.join(", ")}`);
    this.name = "AwardLetterDataError";
    this.missing = missing;
  }
}

export interface AwardLetterModel {
  entityName: string;
  applicationId: string;
  chairmanName: string;
  attestName: string;
  attestTitle: string;
  grantAmount: string;
  matchAmount: string;
  totalProjectCost: string;
}

/** Dollar fields: null/blank/0/NaN all mean "not set". */
const toPositive = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
};

const fullName = (contact?: { first?: string; last?: string } | null) =>
  [contact?.first, contact?.last]
    .map((part) => (part ?? "").trim())
    .filter(Boolean)
    .join(" ");

/**
 * Resolve every merge tag the agreement needs. Throws AwardLetterDataError
 * listing the missing fields so the UI can tell the user what to fill in
 * instead of shipping an agreement with blanks where dollar amounts belong.
 */
export function buildAwardLetterModel(
  application: IGrantApplication
): AwardLetterModel {
  const missing: string[] = [];

  const entityName = (application.legal_entity_name ?? "").trim();
  if (!entityName) missing.push("Legal Entity Name");

  const applicationId =
    application.application_id !== undefined && application.application_id !== null
      ? String(application.application_id).trim()
      : "";
  if (!applicationId) missing.push("Application ID");

  const chairmanName = fullName(application.chairman);
  if (!chairmanName) missing.push("Chairman");

  const grant = toPositive(application.award_amount);
  if (grant === null) missing.push("Award Amount");

  const total = toPositive(application.approved_project_cost);

  // Match: same precedence the email template helper uses
  // (expected_utility_match, then portion_matched_by_recipient); legacy
  // records store 0 for both, so fall back to total − grant when available.
  const match =
    toPositive(application.expected_utility_match) ??
    toPositive(application.portion_matched_by_recipient) ??
    (grant !== null && total !== null && total > grant ? total - grant : null);
  if (match === null) missing.push("Expected Utility Match");

  if (missing.length > 0) throw new AwardLetterDataError(missing);

  const totalProjectCost = total ?? (grant as number) + (match as number);

  return {
    entityName,
    applicationId,
    chairmanName,
    attestName: (application.signatory_name ?? "").trim(),
    attestTitle: (application.signatory_title ?? "").trim(),
    grantAmount: formatNumber(grant),
    matchAmount: formatNumber(match),
    totalProjectCost: formatNumber(totalProjectCost),
  };
}

/* ------------------------------------------------------------------ */
/* Document text                                                       */
/* ------------------------------------------------------------------ */

type Run = { text: string; bold?: boolean };

type Block =
  | { kind: "center"; runs: Run[]; sizeDelta?: number }
  | { kind: "paragraph"; runs: Run[]; indent?: number }
  | { kind: "gap"; lines: number }
  | { kind: "signature" };

const b = (text: string): Run => ({ text, bold: true });
const t = (text: string): Run => ({ text });

const section = (n: number, title: string, body: string): Block => ({
  kind: "paragraph",
  runs: [b(`${n}. ${title}.`), t(` ${body}`)],
});

export function buildAgreementBlocks(m: AwardLetterModel): Block[] {
  return [
    { kind: "center", runs: [b("OKLAHOMA DEPARTMENT OF ENVIRONMENTAL QUALITY")], sizeDelta: 2 },
    { kind: "center", runs: [b("OKLAHOMA RURAL WATER ASSOCIATION")], sizeDelta: 2 },
    { kind: "gap", lines: 0.6 },
    { kind: "center", runs: [b("RIG RECIPIENT")], sizeDelta: 1 },
    { kind: "center", runs: [b(m.entityName)], sizeDelta: 1 },
    { kind: "gap", lines: 0.6 },
    { kind: "center", runs: [b("RIG AGREEMENT")], sizeDelta: 1 },
    { kind: "center", runs: [t(`between ${m.entityName}`)] },
    { kind: "center", runs: [t("and the Oklahoma Rural Water Association")] },
    { kind: "gap", lines: 0.8 },
    {
      kind: "paragraph",
      runs: [
        t(
          `I, ${m.chairmanName}, duly authorized Chairman of the ${m.entityName} (hereinafter "Applicant"), do hereby accept and acknowledge said grant according to the terms of this Rural Infrastructure Grant (hereinafter "RIG") Agreement. Receipt of the subject grant funds shall be acknowledged by separate receipt instrument at the time the same shall be received by an authorized representative of Applicant.`
        ),
      ],
    },
    section(
      1,
      "Administration and Review",
      `Funds disbursed under this Agreement are a grant that is administered by the Oklahoma Rural Water Association ("ORWA"). All disbursements under this Agreement are subject to review by a committee consisting of representatives of ORWA and representatives of the Oklahoma Department of Environmental Quality ("DEQ"), the committee referred to hereinafter as the "RIG Committee."`
    ),
    section(
      2,
      "Description of approved project",
      `This grant has been approved by the RIG Committee for the Applicant's project which is described in Applicant's approved Application attached hereto as "Application #${m.applicationId}," which is incorporated herein by reference. The Application, together with all related construction plans and appurtenances, are all hereinafter referred to collectively as the "Project." Costs authorized for the Project include construction labor pursuant to contract (except force account labor), construction materials, soil testing, engineering, and inspections (all hereinafter referred to collectively as "Project Costs").`
    ),
    section(
      3,
      "Grant Amount",
      `The amount of this grant shall not exceed ${m.grantAmount}.`
    ),
    section(
      4,
      "Twenty Percent Match Requirement",
      `This grant is intended to reimburse Applicant for 80% of the total Project Costs, said 80% not to exceed the Grant Amount. The Applicant shall pay at least 20% of the invoiced Project Costs for which the Applicant is seeking reimbursement. The Applicant must pay the 20% match requirement prior to any reimbursements being approved under this Agreement. The Applicant is responsible for paying all Project Costs exceeding the grant amount listed in paragraph 3 above. The Applicant acknowledges that the 20% match requirement for this grant is ${m.matchAmount}.`
    ),
    section(
      5,
      "Recapitulation of Estimated Project Costs",
      `The Applicant acknowledges the following concerning the total, estimated Project Costs under this Agreement:`
    ),
    { kind: "paragraph", indent: 36, runs: [t("Grant Amount: "), b(m.grantAmount)] },
    { kind: "paragraph", indent: 36, runs: [t("Match Amount: "), b(m.matchAmount)] },
    { kind: "paragraph", indent: 36, runs: [t("Total Project Cost: "), b(m.totalProjectCost)] },
    section(
      6,
      "Submission for Reimbursement",
      `Applicant shall maintain books, records, and supporting documentation (including invoices, billing statements, and canceled checks) sufficient to demonstrate to the satisfaction of ORWA the amounts and purposes of all Project Costs for which reimbursement is sought under this Agreement. All reimbursement requests shall be submitted to ORWA on the RIG Reimbursement Request Form attached hereto, together with copies of all invoices and proof of payment of said invoices attached to said Form. The Applicant shall permit ORWA to inspect invoiced Project Costs and all related construction and equipment on premises. For work that will be inaccessible upon completion (including buried infrastructure), the Applicant shall provide digital photographs documenting the work before it is buried. Any Project Costs lacking adequate supporting documentation and inspection shall be unauthorized and ineligible for reimbursement. Any questions as to whether an expenditure is authorized shall be directed to ORWA before the expenditure is incurred. Upon ORWA's review and approval of documentation of paid Project Costs, including payment of the Twenty Percent Match, ORWA shall request funds from DEQ and, upon receipt, disburse said funds to the Applicant. All funds reimbursed to the Applicant are governed by and subject to this Agreement.`
    ),
    section(
      7,
      "Compliance with State and Federal Law",
      `At all stages of the Project, the Applicant must comply with Oklahoma's Competitive Bidding Act, Open Meetings Act and Open Records Act, as well as DEQ rules and all other applicable State and Federal laws. Any Project Costs incurred in a manner not consistent with any State or Federal law are not subject to reimbursement under this Agreement.`
    ),
    section(
      8,
      "Audit",
      `After completion of the Project, the Applicant acknowledges that an audit of the grant expenditures will be performed, as well as an inspection of Project work.`
    ),
    section(
      9,
      "Additional Requirements",
      `If applicable, the following must be submitted by the Applicant to ORWA prior to reimbursement of any Project Costs:`
    ),
    { kind: "paragraph", indent: 36, runs: [t("1. A copy of the construction permit when issued by DEQ;")] },
    { kind: "paragraph", indent: 36, runs: [t("2. A copy of the engineering services contract;")] },
    { kind: "paragraph", indent: 36, runs: [t("3. A copy of the successful bidder's contract documents; and")] },
    { kind: "paragraph", indent: 36, runs: [t("4. A copy of the notice to proceed with construction.")] },
    {
      kind: "paragraph",
      runs: [
        t(
          "ORWA and DEQ Staff must be included in the pre-construction conference, and at the final inspection."
        ),
      ],
    },
    section(
      10,
      "Reimbursement of Funds",
      `All terms and conditions set forth in this Agreement are deemed material. If, at any time, it is determined by the RIG Committee that Applicant did not comply with the terms and conditions of this Agreement, including compliance with applicable State and Federal laws, then the Applicant will promptly reimburse all funds disbursed to Applicant under this Agreement.`
    ),
    section(
      11,
      "Attorney Fees",
      // The source document says "paragraph 9" here, which is a stale
      // cross-reference from an earlier numbering; Reimbursement of Funds is
      // paragraph 10 in this revision.
      `In the event that any legal proceedings or expenses of any kind or nature are required in order to obtain reimbursement of funds under paragraph 10, then the Applicant shall be liable in damages for all reasonable attorney's fees and expenses incurred in the enforcement of paragraph 10.`
    ),
    section(
      12,
      "Severability",
      `Every provision of this Agreement is intended to be severable. If any term or provision hereof is determined to be illegal or invalid for any reason whatsoever, such illegality or invalidity shall not affect the validity of the remainder of this Agreement.`
    ),
    section(
      13,
      "Governing Law",
      `This Agreement shall be governed by, construed and enforced in accordance with the laws of the State of Oklahoma.`
    ),
    {
      kind: "paragraph",
      runs: [
        t(
          "In consideration of the Applicant's agreement to the terms and conditions set forth herein, Applicant has entered into and signed this Agreement this ______ day of _______________, 20_____."
        ),
      ],
    },
    { kind: "signature" },
  ];
}

/* ------------------------------------------------------------------ */
/* Layout engine                                                       */
/* ------------------------------------------------------------------ */

interface Fonts {
  regular: PDFFont;
  bold: PDFFont;
}

interface PositionedRun {
  text: string;
  font: PDFFont;
  x: number;
  width: number;
}

/**
 * Advance width WITHOUT kerning. pdf-lib's `widthOfTextAtSize` applies the
 * font's kerning pairs, but `drawText` positions glyphs by plain advance
 * widths, so kerned measurements under-report the drawn width of words like
 * "ORWA" / "WATER" and the following space collapses. Summing per-glyph
 * widths matches what the viewer actually draws.
 */
function measure(font: PDFFont, text: string, size: number): number {
  let width = 0;
  for (const ch of text) width += font.widthOfTextAtSize(ch, size);
  return width;
}

/**
 * Word-wrap mixed regular/bold runs into lines. Consecutive words in the same
 * font are coalesced into a single positioned run so each line is drawn with
 * as few `drawText` calls as possible and spaces come from the font itself.
 */
function wrapRuns(
  runs: Run[],
  fonts: Fonts,
  size: number,
  maxWidth: number
): PositionedRun[][] {
  const lines: PositionedRun[][] = [];
  let current: PositionedRun[] = [];
  let cursor = 0;
  const space = measure(fonts.regular, " ", size);

  const flush = () => {
    lines.push(current);
    current = [];
    cursor = 0;
  };

  runs.forEach((run) => {
    const font = run.bold ? fonts.bold : fonts.regular;
    const words = run.text.split(/\s+/).filter(Boolean);
    words.forEach((word) => {
      const width = measure(font, word, size);
      const advance = (cursor > 0 ? space : 0) + width;
      if (cursor + advance > maxWidth && cursor > 0) flush();

      const last = current[current.length - 1];
      if (last && last.font === font) {
        last.text += ` ${word}`;
        last.width += space + width;
        cursor = last.x + last.width;
      } else {
        const x = cursor === 0 ? 0 : cursor + space;
        current.push({ text: word, font, x, width });
        cursor = x + width;
      }
    });
  });

  if (current.length > 0) flush();
  return lines;
}

interface DrawText {
  kind: "text";
  text: string;
  font: PDFFont;
  size: number;
  x: number;
  y: number;
}
interface DrawLine {
  kind: "line";
  x1: number;
  x2: number;
  y: number;
}
type DrawOp = DrawText | DrawLine;

interface Layout {
  ops: DrawOp[];
  bottomY: number;
}

function layoutAgreement(
  blocks: Block[],
  model: AwardLetterModel,
  fonts: Fonts,
  size: number
): Layout {
  const ops: DrawOp[] = [];
  const lineHeight = size * LINE_HEIGHT_RATIO;
  const paragraphGap = size * 0.45;
  const contentWidth = PAGE_WIDTH - MARGIN * 2;
  let y = PAGE_HEIGHT - MARGIN - size;

  const drawLines = (
    lines: PositionedRun[][],
    fontSize: number,
    xOffset: number,
    center: boolean,
    lh: number
  ) => {
    lines.forEach((line) => {
      let shift = xOffset;
      if (center) {
        const last = line[line.length - 1];
        const lineWidth = last.x + last.width;
        shift = MARGIN + (contentWidth - lineWidth) / 2;
      }
      line.forEach((run) => {
        ops.push({ kind: "text", text: run.text, font: run.font, size: fontSize, x: shift + run.x, y });
      });
      y -= lh;
    });
  };

  blocks.forEach((block) => {
    switch (block.kind) {
      case "gap":
        y -= lineHeight * block.lines;
        break;
      case "center": {
        const fs = size + (block.sizeDelta ?? 0);
        const lines = wrapRuns(block.runs, fonts, fs, contentWidth);
        drawLines(lines, fs, MARGIN, true, fs * LINE_HEIGHT_RATIO);
        break;
      }
      case "paragraph": {
        const indent = block.indent ?? 0;
        const lines = wrapRuns(block.runs, fonts, size, contentWidth - indent);
        drawLines(lines, size, MARGIN + indent, false, lineHeight);
        if (!indent) y -= paragraphGap;
        break;
      }
      case "signature": {
        y -= lineHeight * 0.8;
        const leftX = MARGIN;
        const rightX = MARGIN + contentWidth / 2 + 10;
        const lineW = contentWidth / 2 - 40;
        const labelW = (label: string) => measure(fonts.regular, label, size);

        // Row 1: Attest signature line (left) and Chairman signature line (right)
        y -= lineHeight;
        ops.push({ kind: "text", text: "Attest:", font: fonts.regular, size, x: leftX, y });
        ops.push({ kind: "line", x1: leftX + labelW("Attest: "), x2: leftX + labelW("Attest: ") + lineW, y: y - 2 });
        ops.push({ kind: "line", x1: rightX, x2: rightX + lineW + labelW("By: "), y: y - 2 });

        // Row 2: typed names under the lines
        y -= lineHeight;
        if (model.attestName) {
          ops.push({ kind: "text", text: model.attestName, font: fonts.regular, size, x: leftX + labelW("Attest: "), y });
        }
        ops.push({ kind: "text", text: `By: ${model.chairmanName}`, font: fonts.regular, size, x: rightX, y });

        // Row 3: attesting person's title
        y -= lineHeight;
        ops.push({ kind: "text", text: `Title: ${model.attestTitle || "____________________"}`, font: fonts.regular, size, x: leftX, y });

        // Row 4: seal
        y -= lineHeight * 1.4;
        ops.push({ kind: "text", text: "(BOARD SEAL)", font: fonts.regular, size, x: leftX, y });
        break;
      }
    }
  });

  return { ops, bottomY: y };
}

function render(page: PDFPage, layout: Layout) {
  layout.ops.forEach((op) => {
    if (op.kind === "text") {
      page.drawText(op.text, { x: op.x, y: op.y, size: op.size, font: op.font });
    } else {
      page.drawLine({
        start: { x: op.x1, y: op.y },
        end: { x: op.x2, y: op.y },
        thickness: 0.8,
        color: rgb(0, 0, 0),
      });
    }
  });
}

export interface GenerateAwardLetterResult {
  bytes: Uint8Array;
  /** Body font size the one-page fit settled on (for diagnostics/tests). */
  fontSize: number;
}

export async function generateAwardLetterDocument(
  application: IGrantApplication
): Promise<GenerateAwardLetterResult> {
  const model = buildAwardLetterModel(application);
  const blocks = buildAgreementBlocks(model);

  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(`RIG Agreement — ${model.entityName}`);
  const fonts: Fonts = {
    regular: await pdfDoc.embedFont(StandardFonts.TimesRoman),
    bold: await pdfDoc.embedFont(StandardFonts.TimesRomanBold),
  };

  let chosen: { layout: Layout; size: number } | null = null;
  for (let size = MAX_FONT_SIZE; size >= MIN_FONT_SIZE - 1e-6; size -= FONT_SIZE_STEP) {
    const rounded = Math.round(size * 10) / 10;
    const layout = layoutAgreement(blocks, model, fonts, rounded);
    if (layout.bottomY >= MARGIN) {
      chosen = { layout, size: rounded };
      break;
    }
  }

  if (!chosen) {
    throw new Error(
      "RIG Agreement does not fit on a single page even at the smallest font size."
    );
  }

  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  render(page, chosen.layout);

  return { bytes: await pdfDoc.save(), fontSize: chosen.size };
}

/** Backwards-compatible entry point: returns the PDF bytes. */
export async function generateAwardLetter(
  application: IGrantApplication
): Promise<Uint8Array> {
  try {
    const { bytes } = await generateAwardLetterDocument(application);
    return bytes;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}
