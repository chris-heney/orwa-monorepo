import { afterEach, describe, expect, it, vi } from "vitest";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { extractPdfPlainText } from "./documentText";
import {
  baselineCentered,
  fontAscent,
  generateNominationApplicationPdf,
  printNominationApplications,
  wrapLines,
} from "./printNominationApplication";
import type { AwardNominationPrintRecord } from "./nominationPrintModel";

const here = dirname(fileURLToPath(import.meta.url));
const tmpDir = resolve(here, "../../../../../../tmp");
const seedPacket = resolve(
  here,
  "../../../../../../apps/strapi/public/uploads/pqijsnre_awd_8_a04654c691.pdf"
);

const fakeFont = {
  widthOfTextAtSize: (text: string) => text.length * 6,
} as unknown as Parameters<typeof wrapLines>[1];

describe("baselineCentered", () => {
  it("places the cap-box in the vertical middle of a band", async () => {
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.HelveticaBold);
    const ascent = fontAscent(font, 10);
    const bandBottom = 100;
    const bandHeight = 24;
    const baseline = baselineCentered(bandBottom, bandHeight, font, 10);
    const capTop = baseline + ascent;
    const capMid = (baseline + capTop) / 2;
    expect(capMid).toBeCloseTo(bandBottom + bandHeight / 2, 1);
    expect(baseline).toBeGreaterThan(bandBottom);
    expect(capTop).toBeLessThan(bandBottom + bandHeight);
  });
});

describe("wrapLines", () => {
  it("wraps on word boundaries and hard-breaks long tokens", () => {
    expect(wrapLines("one two three", fakeFont, 10, 48)).toEqual([
      "one two",
      "three",
    ]);
    expect(wrapLines("supercalifragilistic", fakeFont, 10, 24)[0].length).toBeLessThanOrEqual(
      4
    );
  });
});

