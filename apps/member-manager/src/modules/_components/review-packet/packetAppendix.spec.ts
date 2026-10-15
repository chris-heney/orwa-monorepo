import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument } from "pdf-lib";
import { embedPrintFonts, setPrintFontLoader } from "../../../helpers/printBrandFonts";
import { extractPdfPlainText } from "../../award-nominations/helpers/documentText";
import { encryptedVariantOf, loadVoucherDoc, makeDocx, makeWorkbook } from "./__fixtures__/legacyOfficeFixtures";
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

const slots: AttachmentSlot[] = [
  { key: "board_list_file", label: "Board / Employee List" },
  { key: "biography_file", label: "Biography" },
  { key: "photographs", label: "Photographs" },
  { key: "supporting_documents", label: "Supporting Documents" },
];

describe("appendPacketAttachments", () => {
  it("renders every upload behind a divider, in order, and notes what cannot embed", async () => {
    const boardDoc = await loadVoucherDoc();
    const bioPdf = await makePdf(["Bio page A", "Bio page B"]);
    const bytesByName: Record<string, Uint8Array | null> = {
      "Travel Voucher.doc": boardDoc,
      "bio.pdf": bioPdf,
      "photo.png": PNG_1X1,
      "staff.xls": await makeWorkbook("xls"),
      "staff.xlsx": await makeWorkbook("xlsx"),
      "notes.csv": new TextEncoder().encode("name,role\nAda,Clerk\n"),
      "missing.pdf": null,
      "slides.ppt": new TextEncoder().encode("\u0000\u0001not really a presentation\u0000\u0002"),
    };
    const record = {
      board_list_file: {
        url: "/uploads/Travel_Voucher_1fd702c6db.doc",
        name: "Travel Voucher.doc",
        mime: "application/msword",
        ext: ".doc",
      },
      biography_file: { url: "/uploads/bio.pdf", name: "bio.pdf", mime: "application/pdf" },
      photographs: [{ url: "/uploads/photo.png", name: "photo.png", mime: "image/png" }],
      supporting_documents: [
        { url: "/uploads/staff.xls", name: "staff.xls", mime: "application/vnd.ms-excel", ext: ".xls" },
        {
          url: "/uploads/staff.xlsx",
          name: "staff.xlsx",
          mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        { url: "/uploads/notes.csv", name: "notes.csv", mime: "text/csv" },
        { url: "/uploads/missing.pdf", name: "missing.pdf", mime: "application/pdf" },
        { url: "/uploads/slides.ppt", name: "slides.ppt", mime: "application/vnd.ms-powerpoint", ext: ".ppt" },
      ],
    };
    const attachments = orderPacketAttachments(record, slots);
    expect(attachments).toHaveLength(8);

    const doc = await PDFDocument.create();
    const fonts = await embedPrintFonts(doc);
    doc.addPage([612, 792]).drawText("Form page", { x: 72, y: 700, size: 14, font: fonts.bold });

    const outcome = await appendPacketAttachments(doc, fonts, attachments, {
      runningTitle: "Adair Co RWD #2  ·  System of the Year  ·  Year: 2027",
      fetchBytes: async (file) => bytesByName[String(file.name)] ?? null,
    });

    expect(outcome.files.map((item) => item.result)).toEqual([
      "embedded", // Travel Voucher.doc — Word 97-2003 text via the MS-DOC reader
      "merged", // bio.pdf (2 pages)
      "embedded", // photo.png
      "embedded", // staff.xls — BIFF8 via SheetJS
      "embedded", // staff.xlsx — OOXML via SheetJS
      "embedded", // notes.csv as text
      "unavailable", // missing.pdf — download failed
      "unavailable", // slides.ppt — no reader
    ]);
    expect(outcome.bySlot).toEqual({
      board_list_file: "embedded",
      biography_file: "merged",
      photographs: "embedded",
      supporting_documents: "embedded",
    });

    // 1 form + 1 (doc text) + 2 (pdf) + 1 (png) + 1 (xls) + 1 (xlsx) + 1 (csv) + 1 (missing note) + 1 (ppt note)
    expect(doc.getPageCount()).toBe(10);
    expect(doc.getPages().every((page) => page.getSize().width === 612)).toBe(true);

    const bytes = await doc.save();
    const text = await extractPdfPlainText(bytes);
    expect(text).toMatch(/Attachment 1 of 8\s+[·-]\s+Board \/ Employee List/);
    expect(text).toMatch(/Travel Voucher\.doc\s+[·-]\s+text rendered from the uploaded document/);
    expect(text).toContain("TRAVEL EXPENSE REIMBURSEMENT VOUCHER");
    expect(text).toContain("Oklahoma City, OK 73129");
    expect(text).toContain("TOTAL AMOUNT OF REIMBURSEMENT");
    expect(text).toContain("Make check payable to:");
    expect(text).not.toMatch(/Travel Voucher\.doc \(Word 97-2003 document \(DOC\)\) could not be embedded/);
    expect(text).toMatch(/bio\.pdf\s+[·-]\s+page 1 of 2/);
    expect(text).toMatch(/bio\.pdf\s+[·-]\s+page 2 of 2/);
    expect(text).toMatch(/Attachment 3 of 8\s+[·-]\s+Photographs/);
    // Both workbooks: sheet headings + rows.
    expect(text.match(/Board\s+Name\s+Position\s+Years\s+Jane Doe\s+Chair\s+12/g)).toHaveLength(2);
    expect(text.match(/Staff\s+Employee\s+Role\s+Ada Lovelace\s+Clerk/g)).toHaveLength(2);
    expect(text).toMatch(/Ada,Clerk/);
    expect(text).toMatch(/Supporting Documents: missing\.pdf \(PDF\) could not be embedded/);
    expect(text).toMatch(/could not be downloaded/);
    expect(text).toMatch(/slides\.ppt \(PowerPoint 97-2003 presentation \(PPT\)\) could not be embedded/);
    expect(text).toMatch(/Only PDF, Word \(DOC \/ DOCX\), Excel \(XLS \/ XLSX\), CSV, text and JPEG/);
    // Order check: dividers appear in ordinal order.
    const positions = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => text.indexOf(`Attachment ${n} of 8`));
    expect(positions.every((pos) => pos >= 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);

    await mkdir(tmpDir, { recursive: true });
    await writeFile(resolve(tmpDir, "packet-appendix-spec.pdf"), Buffer.from(bytes));
  });

  it("routes mislabelled .doc uploads by content and explains password-protected ones", async () => {
    const voucher = await loadVoucherDoc();
    const bytesByName: Record<string, Uint8Array | null> = {
      "really-docx.doc": await makeDocx("Modern Word text saved with the wrong extension."),
      "rtf.doc": new TextEncoder().encode("{\\rtf1\\ansi\\pard Rich text body\\par second line\\par}"),
      "locked.doc": encryptedVariantOf(voucher),
      "plain.doc": new TextEncoder().encode("Just a text file\nwith two lines\n"),
    };
    const record = {
      supporting_documents: Object.keys(bytesByName).map((name) => ({
        url: `/uploads/${name}`,
        name,
        mime: "application/msword",
        ext: ".doc",
      })),
    };
    const attachments = orderPacketAttachments(record, slots);
    const doc = await PDFDocument.create();
    const fonts = await embedPrintFonts(doc);
    doc.addPage([612, 792]);
    const outcome = await appendPacketAttachments(doc, fonts, attachments, {
      runningTitle: "Mislabelled",
      fetchBytes: async (file) => bytesByName[String(file.name)] ?? null,
    });
    expect(outcome.files.map((item) => item.result)).toEqual([
      "embedded",
      "embedded",
      "unavailable",
      "embedded",
    ]);
    expect(outcome.files[2].detail).toBe("The document is password-protected and cannot be read.");

    const text = await extractPdfPlainText(await doc.save());
    expect(text).toContain("Modern Word text saved with the wrong extension.");
    expect(text).toContain("Rich text body");
    expect(text).toContain("second line");
    expect(text).toMatch(/locked\.doc \(Word 97-2003 document \(DOC\)\) could not be embedded/);
    expect(text).toContain("password-protected");
    expect(text).toContain("Just a text file");
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
