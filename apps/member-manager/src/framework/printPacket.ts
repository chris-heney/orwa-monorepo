/**
 * Pure core of the shared Print packet action (`PrintPacketAction.tsx`):
 * labels, progress accounting, the merged-PDF step and the build
 * orchestration. No React, no DOM — unit-tested in Node.
 */
import { PDFDocument } from 'pdf-lib';
import type { DataProvider, Identifier } from 'react-admin';
import {
  isAbortError,
  throwIfAborted,
  type PacketBuildProgress,
} from '../modules/_components/review-packet/packetAppendix';
import type { AppendixOutcome } from '../modules/_components/review-packet/packetAppendix';

export { isAbortError };

/* ---------- adapter contract ---------- */

export interface PacketBuildResult {
  bytes: Uint8Array;
  /** Single-record filename (module convention — the preset never rewrites it). */
  filename: string;
  /** Per-file appendix outcomes, surfaced as warnings in the dialog. */
  attachments?: AppendixOutcome['files'];
}

export interface PacketBuildCallOptions {
  includeSubmissionPdf: boolean;
  signal: AbortSignal;
  onProgress: (progress: PacketBuildProgress) => void;
}

/** What a module hands the preset. `R` is the populated record type it prints. */
export interface PrintPacketAdapter<R = Record<string, unknown>> {
  /** Singular, lower-case: "award nomination". */
  noun: string;
  /** Plural; default `${noun}s`. */
  nounPlural?: string;
  /** Merged filename stem, e.g. "ORWA-Awards" → `ORWA-Awards-Packets-2027-3.pdf`. */
  mergedFilenamePrefix: string;
  /** Fresh, fully-populated copies of the records (in the given order). */
  fetchRecords: (ids: Identifier[], dataProvider: DataProvider) => Promise<R[]>;
  buildPacket: (record: R, options: PacketBuildCallOptions) => Promise<PacketBuildResult>;
  /**
   * Year LABEL as the single-record filename prints it (for the merged
   * filename): Awards "2027", ORWEF "2027-2028". The preset never formats
   * years itself — the module owns that rule.
   */
  packetYearLabel: (record: R) => string | null | undefined;
}

/* ---------- copy ---------- */

export const pluralize = (count: number, noun: string, nounPlural?: string) =>
  count === 1 ? noun : nounPlural ?? `${noun}s`;

/** Bar label while rows are ticked: "Print 3 Selected" / "Print 1 Selected". */
export const printSelectedLabel = (count: number) => `Print ${count} Selected`;

/** Dialog title: "Print packet" / "Print 3 packets". */
export const printDialogTitle = (count: number) =>
  count === 1 ? 'Print packet' : `Print ${count} packets`;

/** Dialog subtitle: "1 award nomination" / "3 scholarship applications". */
export const printDialogSubtitle = (
  count: number,
  adapter: Pick<PrintPacketAdapter, 'noun' | 'nounPlural'>
) => `${count} ${pluralize(count, adapter.noun, adapter.nounPlural)}`;

/** Above this many records the dialog asks first. */
export const PRINT_CONFIRM_THRESHOLD = 25;

export const printConfirmCopy = (
  count: number,
  adapter: Pick<PrintPacketAdapter, 'noun' | 'nounPlural'>
) =>
  `This will fetch ${count} ${pluralize(count, adapter.noun, adapter.nounPlural)} and every file attached to them, which may take a while. Continue?`;

export const printFailureCopy = (message?: string | null) =>
  `Could not build the packet${message ? `: ${message}` : '.'}`;

/* ---------- filenames ---------- */

