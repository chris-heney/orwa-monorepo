/**
 * Pure helpers shared by the Awards and ORWEF print packets: which uploads go
 * into the attachment appendix, in what order, and how they are labelled.
 *
 * "Order submitted" = the order of the upload fields as they appear in the
 * public form, then the stored order of the media array inside a multi-file
 * field. Each module declares its slots in that order.
 */

export type PacketMediaFile = {
  url?: string | null;
  name?: string | null;
  mime?: string | null;
  ext?: string | null;
  formats?: {
    large?: { url?: string | null };
    medium?: { url?: string | null };
  } | null;
} | null;

export type AttachmentSlot<K extends string = string> = {
  /** Record field name (Strapi media attribute). */
  key: K;
  /** Field label as the applicant saw it on the public form. */
  label: string;
  /**
   * PDF the system generated at submit time (`nomination_pdf`,
   * `applicant_pdf`). It repeats the form the Manager already renders, so it
   * is left out of the appendix unless explicitly requested.
   */
  system?: boolean;
};

export type OrderedAttachment = {
  key: string;
  label: string;
  fileName: string;
  mime: string;
  ext: string;
  url: string;
  /** 0-based position inside its slot (multi-file fields). */
  indexInSlot: number;
  /** Number of files in the same slot. */
  slotCount: number;
  /** 1-based position across the whole appendix. */
  ordinal: number;
  system: boolean;
  file: NonNullable<PacketMediaFile>;
};

/**
 * WinAnsi-safe text for pdf-lib fonts. Keeps the middle dot (U+00B7) the
 * packet chrome uses as a separator; smart quotes / dashes / ellipsis are
 * mapped to ASCII and anything outside Latin-1 is dropped.
 */
export const packetText = (value: string): string =>
  String(value || "")
    .replace(/\u2018|\u2019|\u201a|\u2032/g, "'")
    .replace(/\u201c|\u201d|\u201e|\u2033/g, '"')
    .replace(/\u2013|\u2014|\u2212/g, "-")
    .replace(/\u2022|\u25cf/g, "-")
    .replace(/\u00a0|\u202f/g, " ")
    .replace(/\u2026/g, "...")
    // eslint-disable-next-line no-control-regex -- keep tab/LF/CR, strip other controls
    .replace(/[^\u0009\u000a\u000d\u0020-\u007e\u00a0-\u00ff]/g, "");

export type MediaEmbedResult =
  | "embedded"
  | "merged"
  | "unavailable"
  | "skipped";

/** Accepts a single media object, an array, or Strapi v4's `{ data: [...] }`. */
export const asPacketMediaItems = (
  value: unknown
): NonNullable<PacketMediaFile>[] => {
  if (value == null) return [];
  const raw = Array.isArray(value)
    ? value
    : typeof value === "object" &&
        value !== null &&
        Array.isArray((value as { data?: unknown }).data)
      ? ((value as { data: unknown[] }).data as unknown[])
      : [value];
  return raw.filter((item): item is NonNullable<PacketMediaFile> => {
    if (item == null || typeof item !== "object") return false;
    const media = item as PacketMediaFile;
    return Boolean(
      media?.url || media?.formats?.large?.url || media?.formats?.medium?.url
    );
  });
};

export const bestPacketMediaUrl = (file: NonNullable<PacketMediaFile>): string =>
  file.formats?.large?.url || file.formats?.medium?.url || file.url || "";

const extensionOf = (file: NonNullable<PacketMediaFile>): string => {
  const ext = String(file.ext || "").trim();
  if (ext) return ext.startsWith(".") ? ext.toLowerCase() : `.${ext.toLowerCase()}`;
  const name = String(file.name || file.url || "");
  const match = /\.([a-z0-9]{1,6})(?:\?.*)?$/i.exec(name);
  return match ? `.${match[1].toLowerCase()}` : "";
};

/**
 * Flatten the record's upload fields into appendix order. System-generated
 * PDFs are excluded unless `includeSystem` is set.
 */
