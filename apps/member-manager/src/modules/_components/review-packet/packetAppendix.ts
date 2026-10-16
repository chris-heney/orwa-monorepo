import {
  PDFDocument,
  rgb,
  type PDFEmbeddedPage,
  type PDFFont,
  type PDFImage,
  type PDFPage,
} from "pdf-lib";
import type { PrintFonts } from "../../../helpers/printBrandFonts";
import CookieStore from "../../../helpers/ra-strapi-data-provider/src/CookieStore";
import {
  extractAttachmentText,
  isDocxAttachment,
  isPdfAttachment,
  isPlainTextAttachment,
  toWinAnsi,
  type DocumentTextBlock,
  type DocumentTextRun,
} from "../../award-nominations/helpers/documentText";
import { resolveMediaUrl } from "../../orwef-scholarships/helpers/resolveMediaUrl";
import {
  extractLegacyDocText,
  extractWorkbookBlocks,
  isLegacyWordAttachment,
  isSpreadsheetAttachment,
  linesToBlocks,
  rtfToText,
  sniffBinaryContainer,
} from "./legacyOffice";
import {
  attachmentDividerTitle,
  attachmentTypeLabel,
  combineEmbedResults,
  packetText,
  unavailableAttachmentNote,
  type MediaEmbedResult,
  type OrderedAttachment,
  type PacketMediaFile,
} from "./packetAttachments";

/**
 * Attachment appendix shared by the Awards and ORWEF packets.
 *
 * Every upload is rendered onto US-Letter pages AFTER the Manager-rendered
 * form, in submission order, each under a divider naming the field it came
 * from and its filename. PDFs are embedded page by page (scaled to fit),
 * images are embedded (converted through a canvas when pdf-lib cannot read
 * them natively), Word (DOC / DOCX / RTF), Excel (XLS / XLSX), CSV and text
 * are rendered as extracted text, and anything else gets an explicit "could
 * not be embedded" note instead of a blank page.
 */

const NAVY = rgb(0.08, 0.2, 0.36);
const GOLD = rgb(0.72, 0.55, 0.18);
const INK = rgb(0.12, 0.12, 0.14);
const MUTED = rgb(0.38, 0.39, 0.42);
const RULE = rgb(0.78, 0.79, 0.81);
const WHITE = rgb(1, 1, 1);
const NOTE_FILL = rgb(0.995, 0.96, 0.93);
const NOTE_EDGE = rgb(0.72, 0.36, 0.18);

export const LETTER = { width: 612, height: 792 } as const;
const MARGIN_LEFT = 54;
const MARGIN_RIGHT = 54;
const MARGIN_TOP = 46;
const MARGIN_BOTTOM = 50;
const CONTENT_INSET = 12;
const ACCENT_W = 3;
const RULE_CLEARANCE = 3.5;
const DIVIDER_H = 24;
const CAPTION_GAP = 6;
const PRINT_MAX_EDGE = 1800;
const BODY_SIZE = 10;
const LINE_GAP = 4;

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
  const descent = fontDescent(font, size);
  const raw = bandBottom + (bandHeight - ascent) / 2;
  return Math.max(raw, bandBottom + descent + 1);
};

const fitText = (text: string, font: PDFFont, size: number, maxWidth: number) => {
  const value = packetText(text);
  if (font.widthOfTextAtSize(value, size) <= maxWidth) return value;
  let cut = value;
  while (cut.length > 1 && font.widthOfTextAtSize(`${cut}...`, size) > maxWidth) {
    cut = cut.slice(0, -1);
  }
  return cut.length ? `${cut}...` : "";
};

