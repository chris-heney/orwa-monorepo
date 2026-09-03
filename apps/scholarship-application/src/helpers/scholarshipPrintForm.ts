/** Keep drawing in sync with member-manager `orwef-scholarships/helpers/scholarshipPrintForm.ts`. */
import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { PrintFonts } from "./printBrandFonts";

export const ORWEF_LEGAL_NAME = "Oklahoma Rural Water Enrichment Foundation";
export const ORWEF_KICKER = "OKLAHOMA RURAL WATER ENRICHMENT FOUNDATION";
export const SCHOLARSHIP_TITLE = "Scholarship Application";
export const SCHOLARSHIP_FOOTER_AWARD = "ORWEF Scholarship";

const NAVY = rgb(0.08, 0.2, 0.36);
const GOLD = rgb(0.72, 0.55, 0.18);
const INK = rgb(0.12, 0.12, 0.14);
const MUTED = rgb(0.38, 0.39, 0.42);
const RULE = rgb(0.78, 0.79, 0.81);
const ROW_ALT = rgb(0.97, 0.97, 0.98);
const WELL = rgb(0.985, 0.986, 0.988);
const WHITE = rgb(1, 1, 1);

export const LETTER_WIDTH = 612;
export const LETTER_HEIGHT = 792;
const MARGIN_LEFT = 54;
const MARGIN_RIGHT = 54;
const MARGIN_TOP = 46;
const MARGIN_BOTTOM = 50;
const TEXT_X = MARGIN_LEFT;
const CONTENT_INSET = 12;
const LABEL_X_PAD = CONTENT_INSET;
const COL_GAP = 12;
const LINE = 12;
const COVER_BAND_H = 88;
const COVER_GOLD_EDGE_H = 3;
const COVER_BAND_PAD = 20;
const COVER_KICKER_SIZE = 9;
const COVER_TITLE_SIZE = 16;
const COVER_ROW_GAP = 18;
const HEADER_RIGHT_INSET = 16;
const SECTION_BAR_H = 22;
const ACCENT_W = 3;
const RULE_CLEARANCE = 3.5;
const ROW_PAD_Y = 4;
const MIN_ROW_H = 17;
const CARD_TOP_GAP = 6;
const CARD_BODY_GAP = 4;
const CARD_BOTTOM_PAD = 4;

export const toWinAnsi = (value: string): string =>
  String(value || "")
    .replace(/\u2018|\u2019|\u201a|\u2032/g, "'")
    .replace(/\u201c|\u201d|\u201e|\u2033/g, '"')
    .replace(/\u2013|\u2014|\u2212/g, "-")
    .replace(/\u2022|\u25cf/g, "-")
    .replace(/\u00a0|\u202f/g, " ")
    .replace(/\u2026/g, "...")
    // eslint-disable-next-line no-control-regex -- keep tab/LF/CR, strip other controls
    .replace(/[^\u0009\u000a\u000d\u0020-\u007e\u00a0-\u00ff]/g, "");

export const fontAscent = (font: PDFFont, size: number) =>
  font.heightAtSize(size, { descender: false });

export const fontDescent = (font: PDFFont, size: number) =>
  Math.max(0, font.heightAtSize(size, { descender: true }) - fontAscent(font, size));

export const baselineCentered = (
  bandBottom: number,
  bandHeight: number,
  font: PDFFont,
  size: number
) => {
  const ascent = fontAscent(font, size);
  const descent = fontDescent(font, size);
  const raw = bandBottom + (bandHeight - ascent) / 2;
  return Math.max(raw, bandBottom + descent + 1);
};

export const wrapLines = (
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
): string[] => {
  const paragraphs = toWinAnsi(text).replace(/\r\n/g, "\n").split("\n");
  const lines: string[] = [];
  for (const para of paragraphs) {
    const words = para.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push("");
      continue;
    }
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
        current = candidate;
        continue;
      }
      if (current) lines.push(current);
      if (font.widthOfTextAtSize(word, size) <= maxWidth) {
        current = word;
        continue;
      }
      let chunk = "";
      for (const ch of word) {
        const next = chunk + ch;
        if (font.widthOfTextAtSize(next, size) <= maxWidth) {
          chunk = next;
        } else {
          if (chunk) lines.push(chunk);
          chunk = ch;
        }
      }
      current = chunk;
    }
    if (current) lines.push(current);
  }
  return lines.length ? lines : [""];
};

