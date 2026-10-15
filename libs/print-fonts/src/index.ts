// Default import on purpose: the ES build does `export default fontkit` and the
// UMD build `module.exports = fontkit`; a namespace import has no `create` in
// the browser (caught by the headless-Chromium smoke, 2026-10-15).
import fontkit from "@pdf-lib/fontkit";
import type { PDFDocument, PDFFont } from "pdf-lib";

/**
 * Brand fonts for every pdf-lib print path (award nomination, scholarship
 * packet, public form receipts).
 *
 * The user asked for Arial in printed headers. Browsers cannot read OS font
 * files, so we ship Liberation Sans — Red Hat's metric-compatible Arial
 * replacement (SIL Open Font License, see ./fonts/LICENSE) — as Vite assets
 * and embed a glyph subset into each PDF. If a font file cannot be fetched
 * we fall back to pdf-lib's built-in Helvetica so printing never breaks.
 */

export type PrintFontFamily = "Liberation Sans" | "Helvetica";

export type PrintFonts = {
  regular: PDFFont;
  bold: PDFFont;
  italic: PDFFont;
  boldItalic: PDFFont;
  family: PrintFontFamily;
};

type FontStyle = Exclude<keyof PrintFonts, "family">;

/**
 * Static `new URL(..., import.meta.url)` is the one asset pattern Vite rewrites
 * to a hashed `dist/assets/*.ttf` URL in both build and dev. Under Vitest it
 * stays a `file:` URL, which Node's fetch rejects — see {@link setPrintFontLoader}.
 */
export const PRINT_FONT_URLS: Readonly<Record<FontStyle, string>> = {
  regular: new URL("./fonts/LiberationSans-Regular.ttf", import.meta.url).href,
  bold: new URL("./fonts/LiberationSans-Bold.ttf", import.meta.url).href,
  italic: new URL("./fonts/LiberationSans-Italic.ttf", import.meta.url).href,
  boldItalic: new URL("./fonts/LiberationSans-BoldItalic.ttf", import.meta.url).href,
};

export type PrintFontLoader = (url: string) => Promise<Uint8Array>;

const fetchFontBytes: PrintFontLoader = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${url}`);
  }
  return new Uint8Array(await response.arrayBuffer());
};

let loadFontBytes: PrintFontLoader = fetchFontBytes;
const fontBytesCache = new Map<string, Promise<Uint8Array>>();

/**
 * Replace how font files are read (pass nothing to restore `fetch`). Node has
 * no `fetch` for `file:` URLs, so tests use this to read the TTFs from disk.
 */
export const setPrintFontLoader = (loader?: PrintFontLoader): void => {
  loadFontBytes = loader ?? fetchFontBytes;
  fontBytesCache.clear();
};

const getFontBytes = (url: string): Promise<Uint8Array> => {
  let pending = fontBytesCache.get(url);
  if (!pending) {
    pending = loadFontBytes(url).then((bytes) => {
      if (!bytes || bytes.byteLength === 0) {
        throw new Error(`Empty font file at ${url}`);
      }
      return bytes;
    });
    // Do not cache failures: a transient network error should retry next print.
    pending.catch(() => fontBytesCache.delete(url));
    fontBytesCache.set(url, pending);
  }
  return pending;
};

const embedHelvetica = async (doc: PDFDocument): Promise<PrintFonts> => ({
  regular: await doc.embedFont("Helvetica"),
  bold: await doc.embedFont("Helvetica-Bold"),
  italic: await doc.embedFont("Helvetica-Oblique"),
  boldItalic: await doc.embedFont("Helvetica-BoldOblique"),
  family: "Helvetica",
});

/** Embed the Liberation Sans family (subset) into `doc`; Helvetica on failure. */
export const embedPrintFonts = async (doc: PDFDocument): Promise<PrintFonts> => {
  try {
    const [regular, bold, italic, boldItalic] = await Promise.all([
      getFontBytes(PRINT_FONT_URLS.regular),
      getFontBytes(PRINT_FONT_URLS.bold),
      getFontBytes(PRINT_FONT_URLS.italic),
      getFontBytes(PRINT_FONT_URLS.boldItalic),
    ]);
    doc.registerFontkit(fontkit);
    return {
      regular: await doc.embedFont(regular, { subset: true }),
      bold: await doc.embedFont(bold, { subset: true }),
      italic: await doc.embedFont(italic, { subset: true }),
      boldItalic: await doc.embedFont(boldItalic, { subset: true }),
      family: "Liberation Sans",
    };
  } catch (error) {
    console.warn(
      "[print-fonts] Liberation Sans could not be loaded; falling back to Helvetica.",
      error
    );
    return embedHelvetica(doc);
  }
};
