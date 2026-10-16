import { describe, expect, it, vi } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import type { DataProvider } from 'react-admin';
import {
  PRINT_CONFIRM_THRESHOLD,
  formatBytes,
  mergePacketPdfs,
  mergedPacketFilename,
  orderIdsByList,
  printConfirmCopy,
  printDialogSubtitle,
  printDialogTitle,
  printFailureCopy,
  printSelectedLabel,
  progressFraction,
  progressMessage,
  runPrintJob,
  type PrintPacketAdapter,
  type PrintProgress,
} from './printPacket';

const makePdf = async (pages: number, title?: string) => {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pages; i += 1) {
    doc.addPage([612, 792]).drawText(`${title ?? 'p'} ${i + 1}`, { x: 40, y: 700, size: 14 });
  }
  if (title) doc.setTitle(title);
  return doc.save();
};

const pageCount = async (bytes: Uint8Array) => (await PDFDocument.load(bytes)).getPageCount();

describe('print packet copy', () => {
  it('labels the bar action and dialog with the count', () => {
    expect(printSelectedLabel(1)).toBe('Print 1 Selected');
    expect(printSelectedLabel(3)).toBe('Print 3 Selected');
    expect(printDialogTitle(1)).toBe('Print packet');
    expect(printDialogTitle(3)).toBe('Print 3 packets');
    expect(printDialogSubtitle(1, { noun: 'award nomination' })).toBe('1 award nomination');
    expect(printDialogSubtitle(2, { noun: 'scholarship application' })).toBe(
      '2 scholarship applications'
    );
    expect(printFailureCopy('Forbidden')).toBe('Could not build the packet: Forbidden');
    expect(printFailureCopy()).toBe('Could not build the packet.');
  });

  it('warns above the confirm threshold with the record noun', () => {
    expect(PRINT_CONFIRM_THRESHOLD).toBe(25);
    expect(printConfirmCopy(30, { noun: 'award nomination' })).toMatch(
      /^This will fetch 30 award nominations and every file attached/
    );
  });

  it('formats byte sizes for the done line', () => {
    expect(formatBytes(0)).toBe('0 KB');
    expect(formatBytes(900)).toBe('1 KB');
    expect(formatBytes(512 * 1024)).toBe('512 KB');
    expect(formatBytes(1.4 * 1024 * 1024)).toBe('1.4 MB');
  });
});

describe('mergedPacketFilename', () => {
  it('uses <Prefix>-Packets-<yearLabel>-<n>.pdf when every record shares the label', () => {
    // ORWEF passes the split academic year — the same label as its single filename.
    expect(
      mergedPacketFilename('ORWEF-Scholarships', ['2027-2028', ' 2027-2028 ', '2027-2028'], 3)
    ).toBe('ORWEF-Scholarships-Packets-2027-2028-3.pdf');
    // Awards pass the single conference year.
    expect(mergedPacketFilename('ORWA-Award-Nominations', ['2027', '2027'], 2)).toBe(
      'ORWA-Award-Nominations-Packets-2027-2.pdf'
    );
    expect(mergedPacketFilename('ORWA-Award-Nominations', ['2026'], 1)).toBe(
      'ORWA-Award-Nominations-Packets-2026-1.pdf'
    );
  });

  it('drops the year for a mixed selection and sanitises the stem', () => {
    expect(mergedPacketFilename('ORWEF-Scholarships', ['2026-2027', '2027-2028'], 2)).toBe(
      'ORWEF-Scholarships-Packets-2.pdf'
    );
    expect(mergedPacketFilename('ORWA-Award-Nominations', ['2026', '2027'], 2)).toBe(
      'ORWA-Award-Nominations-Packets-2.pdf'
    );
    expect(mergedPacketFilename('ORWA Awards!', [null, undefined], 4)).toBe(
      'ORWA-Awards-Packets-4.pdf'
    );
  });
});

describe('orderIdsByList', () => {
  it('sorts the selection into the grid order, unknown ids last', () => {
    const list = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
    expect(orderIdsByList(['c', 'a'], list)).toEqual(['a', 'c']);
    expect(orderIdsByList(['zz', 'd', 'b'], list)).toEqual(['b', 'd', 'zz']);
    expect(orderIdsByList(['y', 'x'], [])).toEqual(['y', 'x']);
    expect(orderIdsByList(['y', 'x'], undefined)).toEqual(['y', 'x']);
  });
});

