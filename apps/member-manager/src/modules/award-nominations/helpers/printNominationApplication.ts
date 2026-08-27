import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFEmbeddedPage,
  type PDFFont,
  type PDFImage,
  type PDFPage,
} from "pdf-lib";
import CookieStore from "../../../helpers/ra-strapi-data-provider/src/CookieStore";
import { resolveMediaUrl } from "../../orwef-scholarships/helpers/resolveMediaUrl";
import {
  asMediaItems,
  bestMediaUrl,
  countyRegion,
  displayValue,
  identificationRows,
  isPersonNomineeAward,
  isSystemOfTheYearAward,
  nominationApplicationFilename,
  nomineeBasicRows,
  nomineeNameAsPrinted,
  nominatorFullName,
  nominatorRows,
  printedAwardName,
  systemDisplayName,
  systemNameAsPrinted,
  systemRecordRows,
  type AwardNominationPrintRecord,
  type AwardPrintMedia,
} from "./nominationPrintModel";

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
const LABEL_COL = 168;
const PRINT_MAX_EDGE = 1800;
const LINE = 14;
const COVER_BAND_H = 82;
const COVER_GOLD_EDGE_H = 3;
const COVER_BAND_PAD = 16;
const COVER_KICKER_SIZE = 9;
const COVER_TITLE_SIZE = 16;
const COVER_ROW_GAP = 14;
const SECTION_BAR_H = 24;
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

const newPage = (layout: Layout, cover: boolean) => {
  layout.page = layout.doc.addPage([612, 792]);
  layout.width = 612;
  layout.height = 792;
  layout.contentLeft = MARGIN_LEFT;
  layout.contentWidth = 612 - MARGIN_LEFT - MARGIN_RIGHT;
  layout.isCover = cover;
  layout.y = layout.height - MARGIN_TOP;
};

const ensureSpace = (layout: Layout, needed: number) => {
  if (layout.y - needed >= MARGIN_BOTTOM) return;
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
  const kickerBaseline = height - COVER_BAND_PAD - kickerAscent;
  const titleBaseline = kickerBaseline - COVER_ROW_GAP - titleAscent;
  const rightMax = Math.min(240, layout.contentWidth * 0.42);

  const kicker = "OKLAHOMA RURAL WATER ASSOCIATION";
  page.drawText(kicker, {
    x: TEXT_X,
    y: kickerBaseline,
    size: COVER_KICKER_SIZE,
    font: bold,
    color: GOLD,
  });

  const title = "Award Nomination Application";
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
      x: width - MARGIN_RIGHT - bold.widthOfTextAtSize(awardType, COVER_KICKER_SIZE),
      y: kickerBaseline,
      size: COVER_KICKER_SIZE,
      font: bold,
      color: GOLD,
    });
  }

  const cycle = `Cycle ${layout.record.award_year ?? "—"}`;
  page.drawText(cycle, {
    x: width - MARGIN_RIGHT - bold.widthOfTextAtSize(cycle, COVER_TITLE_SIZE),
    y: titleBaseline,
    size: COVER_TITLE_SIZE,
    font: bold,
    color: WHITE,
  });

  // Short gold rule under the left kicker only — midway to the title caps, never through text.
  const kickerWidth = bold.widthOfTextAtSize(kicker, COVER_KICKER_SIZE);
  const ruleY = kickerBaseline - COVER_ROW_GAP / 2;
  page.drawLine({
    start: { x: TEXT_X, y: ruleY },
    end: { x: TEXT_X + kickerWidth, y: ruleY },
    thickness: 0.7,
    color: GOLD,
  });

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

