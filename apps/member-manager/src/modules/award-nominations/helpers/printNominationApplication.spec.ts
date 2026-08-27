import { afterEach, describe, expect, it, vi } from "vitest";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, StandardFonts } from "pdf-lib";
import {
  baselineCentered,
  fontAscent,
  generateNominationApplicationPdf,
  wrapLines,
} from "./printNominationApplication";

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
    const font = await doc.embedFont(StandardFonts.TimesRomanBold);
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
    expect(loaded.getPageCount()).toBeGreaterThanOrEqual(1);
    expect(loaded.getTitle()).toContain("JIMMY E. SEAGO");
    expect(loaded.getAuthor()).toBe("Oklahoma Rural Water Association");

    const loadedPages = loaded.getPages();
    expect(loadedPages.every((page) => page.getSize().width === 612)).toBe(true);
    expect(loadedPages.every((page) => page.getSize().height === 792)).toBe(true);
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
});
