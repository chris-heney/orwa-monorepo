import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  extractAttachmentText,
  extractDocxMarkdown,
  parseMarkdownBlocks,
  toWinAnsi,
} from "./documentText";

const here = dirname(fileURLToPath(import.meta.url));
const tmpDir = resolve(here, "../../../../../../tmp");

describe("toWinAnsi", () => {
  it("normalizes smart punctuation for WinAnsi fonts", () => {
    expect(toWinAnsi("“Hello” — world…")).toBe('"Hello" - world...');
  });
});

describe("parseMarkdownBlocks", () => {
  it("keeps headings, lists, and inline emphasis", () => {
    const blocks = parseMarkdownBlocks(
      "# Title\n\nA **bold** and *italic* line.\n\n- first\n- second\n"
    );
    expect(blocks[0]).toMatchObject({ kind: "heading", level: 1 });
    expect(blocks[1]).toMatchObject({ kind: "paragraph" });
    expect(blocks[1].kind === "paragraph" && blocks[1].runs.some((run) => run.bold)).toBe(
      true
    );
    expect(blocks[2]).toMatchObject({ kind: "list", ordered: false });
  });
});

describe("extractDocxMarkdown", () => {
  it("extracts the Achille photo-permission form without the logo", async () => {
    const bytes = new Uint8Array(
      await readFile(resolve(tmpDir, "achille-biography.docx"))
    );
    const markdown = await extractDocxMarkdown(bytes);
    expect(markdown).toMatch(/permission to reproduce the photos/i);
    expect(markdown).toMatch(/Stephanie Johnson/);
    expect(markdown).not.toMatch(/data:image/);
    expect(markdown).not.toMatch(/!\[/);

    const extracted = await extractAttachmentText(
      bytes,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Photo permission form (TEMPLATE).docx"
    );
    expect(extracted.ok).toBe(true);
    if (extracted.ok) {
      expect(extracted.blocks.length).toBeGreaterThan(0);
      const text = extracted.blocks
        .flatMap((block) =>
          block.kind === "list"
            ? block.items.flat()
            : block.runs
        )
        .map((run) => run.text)
        .join(" ");
      expect(text).toMatch(/MTM Recognition/);
    }
  });
});
