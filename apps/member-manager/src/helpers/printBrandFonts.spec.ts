import { describe, expect, it } from "vitest";
import { PDFDocument } from "pdf-lib";
import { embedPrintFonts } from "./printBrandFonts";

describe("embedPrintFonts", () => {
  it("embeds Arial from the OS or Helvetica — never Times", async () => {
    const doc = await PDFDocument.create();
    const fonts = await embedPrintFonts(doc);
    expect(["Arial", "Helvetica"]).toContain(fonts.family);
    expect(fonts.regular.name).not.toMatch(/Times/i);
    expect(fonts.bold.name).not.toMatch(/Times/i);
    expect(fonts.regular.name).toMatch(/Arial|Helvetica/);
    expect(fonts.bold.name).toMatch(/Arial|Helvetica/);
  });
});
