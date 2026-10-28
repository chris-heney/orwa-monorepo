import { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts } from "pdf-lib";
import { ApplicantPdfContact, ApplicantPdfInput } from "./types";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const money = (value: number | string | null | undefined) =>
  currency.format(Number(value) || 0).replace(/\.00$/, "");

const asDate = (value: Date | string | null | undefined): Date => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "string" && value) {
    // Date-only strings ("2026-08-26") parse as UTC midnight; pin to noon so
    // the printed day does not slip in US timezones.
    const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00` : value);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
};

const longDate = (d: Date) =>
  d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });

const shortDate = (d: Date) => d.toLocaleDateString("en-US");

const contactLine = (c: ApplicantPdfContact | null | undefined) =>
  [
    `${c?.first ?? ""} ${c?.last ?? ""}`.trim(),
    c?.title,
    c?.phone,
    c?.email,
  ]
    .filter(Boolean)
    .join(" · ");

export const applicantPdfFileName = (legalEntityName: string) =>
  `${(legalEntityName || "grant").trim()}-application.pdf`;

/**
 * Render the DEQ/ORWA RIG application PDF. Pure: no DOM, no fetch, no Strapi.
 * Runs in Node (Strapi) and in the browser (gapp-form preview).
 */
export async function renderApplicantPdf(input: ApplicantPdfInput): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  let page: PDFPage = pdfDoc.addPage();
  const { width, height } = page.getSize();

  const fontSize = 11;
  const headerFontSize = 14;
  const lineHeight = fontSize * 1.5;
  const margin = 50;
  const checkboxSize = 12;
  let y = height - margin / 2;

  const applicationDate = asDate(input.applicationDate);

  const checkPageOverflow = () => {
    if (y < margin) {
      page = pdfDoc.addPage();
      y = height - margin;
    }
  };

  const text = (
    value: string,
    x: number,
    at: number,
    opts: { font?: PDFFont; size?: number; maxWidth?: number } = {}
  ) =>
    page.drawText(value ?? "", {
      x,
      y: at,
      size: opts.size ?? fontSize,
      font: opts.font ?? font,
      ...(opts.maxWidth ? { maxWidth: opts.maxWidth } : {}),
    });

  /** Word-wrap `value` at `x`, starting at `start`; returns the y of the last line drawn. */
  const wrapped = (value: string, x: number, start: number, maxWidth: number) => {
    let line = "";
    let at = start;
    const words = (value ?? "").split(" ");
    words.forEach((word, i) => {
      const test = line + word + " ";
      if (font.widthOfTextAtSize(test, fontSize) > maxWidth && i > 0) {
        text(line, x, at);
        line = word + " ";
        at -= lineHeight;
      } else {
        line = test;
      }
    });
    text(line, x, at);
    return at;
  };

  const checkbox = (x: number, at: number, checked: boolean) => {
    page.drawRectangle({
      x,
      y: at - fontSize / 2 + 6,
      width: checkboxSize,
      height: checkboxSize,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
    if (checked) {
      page.drawText("X", { x: x + 2, y: at - fontSize / 2 + 8, size: fontSize, color: rgb(0, 0, 0) });
    }
  };

  // Header
  text(`Application # ${input.applicationNumber}`, margin, height - margin / 2, { font: bold });
  text(`Date Received: ${longDate(applicationDate)}`, width - margin - 150, height - margin / 2);
  if (input.revisedDate) {
    text(
      `Revised: ${longDate(asDate(input.revisedDate))}`,
      width - margin - 150,
      height - margin / 2 - lineHeight
    );
  }
  y -= lineHeight * 2;

  const title = "DEQ/ORWA Rural Infrastructure Grant (RIG)";
  text(title, (width - bold.widthOfTextAtSize(title, 18)) / 2, y, { font: bold, size: 18 });
  y -= lineHeight;
  const subtitle = "Application Form";
  text(subtitle, (width - bold.widthOfTextAtSize(subtitle, headerFontSize)) / 2, y, {
    font: bold,
    size: headerFontSize,
  });
  y -= lineHeight;

  // Contact Information (two columns)
  text("Contact Information", margin, y, { font: bold, size: headerFontSize });
  y -= lineHeight;

  const poc = input.pointOfContact ?? {};
  const addr = input.physicalAddress ?? {};
  const contactInfo = [
    `System Name: ${input.legalEntityName ?? ""}`,
    `Facility ID #: ${input.facilityId ?? ""}`,
    `County: ${input.county ?? ""}`,
    `Legal Contact Name: ${poc.first ?? ""} ${poc.last ?? ""}`,
    `Title: ${input.signatoryTitle ?? ""}`,
    `Phone #: ${poc.phone ?? ""}`,
    `Email Address: ${poc.email ?? ""}`,
    `Street Address: ${addr.street ?? ""}, ${addr.city ?? ""}, ${addr.state ?? ""} ${addr.zip ?? ""}`,
    `Population Served: ${input.populationServed ?? ""}`,
  ];
  const contactPerColumn = Math.ceil(contactInfo.length / 2);
  const columnWidth = (width - 2 * margin) / 2;
  let columnY = y;
  let lastContactY = y;
  contactInfo.forEach((line, index) => {
    const column = Math.floor(index / contactPerColumn);
    const x = margin + column * columnWidth;
    lastContactY = wrapped(line, x, columnY, columnWidth - 10);
    columnY = index % contactPerColumn === contactPerColumn - 1 ? y : lastContactY - lineHeight;
  });
  y = lastContactY - lineHeight * 1.5;

  text(`Do you have an engineer?: ${input.hasEngineer ? "Yes" : "No"}`, margin, y);
  text(`Change Order: ${input.changeOrderRequest ?? "No"}`, margin + columnWidth + margin * 3, y);
  y -= lineHeight * 1.5;

  const chairman = input.chairman;
  if (chairman?.first || chairman?.last) {
    text(
      `Board Chair: ${chairman.first ?? ""} ${chairman.last ?? ""}`.trim() +
        (chairman.title ? ` (${chairman.title})` : "") +
        (chairman.email ? ` — ${chairman.email}` : ""),
      margin,
      y,
      { maxWidth: width - 2 * margin }
    );
    y -= lineHeight;
  }

  const additional = input.additionalContacts ?? [];
  if (additional.length > 0) {
    text("Additional Contacts", margin, y, { font: bold });
    y -= lineHeight;
    for (const contact of additional) {
      const line = contactLine(contact);
      if (!line) continue;
      text(line, margin, y, { maxWidth: width - 2 * margin });
      y -= lineHeight;
    }
  }
  y -= lineHeight;

  // Funding Request checklist (two columns)
  text(`Funding Request (${input.drinkingOrWastewater ?? ""})`, margin, y, {
    font: bold,
    size: headerFontSize,
  });
  y -= lineHeight;

  const criteria = input.scoringCriteria ?? [];
  const criteriaPerColumn = Math.ceil(criteria.length / 2);
  columnY = y;
  criteria.forEach(([order, label, checked], index) => {
    const column = Math.floor(index / criteriaPerColumn);
    const x = margin + column * columnWidth;
    text(String(order), x, columnY);
    text(String(label), x + 30, columnY);
    checkbox(x + 180, columnY - 1, checked);
    columnY = index % criteriaPerColumn === criteriaPerColumn - 1 ? y : columnY - lineHeight;
  });
  y = columnY - lineHeight;
  y -= lineHeight * (input.drinkingOrWastewater === "Drinking Water" ? 11 : 1);

  // Project Status and Impact (two columns)
  text("Project Status and Impact", margin, y, { font: bold, size: headerFontSize });
  y -= lineHeight;

  const status = input.projectStatus;
  const projectStatus: Array<[string, string, boolean]> = [
    ["3.1", "Has an engineering report been prepared?", !!status?.engineeringReport],
    ["3.2", "If yes, has report been approved by DEQ?", !!status?.reportApprovedByDeq],
    ["3.3", "Will this project resolve a potential/current violation?", !!status?.resolvesViolation],
    ["3.4", "Will project satisfy a task on a DEQ issued order?", !!status?.satisfyDeqIssuedOrder],
    ["3.5", "Is other money/funding set aside for this project?", !!status?.moneySetAside],
    ["3.6", "Have you applied for other loans/grants for this?", !!status?.appliedToOtherLoans],
  ];
  const statusPerColumn = Math.ceil(projectStatus.length / 2);
  columnY = y;
  let lastStatusY = y;
  projectStatus.forEach(([id, question, answer], index) => {
    const column = Math.floor(index / statusPerColumn);
    const x = margin + column * columnWidth;
    text(id, x, columnY);
    if (column === 0) {
      const last = wrapped(question, x + 20, columnY, columnWidth - 50);
      checkbox(x + 220, columnY, answer);
      lastStatusY = Math.min(last, columnY);
    } else {
      text(question, x + 20, columnY);
      checkbox(x + 250, columnY, answer);
      lastStatusY = columnY;
    }
    columnY = index % statusPerColumn === statusPerColumn - 1 ? y : lastStatusY - lineHeight;
  });
  y = lastStatusY - lineHeight;
  y -= lineHeight * 1.5;

  // Costs
  const costs = input.projectCosts ?? [];
  if (costs.length > 0) {
    text("Estimated Costs by Project Type", margin, y, { font: bold });
    y -= lineHeight;
    for (const row of costs) {
      checkPageOverflow();
      const name = row.name?.trim() || `Project ${row.project_type_id ?? ""}`;
      text(`${name}: ${money(row.amount)}`, margin, y, { maxWidth: width - 2 * margin });
      y -= lineHeight;
    }
    y -= lineHeight * 0.25;
  }
  text(`Combined Estimated Cost: ${money(input.combinedCostOfProjects)}`, margin, y, { font: bold });
  y -= lineHeight * 1.5;

  // Description
  text("Project Cost/Description:", margin, y, { font: bold, size: headerFontSize });
  for (const paragraph of (input.descriptionJustification ?? "").split("\n")) {
    y -= lineHeight;
    checkPageOverflow();
    y = wrapped(paragraph, margin, y, width - 2 * margin);
  }
  y -= lineHeight * 1.5;
  checkPageOverflow();

  // Certification
  text("Certification: ", margin, y, { font: bold, size: headerFontSize });
  y -= lineHeight;
  text(
    "I certify that, to the best of my knowledge and belief, the information included on and with this Application,",
    margin,
    y
  );
  y -= lineHeight;
  checkPageOverflow();
  text(
    "including all attachments, are true and correct, and that I agreed to abide by the qualifying conditions",
    margin,
    y
  );
  y -= lineHeight;
  text("of the Rural Infrastructure Grant (RIG) program.", margin, y);
  y -= lineHeight * 2;
  checkPageOverflow();

  text("Printed Name:", margin, y);
  text(input.signatoryName ?? "", margin + 100, y);
  y -= lineHeight;
  text("Title:", margin, y);
  text(input.signatoryTitle ?? "", margin + 100, y);
  y -= lineHeight;
  text("Date:", margin, y);
  text(shortDate(applicationDate), margin + 100, y);

  // Signature image (optional)
  if (input.signatureDataUrl) {
    try {
      const isJpeg = /^data:image\/jpe?g/i.test(input.signatureDataUrl);
      const image = isJpeg
        ? await pdfDoc.embedJpg(input.signatureDataUrl)
        : await pdfDoc.embedPng(input.signatureDataUrl);
      const dims = image.scale(0.2);
      page.drawImage(image, {
        x: margin + 250,
        y: y - lineHeight,
        width: dims.width,
        height: dims.height,
      });
    } catch {
      // Unreadable signature image: leave the signature line empty.
    }
  }
  page.drawLine({
    start: { x: margin + 250, y },
    end: { x: margin + 450, y },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  text("Signature", margin + 255, y - lineHeight, { size: fontSize * 0.75 });

  return pdfDoc.save();
}
