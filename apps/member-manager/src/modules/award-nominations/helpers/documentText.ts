import mammoth from "mammoth";
import {
  PDFArray,
  PDFDocument,
  PDFRawStream,
  decodePDFRawStream,
} from "pdf-lib";

export type DocumentTextBlock =
  | { kind: "heading"; level: 1 | 2 | 3; runs: DocumentTextRun[] }
  | { kind: "paragraph"; runs: DocumentTextRun[] }
  | { kind: "list"; ordered: boolean; items: DocumentTextRun[][] };

export type DocumentTextRun = {
  text: string;
  bold?: boolean;
  italic?: boolean;
};

export type DocumentTextResult =
  | { ok: true; markdown: string; blocks: DocumentTextBlock[] }
  | { ok: false; reason: "unsupported" | "empty" | "failed" };

const DOCX_EXT = /\.docx$/i;
const TEXT_EXT = /\.(txt|csv|md)$/i;
const PDF_EXT = /\.pdf$/i;

export const isDocxAttachment = (mime?: string | null, nameOrExt?: string | null) => {
  const mimeLower = String(mime || "").toLowerCase();
  const name = String(nameOrExt || "").toLowerCase();
  return (
    mimeLower.includes("wordprocessingml") ||
    mimeLower.includes("officedocument.word") ||
    DOCX_EXT.test(name)
  );
};

export const isPlainTextAttachment = (
  mime?: string | null,
  nameOrExt?: string | null
) => {
  const mimeLower = String(mime || "").toLowerCase();
  const name = String(nameOrExt || "").toLowerCase();
  return (
    mimeLower.startsWith("text/") ||
    mimeLower === "application/csv" ||
    TEXT_EXT.test(name)
  );
};

export const isPdfAttachment = (mime?: string | null, nameOrExt?: string | null) => {
  const mimeLower = String(mime || "").toLowerCase();
  const name = String(nameOrExt || "").toLowerCase();
  return mimeLower.includes("pdf") || PDF_EXT.test(name);
};

/** WinAnsi-safe text for pdf-lib standard fonts and embedded Arial. */
export const toWinAnsi = (value: string): string =>
  String(value || "")
    .replace(/\u2018|\u2019|\u201a|\u2032/g, "'")
    .replace(/\u201c|\u201d|\u201e|\u2033/g, '"')
    .replace(/\u2013|\u2014|\u2212/g, "-")
    .replace(/\u2022|\u25cf|\u00b7/g, "-")
    .replace(/\u00a0|\u202f/g, " ")
    .replace(/\u2026/g, "...")
    .replace(/[^\u0009\u000a\u000d\u0020-\u007e\u00a0-\u00ff]/g, "");

const stripImages = (markdown: string): string =>
  markdown
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/<img\b[^>]*>/gi, "");

const unescapeMarkdown = (markdown: string): string =>
  markdown.replace(/\\([\\`*_{}[\]()#+\-.!])/g, "$1");

const parseInlineRuns = (raw: string): DocumentTextRun[] => {
  const source = toWinAnsi(raw.replace(/\s+/g, " ").trim());
  if (!source) return [];
  const runs: DocumentTextRun[] = [];
  const token =
    /(\*\*[^*]+?\*\*|__[^_]+?__|\*[^*\n]+?\*|_[^_\n]+?_|`[^`]+`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = token.exec(source))) {
    if (match.index > last) {
      runs.push({ text: source.slice(last, match.index) });
    }
    const tokenText = match[1];
    if (tokenText.startsWith("**") || tokenText.startsWith("__")) {
      runs.push({ text: tokenText.slice(2, -2), bold: true });
    } else if (tokenText.startsWith("`")) {
      runs.push({ text: tokenText.slice(1, -1) });
    } else {
      runs.push({ text: tokenText.slice(1, -1), italic: true });
    }
    last = match.index + tokenText.length;
  }
  if (last < source.length) runs.push({ text: source.slice(last) });
  return runs.filter((run) => run.text);
};

export const parseMarkdownBlocks = (markdown: string): DocumentTextBlock[] => {
  const lines = unescapeMarkdown(stripImages(markdown))
    .replace(/\r\n/g, "\n")
    .split("\n");
  const blocks: DocumentTextBlock[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushParagraph = () => {
    const text = paragraph.join(" ").trim();
    paragraph = [];
    if (!text) return;
    const runs = parseInlineRuns(text);
    if (runs.length) blocks.push({ kind: "paragraph", runs });
  };

  const flushList = () => {
    if (!list || list.items.length === 0) {
      list = null;
      return;
    }
    blocks.push({
      kind: "list",
      ordered: list.ordered,
      items: list.items.map((item) => parseInlineRuns(item)).filter((runs) => runs.length),
    });
    list = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/g, "");
    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    const unordered = /^\s*[-*+]\s+(.+)$/.exec(line);
    const ordered = /^\s*(\d+)[.)]\s+(.+)$/.exec(line);

    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }
    if (heading) {
      flushParagraph();
      flushList();
      const level = Math.min(heading[1].length, 3) as 1 | 2 | 3;
      const runs = parseInlineRuns(heading[2]);
      if (runs.length) blocks.push({ kind: "heading", level, runs });
      continue;
    }
    if (unordered) {
      flushParagraph();
      if (!list || list.ordered) {
        flushList();
        list = { ordered: false, items: [] };
      }
      list.items.push(unordered[1]);
      continue;
    }
    if (ordered) {
      flushParagraph();
      if (!list || !list.ordered) {
        flushList();
        list = { ordered: true, items: [] };
      }
      list.items.push(ordered[2]);
      continue;
    }
    flushList();
    paragraph.push(line.trim());
  }
  flushParagraph();
  flushList();
  return blocks;
};

