/**
 * Text extraction for the legacy binary Office formats the print packets
 * receive: Word 97-2003 (`.doc`) and Excel 97-2003 (`.xls`), plus the
 * mislabelled variants that arrive under those names (a DOCX or RTF saved as
 * `.doc`, a CSV / XLSX saved as `.xls`).
 *
 * `.doc` is read with a small MS-DOC reader on top of SheetJS's `cfb`
 * compound-file parser (FIB → CLX piece table → text pieces). Workbooks go
 * through SheetJS `xlsx`, which reads BIFF, OOXML and CSV alike. Both
 * libraries are imported lazily so the packet code stays out of the main
 * bundle until someone prints.
 */

import type { DocumentTextBlock } from "../../award-nominations/helpers/documentText";

export type BinaryContainer = "ole" | "zip" | "rtf" | "pdf" | "unknown";

/** Magic-byte sniff so a mislabelled upload is routed by what it really is. */
export const sniffBinaryContainer = (bytes: Uint8Array): BinaryContainer => {
  const OLE_MAGIC = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];
  if (bytes.length >= 8 && OLE_MAGIC.every((byte, index) => bytes[index] === byte)) {
    return "ole";
  }
  if (bytes.length >= 4 && bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] <= 0x07 && bytes[3] <= 0x08) {
    return "zip";
  }
  if (bytes.length >= 5) {
    const head = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3], bytes[4]);
    if (head === "{\\rtf") return "rtf";
    if (head === "%PDF-") return "pdf";
  }
  return "unknown";
};

export const isLegacyWordAttachment = (mime?: string | null, nameOrExt?: string | null) => {
  const m = String(mime || "").toLowerCase();
  const n = String(nameOrExt || "").toLowerCase();
  return m === "application/msword" || m === "application/vnd.ms-word" || /(^|\.)(doc|dot)$/.test(n);
};

export const isSpreadsheetAttachment = (mime?: string | null, nameOrExt?: string | null) => {
  const m = String(mime || "").toLowerCase();
  const n = String(nameOrExt || "").toLowerCase();
  return (
    m.includes("spreadsheetml") ||
    m === "application/vnd.ms-excel" ||
    m === "application/excel" ||
    m === "application/x-excel" ||
    /\.?(xlsx|xlsm|xls)$/.test(n)
  );
};

/* ---------- Word 97-2003 ---------- */

export type LegacyDocResult =
  | { ok: true; text: string }
  | { ok: false; reason: "encrypted" | "not-word" | "empty" | "failed" };

type CfbModule = typeof import("cfb");

const loadCfb = async (): Promise<CfbModule> => {
  const mod = await import("cfb");
  return ((mod as unknown as { default?: CfbModule }).default ?? mod) as CfbModule;
};

const asBytes = (content: number[] | Uint8Array | null | undefined): Uint8Array => {
  if (!content) return new Uint8Array(0);
  return content instanceof Uint8Array ? content : Uint8Array.from(content);
};

const u16 = (bytes: Uint8Array, offset: number) =>
  offset + 1 < bytes.length ? bytes[offset] | (bytes[offset + 1] << 8) : 0;

const u32 = (bytes: Uint8Array, offset: number) =>
  offset + 3 < bytes.length
    ? (bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24)) >>> 0
    : 0;

const WORD_MAGIC = 0xa5ec;
const FIB_FLAGS_OFFSET = 0x0a;
const FIB_F_ENCRYPTED = 0x0100;
const FIB_F_WHICH_TBL_STM = 0x0200;
const FIB_F_OBFUSCATED = 0x8000;
const FIB_CCP_TEXT_OFFSET = 0x4c;
const FIB_CCP_FTN_OFFSET = 0x50;
const FIB_CCP_HDD_OFFSET = 0x54;
const FIB_FC_CLX_OFFSET = 0x1a2;
const FIB_LCB_CLX_OFFSET = 0x1a6;
const PCD_F_COMPRESSED = 0x40000000;

type Piece = { cpStart: number; cpEnd: number; fc: number; compressed: boolean };

