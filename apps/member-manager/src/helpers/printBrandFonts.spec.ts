import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { PDFDocument, PDFDict, PDFName } from "pdf-lib";
import { embedPrintFonts, setPrintFontLoader } from "./printBrandFonts";

// Node's fetch rejects file: URLs, so read the vendored TTFs from disk here.
const readFontFromDisk = async (url: string) =>
  new Uint8Array(await readFile(fileURLToPath(url)));

/** BaseFont names of every font dictionary in a saved PDF (subset tag stripped). */
const embeddedBaseFonts = async (bytes: Uint8Array) => {
  const loaded = await PDFDocument.load(bytes);
  const names: string[] = [];
  for (const [, obj] of loaded.context.enumerateIndirectObjects()) {
    if (!(obj instanceof PDFDict)) continue;
    if (obj.get(PDFName.of("Type")) !== PDFName.of("Font")) continue;
    const base = obj.get(PDFName.of("BaseFont"));
    if (base instanceof PDFName) names.push(base.decodeText().replace(/^[A-Z]{6}\+/, ""));
  }
  return names;
};

describe("embedPrintFonts", () => {
  beforeAll(() => setPrintFontLoader(readFontFromDisk));
  afterAll(() => setPrintFontLoader());
  afterEach(() => vi.restoreAllMocks());

  it("embeds the Liberation Sans family (Arial metrics) as subset TrueType", async () => {
    const doc = await PDFDocument.create();
    const fonts = await embedPrintFonts(doc);
    expect(fonts.family).toBe("Liberation Sans");
    expect(fonts.regular.name).toBe("LiberationSans");
    expect(fonts.bold.name).toBe("LiberationSans-Bold");
    expect(fonts.italic.name).toBe("LiberationSans-Italic");
    expect(fonts.boldItalic.name).toBe("LiberationSans-BoldItalic");

    const page = doc.addPage();
    page.drawText("Oklahoma Rural Water Association", { font: fonts.bold, size: 14 });
    page.drawText("Nomination", { font: fonts.regular, size: 11, y: 700 });
    // pdf-lib names subset fonts `TAG+LiberationSans-<n>` / `TAG+LiberationSans-Bold-<n>`.
    const names = await embeddedBaseFonts(await doc.save());
    expect(names.some((name) => /^LiberationSans(-\d+)?$/.test(name))).toBe(true);
    expect(names.some((name) => /^LiberationSans-Bold(-\d+)?$/.test(name))).toBe(true);
    expect(names.join(" ")).not.toMatch(/Helvetica|Times/);
  });

  it("falls back to Helvetica with a warning when a font file cannot be loaded", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    setPrintFontLoader(async () => {
      throw new Error("offline");
    });
    try {
      const doc = await PDFDocument.create();
      const fonts = await embedPrintFonts(doc);
      expect(fonts.family).toBe("Helvetica");
      expect(fonts.regular.name).toBe("Helvetica");
      expect(fonts.bold.name).toBe("Helvetica-Bold");
      expect(warn).toHaveBeenCalledTimes(1);
      expect(String(warn.mock.calls[0][0])).toMatch(/falling back to Helvetica/);
    } finally {
      setPrintFontLoader(readFontFromDisk);
    }
  });
});
