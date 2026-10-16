import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ReplayIcon from '@mui/icons-material/Replay';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import {
  useDataProvider,
  useListContext,
  useNotify,
  useRecordContext,
  useStore,
  type Identifier,
} from 'react-admin';
import HeadingAction from '../modules/_components/heading/HeadingAction';
import type { ActionManifest, PageCtx, TitleBarApi } from './manifest';
import {
  PRINT_CONFIRM_THRESHOLD,
  formatBytes,
  isAbortError,
  orderIdsByList,
  printConfirmCopy,
  printDialogSubtitle,
  printDialogTitle,
  printFailureCopy,
  printSelectedLabel,
  runPrintJob,
  type PrintJobResult,
  type PrintPacketAdapter,
  type PrintProgress,
} from './printPacket';
import { downloadBlob, openPdfInNewTab, printPdfBlob } from './printPdfBlob';

export type { PrintPacketAdapter } from './printPacket';

/** RaStore: which primary action the user picked last ("download" | "print"). */
export const PRINT_DEFAULT_ACTION_KEY = 'print.packetDefaultAction';
export type PrintDefaultAction = 'download' | 'print';

type Phase = 'confirm' | 'running' | 'done' | 'error';

/* ---------- dialog ---------- */

export interface PrintPacketDialogProps<R> {
  open: boolean;
  onClose: () => void;
  /** Record ids in print order. */
  ids: Identifier[];
  adapter: PrintPacketAdapter<R>;
}

/**
 * ONE dialog for every print entry point: builds the packet(s) with a live
 * progress line, then offers Download / Print / Open in new tab. Cancel aborts
 * the in-flight fetches; a failure stays inline with Retry (plus the red toast).
 */