/** Walk the CLX: skip Prc entries (0x01) until the Pcdt (0x02) and read PlcPcd. */
const readPieceTable = (table: Uint8Array, fcClx: number, lcbClx: number): Piece[] => {
  let pos = fcClx;
  const end = Math.min(table.length, fcClx + lcbClx);
  while (pos < end && table[pos] === 0x01) {
    const cb = u16(table, pos + 1);
    pos += 3 + cb;
  }
  if (pos >= end || table[pos] !== 0x02) {
    throw new Error("MS-DOC: piece table (Pcdt) not found in CLX");
  }
  const lcb = u32(table, pos + 1);
  const plc = pos + 5;
  const count = Math.floor((lcb - 4) / 12);
  if (count <= 0 || plc + lcb > table.length + 1) {
    throw new Error("MS-DOC: malformed PlcPcd");
  }
  const pieces: Piece[] = [];
  const pcdBase = plc + 4 * (count + 1);
  for (let i = 0; i < count; i += 1) {
    const cpStart = u32(table, plc + 4 * i);
    const cpEnd = u32(table, plc + 4 * (i + 1));
    const rawFc = u32(table, pcdBase + 8 * i + 2);
    const compressed = (rawFc & PCD_F_COMPRESSED) !== 0;
    const fc = rawFc & 0x3fffffff;
    pieces.push({ cpStart, cpEnd, fc: compressed ? fc >>> 1 : fc, compressed });
  }
  return pieces;
};

const cp1252 = (() => {
  try {
    return new TextDecoder("windows-1252");
  } catch {
    return new TextDecoder("latin1");
  }
})();
const utf16le = new TextDecoder("utf-16le");

/** Characters for CPs [from, to) across the piece table. */
const readRange = (doc: Uint8Array, pieces: Piece[], from: number, to: number): string => {
  let out = "";
  for (const piece of pieces) {
    const start = Math.max(from, piece.cpStart);
    const stop = Math.min(to, piece.cpEnd);
    if (stop <= start) continue;
    const offset = start - piece.cpStart;
    const length = stop - start;
    if (piece.compressed) {
      const slice = doc.subarray(piece.fc + offset, piece.fc + offset + length);
      out += cp1252.decode(slice);
    } else {
      const slice = doc.subarray(piece.fc + offset * 2, piece.fc + (offset + length) * 2);
      out += utf16le.decode(slice);
    }
  }
  return out;
};

/**
 * Word's in-text control characters → readable text. Field codes (0x13 …
 * 0x14 result 0x15) keep only the result; table cell marks become spacing,
 * row marks become line breaks; pictures / anchors / references are dropped.
 */