describe('progress', () => {
  it('is monotonic through one record and across records', () => {
    const steps = [
      progressFraction(0, 2, 'fetch'),
      progressFraction(0, 2, 'form'),
      progressFraction(0, 2, 'attachments', 1, 4),
      progressFraction(0, 2, 'attachments', 3, 4),
      progressFraction(0, 2, 'finishing'),
      progressFraction(1, 2, 'form'),
      progressFraction(1, 2, 'attachments', 2, 2),
      progressFraction(1, 2, 'finishing'),
      progressFraction(1, 2, 'merge'),
      progressFraction(1, 2, 'done'),
    ];
    for (let i = 1; i < steps.length; i += 1) {
      expect(steps[i]).toBeGreaterThan(steps[i - 1]);
    }
    expect(steps[0]).toBe(0);
    expect(steps[steps.length - 1]).toBe(1);
    // A single record has no merge share: finishing lands near the end.
    expect(progressFraction(0, 1, 'finishing')).toBeCloseTo(0.9, 5);
  });

  it('writes the status lines the dialog shows', () => {
    expect(progressMessage(0, 1, { stage: 'fetch' })).toBe('Fetching record…');
    expect(progressMessage(1, 3, { stage: 'fetch' })).toBe('Fetching record 2 of 3…');
    expect(progressMessage(0, 1, { stage: 'form' })).toBe('Rendering form…');
    expect(progressMessage(2, 3, { stage: 'form' })).toBe('Rendering form 3 of 3…');
    expect(
      progressMessage(0, 1, { stage: 'attachments', index: 2, total: 7, fileName: 'essay.pdf' })
    ).toBe('Rendering attachments 2 of 7 · essay.pdf');
    expect(progressMessage(0, 1, { stage: 'finishing' })).toBe('Finishing…');
    expect(progressMessage(1, 2, { stage: 'finishing' })).toBe('Finishing record 2 of 2…');
    expect(progressMessage(2, 3, { stage: 'merge' })).toBe('Merging 3 packets…');
    expect(progressMessage(0, 1, { stage: 'done' })).toBe('Ready');
  });
});

describe('mergePacketPdfs', () => {
  it('concatenates packets in order and the page count is the sum', async () => {
    const a = await makePdf(2, 'Alpha');
    const b = await makePdf(3, 'Bravo');
    const c = await makePdf(1, 'Charlie');
    const merged = await mergePacketPdfs([a, b, c]);
    expect(await pageCount(merged)).toBe(6);
    const doc = await PDFDocument.load(merged);
    expect(doc.getTitle()).toBe('Alpha (+2 more)');
  });

  it('returns a single packet untouched', async () => {
    const only = await makePdf(2);
    expect(await mergePacketPdfs([only])).toBe(only);
  });

  it('honours an aborted signal', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(
      mergePacketPdfs([await makePdf(1), await makePdf(1)], controller.signal)
    ).rejects.toMatchObject({ name: 'AbortError' });
  });
});

type Rec = { id: string; name: string; year: number; pages: number; files: number };

const dataProvider = {} as DataProvider;

const fakeAdapter = (
  calls: string[],
  overrides: Partial<PrintPacketAdapter<Rec>> = {}
): PrintPacketAdapter<Rec> => ({
  noun: 'thing',
  mergedFilenamePrefix: 'Test-Module',
  fetchRecords: async (ids) => {
    calls.push(`fetch ${ids.join(',')}`);
    return ids.map((id, index) => ({
      id: String(id),
      name: `Rec ${id}`,
      year: 2027,
      pages: index + 1,
      files: index === 1 ? 2 : 0,
    }));
  },
  buildPacket: async (record, options) => {
    calls.push(`build ${record.id}`);
    options.onProgress({ stage: 'form' });
    for (let i = 1; i <= record.files; i += 1) {
      options.onProgress({ stage: 'attachments', index: i, total: record.files, fileName: `f${i}.pdf` });
    }
    options.onProgress({ stage: 'finishing' });
    return {
      bytes: await makePdf(record.pages, record.name),
      filename: `${record.name}.pdf`,
      attachments:
        record.files > 0
          ? [
              {
                attachment: { fileName: 'f1.pdf', label: 'Essay' } as never,
                result: 'merged' as const,
              },
              {
                attachment: { fileName: 'f2.pdf', label: 'Photo' } as never,
                result: 'unavailable' as const,
                detail: 'The file could not be downloaded from the media library.',
              },
            ]
          : [],
    };
  },
  packetYearLabel: (record) => String(record.year),
  ...overrides,
});

