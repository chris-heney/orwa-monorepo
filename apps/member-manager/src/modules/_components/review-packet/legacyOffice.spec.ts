import { describe, expect, it } from "vitest";
import {
  extractLegacyDocText,
  extractWorkbookBlocks,
  isLegacyWordAttachment,
  isSpreadsheetAttachment,
  linesToBlocks,
  normaliseWordText,
  rtfToText,
  sniffBinaryContainer,
} from "./legacyOffice";
import { encryptedVariantOf, loadVoucherDoc, makeWorkbook } from "./__fixtures__/legacyOfficeFixtures";

describe("sniffBinaryContainer", () => {
  it("recognises OLE, ZIP, RTF and PDF headers", async () => {
    expect(sniffBinaryContainer(await loadVoucherDoc())).toBe("ole");
    expect(sniffBinaryContainer(Uint8Array.from([0x50, 0x4b, 0x03, 0x04, 0, 0, 0, 0]))).toBe("zip");
    expect(sniffBinaryContainer(new TextEncoder().encode("{\\rtf1\\ansi Hello}"))).toBe("rtf");
    expect(sniffBinaryContainer(new TextEncoder().encode("%PDF-1.4\n"))).toBe("pdf");
    expect(sniffBinaryContainer(new TextEncoder().encode("just text"))).toBe("unknown");
  });
});