export const normaliseWordText = (raw: string): string => {
  const fieldStack: Array<"code" | "result"> = [];
  let out = "";
  for (let i = 0; i < raw.length; i += 1) {
    const ch = raw[i];
    const code = raw.charCodeAt(i);
    if (code === 0x13) {
      fieldStack.push("code");
      continue;
    }
    if (code === 0x14) {
      if (fieldStack.length) fieldStack[fieldStack.length - 1] = "result";
      continue;
    }
    if (code === 0x15) {
      fieldStack.pop();
      continue;
    }
    if (fieldStack.some((state) => state === "code")) continue;
    if (code === 0x0d || code === 0x0b || code === 0x0c || code === 0x0a) {
      out += "\n";
    } else if (code === 0x07) {
      // Cell mark; a second 0x07 straight after it is the row (TTP) mark.
      if (raw.charCodeAt(i + 1) === 0x07) {
        out += "\u0007\n";
        i += 1;
      } else {
        out += "\u0007";
      }
    } else if (code === 0x1e) {
      out += "-";
    } else if (code === 0x09) {
      out += "\t";
    } else if (code < 0x20 || code === 0x7f) {
      // 0x01 picture, 0x02 footnote ref, 0x03/0x04 separators, 0x05 note
      // ref, 0x08 drawing anchor, 0x1f optional hyphen, misc.
      continue;
    } else {
      out += ch;
    }
  }
  return out
    .replace(/\u0007/g, "   ")
    .split("\n")
    .map((line) => line.replace(/\s+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

/**
 * Body text of a Word 97-2003 binary (followed by footnotes and headers /
 * footers when present). Encrypted / obfuscated files are reported, not
 * decoded.
 */
export const extractLegacyDocText = async (bytes: Uint8Array): Promise<LegacyDocResult> => {
  if (sniffBinaryContainer(bytes) !== "ole") return { ok: false, reason: "not-word" };
  const CFB = await loadCfb();
  const container = CFB.read(bytes, { type: "array" });
  const wordEntry = CFB.find(container, "/WordDocument") ?? CFB.find(container, "WordDocument");
  if (!wordEntry) return { ok: false, reason: "not-word" };
  const doc = asBytes(wordEntry.content);
  if (doc.length < 0x200 || u16(doc, 0) !== WORD_MAGIC) return { ok: false, reason: "not-word" };

  const flags = u16(doc, FIB_FLAGS_OFFSET);
  if (flags & FIB_F_ENCRYPTED || flags & FIB_F_OBFUSCATED) return { ok: false, reason: "encrypted" };

  const tableName = flags & FIB_F_WHICH_TBL_STM ? "1Table" : "0Table";
  const tableEntry = CFB.find(container, `/${tableName}`) ?? CFB.find(container, tableName);
  if (!tableEntry) return { ok: false, reason: "failed" };
  const table = asBytes(tableEntry.content);

  const ccpText = u32(doc, FIB_CCP_TEXT_OFFSET);
  const ccpFtn = u32(doc, FIB_CCP_FTN_OFFSET);
  const ccpHdd = u32(doc, FIB_CCP_HDD_OFFSET);
  const fcClx = u32(doc, FIB_FC_CLX_OFFSET);
  const lcbClx = u32(doc, FIB_LCB_CLX_OFFSET);
  if (!lcbClx) return { ok: false, reason: "failed" };

  const pieces = readPieceTable(table, fcClx, lcbClx);
  const sections = [
    normaliseWordText(readRange(doc, pieces, 0, ccpText)),
    normaliseWordText(readRange(doc, pieces, ccpText, ccpText + ccpFtn)),
    normaliseWordText(readRange(doc, pieces, ccpText + ccpFtn, ccpText + ccpFtn + ccpHdd)),
  ];
  const text = sections.filter(Boolean).join("\n\n");
  if (!text.trim()) return { ok: false, reason: "empty" };
  return { ok: true, text };
};

/* ---------- RTF ---------- */

const RTF_SKIP_DESTINATIONS = new Set([
  "fonttbl",
  "colortbl",
  "stylesheet",
  "info",
  "pict",
  "object",
  "header",
  "footer",
  "headerl",
  "headerr",
  "headerf",
  "footerl",
  "footerr",
  "footerf",
  "xmlnstbl",
  "listtable",
  "listoverridetable",
  "rsidtbl",
  "generator",
  "themedata",
  "colorschememapping",
  "latentstyles",
  "datastore",
  "mmathPr",
  "fldinst",
  "wgrffmtfilter",
  "panose",
]);

/** Plain text of an RTF document (control words stripped, groups honoured). */
export const rtfToText = (source: string): string => {
  let out = "";
  const stack: Array<{ skip: boolean; uc: number }> = [];
  let state = { skip: false, uc: 1 };
  let i = 0;
  let pendingSkip = 0;
  const emit = (text: string) => {
    if (pendingSkip > 0) {
      pendingSkip -= 1;
      return;
    }
    if (!state.skip) out += text;
  };
  while (i < source.length) {
    const ch = source[i];
    if (ch === "{") {
      stack.push(state);
      state = { ...state };
      i += 1;
      continue;
    }
    if (ch === "}") {
      state = stack.pop() ?? { skip: false, uc: 1 };
      i += 1;
      continue;
    }
    if (ch === "\\") {
      const next = source[i + 1] ?? "";
      if (next === "'") {
        const hex = source.slice(i + 2, i + 4);
        const byte = parseInt(hex, 16);
        if (!Number.isNaN(byte)) emit(cp1252.decode(Uint8Array.of(byte)));
        i += 4;
        continue;
      }
      if (next === "*") {
        state.skip = true;
        i += 2;
        continue;
      }
      if (next === "\\" || next === "{" || next === "}") {
        emit(next);
        i += 2;
        continue;
      }
      if (next === "~") {
        emit(" ");
        i += 2;
        continue;
      }
      if (next === "-" || next === "_") {
        emit(next === "_" ? "-" : "");
        i += 2;
        continue;
      }
      if (next === "\n" || next === "\r") {
        emit("\n");
        i += 2;
        continue;
      }
      const match = /^\\([a-zA-Z]+)(-?\d+)? ?/.exec(source.slice(i, i + 40));
      if (!match) {
        i += 2;
        continue;
      }
      const word = match[1];
      const param = match[2] !== undefined ? parseInt(match[2], 10) : undefined;
      i += match[0].length;
      if (RTF_SKIP_DESTINATIONS.has(word)) {
        state.skip = true;
      } else if (word === "uc") {
        state.uc = param ?? 1;
      } else if (word === "u" && param !== undefined) {
        const codePoint = param < 0 ? param + 65536 : param;
        emit(String.fromCharCode(codePoint));
        pendingSkip = state.uc;
      } else if (word === "par" || word === "line" || word === "sect" || word === "page" || word === "row") {
        emit("\n");
      } else if (word === "tab" || word === "cell") {
        emit(word === "cell" ? "   " : "\t");
      } else if (word === "emdash" || word === "endash") {
        emit("-");
      } else if (word === "lquote" || word === "rquote") {
        emit("'");
      } else if (word === "ldblquote" || word === "rdblquote") {
        emit('"');
      } else if (word === "bullet") {
        emit("-");
      }
      continue;
    }
    if (ch === "\r" || ch === "\n") {
      i += 1;
      continue;
    }
    emit(ch);
    i += 1;
  }
  return out
    .split("\n")
    .map((line) => line.replace(/\s+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

/* ---------- workbooks (XLS / XLSX / CSV) ---------- */

export type WorkbookResult =
  | { ok: true; blocks: DocumentTextBlock[] }
  | { ok: false; reason: "encrypted" | "empty" | "failed" };

type XlsxModule = typeof import("xlsx");

const loadXlsx = async (): Promise<XlsxModule> => {
  const mod = await import("xlsx");
  return ((mod as unknown as { default?: XlsxModule }).default ?? mod) as XlsxModule;
};

/** Workbook → "Sheet" headings + one paragraph per non-empty row. */
export const extractWorkbookBlocks = async (bytes: Uint8Array): Promise<WorkbookResult> => {
  const XLSX = await loadXlsx();
  let workbook: import("xlsx").WorkBook;
  try {
    workbook = XLSX.read(bytes, { type: "array", cellDates: false, cellNF: false });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/password|encrypt/i.test(message)) return { ok: false, reason: "encrypted" };
    throw error;
  }
  const sheets = workbook.SheetNames.map((name) => {
    const sheet = workbook.Sheets[name];
    const rows: string[] = [];
    if (!sheet) return { name, rows };
    const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, raw: false, defval: "", blankrows: false });
    for (const row of matrix) {
      const cells = (row as unknown[]).map((cell) => (cell == null ? "" : String(cell).trim()));
      while (cells.length && !cells[cells.length - 1]) cells.pop();
      if (cells.some(Boolean)) rows.push(cells.join("   "));
    }
    return { name, rows };
  });
  const populated = sheets.filter((sheet) => sheet.rows.length > 0);
  if (populated.length === 0) return { ok: false, reason: "empty" };
  const blocks: DocumentTextBlock[] = [];
  for (const sheet of populated) {
    if (sheets.length > 1) blocks.push({ kind: "heading", level: 2, runs: [{ text: sheet.name }] });
    for (const row of sheet.rows) blocks.push({ kind: "paragraph", runs: [{ text: row }] });
  }
  return { ok: true, blocks };
};

/**
 * Plain text → one paragraph per non-empty line. Forms rely on runs of
 * spaces for blanks, so internal spacing is kept (tabs become spaces, very
 * long runs are capped so they still fit a line).
 */
export const linesToBlocks = (text: string): DocumentTextBlock[] =>
  text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) =>
      line
        .replace(/\t/g, "    ")
        .replace(/ {13,}/g, "            ")
        .trim()
    )
    .filter(Boolean)
    .map((line) => ({ kind: "paragraph", runs: [{ text: line }] }));