describe('runPrintJob', () => {
  it('keeps the module filename for one record and reports a full progress sequence', async () => {
    const calls: string[] = [];
    const progress: PrintProgress[] = [];
    const result = await runPrintJob(['a'], fakeAdapter(calls), dataProvider, {
      includeSubmissionPdf: false,
      signal: new AbortController().signal,
      onProgress: (update) => progress.push(update),
    });
    expect(calls).toEqual(['fetch a', 'build a']);
    expect(result.filename).toBe('Rec a.pdf');
    expect(result.pageCount).toBe(1);
    expect(result.unavailable).toEqual([]);
    expect(progress.map((p) => p.message)).toEqual([
      'Fetching record…',
      'Rendering form…',
      'Finishing…',
      'Ready',
    ]);
    const fractions = progress.map((p) => p.fraction);
    expect(fractions[0]).toBe(0);
    expect(fractions[fractions.length - 1]).toBe(1);
    for (let i = 1; i < fractions.length; i += 1) {
      expect(fractions[i]).toBeGreaterThanOrEqual(fractions[i - 1]);
    }
  });

  it('merges several records in the given order under the merged filename and collects warnings', async () => {
    const calls: string[] = [];
    const progress: PrintProgress[] = [];
    const result = await runPrintJob(['c', 'a', 'b'], fakeAdapter(calls), dataProvider, {
      includeSubmissionPdf: true,
      signal: new AbortController().signal,
      onProgress: (update) => progress.push(update),
    });
    expect(calls).toEqual(['fetch c,a,b', 'build c', 'build a', 'build b']);
    // pages 1 + 2 + 3
    expect(result.pageCount).toBe(6);
    expect(result.filename).toBe('Test-Module-Packets-2027-3.pdf');
    const doc = await PDFDocument.load(result.bytes);
    expect(doc.getTitle()).toBe('Rec c (+2 more)');
    expect(result.unavailable).toEqual([
      {
        fileName: 'f2.pdf',
        label: 'Photo',
        detail: 'The file could not be downloaded from the media library.',
      },
    ]);
    const messages = progress.map((p) => p.message);
    expect(messages[0]).toBe('Fetching record 1 of 3…');
    expect(messages).toContain('Rendering form 2 of 3…');
    expect(messages).toContain('Rendering attachments 2 of 2 · f2.pdf');
    expect(messages).toContain('Merging 3 packets…');
    expect(messages[messages.length - 1]).toBe('Ready');
  });

  it('forwards includeSubmissionPdf and the signal to every build', async () => {
    const calls: string[] = [];
    const seen: Array<{ include: boolean; signal: AbortSignal }> = [];
    const controller = new AbortController();
    const adapter = fakeAdapter(calls, {
      buildPacket: async (record, options) => {
        seen.push({ include: options.includeSubmissionPdf, signal: options.signal });
        return { bytes: await makePdf(1), filename: `${record.id}.pdf` };
      },
    });
    await runPrintJob(['a', 'b'], adapter, dataProvider, {
      includeSubmissionPdf: true,
      signal: controller.signal,
      onProgress: () => undefined,
    });
    expect(seen).toHaveLength(2);
    expect(seen.every((entry) => entry.include && entry.signal === controller.signal)).toBe(true);
  });

  it('aborts between records: no further builds, rejects with AbortError', async () => {
    const calls: string[] = [];
    const controller = new AbortController();
    const adapter = fakeAdapter(calls, {
      buildPacket: async (record) => {
        calls.push(`build ${record.id}`);
        if (record.id === 'a') controller.abort();
        return { bytes: await makePdf(1), filename: `${record.id}.pdf` };
      },
    });
    await expect(
      runPrintJob(['a', 'b', 'c'], adapter, dataProvider, {
        includeSubmissionPdf: false,
        signal: controller.signal,
        onProgress: () => undefined,
      })
    ).rejects.toMatchObject({ name: 'AbortError' });
    expect(calls).toEqual(['fetch a,b,c', 'build a']);
  });

  it('fails fast when a record cannot be loaded', async () => {
    const calls: string[] = [];
    const adapter = fakeAdapter(calls, {
      fetchRecords: async () => [],
    });
    await expect(
      runPrintJob(['a', 'b'], adapter, dataProvider, {
        includeSubmissionPdf: false,
        signal: new AbortController().signal,
        onProgress: () => undefined,
      })
    ).rejects.toThrow('Only 0 of 2 things could be loaded.');
    expect(calls).toEqual([]);
  });

  it('surfaces a builder failure as a rejection (not an abort)', async () => {
    const calls: string[] = [];
    const onProgress = vi.fn();
    const adapter = fakeAdapter(calls, {
      buildPacket: async () => {
        throw new Error('404 attachment host unreachable');
      },
    });
    await expect(
      runPrintJob(['a'], adapter, dataProvider, {
        includeSubmissionPdf: false,
        signal: new AbortController().signal,
        onProgress,
      })
    ).rejects.toThrow('404 attachment host unreachable');
  });
});
