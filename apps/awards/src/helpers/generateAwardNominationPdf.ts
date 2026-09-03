import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { IAwardNominationPayload } from "../types/types";
import { isSystemOfTheYearAward } from "./awardType";
import { embedPrintFonts, type PrintFonts } from "./printBrandFonts";

const NAVY = rgb(0.08, 0.2, 0.36);
const GOLD = rgb(0.72, 0.55, 0.18);
const INK = rgb(0.12, 0.12, 0.14);
const MUTED = rgb(0.38, 0.39, 0.42);
const RULE = rgb(0.78, 0.79, 0.81);
const ROW_ALT = rgb(0.97, 0.97, 0.98);
const WHITE = rgb(1, 1, 1);

const MARGIN_LEFT = 54;
const MARGIN_RIGHT = 54;
const MARGIN_BOTTOM = 50;
const CONTENT_INSET = 12;
const LABEL_X = MARGIN_LEFT + CONTENT_INSET;
const LABEL_COL = 168;
const LINE = 14;
const COVER_BAND_H = 88;
const COVER_GOLD_EDGE_H = 3;
const COVER_BAND_PAD = 20;
const COVER_KICKER_SIZE = 9;
const COVER_TITLE_SIZE = 16;
const COVER_ROW_GAP = 18;
const HEADER_RIGHT_INSET = 16;
const SECTION_BAR_H = 24;
const ACCENT_W = 3;
const MIN_ROW_H = 20;
const ROW_PAD_Y = 6;
const LETTER_WIDTH = 612;
const LETTER_HEIGHT = 792;

const toWinAnsi = (value: string): string =>
  String(value || "")
    .replace(/\u2018|\u2019|\u201a|\u2032/g, "'")
    .replace(/\u201c|\u201d|\u201e|\u2033/g, '"')
    .replace(/\u2013|\u2014|\u2212/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/[^\u0009\u000a\u000d\u0020-\u007e\u00a0-\u00ff]/g, "");

const fontAscent = (font: PDFFont, size: number) =>
  font.heightAtSize(size, { descender: false });

const fontDescent = (font: PDFFont, size: number) =>
  Math.max(0, font.heightAtSize(size, { descender: true }) - fontAscent(font, size));

const baselineCentered = (
  bandBottom: number,
  bandHeight: number,
  font: PDFFont,
  size: number
) => {
  const ascent = fontAscent(font, size);
  const raw = bandBottom + (bandHeight - ascent) / 2;
  return Math.max(raw, bandBottom + 1);
};

const wrapLines = (text: string, font: PDFFont, size: number, maxWidth: number) => {
  const words = toWinAnsi(text).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];
  const lines: string[] = [];
  let current = words[0];
  for (let i = 1; i < words.length; i += 1) {
    const next = `${current} ${words[i]}`;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) current = next;
    else {
      lines.push(current);
      current = words[i];
    }
  }
  lines.push(current);
  return lines;
};

const fitText = (text: string, font: PDFFont, size: number, maxWidth: number) => {
  const value = toWinAnsi(text);
  if (font.widthOfTextAtSize(value, size) <= maxWidth) return value;
  let cut = value;
  while (cut.length > 1 && font.widthOfTextAtSize(`${cut}...`, size) > maxWidth) {
    cut = cut.slice(0, -1);
  }
  return cut.length ? `${cut}...` : "";
};

const display = (value: unknown): string => {
  if (value === undefined || value === null || value === "") return "—";
  return String(value);
};

type Layout = {
  doc: PDFDocument;
  page: PDFPage;
  fonts: PrintFonts;
  width: number;
  height: number;
  y: number;
  contentWidth: number;
};

const newPage = (layout: Layout) => {
  layout.page = layout.doc.addPage([LETTER_WIDTH, LETTER_HEIGHT]);
  layout.width = LETTER_WIDTH;
  layout.height = LETTER_HEIGHT;
  layout.contentWidth = LETTER_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
  layout.y = layout.height - 64;
};

const ensureSpace = (layout: Layout, needed: number) => {
  if (layout.y - needed >= MARGIN_BOTTOM) return;
  newPage(layout);
};