const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer => {
  const out = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(out).set(bytes);
  return out;
};

const decodePdfStream = (stream: PDFRawStream): string => {
  try {
    const decoded = decodePDFRawStream(stream);
    return new TextDecoder("latin1").decode(decoded.decode());
  } catch {
    try {
      return new TextDecoder("latin1").decode(stream.getContents());
    } catch {
      return "";
    }
  }
};

const unescapePdfLiteral = (value: string): string =>
  value
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\\/g, "\\")
    .replace(/\\(\d{1,3})/g, (_, oct) =>
      String.fromCharCode(parseInt(oct, 8) || 32)
    );

const stringsFromPdfContent = (content: string): string[] => {
  const out: string[] = [];
  const tj = /\(((?:\\.|[^\\)])*)\)\s*Tj/g;
  let match: RegExpExecArray | null;
  while ((match = tj.exec(content))) {
    const text = unescapePdfLiteral(match[1]).trim();
    if (text) out.push(text);
  }
  const tjArray = /\[([\s\S]*?)\]\s*TJ/g;
  while ((match = tjArray.exec(content))) {
    const inner = match[1];
    const parts = /\(((?:\\.|[^\\)])*)\)/g;
    let part: RegExpExecArray | null;
    const row: string[] = [];
    while ((part = parts.exec(inner))) {
      row.push(unescapePdfLiteral(part[1]));
    }
    const joined = row.join("").trim();
    if (joined) out.push(joined);
  }
  return out;
};

export const extractPdfPlainText = async (
  bytes: Uint8Array
): Promise<string> => {
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const lines: string[] = [];
  for (const page of src.getPages()) {
    const contents = page.node.Contents();
    if (!contents) continue;
    const streams = contents instanceof PDFArray ? contents.asArray() : [contents];
    const pageText: string[] = [];
    for (const item of streams) {
      const stream = page.doc.context.lookup(item);
      if (!(stream instanceof PDFRawStream)) continue;
      pageText.push(...stringsFromPdfContent(decodePdfStream(stream)));
    }
    if (pageText.length) lines.push(pageText.join(" "));
  }
  return lines.join("\n").trim();
};

type MammothMarkdown = {
  convertToMarkdown: (
    input: { arrayBuffer?: ArrayBuffer; buffer?: Uint8Array },
    options?: { convertImage?: unknown }
  ) => Promise<{ value: string }>;
};

const mammothMarkdown = mammoth as unknown as MammothMarkdown;

export const extractDocxMarkdown = async (
  bytes: Uint8Array
): Promise<string> => {
  const options = {
    convertImage: mammoth.images.imgElement(async () => ({ src: "" })),
  };
  let result: { value: string };
  try {
    result = await mammothMarkdown.convertToMarkdown(
      { arrayBuffer: toArrayBuffer(bytes) },
      options
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!/Could not find file/i.test(message)) throw error;
    result = await mammothMarkdown.convertToMarkdown(
      { buffer: bytes },
      options
    );
  }
  return unescapeMarkdown(stripImages(result.value || "")).trim();
};

const fromMarkdown = (markdown: string): DocumentTextResult => {
  const cleaned = unescapeMarkdown(stripImages(markdown)).trim();
  if (!cleaned) return { ok: false, reason: "empty" };
  const blocks = parseMarkdownBlocks(cleaned);
  if (blocks.length === 0) return { ok: false, reason: "empty" };
  return { ok: true, markdown: cleaned, blocks };
};

export const extractAttachmentText = async (
  bytes: Uint8Array,
  mime?: string | null,
  nameOrExt?: string | null
): Promise<DocumentTextResult> => {
  try {
    if (isDocxAttachment(mime, nameOrExt)) {
      return fromMarkdown(await extractDocxMarkdown(bytes));
    }
    if (isPlainTextAttachment(mime, nameOrExt)) {
      return fromMarkdown(new TextDecoder("utf-8").decode(bytes));
    }
    if (isPdfAttachment(mime, nameOrExt)) {
      const text = await extractPdfPlainText(bytes);
      return fromMarkdown(text);
    }
    return { ok: false, reason: "unsupported" };
  } catch (error) {
    console.warn("Award print: could not extract attachment text", error);
    return { ok: false, reason: "failed" };
  }
};
