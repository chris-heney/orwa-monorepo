/** @vitest-environment jsdom */
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const notify = vi.fn();
const storeState: Record<string, unknown> = {};

vi.mock('react-admin', () => ({
  useNotify: () => notify,
  useDataProvider: () => ({}),
  useListContext: () => ({ selectedIds: [], data: [] }),
  useRecordContext: () => undefined,
  useStore: (key: string, fallback: unknown) => [
    key in storeState ? storeState[key] : fallback,
    (value: unknown) => {
      storeState[key] = value;
    },
  ],
}));

const runPrintJob = vi.fn();
vi.mock('./printPacket', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./printPacket')>();
  return { ...actual, runPrintJob: (...args: unknown[]) => runPrintJob(...args) };
});

const printPdfBlob = vi.fn(async () => undefined);
const downloadBlob = vi.fn();
const openPdfInNewTab = vi.fn(() => false);
vi.mock('./printPdfBlob', () => ({
  printPdfBlob: (...args: unknown[]) => printPdfBlob(...(args as [])),
  downloadBlob: (...args: unknown[]) => downloadBlob(...args),
  openPdfInNewTab: (...args: unknown[]) => openPdfInNewTab(...(args as [])),
}));

import { PRINT_DEFAULT_ACTION_KEY, PrintPacketDialog } from './PrintPacketAction';
import type { PrintJobOptions, PrintPacketAdapter } from './printPacket';

const adapter: PrintPacketAdapter<{ id: string }> = {
  noun: 'award nomination',
  mergedFilenamePrefix: 'ORWA-Award-Nominations',
  fetchRecords: async (ids) => ids.map((id) => ({ id: String(id) })),
  buildPacket: async () => ({ bytes: new Uint8Array([1]), filename: 'one.pdf' }),
  packetYearLabel: () => '2027',
};

let container: HTMLDivElement;
let root: Root;
const onClose = vi.fn();

const render = async (ids: string[]) => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => {
    root.render(<PrintPacketDialog open onClose={onClose} ids={ids} adapter={adapter} />);
  });
};

const byTestId = (id: string) => document.body.querySelector<HTMLElement>(`[data-testid="${id}"]`);
const click = async (el: HTMLElement | null) => {
  expect(el).not.toBeNull();
  await act(async () => {
    el!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
};

/** A controllable job: resolve / reject it from the test. */
const deferJob = () => {
  let resolve!: (value: unknown) => void;
  let reject!: (reason: unknown) => void;
  let options!: PrintJobOptions;
  runPrintJob.mockImplementation((_ids, _adapter, _dp, opts: PrintJobOptions) => {
    options = opts;
    return new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
  });
  return {
    resolve: (value: unknown) => act(async () => resolve(value)),
    reject: (reason: unknown) => act(async () => reject(reason)),
    options: () => options,
  };
};

const doneResult = {
  bytes: new Uint8Array([37, 80, 68, 70]),
  filename: 'ORWA-Award-Nomination-Seago-2027.pdf',
  pageCount: 12,
  unavailable: [],
};

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
  URL.createObjectURL = () => 'blob:test';
  URL.revokeObjectURL = () => undefined;
  for (const key of Object.keys(storeState)) delete storeState[key];
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.clearAllMocks();
});