const drawCover = (layout: Layout, payload: IAwardNominationPayload) => {
  const { page, fonts, width, height } = layout;
  const bandBottom = height - COVER_BAND_H;
  page.drawRectangle({ x: 0, y: bandBottom, width, height: COVER_BAND_H, color: NAVY });
  page.drawRectangle({
    x: 0,
    y: bandBottom - COVER_GOLD_EDGE_H,
    width,
    height: COVER_GOLD_EDGE_H,
    color: GOLD,
  });
  const kickerAscent = fontAscent(fonts.bold, COVER_KICKER_SIZE);
  const titleAscent = fontAscent(fonts.bold, COVER_TITLE_SIZE);
  const kickerDescent = fontDescent(fonts.bold, COVER_KICKER_SIZE);
  const stackH = kickerAscent + COVER_ROW_GAP + titleAscent;
  const topPad = Math.max(COVER_BAND_PAD, (COVER_BAND_H - stackH) / 2);
  const kickerBaseline = height - topPad - kickerAscent;
  const titleBaseline = kickerBaseline - COVER_ROW_GAP - titleAscent;
  const rightMax = Math.min(220, layout.contentWidth * 0.38);
  const rightEdge = width - MARGIN_RIGHT - HEADER_RIGHT_INSET;
  const leftMax = Math.max(120, rightEdge - rightMax - MARGIN_LEFT - 16);

  const kicker = fitText(
    "OKLAHOMA RURAL WATER ASSOCIATION",
    fonts.bold,
    COVER_KICKER_SIZE,
    leftMax
  );
  const title = fitText(
    "Award Nomination Application",
    fonts.bold,
    COVER_TITLE_SIZE,
    leftMax
  );
  page.drawText(kicker, {
    x: MARGIN_LEFT,
    y: kickerBaseline,
    size: COVER_KICKER_SIZE,
    font: fonts.bold,
    color: GOLD,
  });
  page.drawText(title, {
    x: MARGIN_LEFT,
    y: titleBaseline,
    size: COVER_TITLE_SIZE,
    font: fonts.bold,
    color: WHITE,
  });
  const cycle = fitText(
    `Cycle ${payload.award_year ?? "—"}`,
    fonts.bold,
    COVER_TITLE_SIZE,
    rightMax
  );
  page.drawText(cycle, {
    x: rightEdge - fonts.bold.widthOfTextAtSize(cycle, COVER_TITLE_SIZE),
    y: titleBaseline,
    size: COVER_TITLE_SIZE,
    font: fonts.bold,
    color: WHITE,
  });
  const awardType = fitText(
    String(payload.award_type || ""),
    fonts.bold,
    COVER_KICKER_SIZE,
    rightMax
  );
  if (awardType) {
    page.drawText(awardType, {
      x: rightEdge - fonts.bold.widthOfTextAtSize(awardType, COVER_KICKER_SIZE),
      y: kickerBaseline,
      size: COVER_KICKER_SIZE,
      font: fonts.bold,
      color: GOLD,
    });
  }
  const belowKicker = kickerBaseline - kickerDescent;
  const aboveTitle = titleBaseline + titleAscent;
  const ruleY = (belowKicker + aboveTitle) / 2;
  const kickerWidth = fonts.bold.widthOfTextAtSize(kicker, COVER_KICKER_SIZE);
  const ruleEnd = Math.min(MARGIN_LEFT + kickerWidth, rightEdge - rightMax - 12);
  if (ruleEnd > MARGIN_LEFT + 12) {
    page.drawLine({
      start: { x: MARGIN_LEFT, y: ruleY },
      end: { x: ruleEnd, y: ruleY },
      thickness: 0.7,
      color: GOLD,
    });
  }
  layout.y = bandBottom - COVER_GOLD_EDGE_H - 18;
};