const sectionBar = (layout: Layout, left: string, right?: string) => {
  ensureSpace(layout, SECTION_BAR_H + 16);
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
  const leftSize = 10;
  const rightSize = 9;
  const leftMax = right ? layout.contentWidth * 0.58 : layout.contentWidth;
  const barBaseline = baselineCentered(
    bandBottom,
    SECTION_BAR_H,
    layout.bold,
    leftSize
  );
  layout.page.drawText(fitText(left, layout.bold, leftSize, leftMax), {
    x: TEXT_X,
    y: barBaseline,
    size: leftSize,
    font: layout.bold,
    color: WHITE,
  });
  if (right) {
    const text = fitText(right, layout.regular, rightSize, layout.contentWidth * 0.36);
    const textW = layout.regular.widthOfTextAtSize(text, rightSize);
    layout.page.drawText(text, {
      x: contentRight(layout) - textW,
      y: barBaseline,
      size: rightSize,
      font: layout.regular,
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
  layout.page.drawText(fitText(label, layout.bold, labelSize, LABEL_COL - 8), {
    x: TEXT_X,
    y: firstBaseline,
    size: labelSize,
    font: layout.bold,
    color: MUTED,
  });
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
  ensureSpace(layout, 40);
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
    x: TEXT_X,
    y: baselineCentered(bandBottom, headH, layout.bold, headSize),
    size: headSize,
    font: layout.bold,
    color: NAVY,
  });
  layout.y = bandBottom - 8;
  const bodySize = 10;
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

const addLinkPage = (
  layout: Layout,
  label: string,
  fileName: string,
  href: string
) => {
  newPage(layout, false);
  drawRunningHeader(layout);
  sectionBar(layout, label);
  fieldRow(layout, "File", fileName || "Attachment", { alt: true });
  fieldRow(
    layout,
    "Note",
    "This file type cannot be inlined in the printed application. Open it from Media Library or the URL below."
  );
  const lines = wrapLines(href, layout.regular, 9, layout.contentWidth);
  for (const line of lines.slice(0, 8)) {
    ensureSpace(layout, 12);
    layout.page.drawText(line, {
      x: layout.contentLeft,
      y: layout.y,
      size: 9,
      font: layout.regular,
      color: rgb(0.05, 0.25, 0.55),
    });
    layout.y -= 12;
  }
};

const appendImageOnPage = (
  layout: Layout,
  label: string,
  image: PDFImage,
  caption: string
) => {
  newPage(layout, false);
  drawRunningHeader(layout);
  sectionBar(layout, label);
  if (caption) {
    layout.page.drawText(caption.slice(0, 90), {
      x: layout.contentLeft,
      y: layout.y,
      size: 9,
      font: layout.regular,
      color: MUTED,
    });
    layout.y -= 16;
  }
  const maxW = layout.contentWidth;
  const maxH = layout.y - MARGIN_BOTTOM - 8;
  const scale = Math.min(maxW / image.width, maxH / image.height, 1);
  const drawW = image.width * scale;
  const drawH = image.height * scale;
  layout.page.drawImage(image, {
    x: layout.contentLeft + (maxW - drawW) / 2,
    y: layout.y - drawH,
    width: drawW,
    height: drawH,
  });
  layout.y = MARGIN_BOTTOM;
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
  const queued = (
    doc as PDFDocument & { embeddedPages?: unknown[] }
  ).embeddedPages;
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
  if (label) sectionBar(layout, label);
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
  for (const item of items) {
    try {
      const fetched = await fetchMediaBytes(item);
      if (!fetched) {
        continue;
      }
      const mime = (item.mime || "").toLowerCase();
      const fileName = item.name || "Attachment";

      if (mime.includes("pdf") || (item.ext || "").toLowerCase() === "pdf") {
        const merged = await appendPdfPages(layout, fetched.bytes, label);
        if (merged) {
          outcome = "merged";
          continue;
        }
        console.warn(
          `Award print: skipped PDF attachment ${fileName} (no printable pages)`
        );
        continue;
      }

      if (mime.startsWith("image/") || !mime) {
        const image = await toPrintImage(layout.doc, fetched.bytes, mime);
        if (image) {
          appendImageOnPage(layout, label, image, fileName);
          if (outcome !== "merged") outcome = "embedded";
          continue;
        }
      }

      addLinkPage(layout, label, fileName, fetched.href);
      if (outcome === "skipped") outcome = "linked";
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
  identificationRows(layout.record).forEach((row, index) => {
    fieldRow(layout, row.label, row.value, { alt: index % 2 === 1 });
  });
  systemRecordRows(layout.record).forEach((row, index) => {
    fieldRow(layout, row.label, row.value, { alt: index % 2 === 0 });
  });

  if (isSystemOfTheYearAward(layout.record.award_type)) {
    nomineeBasicRows(layout.record).forEach((row, index) => {
      fieldRow(layout, row.label, row.value, { alt: index % 2 === 1 });
    });
  } else if (isPersonNomineeAward(layout.record)) {
    ensureSpace(layout, 80);
    sectionBar(layout, nomineeNameAsPrinted(layout.record));
    nomineeBasicRows(layout.record).forEach((row, index) => {
      fieldRow(layout, row.label, row.value, { alt: index % 2 === 1 });
    });
  }

  narrativeBlock(
    layout,
    "What makes the nominee deserving of this award?",
    String(layout.record.justification || "")
  );
  fieldRow(
    layout,
    "Biography method",
    displayValue(layout.record.biography_method),
    { alt: true }
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
  const nominatorBlock =
    36 + 20 * (2 + nominatorRows(layout.record).length);
  ensureSpace(layout, nominatorBlock);
  sectionBar(layout, "Nominator Information");
  fieldRow(layout, "Nominator", displayValue(nominatorFullName(layout.record)), {
    alt: true,
  });
  nominatorRows(layout.record).forEach((row, index) => {
    fieldRow(layout, row.label, row.value, { alt: index % 2 === 0 });
  });
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
  const regular = await doc.embedFont(StandardFonts.TimesRoman);
  const bold = await doc.embedFont(StandardFonts.TimesRomanBold);
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
  if (
    isSystemOfTheYearAward(record.award_type) &&
    asMediaItems(record.board_list_file).length > 0
  ) {
    await appendMediaSlot(
      layout,
      "Board member & employee list",
      record.board_list_file,
      media
    );
  }
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
    fieldRow(layout, "Photographs", "None", { alt: true });
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

/**
 * Open one PDF in a hidden iframe and invoke the browser print dialog.
 * Sequential callers wait for `afterprint` so each nomination is its own job.
 */
export const printPdfBlob = (blob: Blob): Promise<void> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    iframe.setAttribute("title", "Print nomination application");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.cssText =
      "position:fixed;inset:0;width:1px;height:1px;opacity:0;border:0;pointer-events:none;";
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      iframe.remove();
      URL.revokeObjectURL(url);
      resolve();
    };
    iframe.onload = () => {
      const win = iframe.contentWindow;
      if (!win) {
        iframe.remove();
        URL.revokeObjectURL(url);
        reject(new Error("Print preview failed to load"));
        return;
      }
      win.addEventListener("afterprint", finish);
      try {
        win.focus();
        win.print();
      } catch {
        finish();
        return;
      }
      window.setTimeout(finish, 120000);
    };
    iframe.onerror = () => {
      iframe.remove();
      URL.revokeObjectURL(url);
      reject(new Error("Print preview failed to load"));
    };
    iframe.src = url;
    document.body.appendChild(iframe);
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

export const printNominationApplications = async (
  records: AwardNominationPrintRecord[]
) => {
  const printed: string[] = [];
  for (const record of records) {
    const result = await printNominationApplication(record);
    printed.push(result.filename);
    await new Promise((resolve) => window.setTimeout(resolve, 350));
  }
  return printed;
};