export const orderPacketAttachments = (
  record: Record<string, unknown>,
  slots: ReadonlyArray<AttachmentSlot>,
  options: { includeSystem?: boolean } = {}
): OrderedAttachment[] => {
  const out: OrderedAttachment[] = [];
  for (const slot of slots) {
    if (slot.system && !options.includeSystem) continue;
    const items = asPacketMediaItems(record[slot.key]);
    items.forEach((file, index) => {
      out.push({
        key: slot.key,
        label: slot.label,
        fileName: String(file.name || "").trim() || "Attachment",
        mime: String(file.mime || "").toLowerCase(),
        ext: extensionOf(file),
        url: bestPacketMediaUrl(file),
        indexInSlot: index,
        slotCount: items.length,
        ordinal: out.length + 1,
        system: Boolean(slot.system),
        file,
      });
    });
  }
  return out;
};

/** Plain-language file type for dividers and fallback notes. */
export const attachmentTypeLabel = (
  mime?: string | null,
  ext?: string | null
): string => {
  const m = String(mime || "").toLowerCase();
  const e = String(ext || "").toLowerCase().replace(/^\./, "");
  if (m.includes("pdf") || e === "pdf") return "PDF";
  if (m.includes("wordprocessingml") || e === "docx") return "Word document (DOCX)";
  if (m === "application/msword" || e === "doc") return "Word 97-2003 document (DOC)";
  if (m.includes("spreadsheetml") || e === "xlsx") return "Excel workbook (XLSX)";
  if (m === "application/vnd.ms-excel" || e === "xls") return "Excel 97-2003 workbook (XLS)";
  if (m === "text/csv" || m === "application/csv" || e === "csv") return "CSV";
  if (m.startsWith("text/") || e === "txt" || e === "md") return "Text";
  if (m.startsWith("image/")) {
    const sub = m.slice("image/".length).replace(/^x-/, "");
    const names: Record<string, string> = {
      jpeg: "JPEG image",
      jpg: "JPEG image",
      png: "PNG image",
      gif: "GIF image",
      webp: "WebP image",
      tiff: "TIFF image",
      heic: "HEIC image",
      heif: "HEIF image",
      bmp: "BMP image",
      svg: "SVG image",
      "svg+xml": "SVG image",
    };
    return names[sub] || `${sub.toUpperCase()} image`;
  }
  if (e) return `${e.toUpperCase()} file`;
  return "file";
};

/** Fallback note when an upload cannot be rendered into the packet. */
export const unavailableAttachmentNote = (
  attachment: Pick<OrderedAttachment, "label" | "fileName" | "mime" | "ext">
): string =>
  `${attachment.label}: ${attachment.fileName} (${attachmentTypeLabel(
    attachment.mime,
    attachment.ext
  )}) could not be embedded in this packet - open it from the record.`;

/** Short divider title: "Attachment 3 of 7 · Photographs (1 of 2)". */
export const attachmentDividerTitle = (
  attachment: Pick<
    OrderedAttachment,
    "ordinal" | "label" | "indexInSlot" | "slotCount"
  >,
  total: number
): string => {
  const slotPart =
    attachment.slotCount > 1
      ? `${attachment.label} (${attachment.indexInSlot + 1} of ${attachment.slotCount})`
      : attachment.label;
  return `Attachment ${attachment.ordinal} of ${total}  ·  ${slotPart}`;
};

/** Cross-reference used in the form body: "see Attachment 2" / "see Attachments 3-4". */
export const attachmentReference = (
  attachments: ReadonlyArray<Pick<OrderedAttachment, "key" | "ordinal">>,
  key: string
): string => {
  const ordinals = attachments
    .filter((item) => item.key === key)
    .map((item) => item.ordinal);
  if (ordinals.length === 0) return "";
  if (ordinals.length === 1) return `see Attachment ${ordinals[0]}`;
  const first = ordinals[0];
  const last = ordinals[ordinals.length - 1];
  const contiguous = last - first === ordinals.length - 1;
  return contiguous
    ? `see Attachments ${first}-${last}`
    : `see Attachments ${ordinals.join(", ")}`;
};

/** Collapse an attachment's per-file outcomes into one slot-level outcome. */
export const combineEmbedResults = (
  results: ReadonlyArray<MediaEmbedResult>
): MediaEmbedResult => {
  if (results.includes("merged")) return "merged";
  if (results.includes("embedded")) return "embedded";
  if (results.includes("unavailable")) return "unavailable";
  return "skipped";
};
