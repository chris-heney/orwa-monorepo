import {
  PDFDocument,
  rgb,
  type PDFEmbeddedPage,
  type PDFFont,
  type PDFImage,
  type PDFPage,
} from "pdf-lib";
import { embedPrintFonts } from "../../../helpers/printBrandFonts";
import CookieStore from "../../../helpers/ra-strapi-data-provider/src/CookieStore";
import { resolveMediaUrl } from "../../orwef-scholarships/helpers/resolveMediaUrl";
import {
  extractAttachmentText,
  isDocxAttachment,
  isPdfAttachment,
  isPlainTextAttachment,
  toWinAnsi,
  type DocumentTextBlock,
  type DocumentTextRun,
} from "./documentText";
import { employeeTotal } from "./recordDisplay";
import {
  asMediaItems,
  bestMediaUrl,
  countyRegion,
  displayValue,
  formatCount,
  formatEstablishedDate,
  isPersonNomineeAward,
  isSystemOfTheYearAward,
  nominationApplicationFilename,
  nomineeAddressLines,
  nomineeNameAsPrinted,
  nominatorAddressLines,
  nominatorFullName,
  printedAwardName,
  systemDisplayName,
  systemNameAsPrinted,
  type AwardNominationPrintRecord,
  type AwardPrintMedia,
} from "./nominationPrintModel";
import {
  CARD_GAP,
  COL_GAP,
  SIDEBAR_W,
  SIDEBAR_WELL,
  drawContactPair,
  drawEmployeeCard,
  drawEstCard,
  drawFactCard,
  drawMeteredCard,
  drawWell,
  measureContactPair,
  measureEmployeeCard,
  measureEstCard,
  measureFactCard,
  measureMeteredCard,
  measureSidebar,
  type ChromeFonts,
  type EmployeeRow,
  type StackedField,
  type TextMetrics,
} from "./printLayoutChrome";

export type MediaEmbedResult = "embedded" | "merged" | "linked" | "skipped";

const NAVY = rgb(0.08, 0.2, 0.36);
const GOLD = rgb(0.72, 0.55, 0.18);
const INK = rgb(0.12, 0.12, 0.14);
const MUTED = rgb(0.38, 0.39, 0.42);
const RULE = rgb(0.78, 0.79, 0.81);
const BAND = rgb(0.93, 0.94, 0.96);
const ROW_ALT = rgb(0.97, 0.97, 0.98);
const WHITE = rgb(1, 1, 1);

/** Shared page edges — every box and every text run uses these. */
const MARGIN_LEFT = 54;
const MARGIN_RIGHT = 54;
const MARGIN_TOP = 46;
const MARGIN_BOTTOM = 50;
const TEXT_X = MARGIN_LEFT;
/** Inset field/section text inside the 54pt margin so labels don't kiss the stripe. */
const CONTENT_INSET = 12;
const LABEL_X = MARGIN_LEFT + CONTENT_INSET;
const LABEL_COL = 168;
const PRINT_MAX_EDGE = 1800;
const LINE = 14;
const COVER_BAND_H = 88;
const COVER_GOLD_EDGE_H = 3;
const COVER_BAND_PAD = 20;
const COVER_KICKER_SIZE = 9;
const COVER_TITLE_SIZE = 16;
const COVER_ROW_GAP = 18;
/** Extra inset so cover/identity right labels are not flush to the bar edge. */
const HEADER_RIGHT_INSET = 16;
const SECTION_BAR_H = 24;
const IDENTITY_BAR_H = 30;
const IDENTITY_LEFT_SIZE = 11;
const IDENTITY_RIGHT_SIZE = 13;
const SECTION_BAR_STACK = 8 + SECTION_BAR_H + 10;
const PRINT_IMAGE_MAX_H = 280;
const IMAGE_GAP = 12;
const CAPTION_H = 16;
const ACCENT_W = 3;
const RULE_CLEARANCE = 3.5;
const ROW_PAD_Y = 6;
const MIN_ROW_H = 20;

/** Cap-box height above the baseline (pdf-lib `drawText` y is the baseline). */
export const fontAscent = (font: PDFFont, size: number) =>
  font.heightAtSize(size, { descender: false });

export const fontDescent = (font: PDFFont, size: number) =>
  Math.max(
    0,
    font.heightAtSize(size, { descender: true }) - fontAscent(font, size)
  );

/** Baseline that vertically centers the cap-box in `[bandBottom, bandBottom + bandHeight]`. */
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

