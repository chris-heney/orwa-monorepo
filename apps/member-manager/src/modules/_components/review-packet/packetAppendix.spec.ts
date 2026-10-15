import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument } from "pdf-lib";
import { embedPrintFonts, setPrintFontLoader } from "../../../helpers/printBrandFonts";
import { extractPdfPlainText } from "../../award-nominations/helpers/documentText";
import { appendPacketAttachments } from "./packetAppendix";
import { orderPacketAttachments, type AttachmentSlot } from "./packetAttachments";

const here = dirname(fileURLToPath(import.meta.url));
const tmpDir = resolve(here, "../../../../../../tmp");

// Force pdf-lib's built-in Helvetica: with the embedded Liberation Sans subset,
// text is written as glyph ids and `extractPdfPlainText` cannot read it back.
beforeAll(() => {
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
  setPrintFontLoader(async () => {
    throw new Error("spec: use the Helvetica fallback so page text is extractable");
  });
});
afterAll(() => {
  setPrintFontLoader();
  vi.restoreAllMocks();
});

// 1x1 opaque red PNG.
const PNG_1X1 = Uint8Array.from(
  Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==",
    "base64"
  )
);

const makePdf = async (texts: string[]) => {
  const doc = await PDFDocument.create();
  for (const text of texts) {
    const page = doc.addPage([400, 300]);
    page.drawText(text, { x: 40, y: 200, size: 18 });
  }
  return doc.save();
};

const makeXlsx = async () => {
  const mod = await import("exceljs");
  const ExcelJS = (mod as unknown as { default?: typeof mod }).default ?? mod;
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Board");
  sheet.addRow(["Name", "Position"]);
  sheet.addRow(["Jane Doe", "Chair"]);
  sheet.addRow(["John Roe", "Operator"]);
  return new Uint8Array(await workbook.xlsx.writeBuffer());
};

const slots: AttachmentSlot[] = [
  { key: "board_list_file", label: "Board / Employee List" },
  { key: "biography_file", label: "Biography" },
  { key: "photographs", label: "Photographs" },
  { key: "supporting_documents", label: "Supporting Documents" },
];

describe("appendPacketAttachments", () => {
  it("renders every upload behind a divider, in order, and notes what cannot embed", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const boardPdf = await makePdf(["Board page A", "Board page B"]);
    const xlsx = await makeXlsx();
    const bytesByName: Record<string, Uint8Array | null> = {
      "board.pdf": boardPdf,
      "bio.doc": new TextEncoder().encode("legacy word binary"),
      "photo.png": PNG_1X1,
      "staff.xlsx": xlsx,
      "notes.csv": new TextEncoder().encode("name,role\nAda,Clerk\n"),
      "missing.pdf": null,
    };
    const record = {
      board_list_file: { url: "/uploads/board.pdf", name: "board.pdf", mime: "application/pdf" },
      biography_file: { url: "/uploads/bio.doc", name: "bio.doc", mime: "application/msword" },
      photographs: [{ url: "/uploads/photo.png", name: "photo.png", mime: "image/png" }],
      supporting_documents: [
        {
          url: "/uploads/staff.xlsx",
          name: "staff.xlsx",
          mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        { url: "/uploads/notes.csv", name: "notes.csv", mime: "text/csv" },
        { url: "/uploads/missing.pdf", name: "missing.pdf", mime: "application/pdf" },
      ],
    };
    const attachments = orderPacketAttachments(record, slots);
    expect(attachments).toHaveLength(6);

    const doc = await PDFDocument.create();
    const fonts = await embedPrintFonts(doc);
    doc.addPage([612, 792]).drawText("Form page", { x: 72, y: 700, size: 14, font: fonts.bold });

    const outcome = await appendPacketAttachments(doc, fonts, attachments, {
      runningTitle: "Test System  ·  System of the Year  ·  Year: 2027",
      fetchBytes: async (file) => bytesByName[String(file.name)] ?? null,
    });

    expect(outcome.files.map((item) => item.result)).toEqual([
      "merged", // board.pdf (2 pages)
      "unavailable", // bio.doc — legacy Word cannot be parsed
      "embedded", // photo.png
      "embedded", // staff.xlsx via exceljs
      "embedded", // notes.csv as text
      "unavailable", // missing.pdf — download failed
    ]);
    expect(outcome.bySlot).toEqual({
      board_list_file: "merged",
      biography_file: "unavailable",
      photographs: "embedded",
      supporting_documents: "embedded",
    });

    // 1 form page + 2 (pdf) + 1 (doc note) + 1 (png) + 1 (xlsx) + 1 (csv) + 1 (missing note)
    expect(doc.getPageCount()).toBe(8);
    expect(doc.getPages().every((page) => page.getSize().width === 612)).toBe(true);

    const bytes = await doc.save();
    const text = await extractPdfPlainText(bytes);
    expect(text).toMatch(/Attachment 1 of 6\s+[·-]\s+Board \/ Employee List/);
    expect(text).toMatch(/board\.pdf\s+[·-]\s+page 1 of 2/);
    expect(text).toMatch(/board\.pdf\s+[·-]\s+page 2 of 2/);
    expect(text).toMatch(
      /Biography: bio\.doc \(Word 97-2003 document \(DOC\)\) could not be embedded in this packet - open it from the record\./
    );
    expect(text).toMatch(/Attachment 3 of 6\s+[·-]\s+Photographs/);
    expect(text).toMatch(/Jane Doe\s+Chair/);
    expect(text).toMatch(/Ada,Clerk/);
    expect(text).toMatch(/Supporting Documents: missing\.pdf \(PDF\) could not be embedded/);
    expect(text).toMatch(/could not be downloaded/);
    // Order check: dividers appear in ordinal order.
    const positions = [1, 2, 3, 4, 5, 6].map((n) => text.indexOf(`Attachment ${n} of 6`));
    expect(positions.every((pos) => pos >= 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);

    await mkdir(tmpDir, { recursive: true });
    await writeFile(resolve(tmpDir, "packet-appendix-spec.pdf"), Buffer.from(bytes));
  });

  it("returns an empty outcome without adding pages when nothing is attached", async () => {
    const doc = await PDFDocument.create();
    const fonts = await embedPrintFonts(doc);
    doc.addPage([612, 792]);
    const outcome = await appendPacketAttachments(doc, fonts, [], {
      runningTitle: "Nobody",
      fetchBytes: async () => null,
    });
    expect(outcome.files).toEqual([]);
    expect(outcome.bySlot).toEqual({});
    expect(doc.getPageCount()).toBe(1);
  });
});
