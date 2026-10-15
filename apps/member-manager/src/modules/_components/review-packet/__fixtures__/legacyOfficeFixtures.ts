/** Test-only helpers for the legacy Office specs (not imported by app code). */
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

/**
 * Real Word 97-2003 output (Microsoft Office Word, code page 1252, UTF-16
 * pieces for the smart quotes / box glyphs): the blank ORWA travel-voucher
 * template an applicant uploaded as a Board / Employee List. Author names in
 * the document properties and the saved-by table were overwritten in place
 * with same-length placeholders; the body is an unfilled form.
 */
export const loadVoucherDoc = async () =>
  new Uint8Array(await readFile(resolve(here, "travel-voucher.doc")));

/** Flip the FIB `fEncrypted` bit of the WordDocument stream (first 512-byte sector that starts with the Word magic). */
export const encryptedVariantOf = (bytes: Uint8Array) => {
  const copy = Uint8Array.from(bytes);
  for (let offset = 512; offset + 0x0c < copy.length; offset += 512) {
    if (copy[offset] === 0xec && copy[offset + 1] === 0xa5) {
      copy[offset + 0x0b] |= 0x01; // 0x0100 fEncrypted (little-endian high byte)
      return copy;
    }
  }
  throw new Error("WordDocument stream not found");
};

/** Two-sheet board/staff workbook written by SheetJS in the requested format (BIFF8 for "xls"). */
export const makeWorkbook = async (bookType: "xls" | "xlsx" | "csv") => {
  const XLSX = await import("xlsx");
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet([
      ["Name", "Position", "Years"],
      ["Jane Doe", "Chair", 12],
      ["John Roe", "Operator", 3.5],
    ]),
    "Board"
  );
  if (bookType !== "csv") {
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet([["Employee", "Role"], ["Ada Lovelace", "Clerk"]]),
      "Staff"
    );
  }
  return new Uint8Array(XLSX.write(workbook, { bookType, type: "array" }) as ArrayBuffer);
};

/** Smallest DOCX mammoth will read: content types, package rels, one paragraph. */
export const makeDocx = async (paragraph: string) => {
  const CFB = await import("cfb");
  const zip = CFB.utils.cfb_new();
  const add = (name: string, xml: string) =>
    CFB.utils.cfb_add(zip, name, new TextEncoder().encode(xml));
  add(
    "[Content_Types].xml",
    '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'
  );
  add(
    "_rels/.rels",
    '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'
  );
  add(
    "word/document.xml",
    '<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
      `<w:body><w:p><w:r><w:t>${paragraph}</w:t></w:r></w:p></w:body></w:document>`
  );
  return new Uint8Array(CFB.write(zip, { fileType: "zip", type: "array" }) as number[]);
};