export const fitText = (
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
): string => {
  const value = toWinAnsi(text);
  if (font.widthOfTextAtSize(value, size) <= maxWidth) return value;
  let cut = value;
  while (cut.length > 1 && font.widthOfTextAtSize(`${cut}...`, size) > maxWidth) {
    cut = cut.slice(0, -1);
  }
  return cut.length ? `${cut}...` : "";
};

export type PrintField =
  | { kind: "kv"; label: string; value: string }
  | { kind: "contact"; lines: string[] }
  | { kind: "body"; text: string };

export type PrintCard = {
  title: string;
  fields: PrintField[];
};

export type ScholarshipPrintModel = {
  applicantName: string;
  cycleYear: string;
  cards: PrintCard[];
  fullWidth: PrintCard[];
};

type Layout = {
  doc: PDFDocument;
  page: PDFPage;
  fonts: PrintFonts;
  width: number;
  height: number;
  y: number;
  contentWidth: number;
  isCover: boolean;
  model: ScholarshipPrintModel;
};

const contentRight = (layout: Layout) => layout.width - MARGIN_RIGHT;

const columnWidth = (layout: Layout) =>
  (layout.contentWidth - COL_GAP) / 2;

export const isLetterPage = (page: PDFPage) => {
  const { width, height } = page.getSize();
  return (
    Math.abs(width - LETTER_WIDTH) < 0.5 &&
    Math.abs(height - LETTER_HEIGHT) < 0.5
  );
};

const newPage = (layout: Layout, cover: boolean) => {
  layout.page = layout.doc.addPage([LETTER_WIDTH, LETTER_HEIGHT]);
  layout.width = LETTER_WIDTH;
  layout.height = LETTER_HEIGHT;
  layout.contentWidth = LETTER_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
  layout.isCover = cover;
  layout.y = layout.height - MARGIN_TOP;
};

const remainingHeight = (layout: Layout) => layout.y - MARGIN_BOTTOM;

const drawRunningHeader = (layout: Layout) => {
  if (layout.isCover) return;
  const size = 8;
  const title = [layout.model.applicantName || "Applicant", SCHOLARSHIP_FOOTER_AWARD, layout.model.cycleYear]
    .filter((part) => part != null && String(part).trim() !== "")
    .join("  ·  ");
  const ascent = fontAscent(layout.fonts.regular, size);
  const baseline = layout.height - 18 - ascent;
  layout.page.drawText(fitText(title, layout.fonts.regular, size, layout.contentWidth), {
    x: TEXT_X,
    y: baseline,
    size,
    font: layout.fonts.regular,
    color: MUTED,
  });
  const ruleY = baseline - fontDescent(layout.fonts.regular, size) - RULE_CLEARANCE;
  layout.page.drawLine({
    start: { x: TEXT_X, y: ruleY },
    end: { x: contentRight(layout), y: ruleY },
    thickness: 0.6,
    color: GOLD,
  });
  layout.y = Math.min(layout.y, ruleY - 14);
};

const ensureSpace = (layout: Layout, needed: number) => {
  if (remainingHeight(layout) >= needed) return;
  newPage(layout, false);
  drawRunningHeader(layout);
};