const wrapLines = (
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
): string[] => {
  const paragraphs = packetText(text).replace(/\r\n/g, "\n").split("\n");
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

export type PacketMediaFetcher = (
  file: NonNullable<PacketMediaFile>,
  url: string,
  /** Cancel (Print dialog's Cancel); an aborted fetch must rethrow, not return null. */
  signal?: AbortSignal
) => Promise<Uint8Array | null>;

/** `DOMException` name a cancelled build throws — the dialog closes without a toast. */
export const ABORT_ERROR_NAME = "AbortError";

export const isAbortError = (error: unknown): boolean =>
  (error as { name?: string } | null)?.name === ABORT_ERROR_NAME;

/** Throw the standard abort error when `signal` has fired (no-op otherwise). */
export const throwIfAborted = (signal?: AbortSignal | null) => {
  if (!signal?.aborted) return;
  throw typeof DOMException === "function"
    ? new DOMException("Packet build cancelled", ABORT_ERROR_NAME)
    : Object.assign(new Error("Packet build cancelled"), { name: ABORT_ERROR_NAME });
};

/** Default fetcher: Strapi media with the signed-in user's token. Never throws (except on abort). */
export const fetchPacketMedia: PacketMediaFetcher = async (file, url, signal) => {
  const href = resolveMediaUrl(url);
  if (!href) return null;
  try {
    const response = await fetch(href, { headers: authHeaders(), signal });
    if (!response.ok) {
      console.warn(
        `Packet print: could not download ${file.name || href} (${response.status})`
      );
      return null;
    }
    return new Uint8Array(await response.arrayBuffer());
  } catch (error) {
    if (isAbortError(error)) throw error;
    console.warn(`Packet print: could not download ${file.name || href}`, error);
    return null;
  }
};

type AppendixLayout = {
  doc: PDFDocument;
  fonts: PrintFonts;
  runningTitle: string;
  total: number;
  page: PDFPage;
  y: number;
  contentWidth: number;
};

const contentRight = () => LETTER.width - MARGIN_RIGHT;

const drawRunningHeader = (layout: AppendixLayout) => {
  const size = 8;
  const font = layout.fonts.regular;
  const title = [layout.runningTitle, "Attachments"]
    .filter((part) => part && part.trim())
    .join("  ·  ");
  const ascent = fontAscent(font, size);
  const baseline = LETTER.height - 18 - ascent;
  layout.page.drawText(fitText(title, font, size, layout.contentWidth), {
    x: MARGIN_LEFT,
    y: baseline,
    size,
    font,
    color: MUTED,
  });
  const ruleY = baseline - fontDescent(font, size) - RULE_CLEARANCE;
  layout.page.drawLine({
    start: { x: MARGIN_LEFT, y: ruleY },
    end: { x: contentRight(), y: ruleY },
    thickness: 0.6,
    color: GOLD,
  });
  layout.y = Math.min(LETTER.height - MARGIN_TOP, ruleY - 14);
};

/**
 * Divider: navy bar "Attachment n of N · Field (i of k)" with the file type
 * right-aligned, then a muted caption "filename · page p of q".
 */
const drawDivider = (
  layout: AppendixLayout,
  attachment: OrderedAttachment,
  caption: string
) => {
  const { bold, regular } = layout.fonts;
  const bandBottom = layout.y - DIVIDER_H;
  layout.page.drawRectangle({
    x: MARGIN_LEFT,
    y: bandBottom,
    width: layout.contentWidth,
    height: DIVIDER_H,
    color: NAVY,
  });
  layout.page.drawRectangle({
    x: MARGIN_LEFT - ACCENT_W,
    y: bandBottom,
    width: ACCENT_W,
    height: DIVIDER_H,
    color: GOLD,
  });
  const typeText = fitText(
    attachmentTypeLabel(attachment.mime, attachment.ext),
    regular,
    8,
    layout.contentWidth * 0.3
  );
  const typeW = regular.widthOfTextAtSize(typeText, 8);
  const title = fitText(
    attachmentDividerTitle(attachment, layout.total),
    bold,
    10,
    layout.contentWidth - CONTENT_INSET * 2 - typeW - 12
  );
  layout.page.drawText(title, {
    x: MARGIN_LEFT + CONTENT_INSET,
    y: baselineCentered(bandBottom, DIVIDER_H, bold, 10),
    size: 10,
    font: bold,
    color: WHITE,
  });
  layout.page.drawText(typeText, {
    x: contentRight() - CONTENT_INSET - typeW,
    y: baselineCentered(bandBottom, DIVIDER_H, regular, 8),
    size: 8,
    font: regular,
    color: WHITE,
  });
  let y = bandBottom - CAPTION_GAP - fontAscent(regular, 8.5);
  layout.page.drawText(fitText(caption, regular, 8.5, layout.contentWidth), {
    x: MARGIN_LEFT,
    y,
    size: 8.5,
    font: regular,
    color: MUTED,
  });
  y -= fontDescent(regular, 8.5) + 6;
  layout.page.drawLine({
    start: { x: MARGIN_LEFT, y },
    end: { x: contentRight(), y },
    thickness: 0.4,
    color: RULE,
  });
  layout.y = y - 10;
};

const startAttachmentPage = (
  layout: AppendixLayout,
  attachment: OrderedAttachment,
  caption: string
) => {
  layout.page = layout.doc.addPage([LETTER.width, LETTER.height]);
  layout.contentWidth = LETTER.width - MARGIN_LEFT - MARGIN_RIGHT;
  drawRunningHeader(layout);
  drawDivider(layout, attachment, caption);
};

const remaining = (layout: AppendixLayout) => layout.y - MARGIN_BOTTOM;

const fileCaption = (attachment: OrderedAttachment, suffix?: string) =>
  [attachment.fileName, suffix].filter(Boolean).join("  ·  ");

/* ---------- PDF ---------- */

const pageHasContents = (page: PDFPage): boolean => {
  try {
    return Boolean(page.node.Contents() || page.node.normalizedEntries().Contents);
  } catch {
    return false;
  }
};

const dropQueuedEmbeddedPage = (doc: PDFDocument, embedded: unknown) => {
  const queued = (doc as unknown as { embeddedPages?: unknown[] }).embeddedPages;
  if (!Array.isArray(queued)) return;
  const index = queued.indexOf(embedded);
  if (index >= 0) queued.splice(index, 1);
};

const drawEmbeddedPage = (layout: AppendixLayout, embedded: PDFEmbeddedPage) => {
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
    x: MARGIN_LEFT + (maxW - drawW) / 2,
    y: boxTop - drawH,
    width: drawW,
    height: drawH,
  });
  layout.y = MARGIN_BOTTOM;
};

