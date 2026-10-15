import { describe, expect, it } from "vitest";
import { formatPacketYear } from "./formatters";
import {
  asPacketMediaItems,
  attachmentDividerTitle,
  attachmentReference,
  attachmentTypeLabel,
  combineEmbedResults,
  orderPacketAttachments,
  unavailableAttachmentNote,
  type AttachmentSlot,
} from "./packetAttachments";

const slots: AttachmentSlot[] = [
  { key: "board_list_file", label: "Board / Employee List" },
  { key: "biography_file", label: "Biography" },
  { key: "photographs", label: "Photographs" },
  { key: "nomination_pdf", label: "Submitted Nomination PDF", system: true },
];

const png = (name: string) => ({ url: `/uploads/${name}`, name, mime: "image/png", ext: ".png" });

describe("formatPacketYear", () => {
  it("prints the record year as 'Year: NNNN' and never 'Cycle'", () => {
    expect(formatPacketYear(2027)).toBe("Year: 2027");
    expect(formatPacketYear("2026")).toBe("Year: 2026");
    expect(formatPacketYear(null)).toBe("Year: —");
    expect(formatPacketYear(2027)).not.toMatch(/cycle/i);
  });
});

describe("asPacketMediaItems", () => {
  it("accepts a single file, an array, or Strapi v4 { data: [] } and drops url-less items", () => {
    const one = png("a.png");
    expect(asPacketMediaItems(one)).toEqual([one]);
    expect(asPacketMediaItems([one, null, { name: "no-url" }])).toEqual([one]);
    expect(asPacketMediaItems({ data: [one] })).toEqual([one]);
    expect(asPacketMediaItems(null)).toEqual([]);
  });
});

describe("orderPacketAttachments", () => {
  const record = {
    photographs: [png("photo-1.png"), png("photo-2.png")],
    biography_file: { url: "/uploads/bio.docx", name: "bio.docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
    board_list_file: { url: "/uploads/board.pdf", name: "board.pdf", mime: "application/pdf" },
    nomination_pdf: { url: "/uploads/system.pdf", name: "system.pdf", mime: "application/pdf" },
  };

  it("follows slot (public form) order, then stored media order, with 1-based ordinals", () => {
    const ordered = orderPacketAttachments(record, slots);
    expect(ordered.map((item) => item.fileName)).toEqual([
      "board.pdf",
      "bio.docx",
      "photo-1.png",
      "photo-2.png",
    ]);
    expect(ordered.map((item) => item.ordinal)).toEqual([1, 2, 3, 4]);
    expect(ordered[2]).toMatchObject({ indexInSlot: 0, slotCount: 2, key: "photographs" });
    expect(ordered[3]).toMatchObject({ indexInSlot: 1, slotCount: 2 });
  });

  it("excludes the system-generated submission PDF unless asked for it", () => {
    expect(orderPacketAttachments(record, slots).some((item) => item.system)).toBe(false);
    const withSystem = orderPacketAttachments(record, slots, { includeSystem: true });
    expect(withSystem[withSystem.length - 1]).toMatchObject({
      key: "nomination_pdf",
      system: true,
      ordinal: 5,
    });
  });

  it("derives the extension from the name when Strapi omits ext", () => {
    const [only] = orderPacketAttachments(
      { biography_file: { url: "/uploads/x", name: "Letter.DOCX" } },
      slots
    );
    expect(only.ext).toBe(".docx");
    expect(only.mime).toBe("");
  });

  it("skips empty slots entirely", () => {
    expect(orderPacketAttachments({}, slots)).toEqual([]);
  });
});

describe("labels and notes", () => {
  it("names file types in plain language", () => {
    expect(attachmentTypeLabel("application/pdf", ".pdf")).toBe("PDF");
    expect(attachmentTypeLabel("image/png", ".png")).toBe("PNG image");
    expect(attachmentTypeLabel("image/heic", ".heic")).toBe("HEIC image");
    expect(attachmentTypeLabel("application/msword", ".doc")).toBe("Word 97-2003 document (DOC)");
    expect(attachmentTypeLabel("", ".xlsx")).toBe("Excel workbook (XLSX)");
    expect(attachmentTypeLabel("", "")).toBe("file");
  });

  it("writes the explicit fallback note with field label, filename and type", () => {
    expect(
      unavailableAttachmentNote({
        label: "Board / Employee List",
        fileName: "staff.xls",
        mime: "application/vnd.ms-excel",
        ext: ".xls",
      })
    ).toBe(
      "Board / Employee List: staff.xls (Excel 97-2003 workbook (XLS)) could not be embedded in this packet - open it from the record."
    );
  });

  it("builds divider titles with slot position for multi-file fields", () => {
    expect(
      attachmentDividerTitle({ ordinal: 3, label: "Photographs", indexInSlot: 0, slotCount: 2 }, 4)
    ).toBe("Attachment 3 of 4  ·  Photographs (1 of 2)");
    expect(
      attachmentDividerTitle({ ordinal: 1, label: "Biography", indexInSlot: 0, slotCount: 1 }, 4)
    ).toBe("Attachment 1 of 4  ·  Biography");
  });

  it("cross-references attachments from the form body", () => {
    const items = [
      { key: "board_list_file", ordinal: 1 },
      { key: "photographs", ordinal: 2 },
      { key: "photographs", ordinal: 3 },
      { key: "supporting_documents", ordinal: 4 },
      { key: "photographs", ordinal: 5 },
    ];
    expect(attachmentReference(items, "board_list_file")).toBe("see Attachment 1");
    expect(attachmentReference(items.slice(0, 3), "photographs")).toBe("see Attachments 2-3");
    expect(attachmentReference(items, "photographs")).toBe("see Attachments 2, 3, 5");
    expect(attachmentReference(items, "biography_file")).toBe("");
  });

  it("collapses per-file outcomes with merged > embedded > unavailable > skipped", () => {
    expect(combineEmbedResults(["unavailable", "merged"])).toBe("merged");
    expect(combineEmbedResults(["embedded", "unavailable"])).toBe("embedded");
    expect(combineEmbedResults(["unavailable"])).toBe("unavailable");
    expect(combineEmbedResults([])).toBe("skipped");
  });
});