const drawCover = (layout: Layout) => {
  const { page, fonts, width, height } = layout;
  const bandBottom = height - COVER_BAND_H;
  page.drawRectangle({
    x: 0,
    y: bandBottom,
    width,
    height: COVER_BAND_H,
    color: NAVY,
  });
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
  const leftMax = Math.max(120, rightEdge - rightMax - TEXT_X - 16);

  const kicker = fitText(ORWEF_KICKER, fonts.bold, COVER_KICKER_SIZE, leftMax);
  const title = fitText(SCHOLARSHIP_TITLE, fonts.bold, COVER_TITLE_SIZE, leftMax);
  page.drawText(kicker, {
    x: TEXT_X,
    y: kickerBaseline,
    size: COVER_KICKER_SIZE,
    font: fonts.bold,
    color: GOLD,
  });
  page.drawText(title, {
    x: TEXT_X,
    y: titleBaseline,
    size: COVER_TITLE_SIZE,
    font: fonts.bold,
    color: WHITE,
  });

  const cycle = fitText(
    `Cycle ${layout.model.cycleYear}`,
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

  const belowKicker = kickerBaseline - kickerDescent;
  const aboveTitle = titleBaseline + titleAscent;
  const ruleY = (belowKicker + aboveTitle) / 2;
  const kickerWidth = fonts.bold.widthOfTextAtSize(kicker, COVER_KICKER_SIZE);
  const ruleEnd = Math.min(TEXT_X + kickerWidth, rightEdge - rightMax - 12);
  if (ruleEnd > TEXT_X + 12) {
    page.drawLine({
      start: { x: TEXT_X, y: ruleY },
      end: { x: ruleEnd, y: ruleY },
      thickness: 0.7,
      color: GOLD,
    });
  }

  layout.y = bandBottom - COVER_GOLD_EDGE_H - 12;
};

const kvLayout = (cardWidth: number, fonts: PrintFonts, label: string) => {
  const labelBudget = Math.min(108, cardWidth * 0.44);
  const labelText = fitText(label, fonts.bold, 8, labelBudget);
  const labelW = fonts.bold.widthOfTextAtSize(labelText, 8);
  const valueX = CONTENT_INSET + labelW + 8;
  const valueWidth = Math.max(36, cardWidth - valueX - CONTENT_INSET);
  return { labelText, valueX, valueWidth };
};

const measureField = (
  field: PrintField,
  fonts: PrintFonts,
  cardWidth: number
): number => {
  const inner = cardWidth - CONTENT_INSET * 2;
  if (field.kind === "kv") {
    const { valueWidth } = kvLayout(cardWidth, fonts, field.label);
    const lines = wrapLines(field.value || "—", fonts.regular, 9, valueWidth);
    const firstAscent = Math.max(fontAscent(fonts.bold, 8), fontAscent(fonts.regular, 9));
    return Math.max(MIN_ROW_H, ROW_PAD_Y + firstAscent + Math.max(0, lines.length - 1) * LINE + ROW_PAD_Y);
  }
  if (field.kind === "contact") {
    const rows = field.lines.length ? field.lines : ["—"];
    let height = ROW_PAD_Y;
    rows.forEach((line, index) => {
      const font = index === 0 ? fonts.bold : fonts.regular;
      const size = index === 0 ? 10 : 9;
      const wrapped = wrapLines(line, font, size, inner);
      height += wrapped.length * (size + 4);
    });
    return Math.max(MIN_ROW_H, height + 2);
  }
  const lines = wrapLines(field.text || "—", fonts.regular, 10, inner);
  return Math.max(MIN_ROW_H, ROW_PAD_Y + lines.length * LINE + ROW_PAD_Y);
};

const measureCard = (card: PrintCard, fonts: PrintFonts, cardWidth: number) => {
  const fieldsH = card.fields.reduce(
    (sum, field) => sum + measureField(field, fonts, cardWidth),
    0
  );
  return CARD_TOP_GAP + SECTION_BAR_H + CARD_BODY_GAP + fieldsH + CARD_BOTTOM_PAD;
};

const drawSectionBar = (
  page: PDFPage,
  fonts: PrintFonts,
  x: number,
  bandBottom: number,
  width: number,
  title: string
) => {
  page.drawRectangle({
    x,
    y: bandBottom,
    width,
    height: SECTION_BAR_H,
    color: NAVY,
  });
  page.drawRectangle({
    x: x - ACCENT_W,
    y: bandBottom,
    width: ACCENT_W,
    height: SECTION_BAR_H,
    color: GOLD,
  });
  page.drawText(fitText(title, fonts.bold, 10, width - CONTENT_INSET), {
    x: x + LABEL_X_PAD,
    y: baselineCentered(bandBottom, SECTION_BAR_H, fonts.bold, 10),
    size: 10,
    font: fonts.bold,
    color: WHITE,
  });
};

const drawField = (
  page: PDFPage,
  fonts: PrintFonts,
  x: number,
  top: number,
  cardWidth: number,
  field: PrintField,
  alt: boolean
): number => {
  const rowH = measureField(field, fonts, cardWidth);
  const bandBottom = top - rowH;
  if (alt) {
    page.drawRectangle({
      x,
      y: bandBottom,
      width: cardWidth,
      height: rowH,
      color: ROW_ALT,
    });
  }
  const inner = cardWidth - CONTENT_INSET * 2;
  if (field.kind === "kv") {
    const labelSize = 8;
    const valueSize = 9;
    const { labelText, valueX, valueWidth } = kvLayout(cardWidth, fonts, field.label);
    const lines = wrapLines(field.value || "—", fonts.regular, valueSize, valueWidth);
    const firstAscent = Math.max(
      fontAscent(fonts.bold, labelSize),
      fontAscent(fonts.regular, valueSize)
    );
    const firstBaseline =
      lines.length <= 1
        ? baselineCentered(bandBottom, rowH, fonts.regular, valueSize)
        : bandBottom + rowH - ROW_PAD_Y - firstAscent;
    page.drawText(labelText, {
      x: x + LABEL_X_PAD,
      y: firstBaseline,
      size: labelSize,
      font: fonts.bold,
      color: MUTED,
    });
    lines.forEach((line, index) => {
      page.drawText(line, {
        x: x + valueX,
        y: firstBaseline - index * LINE,
        size: valueSize,
        font: fonts.regular,
        color: INK,
      });
    });
  } else if (field.kind === "contact") {
    const rows = field.lines.length ? field.lines : ["—"];
    let cursor = top - ROW_PAD_Y;
    rows.forEach((line, index) => {
      const font = index === 0 ? fonts.bold : fonts.regular;
      const size = index === 0 ? 10 : 9;
      const color = index === 0 ? INK : MUTED;
      const wrapped = wrapLines(line, font, size, inner);
      for (const row of wrapped) {
        cursor -= fontAscent(font, size);
        page.drawText(row, {
          x: x + LABEL_X_PAD,
          y: cursor,
          size,
          font,
          color,
        });
        cursor -= 4;
      }
    });
  } else {
    const lines = wrapLines(field.text || "—", fonts.regular, 10, inner);
    const firstAscent = fontAscent(fonts.regular, 10);
    let cursor = top - ROW_PAD_Y - firstAscent;
    for (const line of lines) {
      page.drawText(line, {
        x: x + LABEL_X_PAD,
        y: cursor,
        size: 10,
        font: fonts.regular,
        color: INK,
      });
      cursor -= LINE;
    }
  }
  page.drawLine({
    start: { x, y: bandBottom },
    end: { x: x + cardWidth, y: bandBottom },
    thickness: 0.4,
    color: RULE,
  });
  return bandBottom;
};

const drawCard = (
  page: PDFPage,
  fonts: PrintFonts,
  x: number,
  yTop: number,
  cardWidth: number,
  card: PrintCard,
  stretchTo: number
) => {
  const contentH = measureCard(card, fonts, cardWidth);
  const rowH = Math.max(contentH, stretchTo);
  const wellBottom = yTop - rowH;
  const barTop = yTop - CARD_TOP_GAP;
  const bandBottom = barTop - SECTION_BAR_H;

  page.drawRectangle({
    x,
    y: wellBottom,
    width: cardWidth,
    height: rowH - CARD_TOP_GAP,
    color: WELL,
  });
  drawSectionBar(page, fonts, x, bandBottom, cardWidth, card.title);

  let cursor = bandBottom - CARD_BODY_GAP;
  card.fields.forEach((field, index) => {
    cursor = drawField(page, fonts, x, cursor, cardWidth, field, index % 2 === 1);
  });
};

const drawCardPair = (layout: Layout, left: PrintCard, right?: PrintCard) => {
  const colW = columnWidth(layout);
  const leftH = measureCard(left, layout.fonts, colW);
  const rightH = right ? measureCard(right, layout.fonts, colW) : 0;
  const rowH = Math.max(leftH, rightH);
  ensureSpace(layout, rowH + 4);
  const yTop = layout.y;
  drawCard(layout.page, layout.fonts, MARGIN_LEFT, yTop, colW, left, rowH);
  if (right) {
    drawCard(
      layout.page,
      layout.fonts,
      MARGIN_LEFT + colW + COL_GAP,
      yTop,
      colW,
      right,
      rowH
    );
  }
  layout.y = yTop - rowH - 4;
};

const drawFullWidthFlow = (layout: Layout, card: PrintCard) => {
  const width = layout.contentWidth;
  const headerH = CARD_TOP_GAP + SECTION_BAR_H + CARD_BODY_GAP;
  ensureSpace(layout, headerH + MIN_ROW_H);
  layout.y -= CARD_TOP_GAP;
  const bandBottom = layout.y - SECTION_BAR_H;
  drawSectionBar(layout.page, layout.fonts, MARGIN_LEFT, bandBottom, width, card.title);
  layout.y = bandBottom - CARD_BODY_GAP;

  card.fields.forEach((field, index) => {
    if (field.kind === "body") {
      const inner = width - CONTENT_INSET * 2;
      const lines = wrapLines(field.text || "—", layout.fonts.regular, 10, inner);
      for (const line of lines) {
        const ascent = fontAscent(layout.fonts.regular, 10);
        ensureSpace(layout, ascent + 4);
        layout.y -= ascent;
        layout.page.drawText(line, {
          x: MARGIN_LEFT + LABEL_X_PAD,
          y: layout.y,
          size: 10,
          font: layout.fonts.regular,
          color: INK,
        });
        layout.y -= 4;
      }
      layout.y -= 6;
      return;
    }
    const rowH = measureField(field, layout.fonts, width);
    ensureSpace(layout, rowH + 2);
    layout.y = drawField(
      layout.page,
      layout.fonts,
      MARGIN_LEFT,
      layout.y,
      width,
      field,
      index % 2 === 1
    );
  });
  layout.y -= 4;
};

export const drawLetterFooters = (
  doc: PDFDocument,
  fonts: PrintFonts,
  who: string,
  award: string
) => {
  const pages = doc.getPages();
  const total = pages.length;
  pages.forEach((page, index) => {
    if (!isLetterPage(page)) return;
    const { width } = page.getSize();
    const footSize = 8;
    const footBaseline = baselineCentered(14, 22, fonts.regular, footSize);
    const ruleY = footBaseline + fontAscent(fonts.regular, footSize) + RULE_CLEARANCE;
    page.drawLine({
      start: { x: TEXT_X, y: ruleY },
      end: { x: width - MARGIN_RIGHT, y: ruleY },
      thickness: 0.6,
      color: GOLD,
    });
    const mark = `Page ${index + 1} of ${total}`;
    const markW = fonts.regular.widthOfTextAtSize(mark, footSize);
    const markX = width - MARGIN_RIGHT - markW;
    page.drawText(
      fitText(`${who}  ·  ${award}`, fonts.regular, footSize, markX - TEXT_X - 10),
      {
        x: TEXT_X,
        y: footBaseline,
        size: footSize,
        font: fonts.regular,
        color: MUTED,
      }
    );
    page.drawText(mark, {
      x: markX,
      y: footBaseline,
      size: footSize,
      font: fonts.regular,
      color: MUTED,
    });
  });
};

export const drawScholarshipApplicationForm = (
  doc: PDFDocument,
  fonts: PrintFonts,
  model: ScholarshipPrintModel
) => {
  const page = doc.addPage([LETTER_WIDTH, LETTER_HEIGHT]);
  const layout: Layout = {
    doc,
    page,
    fonts,
    width: LETTER_WIDTH,
    height: LETTER_HEIGHT,
    y: LETTER_HEIGHT - MARGIN_TOP,
    contentWidth: LETTER_WIDTH - MARGIN_LEFT - MARGIN_RIGHT,
    isCover: true,
    model,
  };
  drawCover(layout);
  const paired = [...model.cards];
  for (let i = 0; i < paired.length; i += 2) {
    drawCardPair(layout, paired[i], paired[i + 1]);
  }
  for (const card of model.fullWidth) {
    drawFullWidthFlow(layout, card);
  }
};

export const stackLines = (...parts: Array<string | null | undefined>) => {
  const lines = parts
    .map((part) => String(part ?? "").trim())
    .filter((part) => part && part !== "—");
  return lines.length ? lines : ["—"];
};