const sectionBar = (layout: Layout, title: string) => {
  ensureSpace(layout, 8 + SECTION_BAR_H + MIN_ROW_H);
  layout.y -= 8;
  const bandBottom = layout.y - SECTION_BAR_H;
  layout.page.drawRectangle({
    x: MARGIN_LEFT,
    y: bandBottom,
    width: layout.contentWidth,
    height: SECTION_BAR_H,
    color: NAVY,
  });
  layout.page.drawRectangle({
    x: MARGIN_LEFT - ACCENT_W,
    y: bandBottom,
    width: ACCENT_W,
    height: SECTION_BAR_H,
    color: GOLD,
  });
  layout.page.drawText(title, {
    x: LABEL_X,
    y: baselineCentered(bandBottom, SECTION_BAR_H, layout.fonts.bold, 10),
    size: 10,
    font: layout.fonts.bold,
    color: WHITE,
  });
  layout.y = bandBottom - 10;
};

const fieldRow = (layout: Layout, label: string, value: unknown, alt = false) => {
  const valueSize = 10;
  const lines = wrapLines(
    display(value),
    layout.fonts.regular,
    valueSize,
    layout.contentWidth - LABEL_COL
  );
  const firstAscent = Math.max(
    fontAscent(layout.fonts.bold, 9),
    fontAscent(layout.fonts.regular, valueSize)
  );
  const rowH = Math.max(
    MIN_ROW_H,
    ROW_PAD_Y + firstAscent + Math.max(0, lines.length - 1) * LINE + ROW_PAD_Y
  );
  ensureSpace(layout, rowH + 2);
  const bandBottom = layout.y - rowH;
  if (alt) {
    layout.page.drawRectangle({
      x: MARGIN_LEFT,
      y: bandBottom,
      width: layout.contentWidth,
      height: rowH,
      color: ROW_ALT,
    });
  }
  const firstBaseline =
    lines.length <= 1
      ? baselineCentered(bandBottom, rowH, layout.fonts.regular, valueSize)
      : bandBottom + rowH - ROW_PAD_Y - firstAscent;
  layout.page.drawText(fitText(label, layout.fonts.bold, 9, LABEL_COL - CONTENT_INSET - 8), {
    x: LABEL_X,
    y: firstBaseline,
    size: 9,
    font: layout.fonts.bold,
    color: MUTED,
  });
  lines.forEach((line, index) => {
    layout.page.drawText(line, {
      x: MARGIN_LEFT + LABEL_COL,
      y: firstBaseline - index * LINE,
      size: valueSize,
      font: layout.fonts.regular,
      color: INK,
    });
  });
  layout.page.drawLine({
    start: { x: MARGIN_LEFT, y: bandBottom },
    end: { x: layout.width - MARGIN_RIGHT, y: bandBottom },
    thickness: 0.4,
    color: RULE,
  });
  layout.y = bandBottom;
};

const narrative = (layout: Layout, heading: string, body: string) => {
  sectionBar(layout, heading);
  const lines = wrapLines(
    body.trim() || "—",
    layout.fonts.regular,
    10,
    layout.contentWidth - CONTENT_INSET
  );
  for (const line of lines) {
    const ascent = fontAscent(layout.fonts.regular, 10);
    ensureSpace(layout, ascent + 4);
    layout.y -= ascent;
    layout.page.drawText(line, {
      x: LABEL_X,
      y: layout.y,
      size: 10,
      font: layout.fonts.regular,
      color: INK,
    });
    layout.y -= 4;
  }
  layout.y -= 6;
};

const drawFooters = (layout: Layout, who: string, award: string) => {
  const pages = layout.doc.getPages();
  const total = pages.length;
  pages.forEach((page, index) => {
    const { width, height } = page.getSize();
    if (Math.abs(width - LETTER_WIDTH) > 0.5 || Math.abs(height - LETTER_HEIGHT) > 0.5) {
      return;
    }
    const footSize = 8;
    const footBaseline = baselineCentered(14, 22, layout.fonts.regular, footSize);
    page.drawLine({
      start: { x: MARGIN_LEFT, y: footBaseline + fontAscent(layout.fonts.regular, footSize) + 3.5 },
      end: { x: width - MARGIN_RIGHT, y: footBaseline + fontAscent(layout.fonts.regular, footSize) + 3.5 },
      thickness: 0.6,
      color: GOLD,
    });
    const mark = `Page ${index + 1} of ${total}`;
    const markW = layout.fonts.regular.widthOfTextAtSize(mark, footSize);
    page.drawText(
      fitText(`${who}  ·  ${award}`, layout.fonts.regular, footSize, width - MARGIN_RIGHT - markW - MARGIN_LEFT - 10),
      {
        x: MARGIN_LEFT,
        y: footBaseline,
        size: footSize,
        font: layout.fonts.regular,
        color: MUTED,
      }
    );
    page.drawText(mark, {
      x: width - MARGIN_RIGHT - markW,
      y: footBaseline,
      size: footSize,
      font: layout.fonts.regular,
      color: MUTED,
    });
  });
};