const appendPdf = async (
  layout: AppendixLayout,
  attachment: OrderedAttachment,
  bytes: Uint8Array
): Promise<"merged" | "empty" | "failed"> => {
  let src: PDFDocument;
  try {
    src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  } catch (error) {
    console.warn(`Packet print: could not parse PDF ${attachment.fileName}`, error);
    return "failed";
  }
  const pages = src.getPages();
  const printable = pages
    .map((page, index) => ({ page, index }))
    .filter(({ page, index }) => {
      if (pageHasContents(page)) return true;
      console.warn(
        `Packet print: skipped empty PDF page ${index + 1} of ${attachment.fileName} (no Contents stream)`
      );
      return false;
    });
  if (printable.length === 0) return "empty";

  let added = 0;
  for (let i = 0; i < printable.length; i += 1) {
    const { page, index } = printable[i];
    const caption = fileCaption(attachment, `page ${i + 1} of ${printable.length}`);
    let queued: PDFEmbeddedPage | null = null;
    try {
      const [embedded] = await layout.doc.embedPages([page]);
      queued = embedded;
      // Force embed now — pdf-lib otherwise throws on save() for missing Contents.
      await embedded.embed();
      startAttachmentPage(layout, attachment, caption);
      drawEmbeddedPage(layout, embedded);
      added += 1;
    } catch (error) {
      if (queued) dropQueuedEmbeddedPage(layout.doc, queued);
      const message = error instanceof Error ? error.message : String(error);
      if (/missing Contents/i.test(message)) {
        console.warn(`Packet print: skipped empty PDF page ${index + 1}`, error);
        continue;
      }
      try {
        const [copied] = await layout.doc.copyPages(src, [index]);
        layout.doc.addPage(copied);
        added += 1;
        console.warn(
          `Packet print: embedded page ${index + 1} failed (${message}); copied original page instead`
        );
      } catch (copyError) {
        console.warn(`Packet print: skipped unreadable PDF page ${index + 1}`, copyError);
      }
    }
  }
  return added > 0 ? "merged" : "failed";
};

