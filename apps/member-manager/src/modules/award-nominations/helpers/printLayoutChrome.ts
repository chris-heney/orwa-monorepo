import { rgb, type PDFFont, type PDFPage } from "pdf-lib";

/** Shared print-card chrome used by award (and optionally scholarship) PDFs. */
export const NAVY = rgb(0.08, 0.2, 0.36);
export const GOLD = rgb(0.72, 0.55, 0.18);
export const INK = rgb(0.12, 0.12, 0.14);
export const MUTED = rgb(0.38, 0.39, 0.42);
export const RULE = rgb(0.78, 0.79, 0.81);
export const BAND = rgb(0.93, 0.94, 0.96);
export const ROW_ALT = rgb(0.97, 0.97, 0.98);
export const WHITE = rgb(1, 1, 1);
export const SIDEBAR_WELL = rgb(0.945, 0.952, 0.962);

export const ACCENT_W = 2.5;
export const CARD_PAD = 10;
export const CARD_GAP = 8;
export const COL_GAP = 12;
export const SIDEBAR_W = 168;
export const DIVIDER_INSET = 8;

export type ChromeFonts = {
  regular: PDFFont;
  bold: PDFFont;
};

export type TextMetrics = {
  wrapLines: (
    text: string,
    font: PDFFont,
    size: number,
    maxWidth: number
  ) => string[];
  fitText: (text: string, font: PDFFont, size: number, maxWidth: number) => string;
  fontAscent: (font: PDFFont, size: number) => number;
  fontDescent: (font: PDFFont, size: number) => number;
  baselineCentered: (
    bandBottom: number,
    bandHeight: number,
    font: PDFFont,
    size: number
  ) => number;
};

export type StackedField = {
  label: string;
  lines: string[];
};

const labelSize = 8;
const valueSize = 10;
const valueLead = 12;
const kickerSize = 7.5;

export const drawAccent = (
  page: PDFPage,
  x: number,
  bottom: number,
  height: number,
  color = NAVY
) => {
  page.drawRectangle({
    x,
    y: bottom,
    width: ACCENT_W,
    height,
    color,
  });
};

export const drawWell = (
  page: PDFPage,
  x: number,
  bottom: number,
  width: number,
  height: number,
  fill = SIDEBAR_WELL
) => {
  page.drawRectangle({
    x,
    y: bottom,
    width,
    height,
    color: fill,
  });
};

const stackedFieldHeight = (
  field: StackedField,
  fonts: ChromeFonts,
  metrics: TextMetrics,
  innerW: number
) => {
  const values = field.lines.length ? field.lines : ["—"];
  let h = metrics.fontAscent(fonts.bold, labelSize) + 4;
  for (const line of values) {
    h += metrics.wrapLines(line, fonts.regular, valueSize, innerW).length * valueLead;
  }
  return h;
};

export const measureStackedFields = (
  fields: StackedField[],
  fonts: ChromeFonts,
  metrics: TextMetrics,
  innerW: number
) => {
  let h = 0;
  fields.forEach((field, index) => {
    if (index > 0) h += 8;
    h += stackedFieldHeight(field, fonts, metrics, innerW);
  });
  return h;
};

export const drawStackedFields = (
  page: PDFPage,
  fonts: ChromeFonts,
  metrics: TextMetrics,
  x: number,
  top: number,
  innerW: number,
  fields: StackedField[]
) => {
  let cursor = top;
  fields.forEach((field, index) => {
    if (index > 0) cursor -= 8;
    cursor -= metrics.fontAscent(fonts.bold, labelSize);
    page.drawText(metrics.fitText(field.label, fonts.bold, labelSize, innerW), {
      x,
      y: cursor,
      size: labelSize,
      font: fonts.bold,
      color: NAVY,
    });
    cursor -= 4;
    const values = field.lines.length ? field.lines : ["—"];
    for (const line of values) {
      for (const row of metrics.wrapLines(line, fonts.regular, valueSize, innerW)) {
        cursor -= metrics.fontAscent(fonts.regular, valueSize);
        page.drawText(row, {
          x,
          y: cursor,
          size: valueSize,
          font: fonts.regular,
          color: INK,
        });
        cursor -= valueLead - metrics.fontAscent(fonts.regular, valueSize);
      }
    }
  });
  return cursor;
};

export const measureContactPair = (
  left: StackedField[],
  right: StackedField[],
  fonts: ChromeFonts,
  metrics: TextMetrics,
  pairWidth: number
) => {
  const inner = (pairWidth - CARD_PAD * 2 - ACCENT_W * 2 - 14 - 1) / 2;
  const body = Math.max(
    measureStackedFields(left, fonts, metrics, inner),
    measureStackedFields(right, fonts, metrics, inner)
  );
  return CARD_PAD + body + CARD_PAD;
};