describe("attachment predicates", () => {
  it("matches legacy Word and every spreadsheet flavour", () => {
    expect(isLegacyWordAttachment("application/msword", ".doc")).toBe(true);
    expect(isLegacyWordAttachment("", "Travel Voucher.doc")).toBe(true);
    expect(isLegacyWordAttachment("application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".docx")).toBe(false);
    expect(isSpreadsheetAttachment("application/vnd.ms-excel", ".xls")).toBe(true);
    expect(isSpreadsheetAttachment("", "board.xlsx")).toBe(true);
    expect(isSpreadsheetAttachment("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".xlsx")).toBe(true);
    expect(isSpreadsheetAttachment("text/csv", ".csv")).toBe(false);
  });
});

describe("extractLegacyDocText", () => {
  it("reads the body of a real Word 97-2003 file, including UTF-16 pieces", async () => {
    const result = await extractLegacyDocText(await loadVoucherDoc());
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const lines = result.text.split("\n");
    expect(lines[0]).toMatch(/^ORWA\s+TRAVEL EXPENSE REIMBURSEMENT VOUCHER$/);
    expect(lines[1]).toBe("1410 SE 15th Street");
    expect(lines[2]).toBe("Oklahoma City, OK 73129");
    expect(result.text).toContain("(MUST BE COMPLETED FOR REIMBURSEMENT)");
    // Smart quotes and the checkbox glyph live in 16-bit pieces.
    expect(result.text).toContain("*Per Diem is for \u201cORWA\u201d Board Only: (we will calculate this for you)");
    expect(result.text).toContain("Personal Vehicle \u25a1   System Vehicle \u25a1");
    expect(result.text).toContain("Total Mileage                 @ .76\u00a2 a mile = $");
    expect(result.text).toContain("Additional Expenses (must have receipt for reimbursement):");
    expect(result.text).toMatch(/Make check payable to:\nPrint Name:\nAddress:\nCity, State, Zip:\nSignature:\nDate:$/);
    // No control characters leak through.
    // eslint-disable-next-line no-control-regex
    expect(result.text).not.toMatch(/[\u0000-\u0008\u000b-\u001f]/);
  });

  it("reports password-protected documents instead of decoding garbage", async () => {
    const result = await extractLegacyDocText(encryptedVariantOf(await loadVoucherDoc()));
    expect(result).toEqual({ ok: false, reason: "encrypted" });
  });

  it("rejects non-OLE and non-Word input", async () => {
    expect(await extractLegacyDocText(new TextEncoder().encode("legacy word binary"))).toEqual({
      ok: false,
      reason: "not-word",
    });
    // A real compound file that is a workbook, not a document.
    const xls = await makeWorkbook("xls");
    expect(sniffBinaryContainer(xls)).toBe("ole");
    expect(await extractLegacyDocText(xls)).toEqual({ ok: false, reason: "not-word" });
  });
});

describe("normaliseWordText", () => {
  it("keeps field results, drops field codes, pictures and anchors", () => {
    const raw = "Date: \u0013 DATE \\@ \"d MMMM yyyy\" \u0014June 24, 2026\u0015\r\u0001Logo\u0008\rNext\r";
    expect(normaliseWordText(raw)).toBe("Date: June 24, 2026\nLogo\nNext");
  });

  it("turns table cell marks into spacing and row marks into line breaks", () => {
    const raw = "Name\u0007Role\u0007\u0007Jane\u0007Chair\u0007\u0007After\r";
    expect(normaliseWordText(raw)).toBe("Name   Role\nJane   Chair\nAfter");
  });

  it("handles nested fields (hyperlink inside a TOC-style field)", () => {
    const raw = "\u0013 TOC \u0014\u0013 HYPERLINK \"x\" \u0014Section 1\u0015\u0015\r";
    expect(normaliseWordText(raw)).toBe("Section 1");
  });
});

describe("rtfToText", () => {
  it("strips control words and groups, decodes escapes and unicode", () => {
    const rtf =
      "{\\rtf1\\ansi\\ansicpg1252\\deff0{\\fonttbl{\\f0 Calibri;}}{\\colortbl;\\red0\\green0\\blue0;}" +
      "{\\*\\generator Riched20}\\pard\\f0\\fs22 Board members:\\par" +
      "\\tab Jane \\'e9 Doe \\u8211? Chair\\par Second \\{line\\}\\par}";
    expect(rtfToText(rtf)).toBe("Board members:\n\tJane \u00e9 Doe \u2013 Chair\nSecond {line}");
  });
});

describe("extractWorkbookBlocks", () => {
  it("renders an Excel 97-2003 (BIFF8) workbook as titled text tables", async () => {
    const result = await extractWorkbookBlocks(await makeWorkbook("xls"));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.blocks).toEqual([
      { kind: "heading", level: 2, runs: [{ text: "Board" }] },
      { kind: "paragraph", runs: [{ text: "Name   Position   Years" }] },
      { kind: "paragraph", runs: [{ text: "Jane Doe   Chair   12" }] },
      { kind: "paragraph", runs: [{ text: "John Roe   Operator   3.5" }] },
      { kind: "heading", level: 2, runs: [{ text: "Staff" }] },
      { kind: "paragraph", runs: [{ text: "Employee   Role" }] },
      { kind: "paragraph", runs: [{ text: "Ada Lovelace   Clerk" }] },
    ]);
  });

  it("renders XLSX identically and skips the sheet heading for single-sheet CSV-as-xls", async () => {
    const xlsx = await extractWorkbookBlocks(await makeWorkbook("xlsx"));
    const xls = await extractWorkbookBlocks(await makeWorkbook("xls"));
    expect(xlsx).toEqual(xls);
    const csv = await extractWorkbookBlocks(await makeWorkbook("csv"));
    expect(csv.ok).toBe(true);
    if (!csv.ok) return;
    expect(csv.blocks.map((block) => block.kind)).toEqual(["paragraph", "paragraph", "paragraph"]);
    expect(csv.blocks[1]).toEqual({ kind: "paragraph", runs: [{ text: "Jane Doe   Chair   12" }] });
  });

  it("reports empty workbooks", async () => {
    const XLSX = await import("xlsx");
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([[]]), "Blank");
    const bytes = new Uint8Array(XLSX.write(workbook, { bookType: "xls", type: "array" }) as ArrayBuffer);
    expect(await extractWorkbookBlocks(bytes)).toEqual({ ok: false, reason: "empty" });
  });
});

describe("linesToBlocks", () => {
  it("keeps one paragraph per line, expands tabs and caps blank runs", () => {
    const blocks = linesToBlocks("A\tB\r\n\n   C" + " ".repeat(30) + "D   \n");
    expect(blocks).toEqual([
      { kind: "paragraph", runs: [{ text: "A    B" }] },
      { kind: "paragraph", runs: [{ text: `C${" ".repeat(12)}D` }] },
    ]);
  });
});
