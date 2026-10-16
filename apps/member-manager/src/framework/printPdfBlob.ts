/**
 * Browser outputs for a generated PDF: print dialog (hidden iframe), download
 * (`<a download>`) and a new tab. Shared by every module's Print packet action
 * (`PrintPacketAction.tsx`). None of these need a popup allowance when called
 * from the user's click; `openPdfInNewTab` is the only one a blocker can stop,
 * and it reports that so the dialog can fall back to Download.
 */

/** Chromium iframe `afterprint` often fires as the dialog opens — ignore that. */
export const PRINT_AFTERPRINT_IGNORE_MS = 600;
/** Blocked or dismissed dialogs must not leave the Print button spinning. */
export const PRINT_DIALOG_TIMEOUT_MS = 180_000;

/**
 * Open one PDF in a hidden iframe and invoke the browser print dialog.
 * Resolves only after the dialog closes (`afterprint` / window `focus`)
 * or the timeout fires, so a caller can safely queue another `print()`.
 */
export const printPdfBlob = (blob: Blob, title = 'Print packet'): Promise<void> =>
  new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('Print preview requires a browser'));
      return;
    }
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.setAttribute('title', title);
    iframe.setAttribute('aria-hidden', 'true');
    iframe.setAttribute('data-print-packet-frame', '');
    iframe.style.cssText =
      'position:fixed;inset:0;width:1px;height:1px;opacity:0;border:0;pointer-events:none;';

    let settled = false;
    let openedAt = 0;
    let timeoutId = 0;
    let win: Window | null = null;

    const dialogLikelyClosed = () =>
      openedAt > 0 && Date.now() - openedAt >= PRINT_AFTERPRINT_IGNORE_MS;

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('afterprint', onCloseSignal);
      window.removeEventListener('focus', onCloseSignal);
      win?.removeEventListener('afterprint', onCloseSignal);
      iframe.remove();
      URL.revokeObjectURL(url);
    };

    const finish = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve();
    };

    const fail = (message: string) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error(message));
    };

    const onCloseSignal = () => {
      if (dialogLikelyClosed()) finish();
    };

    iframe.onload = () => {
      if (settled) return;
      win = iframe.contentWindow;
      if (!win) {
        fail('Print preview failed to load');
        return;
      }
      win.addEventListener('afterprint', onCloseSignal);
      window.addEventListener('afterprint', onCloseSignal);
      window.addEventListener('focus', onCloseSignal);
      openedAt = Date.now();
      try {
        win.focus();
        win.print();
      } catch {
        finish();
      }
    };
    iframe.onerror = () => {
      fail('Print preview failed to load');
    };
    iframe.src = url;
    document.body.appendChild(iframe);
    timeoutId = window.setTimeout(finish, PRINT_DIALOG_TIMEOUT_MS);
  });

/** Save `blob` as `filename` through a transient `<a download>`. */
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Revoke after the click has been dispatched — some browsers read the URL async.
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
};

/**
 * Open the PDF in a new tab. Returns `false` when the browser blocked the
 * popup (the caller shows a hint and keeps Download available).
 */
export const openPdfInNewTab = (blob: Blob): boolean => {
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank', 'noopener');
  if (!win) {
    URL.revokeObjectURL(url);
    return false;
  }
  // The new tab holds the object URL; release it once that document has loaded.
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  return true;
};