/* ---------- images ---------- */

const toPrintImage = async (
  doc: PDFDocument,
  bytes: Uint8Array,
  mime: string
): Promise<PDFImage | null> => {
  const lower = (mime || "").toLowerCase();
  try {
    let native: PDFImage | null = null;
    if (lower.includes("png")) native = await doc.embedPng(bytes);
    else if (lower.includes("jpeg") || lower.includes("jpg")) native = await doc.embedJpg(bytes);
    if (native && native.width <= PRINT_MAX_EDGE && native.height <= PRINT_MAX_EDGE) {
      return native;
    }
  } catch {
    // Fall through to the canvas conversion (odd PNG encodings, CMYK JPEGs).
  }

  // Browser only: decode WebP / GIF / BMP / oversize images and re-encode as JPEG.
  if (typeof createImageBitmap !== "function" || typeof document === "undefined") {
    return null;
  }
  try {
    const blob = new Blob([bytes as BlobPart], { type: mime || "application/octet-stream" });
    const bitmap = await createImageBitmap(blob);
    const scale = Math.min(PRINT_MAX_EDGE / bitmap.width, PRINT_MAX_EDGE / bitmap.height, 1);
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
      canvas.toBlob((part) => resolve(part), "image/jpeg", 0.85)
    );
    if (!jpeg) return null;
    return doc.embedJpg(new Uint8Array(await jpeg.arrayBuffer()));
  } catch {
    return null;
  }
};

const appendImage = (
  layout: AppendixLayout,
  attachment: OrderedAttachment,
  image: PDFImage
) => {
  startAttachmentPage(layout, attachment, fileCaption(attachment, `${image.width} x ${image.height} px`));
  const maxW = layout.contentWidth;
  const maxH = Math.max(40, remaining(layout) - 8);
  const scale = Math.min(maxW / Math.max(image.width, 1), maxH / Math.max(image.height, 1), 1);
  const drawW = image.width * scale;
  const drawH = image.height * scale;
  layout.page.drawImage(image, {
    x: MARGIN_LEFT + (maxW - drawW) / 2,
    y: layout.y - drawH,
    width: drawW,
    height: drawH,
  });
  layout.y -= drawH + 12;
};

/* ---------- text (DOC / DOCX / RTF / CSV / TXT / XLS / XLSX) ---------- */

const runFont = (fonts: PrintFonts, run: DocumentTextRun): PDFFont => {
  if (run.bold && run.italic) return fonts.boldItalic;
  if (run.bold) return fonts.bold;
  if (run.italic) return fonts.italic;
  return fonts.regular;
};

type StyledLine = Array<{ text: string; font: PDFFont }>;

