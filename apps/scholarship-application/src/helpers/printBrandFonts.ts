import { PDFDocument, StandardFonts, type PDFFont } from "pdf-lib";

export type PrintFontFamily = "Arial" | "Helvetica";

export type PrintFonts = {
  regular: PDFFont;
  bold: PDFFont;
  italic: PDFFont;
  boldItalic: PDFFont;
  family: PrintFontFamily;
};

const ARIAL_DIRS = ["C:/Windows/Fonts", "C:\\Windows\\Fonts", "/mnt/c/Windows/Fonts"];

const ARIAL_FILES = {
  regular: "arial.ttf",
  bold: "arialbd.ttf",
  italic: "ariali.ttf",
  boldItalic: "arialbi.ttf",
} as const;

const readOsFile = async (filePath: string): Promise<Uint8Array | null> => {
  try {
    const { readFile } = await import(/* @vite-ignore */ "node:fs/promises");
    return new Uint8Array(await readFile(filePath));
  } catch {
    return null;
  }
};

const firstExisting = async (names: string[]): Promise<Uint8Array | null> => {
  for (const dir of ARIAL_DIRS) {
    for (const name of names) {
      const bytes = await readOsFile(`${dir}/${name}`);
      if (bytes && bytes.byteLength > 0) return bytes;
    }
  }
  return null;
};

const loadArialFamilyBytes = async () => {
  const regular = await firstExisting([ARIAL_FILES.regular]);
  const bold = await firstExisting([ARIAL_FILES.bold]);
  if (!regular || !bold) return null;
  return {
    regular,
    bold,
    italic: (await firstExisting([ARIAL_FILES.italic])) || regular,
    boldItalic: (await firstExisting([ARIAL_FILES.boldItalic])) || bold,
  };
};

const registerFontkit = async (doc: PDFDocument): Promise<boolean> => {
  try {
    const mod = (await import(/* @vite-ignore */ "fontkit")) as {
      default?: { create: (data: Uint8Array) => unknown };
      create?: (data: Uint8Array) => unknown;
    };
    const fontkit = mod.default ?? mod;
    if (!fontkit || typeof fontkit.create !== "function") return false;
    doc.registerFontkit(fontkit as never);
    return true;
  } catch {
    return false;
  }
};

const embedHelvetica = async (doc: PDFDocument): Promise<PrintFonts> => ({
  regular: await doc.embedFont(StandardFonts.Helvetica),
  bold: await doc.embedFont(StandardFonts.HelveticaBold),
  italic: await doc.embedFont(StandardFonts.HelveticaOblique),
  boldItalic: await doc.embedFont(StandardFonts.HelveticaBoldOblique),
  family: "Helvetica",
});

/** Runtime Arial from Windows fonts; Helvetica fallback. Do not commit font files. */
export const embedPrintFonts = async (doc: PDFDocument): Promise<PrintFonts> => {
  const arial = await loadArialFamilyBytes();
  if (arial && (await registerFontkit(doc))) {
    try {
      return {
        regular: await doc.embedFont(arial.regular),
        bold: await doc.embedFont(arial.bold),
        italic: await doc.embedFont(arial.italic),
        boldItalic: await doc.embedFont(arial.boldItalic),
        family: "Arial",
      };
    } catch {
      // Custom TTF embed failed — use the standard sans.
    }
  }
  return embedHelvetica(doc);
};