describe("generateNominationApplicationPdf", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("builds a standalone letter-size application with metadata", async () => {
    const { blob, filename, media } = await generateNominationApplicationPdf({
      nominee_name: "JIMMY E. SEAGO",
      system_name: "Achille PUA",
      award_name_printed: "Achille PUA",
      award_type: "System of the Year",
      award_year: 2027,
      nomination_status: "Submitted",
      county: "Bryan",
      address: "100 Main Street",
      city: "Achille",
      state: "OK",
      zip: "73401",
      daytime_phone: "(580) 555-0100",
      email: "achille@example.com",
      operation_start_date: "1977-06-30",
      beginning_members: 484,
      current_members: 1174,
      justification:
        "Decades of service to a rural water system and a record of reliable operations that the committee can review on paper.",
      biography_method: "Copy/Paste or Type Biography",
      biography_text:
        "Jimmy Seago has served Achille PUA through growth in meter connections and day-to-day system leadership.",
      nominator_first_name: "Pat",
      nominator_last_name: "Nominee",
      nominator_city: "Achille",
      nominator_state: "OK",
      watersystem: { name: "Achille PUA", county: "Bryan", region: "Region 3" },
      clerical_employees: 1,
      operation_maintenance_employees: 4,
      management_employees: 2,
    });

    expect(filename).toBe("ORWA-Award-Nomination-JIMMY-E-SEAGO-2027.pdf");
    expect(media.Photographs).toBe("skipped");
    expect(blob.type).toBe("application/pdf");
    expect(blob.size).toBeGreaterThan(1000);

    const loaded = await PDFDocument.load(await blob.arrayBuffer());
    expect(loaded.getPageCount()).toBeLessThanOrEqual(2);
    expect(loaded.getTitle()).toContain("JIMMY E. SEAGO");
    expect(loaded.getAuthor()).toBe("Oklahoma Rural Water Association");

    const loadedPages = loaded.getPages();
    expect(loadedPages.every((page) => page.getSize().width === 612)).toBe(true);
    expect(loadedPages.every((page) => page.getSize().height === 792)).toBe(true);

    const bytes = new Uint8Array(await blob.arrayBuffer());
    const text = await extractPdfPlainText(bytes);
    if (text) {
      expect(text).toMatch(/Bryan \/ Region 3/);
      expect(text).toMatch(/JUN 30 1977/);
      expect(text).toMatch(/METERED CONNECTIONS/);
      expect(text).toMatch(/EMPLOYEE COUNTS/);
    }

    await mkdir(tmpDir, { recursive: true });
    await writeFile(resolve(tmpDir, "orwa-award-nomination-achille-header.pdf"), Buffer.from(bytes));
  });

  it("fits a tiny imported packet onto letter pages and writes review PDFs", async () => {
    const stubBytes = new Uint8Array(await readFile(seedPacket));
    const stubDoc = await PDFDocument.load(stubBytes);
    const stubSize = stubDoc.getPage(0).getSize();
    expect(stubSize.width).toBe(200);
    expect(stubSize.height).toBe(200);

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        arrayBuffer: async () => stubBytes.buffer.slice(stubBytes.byteOffset),
      }))
    );

    const system = await generateNominationApplicationPdf({
      nominee_name: "Adamson RWD #8",
      system_name: "Adamson RWD #8",
      award_type: "System of the Year",
      award_year: 2026,
      nomination_status: "Submitted",
      county: "Pittsburg",
      address: "100 Seed Lane",
      city: "Adamson",
      state: "OK",
      zip: "74501",
      daytime_phone: "(918) 555-0108",
      email: "adamson@example.com",
      justification: "Seed system application used to verify print layout.",
      biography_method: "Copy/Paste or Type Biography",
      biography_text: "Adamson RWD #8 is a seed biography.",
      nominator_first_name: "Pat",
      nominator_last_name: "Nominator",
      watersystem: {
        name: "Adamson RWD #8",
        county: "Pittsburg",
        region: "Region 2",
      },
      nomination_pdf: {
        url: "/uploads/pqijsnre_awd_8_a04654c691.pdf",
        mime: "application/pdf",
        name: "pqijsnre-awd-8.pdf",
        ext: ".pdf",
      },
    });

    const person = await generateNominationApplicationPdf({
      nominee_name: "Jensen E2E Seed pqijsnre Hodkiewicz",
      system_name: "Ada City of",
      award_name_printed: "Jensen E2E Seed Hodkiewicz",
      award_type: "Excellence in Operations",
      award_year: 2026,
      county: "Pontotoc",
      address: "12 Main",
      city: "Ada",
      state: "OK",
      zip: "74820",
      daytime_phone: "(580) 555-0110",
      email: "jensen@example.com",
      employment_date: "2018-03-01",
      justification: "Individual nominee used to verify the gold H2 and second bar.",
      biography_text: "Jensen has led operations for Ada.",
      nominator_first_name: "Riley",
      nominator_last_name: "Sponsor",
      watersystem: { name: "Ada City of", county: "Pontotoc", region: "Region 3" },
    });

    const systemDoc = await PDFDocument.load(await system.blob.arrayBuffer());
    for (const page of systemDoc.getPages()) {
      const { width, height } = page.getSize();
      expect(width).toBe(612);
      expect(height).toBe(792);
    }
    expect(systemDoc.getPageCount()).toBeGreaterThanOrEqual(2);

    expect(system.media["Original submitted packet"] || system.media["Appendix  ·  Original submitted packet"]).toBe(
      "merged"
    );

    await mkdir(tmpDir, { recursive: true });
    await writeFile(
      resolve(tmpDir, "orwa-award-nomination-adamson.pdf"),
      Buffer.from(await system.blob.arrayBuffer())
    );
    await writeFile(
      resolve(tmpDir, "orwa-award-nomination-jensen.pdf"),
      Buffer.from(await person.blob.arrayBuffer())
    );
  });

  it("skips PDF pages with no Contents stream and still saves", async () => {
    const blankPacket = new TextEncoder().encode(
      "%PDF-1.1\n1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj\n2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj\n3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 200] /Resources << >> >>endobj\ntrailer<< /Root 1 0 R /Size 4 >>\n%%EOF\n"
    );

    const mixed = await PDFDocument.create();
    const first = mixed.addPage([612, 792]);
    first.drawText("Packet page one", { x: 72, y: 720, size: 18 });
    mixed.addPage([612, 792]);
    const third = mixed.addPage([612, 792]);
    third.drawText("Packet page three", { x: 72, y: 720, size: 18 });
    const mixedBytes = await mixed.save();

    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        const bytes = String(url).includes("blank") ? blankPacket : mixedBytes;
        return {
          ok: true,
          arrayBuffer: async () =>
            bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
        };
      })
    );

    const blankOnly = await generateNominationApplicationPdf({
      nominee_name: "Blank Packet System",
      system_name: "Blank Packet System",
      award_type: "System of the Year",
      award_year: 2026,
      nomination_pdf: {
        url: "/uploads/blank-no-contents.pdf",
        mime: "application/pdf",
        name: "blank-no-contents.pdf",
        ext: ".pdf",
      },
    });

    expect(blankOnly.media["Appendix  ·  Original submitted packet"]).toBe(
      "skipped"
    );
    const blankDoc = await PDFDocument.load(await blankOnly.blob.arrayBuffer());
    expect(blankDoc.getPageCount()).toBeGreaterThanOrEqual(1);
    expect(blankDoc.getPages().every((page) => page.getSize().width === 612)).toBe(
      true
    );

    const mixedPrint = await generateNominationApplicationPdf({
      nominee_name: "Mixed Packet System",
      system_name: "Mixed Packet System",
      award_type: "System of the Year",
      award_year: 2026,
      nomination_pdf: {
        url: "/uploads/mixed-packet.pdf",
        mime: "application/pdf",
        name: "mixed-packet.pdf",
        ext: ".pdf",
      },
    });

    expect(mixedPrint.media["Appendix  ·  Original submitted packet"]).toBe(
      "merged"
    );
    const mixedDoc = await PDFDocument.load(await mixedPrint.blob.arrayBuffer());
    expect(mixedDoc.getPages().every((page) => page.getSize().width === 612)).toBe(
      true
    );
    expect(mixedDoc.getPageCount()).toBeGreaterThanOrEqual(3);
    expect(warn.mock.calls.some((call) => String(call[0]).includes("no Contents"))).toBe(
      true
    );

    await mkdir(tmpDir, { recursive: true });
    await writeFile(
      resolve(tmpDir, "orwa-award-nomination-mixed-packet.pdf"),
      Buffer.from(await mixedPrint.blob.arrayBuffer())
    );
    warn.mockRestore();
  });

  it("embeds uploaded images and draws DOCX biography text instead of a URL", async () => {
    const boardPdf = await PDFDocument.create();
    const page = boardPdf.addPage([612, 792]);
    page.drawText("Achille PUA board members", { x: 72, y: 720, size: 16 });
    const boardBytes = await boardPdf.save();
    const png = new Uint8Array(
      await readFile(resolve(tmpDir, "achille-board-list-source.png"))
    );
    const docx = new Uint8Array(
      await readFile(resolve(tmpDir, "achille-biography.docx"))
    );
    const nominationPdfBytes = new Uint8Array(
      await readFile(resolve(tmpDir, "achille-nomination-pdf.pdf"))
    );

    const fetchMock = vi.fn(async (url: string) => {
      const href = String(url);
      const bytes = href.includes("JIMMY")
        ? nominationPdfBytes
        : href.toLowerCase().includes(".docx") || href.includes("Photo_permission")
          ? docx
          : href.includes(".png")
            ? png
            : boardBytes;
      return {
        ok: true,
        arrayBuffer: async () =>
          bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
      };
    });
    vi.stubGlobal("fetch", fetchMock);

    const uploadedPng = {
      url: "/uploads/Sponsorship_Verbiage_55a656bd4c.png",
      mime: "image/png",
      name: "Sponsorship Verbiage.png",
      ext: ".png",
    };

    const achille = await generateNominationApplicationPdf({
      id: "v9kv0s9tlw0dd5h9z2smdodh",
      documentId: "v9kv0s9tlw0dd5h9z2smdodh",
      entityId: 13,
      nominee_name: "JIMMY E. SEAGO",
      system_name: "Achille PUA",
      award_name_printed: "Achille PUA",
      award_type: "System of the Year",
      award_year: 2027,
      nomination_status: "Submitted",
      address: "1410 SE 15th Street",
      city: "OKLAHOMA CITY",
      state: "OK",
      zip: "73129",
      daytime_phone: "4056728925",
      email: "sjohnson@orwa.org",
      operation_start_date: "2026-08-26",
      beginning_members: 1,
      current_members: 100,
      clerical_employees: 2,
      operation_maintenance_employees: 5,
      management_employees: 3,
      justification: "test test test test test test test test test test test test",
      biography_method: "Upload Biography",
      board_list_method: "File You Upload",
      board_list_file: uploadedPng,
      biography_file: {
        url: "/uploads/Photo_permission_form_TEMPLATE_4964a8b079.docx",
        mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        name: "Photo permission form (TEMPLATE).docx",
        ext: ".docx",
      },
      photographs: [
        uploadedPng,
        {
          ...uploadedPng,
          url: "/uploads/Sponsorship_Verbiage_aad9b6503d.png",
        },
      ],
      nominator_first_name: "stephanie",
      nominator_last_name: "johnson",
      nominator_email: "SJOHNSON@ORWA.ORG",
      nominator_phone: "(405) 672-8925",
      nominator_address: "1410 SE 15th Street",
      nominator_city: "oklahoma city",
      nominator_state: "OK",
      nominator_zip: "73129",
      nominator_country: "United States",
      watersystem: { name: "Achille PUA", county: "Bryan", region: "Region 3" },
      nomination_pdf: {
        url: "/uploads/JIMMY_E_SEAGO_award_nomination_e34a0f548f.pdf",
        mime: "application/pdf",
        name: "JIMMY_E._SEAGO_award_nomination.pdf",
        ext: ".pdf",
      },
    });

    expect(achille.media["Board / employee list"]).toBe("embedded");
    expect(achille.media["Biography file"]).toBe("embedded");
    expect(achille.media["Photographs (2)"]).toBe("embedded");
    expect(achille.media["Appendix  ·  Original submitted packet"]).toBe("merged");

    const achilleBytes = Buffer.from(await achille.blob.arrayBuffer());
    const achilleDoc = await PDFDocument.load(achilleBytes);
    expect(achilleDoc.getPageCount()).toBeLessThan(6);

    await mkdir(tmpDir, { recursive: true });
    await writeFile(
      resolve(tmpDir, "orwa-award-nomination-achille-2027.pdf"),
      achilleBytes
    );

    const kept = await generateNominationApplicationPdf({
      nominee_name: "JIMMY E. SEAGO",
      system_name: "Achille PUA",
      award_type: "System of the Year",
      award_year: 2027,
      board_list_file: {
        url: "/uploads/achille-board.pdf",
        mime: "application/pdf",
        name: "achille-board.pdf",
        ext: ".pdf",
      },
    });
    expect(kept.media["Board / employee list"]).toBe("merged");
  });
});

describe("printNominationApplications", () => {
  it("prints each nomination as its own job and continues after a failure", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const order: string[] = [];
    const printOne = async (record: AwardNominationPrintRecord) => {
      order.push(String(record.nominee_name));
      if (record.nominee_name === "Two") {
        throw new Error("PDF failed");
      }
      return { filename: `${record.nominee_name}.pdf` };
    };

    const result = await printNominationApplications(
      [
        { nominee_name: "One", award_year: 2027 },
        { nominee_name: "Two", award_year: 2027 },
        { nominee_name: "Three", award_year: 2027 },
      ],
      printOne
    );

    expect(order).toEqual(["One", "Two", "Three"]);
    expect(result.printed).toEqual(["One.pdf", "Three.pdf"]);
    expect(result.failed).toHaveLength(1);
    expect(result.failed[0].message).toBe("PDF failed");
    expect(result.failed[0].filename).toContain("Two");
  });
});