const wrapStyledRuns = (
  fonts: PrintFonts,
  runs: DocumentTextRun[],
  size: number,
  maxWidth: number
): StyledLine[] => {
  const lines: StyledLine[] = [];
  let current: StyledLine = [];
  let width = 0;
  const flush = () => {
    if (current.length) lines.push(current);
    current = [];
    width = 0;
  };
  for (const run of runs) {
    const font = runFont(fonts, run);
    for (const piece of toWinAnsi(run.text).split(/(\s+)/)) {
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

type TextFlow = {
  layout: AppendixLayout;
  attachment: OrderedAttachment;
  pageNo: number;
};

const ensureTextSpace = (flow: TextFlow, needed: number) => {
  if (remaining(flow.layout) >= needed) return;
  flow.pageNo += 1;
  startAttachmentPage(
    flow.layout,
    flow.attachment,
    fileCaption(flow.attachment, `continued (page ${flow.pageNo})`)
  );
};

const drawStyledLines = (
  flow: TextFlow,
  lines: StyledLine[],
  size: number,
  indent = 0
) => {
  const { layout } = flow;
  for (const line of lines) {
    const ascent = Math.max(
      fontAscent(layout.fonts.regular, size),
      ...line.map((part) => fontAscent(part.font, size))
    );
    ensureTextSpace(flow, ascent + LINE_GAP);
    layout.y -= ascent;
    let x = MARGIN_LEFT + indent;
    for (const part of line) {
      if (!part.text) continue;
      layout.page.drawText(part.text, { x, y: layout.y, size, font: part.font, color: INK });
      x += part.font.widthOfTextAtSize(part.text, size);
    }
    layout.y -= LINE_GAP;
  }
};

const drawDocumentBlocks = (flow: TextFlow, blocks: DocumentTextBlock[]) => {
  const { layout } = flow;
  const { fonts } = layout;
  for (const block of blocks) {
    if (block.kind === "heading") {
      const size = block.level === 1 ? 13 : block.level === 2 ? 12 : 11;
      layout.y -= 6;
      drawStyledLines(
        flow,
        wrapStyledRuns(fonts, block.runs.map((run) => ({ ...run, bold: true })), size, layout.contentWidth),
        size
      );
      layout.y -= 4;
      continue;
    }
    if (block.kind === "list") {
      block.items.forEach((item, index) => {
        const marker = block.ordered ? `${index + 1}. ` : "- ";
        const markerW = fonts.regular.widthOfTextAtSize(marker, BODY_SIZE);
        const lines = wrapStyledRuns(fonts, item, BODY_SIZE, layout.contentWidth - markerW);
        ensureTextSpace(flow, fontAscent(fonts.regular, BODY_SIZE) + LINE_GAP);
        const markerY = layout.y - fontAscent(fonts.regular, BODY_SIZE);
        layout.page.drawText(marker, {
          x: MARGIN_LEFT,
          y: markerY,
          size: BODY_SIZE,
          font: fonts.regular,
          color: INK,
        });
        drawStyledLines(flow, lines, BODY_SIZE, markerW);
      });
      layout.y -= 4;
      continue;
    }
    drawStyledLines(flow, wrapStyledRuns(fonts, block.runs, BODY_SIZE, layout.contentWidth), BODY_SIZE);
    layout.y -= 6;
  }
};

const appendTextBlocks = (
  layout: AppendixLayout,
  attachment: OrderedAttachment,
  blocks: DocumentTextBlock[]
) => {
  startAttachmentPage(layout, attachment, fileCaption(attachment, "text rendered from the uploaded document"));
  drawDocumentBlocks({ layout, attachment, pageNo: 1 }, blocks);
};

type TextOutcome =
  | { ok: true; blocks: DocumentTextBlock[] }
  | { ok: false; detail: string };

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const looksLikePlainText = (bytes: Uint8Array): boolean => {
  const sample = bytes.subarray(0, 2048);
  if (sample.length === 0) return false;
  let odd = 0;
  for (let i = 0; i < sample.length; i += 1) {
    const byte = sample[i];
    if (byte === 0 || (byte < 0x20 && byte !== 0x09 && byte !== 0x0a && byte !== 0x0d)) odd += 1;
  }
  return odd <= sample.length / 50;
};

/**
 * `.doc` uploads: a real Word 97-2003 binary goes through the MS-DOC reader;
 * DOCX / RTF / plain text saved under the wrong name are routed by their
 * magic bytes so they still render.
 */
const legacyWordBlocks = async (
  attachment: OrderedAttachment,
  bytes: Uint8Array
): Promise<TextOutcome> => {
  const container = sniffBinaryContainer(bytes);
  if (container === "zip") {
    const extracted = await extractAttachmentText(bytes, DOCX_MIME, ".docx");
    if (extracted.ok) return { ok: true, blocks: extracted.blocks };
    return {
      ok: false,
      detail:
        extracted.reason === "empty"
          ? "The document contains no printable text."
          : "The document could not be read.",
    };
  }
  if (container === "rtf") {
    const blocks = linesToBlocks(rtfToText(new TextDecoder("latin1").decode(bytes)));
    if (blocks.length) return { ok: true, blocks };
    return { ok: false, detail: "The document contains no printable text." };
  }
  if (container === "ole") {
    const result = await extractLegacyDocText(bytes);
    if (result.ok) {
      const blocks = linesToBlocks(result.text);
      if (blocks.length) return { ok: true, blocks };
      return { ok: false, detail: "The document contains no printable text." };
    }
    console.warn(`Packet print: legacy Word ${attachment.fileName} not embedded (${result.reason})`);
    const details: Record<typeof result.reason, string> = {
      encrypted: "The document is password-protected and cannot be read.",
      "not-word": "The file is not a Word document.",
      empty: "The document contains no printable text.",
      failed: "The document could not be read.",
    };
    return { ok: false, detail: details[result.reason] };
  }
  if (container === "unknown" && looksLikePlainText(bytes)) {
    const blocks = linesToBlocks(new TextDecoder("utf-8").decode(bytes));
    if (blocks.length) return { ok: true, blocks };
  }
  return { ok: false, detail: "The document could not be read (unrecognised format)." };
};

/** `.xls` / `.xlsx` / CSV-as-xls uploads through SheetJS (lazy). */
const spreadsheetBlocks = async (
  attachment: OrderedAttachment,
  bytes: Uint8Array
): Promise<TextOutcome> => {
  try {
    const result = await extractWorkbookBlocks(bytes);
    if (result.ok) return { ok: true, blocks: result.blocks };
    const details: Record<typeof result.reason, string> = {
      encrypted: "The workbook is password-protected and cannot be read.",
      empty: "The workbook has no cell values.",
      failed: "The workbook could not be read.",
    };
    return { ok: false, detail: details[result.reason] };
  } catch (error) {
    console.warn(`Packet print: could not read workbook ${attachment.fileName}`, error);
    return { ok: false, detail: "The workbook could not be read." };
  }
};

/* ---------- fallback note ---------- */

const appendUnavailableNote = (
  layout: AppendixLayout,
  attachment: OrderedAttachment,
  reason?: string
) => {
  startAttachmentPage(layout, attachment, fileCaption(attachment, "not embedded"));
  const { bold, regular } = layout.fonts;
  const note = unavailableAttachmentNote(attachment);
  const inner = layout.contentWidth - CONTENT_INSET * 2;
  const noteLines = wrapLines(note, bold, 10, inner);
  const reasonLines = reason ? wrapLines(reason, regular, 9, inner) : [];
  const boxH =
    10 +
    noteLines.length * (fontAscent(bold, 10) + LINE_GAP) +
    (reasonLines.length ? 4 + reasonLines.length * (fontAscent(regular, 9) + LINE_GAP) : 0) +
    10;
  const top = layout.y;
  const bottom = top - boxH;
  layout.page.drawRectangle({
    x: MARGIN_LEFT,
    y: bottom,
    width: layout.contentWidth,
    height: boxH,
    color: NOTE_FILL,
  });
  layout.page.drawRectangle({
    x: MARGIN_LEFT - ACCENT_W,
    y: bottom,
    width: ACCENT_W,
    height: boxH,
    color: NOTE_EDGE,
  });
  let y = top - 10;
  for (const line of noteLines) {
    y -= fontAscent(bold, 10);
    layout.page.drawText(line, { x: MARGIN_LEFT + CONTENT_INSET, y, size: 10, font: bold, color: INK });
    y -= LINE_GAP;
  }
  if (reasonLines.length) {
    y -= 4;
    for (const line of reasonLines) {
      y -= fontAscent(regular, 9);
      layout.page.drawText(line, { x: MARGIN_LEFT + CONTENT_INSET, y, size: 9, font: regular, color: MUTED });
      y -= LINE_GAP;
    }
  }
  layout.y = bottom - 12;
};

/* ---------- entry point ---------- */

export type AppendixOutcome = {
  /** Slot key → combined outcome (merged > embedded > unavailable > skipped). */
  bySlot: Record<string, MediaEmbedResult>;
  /** One entry per file, in appendix order. */
  files: Array<{ attachment: OrderedAttachment; result: MediaEmbedResult; detail?: string }>;
};

/** Fired before each attachment is fetched/rendered: `index` is 1-based. */
export type AppendixProgress = {
  index: number;
  total: number;
  attachment: OrderedAttachment;
};

/** Coarse build progress a packet generator reports to the Print dialog. */
export type PacketBuildProgress =
  | { stage: "form" }
  | { stage: "attachments"; index: number; total: number; fileName: string }
  | { stage: "finishing" };

/** Options every packet generator (Awards, ORWEF) accepts. */
export type PacketBuildOptions = {
  /**
   * Also append the PDF the system generated at submit time. Off by default:
   * it repeats the form rendered by the generator (the "form appears twice"
   * report). The record's show page links to it.
   */
  includeSubmissionPdf?: boolean;
  /** Test seam — defaults to an authenticated Strapi media fetch. */
  fetchBytes?: PacketMediaFetcher;
  onProgress?: (progress: PacketBuildProgress) => void;
  /** Cancel from the Print dialog. */
  signal?: AbortSignal;
};

/** Adapt a generator's `onProgress` to the appendix's per-attachment callback. */
export const relayAppendixProgress = (
  onProgress?: (progress: PacketBuildProgress) => void
): AppendixOptions["onProgress"] =>
  onProgress
    ? (progress) =>
        onProgress({
          stage: "attachments",
          index: progress.index,
          total: progress.total,
          fileName: progress.attachment.fileName,
        })
    : undefined;

export type AppendixOptions = {
  /** Running-header title, e.g. "Achille PUA · System of the Year · Year: 2027". */
  runningTitle: string;
  fetchBytes?: PacketMediaFetcher;
  /** Progress for the Print dialog ("Rendering attachments 2 of 7 · file.pdf"). */
  onProgress?: (progress: AppendixProgress) => void;
  /** Cancel: checked before every attachment and passed to the media fetch. */
  signal?: AbortSignal;
};

/**
 * Append every attachment to `doc` as letter pages. Returns per-slot and
 * per-file outcomes so callers can report what could not be embedded.
 */
export const appendPacketAttachments = async (
  doc: PDFDocument,
  fonts: PrintFonts,
  attachments: ReadonlyArray<OrderedAttachment>,
  options: AppendixOptions
): Promise<AppendixOutcome> => {
  const fetchBytes = options.fetchBytes ?? fetchPacketMedia;
  const { signal } = options;
  const layout: AppendixLayout = {
    doc,
    fonts,
    runningTitle: options.runningTitle,
    total: attachments.length,
    page: doc.getPageCount() ? doc.getPage(doc.getPageCount() - 1) : doc.addPage([LETTER.width, LETTER.height]),
    y: MARGIN_BOTTOM,
    contentWidth: LETTER.width - MARGIN_LEFT - MARGIN_RIGHT,
  };
  const files: AppendixOutcome["files"] = [];
  const perSlot = new Map<string, MediaEmbedResult[]>();

  for (const attachment of attachments) {
    throwIfAborted(signal);
    options.onProgress?.({
      index: attachment.ordinal,
      total: attachments.length,
      attachment,
    });
    let result: MediaEmbedResult = "unavailable";
    let detail: string | undefined;
    try {
      const bytes = await fetchBytes(attachment.file, attachment.url, signal);
      throwIfAborted(signal);
      if (!bytes) {
        detail = "The file could not be downloaded from the media library.";
        appendUnavailableNote(layout, attachment, detail);
      } else if (isPdfAttachment(attachment.mime, attachment.ext)) {
        const pdf = await appendPdf(layout, attachment, bytes);
        if (pdf === "merged") {
          result = "merged";
        } else {
          const extracted = await extractAttachmentText(bytes, attachment.mime, attachment.ext);
          if (extracted.ok) {
            appendTextBlocks(layout, attachment, extracted.blocks);
            result = "embedded";
          } else {
            detail =
              pdf === "empty"
                ? "The PDF has no printable pages."
                : "The PDF could not be read.";
            appendUnavailableNote(layout, attachment, detail);
          }
        }
      } else if (
        isDocxAttachment(attachment.mime, attachment.ext) ||
        isPlainTextAttachment(attachment.mime, attachment.ext)
      ) {
        const extracted = await extractAttachmentText(bytes, attachment.mime, attachment.ext);
        if (extracted.ok) {
          appendTextBlocks(layout, attachment, extracted.blocks);
          result = "embedded";
        } else {
          detail =
            extracted.reason === "empty"
              ? "The document contains no printable text."
              : "The document could not be read.";
          appendUnavailableNote(layout, attachment, detail);
        }
      } else if (
        isLegacyWordAttachment(attachment.mime, attachment.ext) &&
        sniffBinaryContainer(bytes) === "pdf"
      ) {
        // A PDF renamed to .doc: merge its pages like any other PDF.
        const pdf = await appendPdf(layout, attachment, bytes);
        if (pdf === "merged") {
          result = "merged";
        } else {
          detail = pdf === "empty" ? "The PDF has no printable pages." : "The PDF could not be read.";
          appendUnavailableNote(layout, attachment, detail);
        }
      } else if (
        isLegacyWordAttachment(attachment.mime, attachment.ext) ||
        isSpreadsheetAttachment(attachment.mime, attachment.ext)
      ) {
        const outcome = isLegacyWordAttachment(attachment.mime, attachment.ext)
          ? await legacyWordBlocks(attachment, bytes)
          : await spreadsheetBlocks(attachment, bytes);
        if (outcome.ok) {
          appendTextBlocks(layout, attachment, outcome.blocks);
          result = "embedded";
        } else {
          detail = outcome.detail;
          appendUnavailableNote(layout, attachment, detail);
        }
      } else if (attachment.mime.startsWith("image/") || !attachment.mime) {
        const image = await toPrintImage(doc, bytes, attachment.mime);
        if (image) {
          appendImage(layout, attachment, image);
          result = "embedded";
        } else {
          detail = "This image format cannot be decoded by the browser (TIFF / HEIC / SVG are not supported).";
          appendUnavailableNote(layout, attachment, detail);
        }
      } else {
        detail = "Only PDF, Word (DOC / DOCX), Excel (XLS / XLSX), CSV, text and JPEG / PNG / GIF / WebP images can be embedded.";
        appendUnavailableNote(layout, attachment, detail);
      }
    } catch (error) {
      // Cancel is not an attachment failure — unwind the whole build.
      if (isAbortError(error)) throw error;
      console.warn(`Packet print: attachment ${attachment.fileName} failed`, error);
      detail = error instanceof Error ? error.message : String(error);
      try {
        appendUnavailableNote(layout, attachment, "An unexpected error occurred while embedding this file.");
      } catch {
        // Leave the packet printable even if the note itself fails.
      }
    }
    files.push({ attachment, result, detail });
    const list = perSlot.get(attachment.key) ?? [];
    list.push(result);
    perSlot.set(attachment.key, list);
  }

  const bySlot: Record<string, MediaEmbedResult> = {};
  perSlot.forEach((results, key) => {
    bySlot[key] = combineEmbedResults(results);
  });
  return { bySlot, files };
};