import React, { useEffect, useState } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import {
  Confirm,
  useDataProvider,
  useDeleteMany,
  useListContext,
  useNotify,
  useRefresh,
  type DataProvider,
  type Identifier,
} from 'react-admin';
import HeadingAction from '../modules/_components/heading/HeadingAction';
import type { ActionManifest, PageCtx, TitleBarApi } from './manifest';

/* ---------- pure copy helpers (unit-tested) ---------- */

export interface BulkDeleteNoun {
  /** Singular, lower-case: "scholarship application". */
  noun: string;
  /** Plural; default `${noun}s`. */
  nounPlural?: string;
}

export const pluralizeNoun = (count: number, { noun, nounPlural }: BulkDeleteNoun) =>
  count === 1 ? noun : nounPlural ?? `${noun}s`;

/** "Delete 4 scholarship applications? This cannot be undone." */
export const bulkDeleteConfirmCopy = (count: number, names: BulkDeleteNoun) =>
  `Delete ${count} ${pluralizeNoun(count, names)}? This cannot be undone.`;

export const bulkDeleteTitle = (count: number, names: BulkDeleteNoun) =>
  `Delete ${count} selected ${pluralizeNoun(count, names)}`;

export const bulkDeleteSuccessCopy = (count: number, names: BulkDeleteNoun) =>
  `Deleted ${count} ${pluralizeNoun(count, names)}.`;

export const bulkDeleteFailureCopy = (
  count: number,
  names: BulkDeleteNoun,
  message?: string | null
) =>
  `Could not delete ${count === 1 ? 'the selected' : `the ${count} selected`} ${pluralizeNoun(
    count,
    names
  )}${message ? `: ${message}` : '.'} The list was refreshed — anything still shown was not deleted.`;

/* ---------- component ---------- */

export interface BulkDeleteOptions extends BulkDeleteNoun {
  /**
   * Extra confirmation lines computed when the dialog opens — e.g. "2 of the
   * selected nominations are linked to an Award Winner". Failures are logged
   * and ignored so the dialog still opens.
   */
  warnings?: (ids: Identifier[], dataProvider: DataProvider) => Promise<string[]>;
  order?: number;
}

type ActionComponent = React.ComponentType<{ ctx: PageCtx; api: TitleBarApi }>;

/**
 * Selection-scoped "Delete Selected" for a framework list tab. Lives in the
 * title bar next to "N selected" (same slot as Print Selected), confirms with
 * the count and the module's record name, deletes pessimistically, then the
 * list refetches (RA invalidates the resource) and the grid drops its
 * selection with the replaced rows.
 */
export const bulkDeleteActionComponent = (
  resource: string,
  options: BulkDeleteOptions
): ActionComponent => {
  const Component: ActionComponent = () => {
    const { selectedIds, resource: listResource, onUnselectItems } = useListContext();
    const target = listResource || resource;
    const notify = useNotify();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();
    const [open, setOpen] = useState(false);
    const [warnings, setWarnings] = useState<string[] | null>(null);
    const count = selectedIds.length;

    const [deleteMany, { isLoading }] = useDeleteMany(
      target,
      { ids: selectedIds },
      {
        mutationMode: 'pessimistic',
        onSuccess: () => {
          setOpen(false);
          onUnselectItems();
          notify(bulkDeleteSuccessCopy(count, options), { type: 'success' });
          refresh();
        },
        onError: (error: unknown) => {
          setOpen(false);
          const message = (error as { message?: string } | null)?.message;
          notify(bulkDeleteFailureCopy(count, options, message), { type: 'error' });
          // Some of the batch may have gone through before the failure.
          onUnselectItems();
          refresh();
        },
      }
    );

    // Resolve the optional warnings each time the dialog opens.
    useEffect(() => {
      if (!open || !options.warnings) return;
      let cancelled = false;
      setWarnings(null);
      options
        .warnings(selectedIds, dataProvider)
        .then((lines) => {
          if (!cancelled) setWarnings(lines);
        })
        .catch((error) => {
          console.error(error);
          if (!cancelled) setWarnings([]);
        });
      return () => {
        cancelled = true;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    if (count === 0) return null;

    const checking = Boolean(options.warnings) && warnings === null;

    return (
      <>
        <HeadingAction
          icon={<DeleteOutlineIcon fontSize="small" />}
          label="Delete Selected"
          color="error"
          onClick={() => setOpen(true)}
          data-testid={`heading-action-bulk-delete-${target}`}
        />
        <Confirm
          isOpen={open}
          loading={isLoading}
          title={bulkDeleteTitle(count, options)}
          confirm="Delete"
          confirmColor="warning"
          ConfirmIcon={DeleteOutlineIcon}
          content={
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography>{bulkDeleteConfirmCopy(count, options)}</Typography>
              {checking ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={14} />
                  <Typography variant="body2" color="text.secondary">
                    Checking linked records…
                  </Typography>
                </Box>
              ) : null}
              {warnings && warnings.length > 0 ? (
                <Alert severity="warning" variant="outlined">
                  {warnings.map((line) => (
                    <Typography key={line} variant="body2">
                      {line}
                    </Typography>
                  ))}
                </Alert>
              ) : null}
            </Box>
          }
          onConfirm={() => {
            if (isLoading) return;
            deleteMany();
          }}
          onClose={() => {
            if (!isLoading) setOpen(false);
          }}
        />
      </>
    );
  };
  Component.displayName = `BulkDeleteAction(${resource})`;
  return Component;
};

/**
 * Manifest preset: RBAC-gated (`delete` on the resource) selection action.
 * Hidden with no selection (framework rule for `scope: 'selection'`) and for
 * roles without the delete permission (`visibleActions` → `ctx.can`).
 */
export const bulkDeleteAction = (
  resource: string,
  options: BulkDeleteOptions
): ActionManifest => ({
  id: `bulk-delete-${resource}`,
  label: 'Delete Selected',
  icon: DeleteOutlineIcon,
  scope: 'selection',
  requiresList: true,
  can: ['delete', resource],
  color: 'error',
  component: bulkDeleteActionComponent(resource, options),
  order: options.order ?? 98,
});