describe('PrintPacketDialog', () => {
  it('starts the job on open, shows live progress, then Download / Print / Open in new tab', async () => {
    const job = deferJob();
    await render(['a']);
    expect(runPrintJob).toHaveBeenCalledTimes(1);
    expect(byTestId('print-packet-dialog')?.getAttribute('data-phase')).toBe('running');
    expect(byTestId('print-packet-cancel')).not.toBeNull();

    await act(async () => {
      job.options().onProgress({ fraction: 0.4, message: 'Rendering attachments 2 of 7 · essay.pdf' });
    });
    expect(byTestId('print-packet-status')?.textContent).toBe(
      'Rendering attachments 2 of 7 · essay.pdf'
    );
    expect(document.body.textContent).toContain('40%');

    await job.resolve(doneResult);
    expect(byTestId('print-packet-dialog')?.getAttribute('data-phase')).toBe('done');
    expect(byTestId('print-packet-status')?.textContent).toBe('Ready · 12 pages · 1 KB');
    expect(byTestId('print-packet-filename')?.textContent).toBe(
      'ORWA-Award-Nomination-Seago-2027.pdf'
    );
    // Download is the default primary (contained) action.
    expect(byTestId('print-packet-download')?.className).toContain('MuiButton-contained');
    expect(byTestId('print-packet-print')?.className).toContain('MuiButton-outlined');
    expect(byTestId('print-packet-open-tab')).not.toBeNull();

    await click(byTestId('print-packet-download'));
    expect(downloadBlob).toHaveBeenCalledWith(expect.any(Blob), doneResult.filename);
    expect(notify).not.toHaveBeenCalled();
  });

  it('Print opens the hidden-iframe print dialog and becomes the remembered primary action', async () => {
    const job = deferJob();
    await render(['a']);
    await job.resolve(doneResult);
    await click(byTestId('print-packet-print'));
    expect(printPdfBlob).toHaveBeenCalledWith(expect.any(Blob), 'Print packet');
    expect(storeState[PRINT_DEFAULT_ACTION_KEY]).toBe('print');

    // Re-open: Print is now the contained button.
    await act(async () => root.unmount());
    container.remove();
    const again = deferJob();
    await render(['a']);
    await again.resolve(doneResult);
    expect(byTestId('print-packet-print')?.className).toContain('MuiButton-contained');
    expect(byTestId('print-packet-download')?.className).toContain('MuiButton-outlined');
  });

  it('Cancel aborts the in-flight job and closes without a toast', async () => {
    const job = deferJob();
    await render(['a', 'b']);
    const { signal } = job.options();
    expect(signal.aborted).toBe(false);
    await click(byTestId('print-packet-cancel'));
    expect(signal.aborted).toBe(true);
    expect(onClose).toHaveBeenCalledTimes(1);
    // A late AbortError from the job must be swallowed.
    await job.reject(Object.assign(new Error('cancelled'), { name: 'AbortError' }));
    expect(notify).not.toHaveBeenCalled();
  });

  it('a failure shows the inline error with Retry and fires the red toast; Retry reruns the job', async () => {
    const job = deferJob();
    await render(['a']);
    await job.reject(new Error('Request failed with status code 500'));
    expect(byTestId('print-packet-dialog')?.getAttribute('data-phase')).toBe('error');
    expect(byTestId('print-packet-error')?.textContent).toContain(
      'Could not build the packet: Request failed with status code 500'
    );
    expect(notify).toHaveBeenCalledWith(
      'Could not build the packet: Request failed with status code 500',
      { type: 'error' }
    );

    const retry = deferJob();
    await click(byTestId('print-packet-retry'));
    expect(runPrintJob).toHaveBeenCalledTimes(2);
    expect(byTestId('print-packet-dialog')?.getAttribute('data-phase')).toBe('running');
    await retry.resolve(doneResult);
    expect(byTestId('print-packet-dialog')?.getAttribute('data-phase')).toBe('done');
  });

  it('the submission-PDF checkbox is off by default and rebuilds with the flag when toggled', async () => {
    const job = deferJob();
    await render(['a']);
    expect(job.options().includeSubmissionPdf).toBe(false);
    await job.resolve(doneResult);
    const second = deferJob();
    const checkbox = byTestId('print-packet-include-submission')?.querySelector('input');
    await act(async () => {
      checkbox!.click();
    });
    expect(runPrintJob).toHaveBeenCalledTimes(2);
    expect(second.options().includeSubmissionPdf).toBe(true);
  });

  it('asks first above the confirm threshold and only starts on Continue', async () => {
    const job = deferJob();
    const ids = Array.from({ length: 26 }, (_, i) => `id${i}`);
    await render(ids);
    expect(runPrintJob).not.toHaveBeenCalled();
    expect(byTestId('print-packet-dialog')?.getAttribute('data-phase')).toBe('confirm');
    expect(byTestId('print-packet-confirm')?.textContent).toContain('This will fetch 26 award nominations');
    expect(document.body.textContent).toContain('Print 26 packets');
    await click(byTestId('print-packet-continue'));
    expect(runPrintJob).toHaveBeenCalledTimes(1);
    expect(job.options().includeSubmissionPdf).toBe(false);
  });

  it('lists attachments that fell back to a note page and warns when a popup was blocked', async () => {
    const job = deferJob();
    await render(['a']);
    await job.resolve({
      ...doneResult,
      unavailable: [{ fileName: 'essay.docx', label: 'Essay', detail: 'The document could not be read.' }],
    });
    expect(byTestId('print-packet-unavailable')?.textContent).toContain(
      'Essay · essay.docx — The document could not be read.'
    );
    await click(byTestId('print-packet-open-tab'));
    expect(openPdfInNewTab).toHaveBeenCalled();
    expect(document.body.textContent).toContain('Your browser blocked the new tab');
  });
});