export const drawContactPair = (
  page: PDFPage,
  fonts: ChromeFonts,
  metrics: TextMetrics,
  x: number,
  top: number,
  pairWidth: number,
  left: StackedField[],
  right: StackedField[],
  minHeight?: number
) => {
  const height = Math.max(
    measureContactPair(left, right, fonts, metrics, pairWidth),
    minHeight || 0
  );
  const bottom = top - height;
  const colW = (pairWidth - 1) / 2;
  const innerW = colW - CARD_PAD - ACCENT_W - 8;
  drawAccent(page, x, bottom, height, NAVY);
  drawAccent(page, x + colW + 1, bottom, height, NAVY);
  page.drawLine({
    start: { x: x + colW, y: bottom + DIVIDER_INSET },
    end: { x: x + colW, y: top - DIVIDER_INSET },
    thickness: 0.6,
    color: RULE,
  });
  const fieldTop = top - CARD_PAD;
  drawStackedFields(
    page,
    fonts,
    metrics,
    x + ACCENT_W + CARD_PAD,
    fieldTop,
    innerW,
    left
  );
  drawStackedFields(
    page,
    fonts,
    metrics,
    x + colW + 1 + ACCENT_W + CARD_PAD,
    fieldTop,
    innerW,
    right
  );
  return height;
};

export const measureEstCard = (fonts: ChromeFonts, metrics: TextMetrics) =>
  CARD_PAD +
  metrics.fontAscent(fonts.bold, kickerSize) +
  6 +
  metrics.fontAscent(fonts.bold, 14) +
  CARD_PAD;

export const drawEstCard = (
  page: PDFPage,
  fonts: ChromeFonts,
  metrics: TextMetrics,
  x: number,
  top: number,
  width: number,
  dateText: string
) => {
  const height = measureEstCard(fonts, metrics);
  const bottom = top - height;
  drawWell(page, x, bottom, width, height, WHITE);
  const kicker = "EST";
  const kickerW = fonts.bold.widthOfTextAtSize(kicker, kickerSize);
  let cursor = top - CARD_PAD - metrics.fontAscent(fonts.bold, kickerSize);
  page.drawText(kicker, {
    x: x + (width - kickerW) / 2,
    y: cursor,
    size: kickerSize,
    font: fonts.bold,
    color: MUTED,
  });
  const date = metrics.fitText(dateText || "—", fonts.bold, 14, width - CARD_PAD * 2);
  const dateW = fonts.bold.widthOfTextAtSize(date, 14);
  cursor -= 6 + metrics.fontAscent(fonts.bold, 14);
  page.drawText(date, {
    x: x + (width - dateW) / 2,
    y: cursor,
    size: 14,
    font: fonts.bold,
    color: NAVY,
  });
  return height;
};

export const measureMeteredCard = (fonts: ChromeFonts, metrics: TextMetrics) =>
  CARD_PAD +
  metrics.fontAscent(fonts.bold, kickerSize) +
  8 +
  metrics.fontAscent(fonts.bold, 7) +
  4 +
  metrics.fontAscent(fonts.bold, 13) +
  CARD_PAD;

export const drawMeteredCard = (
  page: PDFPage,
  fonts: ChromeFonts,
  metrics: TextMetrics,
  x: number,
  top: number,
  width: number,
  beginning: string,
  current: string
) => {
  const height = measureMeteredCard(fonts, metrics);
  const bottom = top - height;
  drawWell(page, x, bottom, width, height, WHITE);
  const title = "METERED CONNECTIONS";
  page.drawText(metrics.fitText(title, fonts.bold, kickerSize, width - CARD_PAD * 2), {
    x: x + CARD_PAD,
    y: top - CARD_PAD - metrics.fontAscent(fonts.bold, kickerSize),
    size: kickerSize,
    font: fonts.bold,
    color: NAVY,
  });
  const colW = (width - CARD_PAD * 2 - 8) / 2;
  const statTop =
    top - CARD_PAD - metrics.fontAscent(fonts.bold, kickerSize) - 8;
  const drawStat = (sx: number, label: string, value: string) => {
    const statH =
      metrics.fontAscent(fonts.bold, 7) + 4 + metrics.fontAscent(fonts.bold, 13);
    drawAccent(page, sx, statTop - statH, statH, GOLD);
    let cy = statTop - metrics.fontAscent(fonts.bold, 7);
    page.drawText(label, {
      x: sx + ACCENT_W + 5,
      y: cy,
      size: 7,
      font: fonts.bold,
      color: MUTED,
    });
    cy -= 4 + metrics.fontAscent(fonts.bold, 13);
    page.drawText(metrics.fitText(value, fonts.bold, 13, colW - ACCENT_W - 6), {
      x: sx + ACCENT_W + 5,
      y: cy,
      size: 13,
      font: fonts.bold,
      color: NAVY,
    });
  };
  drawStat(x + CARD_PAD, "BEGINNING", beginning);
  drawStat(x + CARD_PAD + colW + 8, "CURRENT", current);
  return height;
};