export const wrapLines = (
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
): string[] => {
  const paragraphs = String(text || "").replace(/\r\n/g, "\n").split("\n");
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

type Layout = {
  doc: PDFDocument;
  page: PDFPage;
  regular: PDFFont;
  bold: PDFFont;
  italic: PDFFont;
  boldItalic: PDFFont;
  width: number;
  height: number;
  y: number;
  contentLeft: number;
  contentWidth: number;
  record: AwardNominationPrintRecord;
  isCover: boolean;
};

const contentRight = (layout: Layout) =>
  layout.width - MARGIN_RIGHT;

const chromeFonts = (layout: Layout): ChromeFonts => ({
  regular: layout.regular,
  bold: layout.bold,
});

const textMetrics = (): TextMetrics => ({
  wrapLines,
  fitText,
  fontAscent,
  fontDescent,
  baselineCentered,
});

const newPage = (layout: Layout, cover: boolean) => {
  layout.page = layout.doc.addPage([612, 792]);
  layout.width = 612;
  layout.height = 792;
  layout.contentLeft = MARGIN_LEFT;
  layout.contentWidth = 612 - MARGIN_LEFT - MARGIN_RIGHT;
  layout.isCover = cover;
  layout.y = layout.height - MARGIN_TOP;
};

const remainingHeight = (layout: Layout) => layout.y - MARGIN_BOTTOM;

const ensureSpace = (layout: Layout, needed: number) => {
  if (remainingHeight(layout) >= needed) return;
  newPage(layout, false);
  drawRunningHeader(layout);
};

const fitText = (
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
): string => {
  const value = String(text || "");
  if (font.widthOfTextAtSize(value, size) <= maxWidth) return value;
  let cut = value;
  while (cut.length > 1 && font.widthOfTextAtSize(`${cut}...`, size) > maxWidth) {
    cut = cut.slice(0, -1);
  }
  return cut.length ? `${cut}...` : "";
};

const drawRunningHeader = (layout: Layout) => {
  if (layout.isCover) return;
  const size = 8;
  const title = [
    systemNameAsPrinted(layout.record) || "Nomination",
    layout.record.award_type,
    layout.record.award_year,
  ]
    .filter((part) => part != null && String(part).trim() !== "")
    .join("  ·  ");
  const ascent = fontAscent(layout.regular, size);
  const baseline = layout.height - 18 - ascent;
  layout.page.drawText(
    fitText(title, layout.regular, size, layout.contentWidth),
    {
      x: TEXT_X,
      y: baseline,
      size,
      font: layout.regular,
      color: MUTED,
    }
  );
  const ruleY = baseline - fontDescent(layout.regular, size) - RULE_CLEARANCE;
  layout.page.drawLine({
    start: { x: TEXT_X, y: ruleY },
    end: { x: contentRight(layout), y: ruleY },
    thickness: 0.6,
    color: GOLD,
  });
  layout.y = Math.min(layout.y, ruleY - 14);
};

const drawCover = (layout: Layout) => {
  const { page, bold, width, height } = layout;
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

  const kickerAscent = fontAscent(bold, COVER_KICKER_SIZE);
  const titleAscent = fontAscent(bold, COVER_TITLE_SIZE);
  const kickerDescent = fontDescent(bold, COVER_KICKER_SIZE);
  const stackH = kickerAscent + COVER_ROW_GAP + titleAscent;
  const topPad = Math.max(COVER_BAND_PAD, (COVER_BAND_H - stackH) / 2);
  const kickerBaseline = height - topPad - kickerAscent;
  const titleBaseline = kickerBaseline - COVER_ROW_GAP - titleAscent;
  const rightMax = Math.min(220, layout.contentWidth * 0.38);
  const rightEdge = width - MARGIN_RIGHT - HEADER_RIGHT_INSET;
  const leftMax = Math.max(120, rightEdge - rightMax - TEXT_X - 16);

  const kicker = fitText(
    "OKLAHOMA RURAL WATER ASSOCIATION",
    bold,
    COVER_KICKER_SIZE,
    leftMax
  );
  const title = fitText(
    "Award Nomination Application",
    bold,
    COVER_TITLE_SIZE,
    leftMax
  );
  page.drawText(kicker, {
    x: TEXT_X,
    y: kickerBaseline,
    size: COVER_KICKER_SIZE,
    font: bold,
    color: GOLD,
  });
  page.drawText(title, {
    x: TEXT_X,
    y: titleBaseline,
    size: COVER_TITLE_SIZE,
    font: bold,
    color: WHITE,
  });

  const awardType = fitText(
    String(layout.record.award_type || "").trim(),
    bold,
    COVER_KICKER_SIZE,
    rightMax
  );
  if (awardType) {
    page.drawText(awardType, {
      x: rightEdge - bold.widthOfTextAtSize(awardType, COVER_KICKER_SIZE),
      y: kickerBaseline,
      size: COVER_KICKER_SIZE,
      font: bold,
      color: GOLD,
    });
  }

  const cycle = fitText(
    `Cycle ${layout.record.award_year ?? "—"}`,
    bold,
    COVER_TITLE_SIZE,
    rightMax
  );
  page.drawText(cycle, {
    x: rightEdge - bold.widthOfTextAtSize(cycle, COVER_TITLE_SIZE),
    y: titleBaseline,
    size: COVER_TITLE_SIZE,
    font: bold,
    color: WHITE,
  });

  const belowKicker = kickerBaseline - kickerDescent;
  const aboveTitle = titleBaseline + titleAscent;
  const ruleY = (belowKicker + aboveTitle) / 2;
  const kickerWidth = bold.widthOfTextAtSize(kicker, COVER_KICKER_SIZE);
  const ruleEnd = Math.min(TEXT_X + kickerWidth, rightEdge - rightMax - 12);
  if (ruleEnd > TEXT_X + 12) {
    page.drawLine({
      start: { x: TEXT_X, y: ruleY },
      end: { x: ruleEnd, y: ruleY },
      thickness: 0.7,
      color: GOLD,
    });
  }

  layout.y = bandBottom - COVER_GOLD_EDGE_H - 18;
};

const drawLeadTitles = (layout: Layout) => {
  const h1Size = 20;
  const h1 = systemNameAsPrinted(layout.record) || "—";
  const h1Lines = wrapLines(h1, layout.bold, h1Size, layout.contentWidth);
  const h1Lead = fontAscent(layout.bold, h1Size) + 6;
  for (const line of h1Lines.slice(0, 3)) {
    ensureSpace(layout, h1Lead + 4);
    layout.y -= fontAscent(layout.bold, h1Size);
    layout.page.drawText(line, {
      x: TEXT_X,
      y: layout.y,
      size: h1Size,
      font: layout.bold,
      color: NAVY,
    });
    layout.y -= 6;
  }
  if (isPersonNomineeAward(layout.record)) {
    const h2Size = 13;
    const h2Lines = wrapLines(
      nomineeNameAsPrinted(layout.record),
      layout.bold,
      h2Size,
      layout.contentWidth
    );
    const h2Lead = fontAscent(layout.bold, h2Size) + 5;
    for (const line of h2Lines.slice(0, 2)) {
      ensureSpace(layout, h2Lead + 4);
      layout.y -= fontAscent(layout.bold, h2Size);
      layout.page.drawText(line, {
        x: TEXT_X,
        y: layout.y,
        size: h2Size,
        font: layout.bold,
        color: GOLD,
      });
      layout.y -= 5;
    }
  }
  layout.y -= 10;
};

const sectionBar = (
  layout: Layout,
  left: string,
  right?: string,
  minFollow = MIN_ROW_H * 2 + 4
) => {
  const isIdentity = Boolean(right);
  const barH = isIdentity ? IDENTITY_BAR_H : SECTION_BAR_H;
  const leftSize = isIdentity ? IDENTITY_LEFT_SIZE : 10;
  ensureSpace(layout, 8 + barH + 10 + minFollow);
  layout.y -= 8;
  const bandBottom = layout.y - barH;
  layout.page.drawRectangle({
    x: MARGIN_LEFT,
    y: bandBottom,
    width: layout.contentWidth,
    height: barH,
    color: NAVY,
  });
  layout.page.drawRectangle({
    x: MARGIN_LEFT - ACCENT_W,
    y: bandBottom,
    width: ACCENT_W,
    height: barH,
    color: GOLD,
  });
  const rightPad = isIdentity ? HEADER_RIGHT_INSET : CONTENT_INSET;
  let rightText = "";
  let rightW = 0;
  if (right) {
    rightText = fitText(
      right,
      layout.bold,
      IDENTITY_RIGHT_SIZE,
      layout.contentWidth * 0.42
    );
    rightW = layout.bold.widthOfTextAtSize(rightText, IDENTITY_RIGHT_SIZE);
  }
  const leftMax = right
    ? layout.contentWidth - rightW - rightPad - CONTENT_INSET - 16
    : layout.contentWidth - CONTENT_INSET;
  const barBaseline = baselineCentered(bandBottom, barH, layout.bold, leftSize);
  layout.page.drawText(fitText(left, layout.bold, leftSize, leftMax), {
    x: LABEL_X,
    y: barBaseline,
    size: leftSize,
    font: layout.bold,
    color: WHITE,
  });
  if (right) {
    layout.page.drawText(rightText, {
      x: contentRight(layout) - rightPad - rightW,
      y: baselineCentered(bandBottom, barH, layout.bold, IDENTITY_RIGHT_SIZE),
      size: IDENTITY_RIGHT_SIZE,
      font: layout.bold,
      color: WHITE,
    });
  }
  layout.y = bandBottom - 10;
};

const fieldRow = (
  layout: Layout,
  label: string,
  value: string,
  options: { alt?: boolean } = {}
) => {
  const labelSize = 9;
  const valueSize = 10;
  const valueWidth = layout.contentWidth - LABEL_COL;
  const lines = wrapLines(value || "—", layout.regular, valueSize, valueWidth);
  const firstAscent = Math.max(
    fontAscent(layout.bold, labelSize),
    fontAscent(layout.regular, valueSize)
  );
  const extraLines = Math.max(0, lines.length - 1);
  const rowH = Math.max(MIN_ROW_H, ROW_PAD_Y + firstAscent + extraLines * LINE + ROW_PAD_Y);
  ensureSpace(layout, rowH + 2);
  const bandBottom = layout.y - rowH;
  if (options.alt) {
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
      ? baselineCentered(bandBottom, rowH, layout.regular, valueSize)
      : bandBottom + rowH - ROW_PAD_Y - firstAscent;
  layout.page.drawText(
    fitText(label, layout.bold, labelSize, LABEL_COL - CONTENT_INSET - 8),
    {
      x: LABEL_X,
      y: firstBaseline,
      size: labelSize,
      font: layout.bold,
      color: MUTED,
    }
  );
  lines.forEach((line, index) => {
    layout.page.drawText(line, {
      x: TEXT_X + LABEL_COL,
      y: firstBaseline - index * LINE,
      size: valueSize,
      font: layout.regular,
      color: INK,
    });
  });
  layout.page.drawLine({
    start: { x: MARGIN_LEFT, y: bandBottom },
    end: { x: contentRight(layout), y: bandBottom },
    thickness: 0.4,
    color: RULE,
  });
  layout.y = bandBottom;
};

const narrativeBlock = (layout: Layout, heading: string, body: string) => {
  const headSize = 10;
  const headH = 20;
  const bodySize = 10;
  ensureSpace(
    layout,
    8 + headH + 8 + fontAscent(layout.regular, bodySize) + 4
  );
  layout.y -= 8;
  const bandBottom = layout.y - headH;
  layout.page.drawRectangle({
    x: MARGIN_LEFT,
    y: bandBottom,
    width: layout.contentWidth,
    height: headH,
    color: BAND,
  });
  layout.page.drawText(heading, {
    x: LABEL_X,
    y: baselineCentered(bandBottom, headH, layout.bold, headSize),
    size: headSize,
    font: layout.bold,
    color: NAVY,
  });
  layout.y = bandBottom - 8;
  const lines = wrapLines(
    body?.trim() ? body : "—",
    layout.regular,
    bodySize,
    layout.contentWidth
  );
  for (const line of lines) {
    const ascent = fontAscent(layout.regular, bodySize);
    ensureSpace(layout, ascent + 4);
    layout.y -= ascent;
    layout.page.drawText(line, {
      x: TEXT_X,
      y: layout.y,
      size: bodySize,
      font: layout.regular,
      color: INK,
    });
    layout.y -= 4;
  }
  layout.y -= 6;
};

const SOFT_HEAD_H = 20;
const RULE_HEAD_H = 18;

const drawSoftHeading = (layout: Layout, title: string, minFollow = 24) => {
  ensureSpace(layout, 8 + SOFT_HEAD_H + 8 + minFollow);
  layout.y -= 8;
  const bandBottom = layout.y - SOFT_HEAD_H;
  layout.page.drawRectangle({
    x: MARGIN_LEFT,
    y: bandBottom,
    width: layout.contentWidth,
    height: SOFT_HEAD_H,
    color: BAND,
  });
  layout.page.drawText(
    fitText(title, layout.bold, 10, layout.contentWidth - CONTENT_INSET * 2),
    {
      x: LABEL_X,
      y: baselineCentered(bandBottom, SOFT_HEAD_H, layout.bold, 10),
      size: 10,
      font: layout.bold,
      color: NAVY,
    }
  );
  layout.y = bandBottom - 8;
};

const drawRuleHeading = (layout: Layout, title: string, minFollow = 20) => {
  ensureSpace(layout, 10 + RULE_HEAD_H + minFollow);
  layout.y -= 10;
  const label = fitText(title.toUpperCase(), layout.bold, 8, layout.contentWidth);
  layout.y -= fontAscent(layout.bold, 8);
  layout.page.drawText(label, {
    x: TEXT_X,
    y: layout.y,
    size: 8,
    font: layout.bold,
    color: MUTED,
  });
  layout.y -= 4;
  layout.page.drawLine({
    start: { x: TEXT_X, y: layout.y },
    end: { x: contentRight(layout), y: layout.y },
    thickness: 0.5,
    color: RULE,
  });
  layout.y -= 8;
};

const drawSoftKvBar = (layout: Layout, label: string, value: string) => {
  const barH = 20;
  ensureSpace(layout, 6 + barH + 6);
  layout.y -= 6;
  const bandBottom = layout.y - barH;
  layout.page.drawRectangle({
    x: MARGIN_LEFT,
    y: bandBottom,
    width: layout.contentWidth,
    height: barH,
    color: BAND,
  });
  const baseline = baselineCentered(bandBottom, barH, layout.bold, 8);
  layout.page.drawText(
    fitText(label.toUpperCase(), layout.bold, 8, layout.contentWidth * 0.55),
    {
      x: LABEL_X,
      y: baseline,
      size: 8,
      font: layout.bold,
      color: MUTED,
    }
  );
  const text = fitText(value, layout.regular, 9, layout.contentWidth * 0.38);
  const textW = layout.regular.widthOfTextAtSize(text, 9);
  layout.page.drawText(text, {
    x: contentRight(layout) - CONTENT_INSET - textW,
    y: baselineCentered(bandBottom, barH, layout.regular, 9),
    size: 9,
    font: layout.regular,
    color: INK,
  });
  layout.y = bandBottom - 6;
};

const headingKindFor = (label: string): "navy" | "rule" =>
  /board|photograph|biography file/i.test(label) ? "rule" : "navy";

const drawPrintHeading = (
  layout: Layout,
  label: string,
  minFollow = MIN_ROW_H * 2
) => {
  if (headingKindFor(label) === "rule") {
    drawRuleHeading(layout, label, minFollow);
    return;
  }
  sectionBar(layout, label, undefined, minFollow);
};

const drawSystemOverview = (layout: Layout) => {
  const record = layout.record;
  const fonts = chromeFonts(layout);
  const metrics = textMetrics();
  const leftW = layout.contentWidth - SIDEBAR_W - COL_GAP;
  const addressLines = nomineeAddressLines(record);
  const leftFields: StackedField[] = [
    { label: "Address", lines: addressLines.length ? addressLines : ["—"] },
  ];
  const rightFields: StackedField[] = [
    { label: "Phone", lines: [displayValue(record.daytime_phone)] },
    { label: "Email", lines: [displayValue(record.email)] },
  ];
  const contactH = measureContactPair(leftFields, rightFields, fonts, metrics, leftW);

  const sidebarParts: number[] = [];
  const est = formatEstablishedDate(record.operation_start_date);
  sidebarParts.push(measureEstCard(fonts, metrics));
  if (!isSystemOfTheYearAward(record.award_type) && record.employment_date) {
    sidebarParts.push(measureFactCard(fonts, metrics));
  }
  sidebarParts.push(measureMeteredCard(fonts, metrics));
  const employeeRows: EmployeeRow[] = isSystemOfTheYearAward(record.award_type)
    ? [
        { label: "Clerical employees", value: formatCount(record.clerical_employees) },
        {
          label: "Operation & maintenance",
          value: formatCount(record.operation_maintenance_employees),
        },
        { label: "Management", value: formatCount(record.management_employees) },
        { label: "Total", value: formatCount(employeeTotal(record)), total: true },
      ]
    : [];
  if (employeeRows.length) {
    sidebarParts.push(measureEmployeeCard(employeeRows, fonts, metrics));
  }
  const sidebarH = measureSidebar(sidebarParts);
  const blockH = Math.max(contactH, sidebarH);

  ensureSpace(layout, blockH + 12);
  const top = layout.y;
  const sidebarX = MARGIN_LEFT + leftW + COL_GAP;
  drawWell(layout.page, sidebarX, top - sidebarH, SIDEBAR_W, sidebarH, SIDEBAR_WELL);
  drawContactPair(
    layout.page,
    fonts,
    metrics,
    MARGIN_LEFT,
    top,
    leftW,
    leftFields,
    rightFields,
    blockH
  );

  let sideTop = top - 8;
  const sideInnerX = sidebarX + 6;
  const sideInnerW = SIDEBAR_W - 12;
  sideTop -= drawEstCard(
    layout.page,
    fonts,
    metrics,
    sideInnerX,
    sideTop,
    sideInnerW,
    est || "—"
  );
  sideTop -= CARD_GAP;
  if (!isSystemOfTheYearAward(record.award_type) && record.employment_date) {
    sideTop -= drawFactCard(
      layout.page,
      fonts,
      metrics,
      sideInnerX,
      sideTop,
      sideInnerW,
      "DATE EMPLOYED",
      formatEstablishedDate(record.employment_date) || displayValue(record.employment_date)
    );
    sideTop -= CARD_GAP;
  }
  sideTop -= drawMeteredCard(
    layout.page,
    fonts,
    metrics,
    sideInnerX,
    sideTop,
    sideInnerW,
    formatCount(record.beginning_members),
    formatCount(record.current_members)
  );
  if (employeeRows.length) {
    sideTop -= CARD_GAP;
    drawEmployeeCard(
      layout.page,
      fonts,
      metrics,
      sideInnerX,
      sideTop,
      sideInnerW,
      employeeRows
    );
  }
  layout.y = top - blockH - 10;
};

const LETTER_WIDTH = 612;
const LETTER_HEIGHT = 792;

const isLetterPage = (page: PDFPage) => {
  const { width, height } = page.getSize();
  return (
    Math.abs(width - LETTER_WIDTH) < 0.5 &&
    Math.abs(height - LETTER_HEIGHT) < 0.5
  );
};

const drawFooters = (layout: Layout) => {
  const pages = layout.doc.getPages();
  const total = pages.length;
  const who =
    nomineeNameAsPrinted(layout.record) ||
    systemNameAsPrinted(layout.record) ||
    printedAwardName(layout.record) ||
    "Nomination";
  const award = layout.record.award_type || "Award nomination";
  pages.forEach((page, index) => {
    // copyPages fallback can insert a non-letter sheet; skip footer there.
    if (!isLetterPage(page)) return;
    const { width } = page.getSize();
    const footSize = 8;
    const footBaseline = baselineCentered(14, 22, layout.regular, footSize);
    const ruleY = footBaseline + fontAscent(layout.regular, footSize) + RULE_CLEARANCE;
    page.drawLine({
      start: { x: TEXT_X, y: ruleY },
      end: { x: width - MARGIN_RIGHT, y: ruleY },
      thickness: 0.6,
      color: GOLD,
    });
    const mark = `Page ${index + 1} of ${total}`;
    const markW = layout.regular.widthOfTextAtSize(mark, footSize);
    const markX = width - MARGIN_RIGHT - markW;
    page.drawText(
      fitText(`${who}  ·  ${award}`, layout.regular, footSize, markX - TEXT_X - 10),
      {
        x: TEXT_X,
        y: footBaseline,
        size: footSize,
        font: layout.regular,
        color: MUTED,
      }
    );
    page.drawText(mark, {
      x: markX,
      y: footBaseline,
      size: footSize,
      font: layout.regular,
      color: MUTED,
    });
  });
};

const fetchMediaBytes = async (
  file: NonNullable<AwardPrintMedia>
): Promise<{ bytes: Uint8Array; href: string } | null> => {
  const href = resolveMediaUrl(bestMediaUrl(file));
  if (!href) return null;
  try {
    const response = await fetch(href, { headers: authHeaders() });
    if (!response.ok) {
      console.warn(
        `Award print: skipped attachment ${file.name || href} (${response.status})`
      );
      return null;
    }
    return { bytes: new Uint8Array(await response.arrayBuffer()), href };
  } catch (error) {
    console.warn(`Award print: skipped attachment ${file.name || href}`, error);
    return null;
  }
};

const toPrintImage = async (
  pdfDoc: PDFDocument,
  bytes: Uint8Array,
  mime: string
): Promise<PDFImage | null> => {
  const lower = (mime || "").toLowerCase();
  const tryNative = async () => {
    if (lower.includes("png")) return pdfDoc.embedPng(bytes);
    if (lower.includes("jpeg") || lower.includes("jpg")) {
      return pdfDoc.embedJpg(bytes);
    }
    return null;
  };

  try {
    const native = await tryNative();
    if (
      native &&
      native.width <= PRINT_MAX_EDGE &&
      native.height <= PRINT_MAX_EDGE
    ) {
      return native;
    }
  } catch {
    // Convert through canvas (WebP / oversize / odd encodings).
  }

  if (typeof createImageBitmap !== "function") return null;
  try {
    const blob = new Blob([bytes as BlobPart], {
      type: mime || "application/octet-stream",
    });
    const bitmap = await createImageBitmap(blob);
    const scale = Math.min(
      PRINT_MAX_EDGE / bitmap.width,
      PRINT_MAX_EDGE / bitmap.height,
      1
    );
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    const jpeg = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((part) => resolve(part), "image/jpeg", 0.82)
    );
    if (!jpeg) return null;
    return pdfDoc.embedJpg(new Uint8Array(await jpeg.arrayBuffer()));
  } catch {
    return null;
  }
};

const runFont = (layout: Layout, run: DocumentTextRun): PDFFont => {
  if (run.bold && run.italic) return layout.boldItalic;
  if (run.bold) return layout.bold;
  if (run.italic) return layout.italic;
  return layout.regular;
};

const wrapStyledRuns = (
  layout: Layout,
  runs: DocumentTextRun[],
  size: number,
  maxWidth: number
): Array<Array<{ text: string; font: PDFFont }>> => {
  const lines: Array<Array<{ text: string; font: PDFFont }>> = [];
  let current: Array<{ text: string; font: PDFFont }> = [];
  let width = 0;
  const flush = () => {
    if (current.length) lines.push(current);
    current = [];
    width = 0;
  };
  for (const run of runs) {
    const font = runFont(layout, run);
    const pieces = toWinAnsi(run.text).split(/(\s+)/);
    for (const piece of pieces) {
      if (!piece) continue;
      const pieceW = font.widthOfTextAtSize(piece, size);
      if (width + pieceW > maxWidth && current.length) {
        flush();
        if (/^\s+$/.test(piece)) continue;
      }
      current.push({ text: piece, font });
      width += pieceW;
    }
  }
  flush();
  return lines.length ? lines : [[]];
};

const drawStyledRuns = (
  layout: Layout,
  runs: DocumentTextRun[],
  size: number,
  indent = 0
) => {
  const maxWidth = layout.contentWidth - indent;
  const lines = wrapStyledRuns(layout, runs, size, maxWidth);
  for (const line of lines) {
    const ascent = Math.max(
      fontAscent(layout.regular, size),
      ...line.map((part) => fontAscent(part.font, size))
    );
    ensureSpace(layout, ascent + 4);
    layout.y -= ascent;
    let x = layout.contentLeft + indent;
    for (const part of line) {
      if (!part.text) continue;
      layout.page.drawText(part.text, {
        x,
        y: layout.y,
        size,
        font: part.font,
        color: INK,
      });
      x += part.font.widthOfTextAtSize(part.text, size);
    }
    layout.y -= 4;
  }
};

const drawDocumentBlocks = (layout: Layout, blocks: DocumentTextBlock[]) => {
  for (const block of blocks) {
    if (block.kind === "heading") {
      const size = block.level === 1 ? 13 : block.level === 2 ? 12 : 11;
      layout.y -= 6;
      drawStyledRuns(
        layout,
        block.runs.map((run) => ({ ...run, bold: true })),
        size
      );
      layout.y -= 4;
      continue;
    }
    if (block.kind === "list") {
      block.items.forEach((item, index) => {
        const marker = block.ordered ? `${index + 1}. ` : "- ";
        const markerSize = 10;
        const ascent = fontAscent(layout.regular, markerSize);
        ensureSpace(layout, ascent + 4);
        layout.y -= ascent;
        layout.page.drawText(marker, {
          x: layout.contentLeft,
          y: layout.y,
          size: markerSize,
          font: layout.regular,
          color: INK,
        });
        const markerW = layout.regular.widthOfTextAtSize(marker, markerSize);
        const savedY = layout.y;
        const lines = wrapStyledRuns(
          layout,
          item,
          markerSize,
          layout.contentWidth - markerW
        );
        let x = layout.contentLeft + markerW;
        lines.forEach((line, lineIndex) => {
          if (lineIndex > 0) {
            const nextAscent = Math.max(
              fontAscent(layout.regular, markerSize),
              ...line.map((part) => fontAscent(part.font, markerSize))
            );
            ensureSpace(layout, nextAscent + 4);
            layout.y -= nextAscent;
            x = layout.contentLeft + markerW;
          } else {
            layout.y = savedY;
          }
          for (const part of line) {
            layout.page.drawText(part.text, {
              x,
              y: layout.y,
              size: markerSize,
              font: part.font,
              color: INK,
            });
            x += part.font.widthOfTextAtSize(part.text, markerSize);
          }
          layout.y -= 4;
        });
      });
      layout.y -= 4;
      continue;
    }
    drawStyledRuns(layout, block.runs, 10);
    layout.y -= 6;
  }
};

const drawCaption = (layout: Layout, caption: string) => {
  if (!caption) return;
  layout.page.drawText(toWinAnsi(caption).slice(0, 90), {
    x: layout.contentLeft,
    y: layout.y,
    size: 9,
    font: layout.regular,
    color: MUTED,
  });
  layout.y -= CAPTION_H;
};

const addUnavailableNote = (
  layout: Layout,
  label: string | undefined,
  fileName: string
) => {
  const captionH = fileName ? CAPTION_H : 0;
  if (label) drawPrintHeading(layout, label, captionH + MIN_ROW_H + 4);
  drawCaption(layout, fileName);
  fieldRow(layout, "Note", "Attachment could not be included in print", {
    alt: true,
  });
};

const appendDocumentText = (
  layout: Layout,
  label: string | undefined,
  fileName: string,
  blocks: DocumentTextBlock[]
) => {
  const captionH = fileName ? CAPTION_H : 0;
  if (label) {
    drawPrintHeading(layout, label, captionH + fontAscent(layout.regular, 10) + 8);
  } else {
    ensureSpace(layout, captionH + fontAscent(layout.regular, 10) + 8);
  }
  drawCaption(layout, fileName);
  drawDocumentBlocks(layout, blocks);
};

const appendImageOnPage = (
  layout: Layout,
  label: string | undefined,
  image: PDFImage,
  caption: string
) => {
  const captionH = caption ? CAPTION_H : 0;
  const maxW = layout.contentWidth;
  const widthLimitedH = image.height * Math.min(maxW / Math.max(image.width, 1), 1);
  const printSafeH = Math.min(widthLimitedH, PRINT_IMAGE_MAX_H);
  const headingH = label ? 8 + RULE_HEAD_H + 10 : 8;
  const needed = headingH + captionH + printSafeH + IMAGE_GAP;
  ensureSpace(layout, needed);
  if (label) {
    drawPrintHeading(layout, label, captionH + Math.min(printSafeH, 80));
  } else {
    layout.y -= 8;
  }
  drawCaption(layout, caption);
  const availH = Math.max(40, remainingHeight(layout) - 8);
  const scale = Math.min(
    maxW / Math.max(image.width, 1),
    printSafeH / Math.max(image.height, 1),
    availH / Math.max(image.height, 1),
    1
  );
  const drawW = image.width * scale;
  const drawH = image.height * scale;
  layout.page.drawImage(image, {
    x: layout.contentLeft + (maxW - drawW) / 2,
    y: layout.y - drawH,
    width: drawW,
    height: drawH,
  });
  layout.y -= drawH + IMAGE_GAP;
};

const pageHasContents = (page: PDFPage): boolean => {
  try {
    return Boolean(
      page.node.Contents() || page.node.normalizedEntries().Contents
    );
  } catch {
    return false;
  }
};

const dropQueuedEmbeddedPage = (
  doc: PDFDocument,
  embedded: { ref?: unknown }
) => {
  const queued = (doc as unknown as { embeddedPages?: unknown[] })
    .embeddedPages;
  if (!Array.isArray(queued)) return;
  const index = queued.indexOf(embedded);
  if (index >= 0) queued.splice(index, 1);
};

const drawEmbeddedPageOnLetter = (
  layout: Layout,
  embedded: PDFEmbeddedPage,
  label?: string
) => {
  newPage(layout, false);
  drawRunningHeader(layout);
  if (label) drawPrintHeading(layout, label);
  const maxW = layout.contentWidth;
  const boxTop = layout.y;
  const boxBottom = MARGIN_BOTTOM + 8;
  const maxH = Math.max(40, boxTop - boxBottom);
  const scale = Math.min(
    maxW / Math.max(embedded.width, 1),
    maxH / Math.max(embedded.height, 1),
    1
  );
  const drawW = embedded.width * scale;
  const drawH = embedded.height * scale;
  layout.page.drawPage(embedded, {
    x: layout.contentLeft + (maxW - drawW) / 2,
    y: boxBottom + (maxH - drawH) / 2,
    width: drawW,
    height: drawH,
  });
  layout.y = MARGIN_BOTTOM;
};

const appendPdfPages = async (
  layout: Layout,
  bytes: Uint8Array,
  label?: string
): Promise<boolean> => {
  let src: PDFDocument;
  try {
    src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  } catch (error) {
    console.warn("Award print: could not parse attached PDF", error);
    return false;
  }

  const pages = src.getPages();
  let added = 0;
  for (let index = 0; index < pages.length; index += 1) {
    const page = pages[index];
    if (!pageHasContents(page)) {
      console.warn(
        `Award print: skipped empty PDF page ${index + 1} (no Contents stream)`
      );
      continue;
    }

    let queued: PDFEmbeddedPage | null = null;
    try {
      const [embedded] = await layout.doc.embedPages([page]);
      queued = embedded;
      // Force embed now — pdf-lib otherwise throws on save() for missing Contents.
      await embedded.embed();
      drawEmbeddedPageOnLetter(layout, embedded, label);
      added += 1;
      continue;
    } catch (error) {
      if (queued) dropQueuedEmbeddedPage(layout.doc, queued);
      const message = error instanceof Error ? error.message : String(error);
      if (/missing Contents/i.test(message)) {
        console.warn(
          `Award print: skipped empty PDF page ${index + 1}`,
          error
        );
        continue;
      }
      try {
        const [copied] = await layout.doc.copyPages(src, [index]);
        layout.doc.addPage(copied);
        added += 1;
        console.warn(
          `Award print: embedded page ${index + 1} failed (${message}); copied original page instead`
        );
      } catch (copyError) {
        console.warn(
          `Award print: skipped unreadable PDF page ${index + 1}`,
          copyError
        );
      }
    }
  }
  return added > 0;
};

const appendMediaSlot = async (
  layout: Layout,
  label: string,
  files: AwardPrintMedia | AwardPrintMedia[] | undefined,
  results: Record<string, MediaEmbedResult>
): Promise<void> => {
  const items = asMediaItems(files);
  const key = label;
  if (items.length === 0) {
    results[key] = "skipped";
    return;
  }

  let outcome: MediaEmbedResult = "skipped";
  let headingDrawn = false;
  const heading = () => {
    if (headingDrawn) return undefined;
    headingDrawn = true;
    return label;
  };
  for (const item of items) {
    try {
      const fetched = await fetchMediaBytes(item);
      if (!fetched) {
        continue;
      }
      const mime = (item.mime || "").toLowerCase();
      const fileName = item.name || "Attachment";
      const ext = item.ext || fileName;

      if (isPdfAttachment(mime, ext)) {
        const merged = await appendPdfPages(
          layout,
          fetched.bytes,
          headingDrawn ? undefined : label
        );
        if (merged) {
          headingDrawn = true;
          outcome = "merged";
          continue;
        }
        const extracted = await extractAttachmentText(fetched.bytes, mime, ext);
        if (extracted.ok) {
          appendDocumentText(layout, heading(), fileName, extracted.blocks);
          if (outcome !== "merged") outcome = "embedded";
          continue;
        }
        console.warn(
          `Award print: could not include PDF attachment ${fileName}`
        );
        addUnavailableNote(layout, heading(), fileName);
        continue;
      }

      if (isDocxAttachment(mime, ext) || isPlainTextAttachment(mime, ext)) {
        const extracted = await extractAttachmentText(fetched.bytes, mime, ext);
        if (extracted.ok) {
          appendDocumentText(layout, heading(), fileName, extracted.blocks);
          if (outcome !== "merged") outcome = "embedded";
          continue;
        }
        addUnavailableNote(layout, heading(), fileName);
        continue;
      }

      if (mime.startsWith("image/") || !mime) {
        const image = await toPrintImage(layout.doc, fetched.bytes, mime);
        if (image) {
          appendImageOnPage(layout, heading(), image, fileName);
          if (outcome !== "merged") outcome = "embedded";
          continue;
        }
      }

      const extracted = await extractAttachmentText(fetched.bytes, mime, ext);
      if (extracted.ok) {
        appendDocumentText(layout, heading(), fileName, extracted.blocks);
        if (outcome !== "merged") outcome = "embedded";
        continue;
      }
      addUnavailableNote(layout, heading(), fileName);
    } catch (error) {
      console.warn(
        `Award print: skipped attachment ${item.name || label}`,
        error
      );
    }
  }
  results[key] = outcome;
};

const drawSectionOneAndTwo = (layout: Layout) => {
  drawCover(layout);
  drawLeadTitles(layout);
  sectionBar(
    layout,
    systemDisplayName(layout.record) || systemNameAsPrinted(layout.record) || "System",
    countyRegion(layout.record) || undefined
  );
  drawSystemOverview(layout);

  narrativeBlock(
    layout,
    "What makes the nominee deserving of this award?",
    String(layout.record.justification || "")
  );

};

const drawBiographyBlock = (layout: Layout) => {
  drawSoftKvBar(
    layout,
    "Biography method",
    displayValue(layout.record.biography_method)
  );
  if (
    layout.record.biography_method === "Copy/Paste or Type Biography" ||
    layout.record.biography_text
  ) {
    narrativeBlock(
      layout,
      "Biography",
      String(layout.record.biography_text || "")
    );
  }
};

const drawSectionThree = (layout: Layout) => {
  drawSoftHeading(layout, "Nominator Information", 40);
  const fonts = chromeFonts(layout);
  const metrics = textMetrics();
  const name = nominatorFullName(layout.record);
  const address = nominatorAddressLines(layout.record);
  const left: StackedField[] = [
    { label: "Nominator", lines: name ? [name, ...address] : address.length ? address : ["—"] },
  ];
  const right: StackedField[] = [
    { label: "Phone", lines: [displayValue(layout.record.nominator_phone)] },
    { label: "Email", lines: [displayValue(layout.record.nominator_email)] },
  ];
  const height = measureContactPair(
    left,
    right,
    fonts,
    metrics,
    layout.contentWidth
  );
  ensureSpace(layout, height + 8);
  drawContactPair(
    layout.page,
    fonts,
    metrics,
    MARGIN_LEFT,
    layout.y,
    layout.contentWidth,
    left,
    right
  );
  layout.y -= height + 8;
};

/** Build one nomination as its own PDF (never merged with siblings). */
export const generateNominationApplicationPdf = async (
  record: AwardNominationPrintRecord
): Promise<{
  blob: Blob;
  filename: string;
  media: Record<string, MediaEmbedResult>;
}> => {
  const doc = await PDFDocument.create();
  const { regular, bold, italic, boldItalic } = await embedPrintFonts(doc);
  const filename = nominationApplicationFilename(record);
  doc.setTitle(
    `ORWA Award Nomination — ${record.nominee_name || systemDisplayName(record) || "Nomination"}`
  );
  doc.setAuthor("Oklahoma Rural Water Association");
  doc.setSubject("Award Nomination Application");
  doc.setKeywords([
    String(record.award_type || "Award"),
    String(record.award_year || ""),
    String(record.system_name || ""),
  ]);

  const page = doc.addPage([612, 792]);
  const layout: Layout = {
    doc,
    page,
    regular,
    bold,
    italic,
    boldItalic,
    width: 612,
    height: 792,
    y: 792 - MARGIN_TOP,
    contentLeft: MARGIN_LEFT,
    contentWidth: 612 - MARGIN_LEFT - MARGIN_RIGHT,
    record,
    isCover: true,
  };

  drawSectionOneAndTwo(layout);

  const media: Record<string, MediaEmbedResult> = {};
  if (isSystemOfTheYearAward(record.award_type)) {
    if (asMediaItems(record.board_list_file).length > 0) {
      await appendMediaSlot(
        layout,
        "Board / employee list",
        record.board_list_file,
        media
      );
    } else {
      drawRuleHeading(layout, "Board / employee list");
      if (record.board_list_method) {
        drawSoftKvBar(
          layout,
          "Board / employee list via",
          displayValue(record.board_list_method)
        );
      }
    }
  }
  drawBiographyBlock(layout);
  if (asMediaItems(record.biography_file).length > 0) {
    await appendMediaSlot(layout, "Biography file", record.biography_file, media);
  }
  const photoCount = asMediaItems(record.photographs).length;
  if (photoCount > 0) {
    await appendMediaSlot(
      layout,
      `Photographs (${photoCount})`,
      record.photographs,
      media
    );
  } else {
    media.Photographs = "skipped";
    drawSoftKvBar(layout, "Photographs", "None");
  }

  drawSectionThree(layout);

  if (asMediaItems(record.supporting_documents).length > 0) {
    await appendMediaSlot(
      layout,
      "Appendix  ·  Supporting documents",
      record.supporting_documents,
      media
    );
  }
  if (asMediaItems(record.nomination_pdf).length > 0) {
    await appendMediaSlot(
      layout,
      "Appendix  ·  Original submitted packet",
      record.nomination_pdf,
      media
    );
  }

  drawFooters(layout);
  const bytes = await doc.save();
  return {
    blob: new Blob([new Uint8Array(bytes)], { type: "application/pdf" }),
    filename,
    media,
  };
};

/** Chromium iframe `afterprint` often fires as the dialog opens — ignore that. */
export const PRINT_AFTERPRINT_IGNORE_MS = 600;
/** Blocked or dismissed dialogs must not leave Print Selected spinning. */
export const PRINT_DIALOG_TIMEOUT_MS = 180_000;
export const PRINT_NEXT_JOB_GAP_MS = 300;

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

/**
 * Open one PDF in a hidden iframe and invoke the browser print dialog.
 * Resolves only after the dialog closes (`afterprint` / window `focus`)
 * or the timeout fires, so the next job can call `print()` safely.
 */
export const printPdfBlob = (blob: Blob): Promise<void> =>
  new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("Print preview requires a browser"));
      return;
    }
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    iframe.setAttribute("title", "Print nomination application");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.cssText =
      "position:fixed;inset:0;width:1px;height:1px;opacity:0;border:0;pointer-events:none;";

    let settled = false;
    let openedAt = 0;
    let timeoutId = 0;
    let win: Window | null = null;

    const dialogLikelyClosed = () =>
      openedAt > 0 && Date.now() - openedAt >= PRINT_AFTERPRINT_IGNORE_MS;

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("afterprint", onCloseSignal);
      window.removeEventListener("focus", onCloseSignal);
      win?.removeEventListener("afterprint", onCloseSignal);
      iframe.remove();
      URL.revokeObjectURL(url);
    };

    const finish = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve();
    };

    const fail = (message: string) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error(message));
    };

    const onCloseSignal = () => {
      if (dialogLikelyClosed()) finish();
    };

    iframe.onload = () => {
      if (settled) return;
      win = iframe.contentWindow;
      if (!win) {
        fail("Print preview failed to load");
        return;
      }
      win.addEventListener("afterprint", onCloseSignal);
      window.addEventListener("afterprint", onCloseSignal);
      window.addEventListener("focus", onCloseSignal);
      openedAt = Date.now();
      try {
        win.focus();
        win.print();
      } catch {
        finish();
      }
    };
    iframe.onerror = () => {
      fail("Print preview failed to load");
    };
    iframe.src = url;
    document.body.appendChild(iframe);
    timeoutId = window.setTimeout(finish, PRINT_DIALOG_TIMEOUT_MS);
  });

/** One print job per nomination — do not concatenate into a single PDF. */
export const printNominationApplication = async (
  record: AwardNominationPrintRecord
) => {
  const { blob, filename, media } = await generateNominationApplicationPdf(
    record
  );
  await printPdfBlob(blob);
  return { filename, media, byteLength: blob.size };
};

export type PrintQueueResult = {
  printed: string[];
  failed: Array<{ filename: string; message: string }>;
};

/** One print job per nomination — do not concatenate into a single PDF. */
export const printNominationApplications = async (
  records: AwardNominationPrintRecord[],
  printOne: (
    record: AwardNominationPrintRecord
  ) => Promise<{ filename: string }> = printNominationApplication
): Promise<PrintQueueResult> => {
  const printed: string[] = [];
  const failed: PrintQueueResult["failed"] = [];
  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    try {
      const result = await printOne(record);
      printed.push(result.filename);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn("Award print: job failed", error);
      failed.push({
        filename: nominationApplicationFilename(record),
        message,
      });
    }
    if (index < records.length - 1) {
      await delay(PRINT_NEXT_JOB_GAP_MS);
    }
  }
  return { printed, failed };
};