export async function generateAwardNominationPDF(payload: IAwardNominationPayload) {
  const pdfDoc = await PDFDocument.create();
  const fonts = await embedPrintFonts(pdfDoc);
  const page = pdfDoc.addPage([LETTER_WIDTH, LETTER_HEIGHT]);
  const layout: Layout = {
    doc: pdfDoc,
    page,
    fonts,
    width: LETTER_WIDTH,
    height: LETTER_HEIGHT,
    y: LETTER_HEIGHT - 46,
    contentWidth: LETTER_WIDTH - MARGIN_LEFT - MARGIN_RIGHT,
  };

  drawCover(layout, payload);

  sectionBar(layout, "Nominee");
  fieldRow(layout, "Name", payload.nominee_name, true);
  fieldRow(layout, "Name as printed", payload.award_name_printed || payload.system_name);
  fieldRow(layout, "Award", payload.award_type, true);
  fieldRow(layout, "Year", payload.award_year);
  fieldRow(layout, "Email", payload.email, true);
  fieldRow(layout, "Phone", payload.daytime_phone);
  fieldRow(
    layout,
    "Address",
    [payload.address, payload.city, payload.state, payload.zip].filter(Boolean).join(", "),
    true
  );

  sectionBar(layout, "Nominator");
  fieldRow(
    layout,
    "Name",
    [payload.nominator_first_name, payload.nominator_last_name].filter(Boolean).join(" "),
    true
  );
  fieldRow(layout, "Email", payload.nominator_email);
  fieldRow(layout, "Phone", payload.nominator_phone, true);
  fieldRow(
    layout,
    "Address",
    [
      payload.nominator_address,
      payload.nominator_address_2,
      payload.nominator_city,
      payload.nominator_state,
      payload.nominator_zip,
      payload.nominator_country,
    ]
      .filter(Boolean)
      .join(", ")
  );

  sectionBar(layout, "System");
  fieldRow(layout, "System name", payload.system_name, true);
  fieldRow(layout, "Date system began", payload.operation_start_date);
  fieldRow(layout, "Date employed", payload.employment_date, true);
  fieldRow(layout, "Beginning meters", payload.beginning_members);
  fieldRow(layout, "Current meters", payload.current_members, true);
  if (isSystemOfTheYearAward(payload.award_type)) {
    fieldRow(layout, "Clerical employees", payload.clerical_employees);
    fieldRow(layout, "O&M employees", payload.operation_maintenance_employees, true);
    fieldRow(layout, "Management employees", payload.management_employees);
  }

  narrative(
    layout,
    "Nomination",
    String(payload.justification || payload.nomination_description || "").trim()
  );

  sectionBar(layout, "Biography");
  fieldRow(layout, "Method", payload.biography_method, true);
  if (payload.biography_method === "Copy/Paste or Type Biography") {
    narrative(layout, "Biography", String(payload.biography_text || "").trim());
  } else {
    fieldRow(
      layout,
      "Biography file",
      Array.isArray(payload.biography_file)
        ? payload.biography_file[0]?.title
        : (payload.biography_file as { title?: string } | null)?.title
    );
  }
  fieldRow(
    layout,
    "Photographs",
    Array.isArray(payload.photographs) ? payload.photographs.length : 0,
    true
  );

  const who = payload.nominee_name || payload.system_name || "Nomination";
  drawFooters(layout, who, payload.award_type || "Award nomination");

  const bytes = await pdfDoc.save();
  return new Blob([bytes], { type: "application/pdf" });
}