const sanitizeStem = (value: string) =>
  String(value || '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);

/**
 * `<Prefix>-Packets-<yearLabel>-<n>.pdf`. `yearLabels` are the module's own
 * single-filename labels ("2027" / "2027-2028"); the label is included only
 * when every record prints the same one — a mixed selection drops it rather
 * than guess.
 */
export const mergedPacketFilename = (
  prefix: string,
  yearLabels: ReadonlyArray<string | null | undefined>,
  count: number
): string => {
  const distinct = Array.from(
    new Set(
      yearLabels
        .map((label) => (label == null ? '' : String(label).trim()))
        .filter((label) => label !== '')
    )
  );
  const stem = sanitizeStem(prefix) || 'Packets';
  const year = distinct.length === 1 ? `-${sanitizeStem(distinct[0])}` : '';
  return `${stem}-Packets${year}-${count}.pdf`;
};

/* ---------- ordering ---------- */

/**
 * Selected ids in list order (the grid's visible row order), unknown ids last
 * in their selection order — so a merged packet reads top-to-bottom like the list.
 */
export const orderIdsByList = (
  selectedIds: ReadonlyArray<Identifier>,
  listData: ReadonlyArray<{ id: Identifier }> | undefined
): Identifier[] => {
  if (!listData?.length) return [...selectedIds];
  const position = new Map<string, number>();
  listData.forEach((row, index) => position.set(String(row.id), index));
  return [...selectedIds]
    .map((id, index) => ({ id, index, pos: position.get(String(id)) }))
    .sort((a, b) => {
      if (a.pos != null && b.pos != null) return a.pos - b.pos;
      if (a.pos != null) return -1;
      if (b.pos != null) return 1;
      return a.index - b.index;
    })
    .map((item) => item.id);
};

/* ---------- progress ---------- */

export type PrintProgress = {
  /** 0..1 across the whole job. */
  fraction: number;
  /** One line for the dialog's live region. */
  message: string;
};

/** Share of one record's budget per stage (sums to 1). */
const STAGE_WEIGHT = { fetch: 0.15, form: 0.1, attachments: 0.65, finishing: 0.1 } as const;

/**
 * Overall fraction for `recordIndex` (0-based) of `recordCount` records at a
 * given point. `attachmentIndex` is 1-based like the appendix callback.
 */
export const progressFraction = (
  recordIndex: number,
  recordCount: number,
  stage: 'fetch' | 'form' | 'attachments' | 'finishing' | 'merge' | 'done',
  attachmentIndex = 0,
  attachmentTotal = 0
): number => {
  if (stage === 'done') return 1;
  // Merging only exists for several records; reserve the last 5% for it.
  const mergeShare = recordCount > 1 ? 0.05 : 0;
  const perRecord = (1 - mergeShare) / Math.max(1, recordCount);
  if (stage === 'merge') return 1 - mergeShare;
  let within = 0;
  if (stage === 'form') within = STAGE_WEIGHT.fetch;
  else if (stage === 'attachments') {
    const done = attachmentTotal > 0 ? (attachmentIndex - 1) / attachmentTotal : 0;
    within = STAGE_WEIGHT.fetch + STAGE_WEIGHT.form + STAGE_WEIGHT.attachments * Math.min(1, Math.max(0, done));
  } else if (stage === 'finishing') within = 1 - STAGE_WEIGHT.finishing;
  const value = recordIndex * perRecord + within * perRecord;
  return Math.min(1, Math.max(0, value));
};

const ofN = (index: number, count: number) => (count > 1 ? ` ${index} of ${count}` : '');

export const progressMessage = (
  recordIndex: number,
  recordCount: number,
  stage: PacketBuildProgress | { stage: 'fetch' } | { stage: 'merge' } | { stage: 'done' }
): string => {
  const record = `record${ofN(recordIndex + 1, recordCount)}`;
  switch (stage.stage) {
    case 'fetch':
      return `Fetching ${record}…`;
    case 'form':
      return `Rendering ${recordCount > 1 ? `form ${recordIndex + 1} of ${recordCount}` : 'form'}…`;
    case 'attachments':
      return `Rendering attachments ${stage.index} of ${stage.total}${
        stage.fileName ? ` · ${stage.fileName}` : ''
      }`;
    case 'finishing':
      return recordCount > 1 ? `Finishing ${record}…` : 'Finishing…';
    case 'merge':
      return `Merging ${recordCount} packets…`;
    case 'done':
      return 'Ready';
    default:
      return '';
  }
};

/* ---------- merge ---------- */

/**
 * Concatenate finished packets into one PDF, in order. Every packet already
 * starts on its own page and carries its own running headers / footers, so
 * this is a page copy — layouts are never re-flowed together.
 */
export const mergePacketPdfs = async (
  packets: ReadonlyArray<Uint8Array>,
  signal?: AbortSignal
): Promise<Uint8Array> => {
  if (packets.length === 1) return packets[0];
  const merged = await PDFDocument.create();
  for (const bytes of packets) {
    throwIfAborted(signal);
    const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = await merged.copyPages(src, src.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }
  // Keep the first packet's metadata (author / subject are module-wide anyway).
  const first = await PDFDocument.load(packets[0], { ignoreEncryption: true });
  const title = first.getTitle();
  if (title) merged.setTitle(`${title} (+${packets.length - 1} more)`);
  const author = first.getAuthor();
  if (author) merged.setAuthor(author);
  const subject = first.getSubject();
  if (subject) merged.setSubject(subject);
  return merged.save();
};

/* ---------- orchestration ---------- */

export type UnavailableAttachment = { fileName: string; label: string; detail?: string };

export interface PrintJobResult {
  bytes: Uint8Array;
  filename: string;
  pageCount: number;
  /** Attachments the appendix had to replace with a note page. */
  unavailable: UnavailableAttachment[];
}

export interface PrintJobOptions {
  includeSubmissionPdf: boolean;
  signal: AbortSignal;
  onProgress: (progress: PrintProgress) => void;
}

/**
 * Fetch → build each packet → merge. Reports progress as one 0..1 fraction
 * plus a status line; rethrows `AbortError` untouched so the UI can tell a
 * cancel from a failure.
 */
export const runPrintJob = async <R>(
  ids: ReadonlyArray<Identifier>,
  adapter: PrintPacketAdapter<R>,
  dataProvider: DataProvider,
  options: PrintJobOptions
): Promise<PrintJobResult> => {
  const { signal, onProgress } = options;
  const count = ids.length;
  if (count === 0) throw new Error('Nothing to print');

  const report = (
    recordIndex: number,
    stage: Parameters<typeof progressMessage>[2],
    fraction: number
  ) => onProgress({ fraction, message: progressMessage(recordIndex, count, stage) });

  // Fetch everything first so a missing record fails fast, before any rendering.
  report(0, { stage: 'fetch' }, 0);
  throwIfAborted(signal);
  const records = await adapter.fetchRecords([...ids], dataProvider);
  throwIfAborted(signal);
  if (records.length !== count) {
    throw new Error(
      `Only ${records.length} of ${count} ${pluralize(count, adapter.noun, adapter.nounPlural)} could be loaded.`
    );
  }

  const packets: Uint8Array[] = [];
  const unavailable: UnavailableAttachment[] = [];
  let singleFilename = '';
  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    const built = await adapter.buildPacket(record, {
      includeSubmissionPdf: options.includeSubmissionPdf,
      signal,
      onProgress: (progress) => {
        const fraction =
          progress.stage === 'attachments'
            ? progressFraction(index, count, 'attachments', progress.index, progress.total)
            : progressFraction(index, count, progress.stage);
        report(index, progress, fraction);
      },
    });
    throwIfAborted(signal);
    packets.push(built.bytes);
    singleFilename = built.filename;
    for (const file of built.attachments ?? []) {
      if (file.result === 'unavailable') {
        unavailable.push({
          fileName: file.attachment.fileName,
          label: file.attachment.label,
          detail: file.detail,
        });
      }
    }
  }

  let bytes: Uint8Array;
  let filename: string;
  if (count === 1) {
    bytes = packets[0];
    filename = singleFilename;
  } else {
    report(count - 1, { stage: 'merge' }, progressFraction(count - 1, count, 'merge'));
    bytes = await mergePacketPdfs(packets, signal);
    filename = mergedPacketFilename(
      adapter.mergedFilenamePrefix,
      records.map((record) => adapter.packetYearLabel(record)),
      count
    );
  }
  throwIfAborted(signal);
  const pageCount = (await PDFDocument.load(bytes, { ignoreEncryption: true })).getPageCount();
  report(count - 1, { stage: 'done' }, 1);
  return { bytes, filename, pageCount, unavailable };
};

/** Human file size for the done state: "1.4 MB". */
export const formatBytes = (size: number): string => {
  if (!Number.isFinite(size) || size <= 0) return '0 KB';
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};