export type EmployeeRow = { label: string; value: string; total?: boolean };

export const measureEmployeeCard = (
  rows: EmployeeRow[],
  fonts: ChromeFonts,
  metrics: TextMetrics
) => {
  const rowH = 16;
  return (
    CARD_PAD +
    metrics.fontAscent(fonts.bold, kickerSize) +
    6 +
    rows.length * rowH +
    CARD_PAD
  );
};

export const drawEmployeeCard = (
  page: PDFPage,
  fonts: ChromeFonts,
  metrics: TextMetrics,
  x: number,
  top: number,
  width: number,
  rows: EmployeeRow[]
) => {
  const height = measureEmployeeCard(rows, fonts, metrics);
  const bottom = top - height;
  drawWell(page, x, bottom, width, height, WHITE);
  page.drawText(
    metrics.fitText("EMPLOYEE COUNTS", fonts.bold, kickerSize, width - CARD_PAD * 2),
    {
      x: x + CARD_PAD,
      y: top - CARD_PAD - metrics.fontAscent(fonts.bold, kickerSize),
      size: kickerSize,
      font: fonts.bold,
      color: NAVY,
    }
  );
  const rowH = 16;
  let rowTop =
    top - CARD_PAD - metrics.fontAscent(fonts.bold, kickerSize) - 6;
  rows.forEach((row, index) => {
    const rowBottom = rowTop - rowH;
    if (index % 2 === 1 && !row.total) {
      page.drawRectangle({
        x: x + 4,
        y: rowBottom,
        width: width - 8,
        height: rowH,
        color: ROW_ALT,
      });
    }
    if (row.total) {
      page.drawLine({
        start: { x: x + CARD_PAD, y: rowTop },
        end: { x: x + width - CARD_PAD, y: rowTop },
        thickness: 0.6,
        color: RULE,
      });
    }
    drawAccent(page, x + CARD_PAD, rowBottom + 3, rowH - 6, GOLD);
    const font = row.total ? fonts.bold : fonts.regular;
    const size = 8;
    const baseline = metrics.baselineCentered(rowBottom, rowH, font, size);
    page.drawText(
      metrics.fitText(row.label, font, size, width - CARD_PAD * 2 - 36),
      {
        x: x + CARD_PAD + ACCENT_W + 5,
        y: baseline,
        size,
        font,
        color: row.total ? NAVY : INK,
      }
    );
    const value = metrics.fitText(row.value, fonts.bold, size, 32);
    const valueW = fonts.bold.widthOfTextAtSize(value, size);
    page.drawText(value, {
      x: x + width - CARD_PAD - valueW,
      y: baseline,
      size,
      font: fonts.bold,
      color: NAVY,
    });
    rowTop = rowBottom;
  });
  return height;
};

export const measureFactCard = (fonts: ChromeFonts, metrics: TextMetrics) =>
  CARD_PAD +
  metrics.fontAscent(fonts.bold, kickerSize) +
  6 +
  metrics.fontAscent(fonts.bold, 12) +
  CARD_PAD;

export const drawFactCard = (
  page: PDFPage,
  fonts: ChromeFonts,
  metrics: TextMetrics,
  x: number,
  top: number,
  width: number,
  kicker: string,
  value: string
) => {
  const height = measureFactCard(fonts, metrics);
  const bottom = top - height;
  drawWell(page, x, bottom, width, height, WHITE);
  page.drawText(metrics.fitText(kicker, fonts.bold, kickerSize, width - CARD_PAD * 2), {
    x: x + CARD_PAD,
    y: top - CARD_PAD - metrics.fontAscent(fonts.bold, kickerSize),
    size: kickerSize,
    font: fonts.bold,
    color: NAVY,
  });
  page.drawText(metrics.fitText(value, fonts.bold, 12, width - CARD_PAD * 2), {
    x: x + CARD_PAD,
    y:
      top -
      CARD_PAD -
      metrics.fontAscent(fonts.bold, kickerSize) -
      6 -
      metrics.fontAscent(fonts.bold, 12),
    size: 12,
    font: fonts.bold,
    color: NAVY,
  });
  return height;
};

export const measureSidebar = (
  parts: number[],
  wellPad = 8
) => wellPad + parts.reduce((sum, h) => sum + h, 0) + CARD_GAP * Math.max(0, parts.length - 1) + wellPad;