export function PrintPacketDialog<R>({ open, onClose, ids, adapter }: PrintPacketDialogProps<R>) {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const theme = useTheme();
  const [defaultAction, setDefaultAction] = useStore<PrintDefaultAction>(
    PRINT_DEFAULT_ACTION_KEY,
    'download'
  );
  const needsConfirm = ids.length > PRINT_CONFIRM_THRESHOLD;
  const [phase, setPhase] = useState<Phase>(needsConfirm ? 'confirm' : 'running');
  const [includeSubmissionPdf, setIncludeSubmissionPdf] = useState(false);
  const [progress, setProgress] = useState<PrintProgress>({ fraction: 0, message: 'Starting…' });
  const [result, setResult] = useState<PrintJobResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [printing, setPrinting] = useState(false);
  const [popupBlocked, setPopupBlocked] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const count = ids.length;

  const abort = useCallback(() => {
    controller.current?.abort();
    controller.current = null;
  }, []);

  const start = useCallback(
    (withSubmissionPdf: boolean) => {
      abort();
      const next = new AbortController();
      controller.current = next;
      setPhase('running');
      setError(null);
      setResult(null);
      setPopupBlocked(false);
      setProgress({ fraction: 0, message: 'Starting…' });
      runPrintJob(ids, adapter, dataProvider, {
        includeSubmissionPdf: withSubmissionPdf,
        signal: next.signal,
        onProgress: (update) => {
          if (!next.signal.aborted) setProgress(update);
        },
      })
        .then((job) => {
          if (next.signal.aborted) return;
          setResult(job);
          setPhase('done');
        })
        .catch((cause: unknown) => {
          if (next.signal.aborted || isAbortError(cause)) return;
          console.error('Print packet failed', cause);
          const message = cause instanceof Error ? cause.message : String(cause);
          setError(message);
          setPhase('error');
          notify(printFailureCopy(message), { type: 'error' });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [abort, adapter, dataProvider, ids.join('|'), notify]
  );

  // Kick off on open (unless the size warning gates it); abort on unmount.
  useEffect(() => {
    if (!open) return undefined;
    if (!needsConfirm) start(includeSubmissionPdf);
    return abort;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const blob = useMemo(
    () => (result ? new Blob([result.bytes as BlobPart], { type: 'application/pdf' }) : null),
    [result]
  );

  const close = () => {
    abort();
    onClose();
  };

  const toggleSubmissionPdf = (checked: boolean) => {
    setIncludeSubmissionPdf(checked);
    if (phase !== 'confirm') start(checked);
  };

  const download = () => {
    if (!blob || !result) return;
    setDefaultAction('download');
    downloadBlob(blob, result.filename);
  };

  const print = () => {
    if (!blob) return;
    setDefaultAction('print');
    setPrinting(true);
    printPdfBlob(blob, printDialogTitle(count))
      .catch((cause: unknown) => {
        const message = cause instanceof Error ? cause.message : String(cause);
        notify(printFailureCopy(message), { type: 'error' });
      })
      .finally(() => setPrinting(false));
  };

  const openTab = () => {
    if (!blob) return;
    setPopupBlocked(!openPdfInNewTab(blob));
  };

  const primaryIsPrint = defaultAction === 'print';
  const downloadButton = (primary: boolean) => (
    <Button
      key="download"
      variant={primary ? 'contained' : 'outlined'}
      startIcon={<DownloadIcon />}
      onClick={download}
      autoFocus={primary}
      sx={{ flex: '1 1 auto', minWidth: 0, whiteSpace: 'nowrap' }}
      data-testid="print-packet-download"
    >
      Download PDF
    </Button>
  );
  const printButton = (primary: boolean) => (
    <Button
      key="print"
      variant={primary ? 'contained' : 'outlined'}
      startIcon={printing ? <CircularProgress size={16} color="inherit" /> : <PrintIcon />}
      onClick={print}
      disabled={printing}
      autoFocus={primary}
      sx={{ flex: '1 1 auto', minWidth: 0, whiteSpace: 'nowrap' }}
      data-testid="print-packet-print"
    >
      {printing ? 'Printing…' : 'Print'}
    </Button>
  );

  const percent = Math.round(progress.fraction * 100);

  return (
    <Dialog
      open={open}
      onClose={close}
      fullWidth
      maxWidth="xs"
      aria-labelledby="print-packet-title"
      aria-describedby="print-packet-status"
      data-testid="print-packet-dialog"
      data-phase={phase}
      sx={{
        // Readable on a 390px phone: edge margins, buttons wrap.
        '& .MuiDialog-paper': { m: 1.5, width: 'calc(100% - 24px)' },
      }}
    >
      <DialogTitle id="print-packet-title" sx={{ pb: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PrintIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <Box sx={{ minWidth: 0 }}>
            <Typography component="span" variant="h6" sx={{ display: 'block', lineHeight: 1.2 }}>
              {printDialogTitle(count)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {printDialogSubtitle(count, adapter)}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1.5 }}>
        {phase === 'confirm' ? (
          <Alert severity="warning" variant="outlined" data-testid="print-packet-confirm">
            {printConfirmCopy(count, adapter)}
          </Alert>
        ) : null}

        {phase === 'running' || phase === 'done' ? (
          <Box>
            <LinearProgress
              variant="determinate"
              value={percent}
              aria-label="Packet progress"
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: 1,
                mt: 0.75,
              }}
            >
              <Typography
                id="print-packet-status"
                variant="body2"
                color="text.secondary"
                aria-live="polite"
                sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                data-testid="print-packet-status"
              >
                {phase === 'done' && result
                  ? `Ready · ${result.pageCount} page${result.pageCount === 1 ? '' : 's'} · ${formatBytes(
                      result.bytes.byteLength
                    )}`
                  : progress.message}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                {percent}%
              </Typography>
            </Box>
            {phase === 'done' && result ? (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', wordBreak: 'break-all', fontFamily: 'monospace' }}
                data-testid="print-packet-filename"
              >
                {result.filename}
              </Typography>
            ) : null}
          </Box>
        ) : null}

        {phase === 'error' ? (
          <Alert
            severity="error"
            variant="outlined"
            data-testid="print-packet-error"
            action={
              <Button
                color="inherit"
                size="small"
                startIcon={<ReplayIcon />}
                onClick={() => start(includeSubmissionPdf)}
                data-testid="print-packet-retry"
              >
                Retry
              </Button>
            }
          >
            {printFailureCopy(error)}
          </Alert>
        ) : null}

        {phase === 'done' && result && result.unavailable.length > 0 ? (
          <Alert severity="warning" variant="outlined" data-testid="print-packet-unavailable">
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {result.unavailable.length} attachment{result.unavailable.length === 1 ? '' : 's'} could not be
              embedded (a note page stands in):
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
              {result.unavailable.map((item, index) => (
                <Typography key={`${item.fileName}-${index}`} component="li" variant="body2">
                  {item.label} · {item.fileName}
                  {item.detail ? ` — ${item.detail}` : ''}
                </Typography>
              ))}
            </Box>
          </Alert>
        ) : null}

        {popupBlocked ? (
          <Alert severity="info" variant="outlined">
            Your browser blocked the new tab — use Download PDF instead.
          </Alert>
        ) : null}

        <FormControlLabel
          sx={{ mr: 0, alignItems: 'flex-start', '& .MuiCheckbox-root': { pt: 0.25 } }}
          control={
            <Checkbox
              size="small"
              checked={includeSubmissionPdf}
              onChange={(event) => toggleSubmissionPdf(event.target.checked)}
              inputProps={{ 'aria-label': 'Include original submission PDF' }}
              data-testid="print-packet-include-submission"
            />
          }
          label={
            <Box>
              <Typography variant="body2">Include original submission PDF</Typography>
              <Typography variant="caption" color="text.secondary">
                Appends the PDF generated when the form was submitted (repeats the form above).
              </Typography>
            </Box>
          }
        />
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          pt: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: 1,
          '& > :not(style) ~ :not(style)': { ml: 0 },
        }}
      >
        {phase === 'confirm' ? (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={close} color="inherit">
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => start(includeSubmissionPdf)}
              autoFocus
              data-testid="print-packet-continue"
            >
              Continue
            </Button>
          </Box>
        ) : null}
        {phase === 'running' ? (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={close} color="inherit" data-testid="print-packet-cancel">
              Cancel
            </Button>
          </Box>
        ) : null}
        {phase === 'error' ? (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={close} color="inherit">
              Close
            </Button>
          </Box>
        ) : null}
        {phase === 'done' ? (
          <>
            {/* Primary row: the two outputs side by side, remembered choice filled. */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {primaryIsPrint ? downloadButton(false) : printButton(false)}
              {primaryIsPrint ? printButton(true) : downloadButton(true)}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
              <Button
                onClick={openTab}
                color="inherit"
                size="small"
                startIcon={<OpenInNewIcon />}
                sx={{ color: theme.palette.text.secondary }}
                data-testid="print-packet-open-tab"
              >
                Open in new tab
              </Button>
              <Button onClick={close} color="inherit" size="small">
                Close
              </Button>
            </Box>
          </>
        ) : null}
      </DialogActions>
    </Dialog>
  );
}

/* ---------- action components ---------- */

type ActionComponent = React.ComponentType<{ ctx: PageCtx; api: TitleBarApi }>;

/** Bar action for list tabs: "Print N Selected" → dialog over the ticked rows (list order). */
export const printSelectedActionComponent = <R,>(
  resource: string,
  adapter: PrintPacketAdapter<R>
): ActionComponent => {
  const Component: ActionComponent = () => {
    const { selectedIds, data } = useListContext();
    const [open, setOpen] = useState(false);
    const [ids, setIds] = useState<Identifier[]>([]);
    const count = selectedIds.length;
    if (count === 0) return null;
    return (
      <>
        <HeadingAction
          icon={<PrintIcon fontSize="small" />}
          label={printSelectedLabel(count)}
          onClick={() => {
            setIds(orderIdsByList(selectedIds, data));
            setOpen(true);
          }}
          data-testid={`heading-action-print-selected-${resource}`}
        />
        {open ? (
          <PrintPacketDialog
            open={open}
            onClose={() => setOpen(false)}
            ids={ids}
            adapter={adapter}
          />
        ) : null}
      </>
    );
  };
  Component.displayName = `PrintSelectedAction(${resource})`;
  return Component;
};

const recordIdOf = (record: Record<string, unknown> | undefined): Identifier | null => {
  const id = (record?.id ?? record?.documentId) as Identifier | undefined;
  return id == null || id === '' ? null : id;
};

/** Bar action for show pages: "Print" → dialog over the record on screen. */
export const printRecordActionComponent = <R,>(
  resource: string,
  adapter: PrintPacketAdapter<R>
): ActionComponent => {
  const Component: ActionComponent = () => {
    const record = useRecordContext<Record<string, unknown>>();
    const [open, setOpen] = useState(false);
    const id = recordIdOf(record);
    return (
      <>
        <HeadingAction
          icon={<PrintIcon fontSize="small" />}
          label="Print"
          disabled={id == null}
          onClick={() => setOpen(true)}
          data-testid={`heading-action-print-${resource}`}
        />
        {open && id != null ? (
          <PrintPacketDialog
            open={open}
            onClose={() => setOpen(false)}
            ids={[id]}
            adapter={adapter}
          />
        ) : null}
      </>
    );
  };
  Component.displayName = `PrintRecordAction(${resource})`;
  return Component;
};

/**
 * Per-row print icon for `AgDatagrid rowActions` — same dialog as the bar
 * actions, scoped to that row. `data-ag-skip-row-click` keeps the row's
 * `rowClick="show"` from firing.
 */
export function PrintPacketRowButton<R>({
  record,
  adapter,
  label = 'Print packet',
}: {
  record: Record<string, unknown>;
  adapter: PrintPacketAdapter<R>;
  label?: string;
}) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const id = recordIdOf(record);
  return (
    <>
      <Tooltip title={label}>
        <span data-ag-skip-row-click="">
          <IconButton
            size="small"
            aria-label={label}
            disabled={id == null}
            onClick={(event) => {
              event.stopPropagation();
              setOpen(true);
            }}
            sx={{
              color: theme.palette.mode === 'dark' ? 'grey.100' : 'grey.800',
              '&:hover': { color: 'primary.main' },
            }}
            data-testid="print-packet-row"
          >
            <PrintIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      {open && id != null ? (
        <PrintPacketDialog
          open={open}
          onClose={() => setOpen(false)}
          ids={[id]}
          adapter={adapter}
        />
      ) : null}
    </>
  );
}

/* ---------- manifest presets ---------- */

export interface PrintPacketActionOptions {
  order?: number;
}

/**
 * Selection-scoped "Print Selected" for a list tab. Hidden with no selection
 * (framework rule) and for roles without `find` on the resource.
 */
export const printSelectedAction = <R,>(
  resource: string,
  adapter: PrintPacketAdapter<R>,
  options: PrintPacketActionOptions = {}
): ActionManifest => ({
  id: `print-selected-${resource}`,
  label: 'Print Selected',
  icon: PrintIcon,
  scope: 'selection',
  requiresList: true,
  can: ['find', resource],
  component: printSelectedActionComponent(resource, adapter),
  order: options.order ?? 75,
});

/** Record-scoped "Print" for show pages — same gating, same dialog. */
export const printRecordAction = <R,>(
  resource: string,
  adapter: PrintPacketAdapter<R>,
  options: PrintPacketActionOptions = {}
): ActionManifest => ({
  id: `print-${resource}`,
  label: 'Print',
  icon: PrintIcon,
  scope: 'record',
  can: ['find', resource],
  component: printRecordActionComponent(resource, adapter),
  order: options.order ?? 5,
});

/** Both flavours at once, for manifests that want one call. */
export const printPacketAction = <R,>(
  resource: string,
  adapter: PrintPacketAdapter<R>,
  flavour: 'selection' | 'record',
  options: PrintPacketActionOptions = {}
): ActionManifest =>
  flavour === 'selection'
    ? printSelectedAction(resource, adapter, options)
    : printRecordAction(resource, adapter, options);
