import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useDataProvider, useNotify } from 'react-admin';
import { useGetIdentity } from '../../../../helpers/useGetIdentity';

/**
 * Strapi query-engine operators, limited to the ones that make sense for a
 * recipient filter.
 */
const OPERATORS = [
  { id: '$eq', name: 'is' },
  { id: '$ne', name: 'is not' },
  { id: '$gte', name: 'is on or after' },
  { id: '$lte', name: 'is on or before' },
  { id: '$lt', name: 'is before' },
  { id: '$gt', name: 'is after' },
  { id: '$containsi', name: 'contains' },
  { id: '$null', name: 'is empty' },
  { id: '$notNull', name: 'is not empty' },
];

const OPERATORS_WITHOUT_VALUE = new Set(['$null', '$notNull']);

/**
 * Relative dates store a token rather than a concrete date, so the query keeps
 * meaning the same thing every month instead of freezing on the day it was
 * built. The server expands them on every run — see
 * apps/strapi/src/utils/relative-dates.ts.
 */
const DATE_TOKENS = [
  { id: '$now', name: 'today' },
  { id: '$now-1w', name: 'a week ago' },
  { id: '$now-1M', name: 'a month ago' },
  { id: '$now-1y', name: 'a year ago' },
  { id: '$now+1w', name: 'a week from now' },
  { id: '$now+1M', name: 'a month from now' },
  { id: '$now+1y', name: 'a year from now' },
];

interface ConditionRow {
  field: string;
  operator: string;
  /** 'relative' recalculates every run; 'fixed' is a literal that never moves. */
  valueMode: 'relative' | 'fixed';
  value: string;
}

const emptyRow = (): ConditionRow => ({
  field: '',
  operator: '$eq',
  valueMode: 'fixed',
  value: '',
});

/** Coerce obvious literals so "true"/"42" do not go to Strapi as strings. */
const parseValue = (raw: string) => {
  const trimmed = raw.trim();
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed !== '' && !Number.isNaN(Number(trimmed))) return Number(trimmed);
  return trimmed;
};

export const buildFilters = (rows: ConditionRow[]) => {
  const clauses = rows
    .filter((row) => row.field.trim())
    .map((row) => ({
      [row.field.trim()]: OPERATORS_WITHOUT_VALUE.has(row.operator)
        ? { [row.operator]: true }
        : {
            // Relative values are stored as the token verbatim; the server
            // expands them per run.
            [row.operator]:
              row.valueMode === 'relative'
                ? row.value
                : parseValue(row.value),
          },
    }));

  if (clauses.length === 0) return null;
  if (clauses.length === 1) return clauses[0];
  return { $and: clauses };
};

interface CreateSavedQueryDialogProps {
  open: boolean;
  onClose: () => void;
  /** Strapi entity the task targets, e.g. "watersystem". */
  entity?: string;
  /** Called with the created record so the caller can select it. */
  onCreated: (query: { id: string | number; name: string }) => void;
}

/**
 * Builds and saves a query without leaving the scheduled-email task form.
 * Previously a query could only be created from a list's filter sidebar, so
 * setting up a task meant navigating away and back.
 */
const CreateSavedQueryDialog = ({
  open,
  onClose,
  entity,
  onCreated,
}: CreateSavedQueryDialogProps) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const identity = useGetIdentity();

  const [name, setName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [rows, setRows] = useState<ConditionRow[]>([emptyRow()]);
  const [saving, setSaving] = useState(false);

  const hasRelativeValue = rows.some(
    (row) =>
      row.valueMode === 'relative' &&
      row.value &&
      !OPERATORS_WITHOUT_VALUE.has(row.operator)
  );

  const updateRow = (index: number, patch: Partial<ConditionRow>) =>
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, ...patch } : row))
    );

  const reset = () => {
    setName('');
    setIsPublic(true);
    setRows([emptyRow()]);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      notify('Please name the query.', { type: 'warning' });
      return;
    }
    if (!entity) {
      notify('Select an entity before creating a query.', { type: 'warning' });
      return;
    }

    const filters = buildFilters(rows);
    if (!filters) {
      notify('Add at least one condition.', { type: 'warning' });
      return;
    }

    setSaving(true);
    try {
      const { data } = await dataProvider.create('saved-queries', {
        data: {
          name: name.trim(),
          filters,
          is_public: isPublic,
          user: identity?.id,
          resource: entity,
        },
      });

      notify('Query created.', { type: 'success' });
      onCreated({ id: data.id, name: data.name });
      reset();
      onClose();
    } catch (error: any) {
      notify(`Error creating query: ${error.message}`, { type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>New query{entity ? ` for ${entity}` : ''}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            fullWidth
            autoFocus
          />

          <Typography variant="subtitle2">
            Recipients must match all of these conditions
          </Typography>

          {rows.map((row, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}
            >
              <TextField
                label="Field"
                value={row.field}
                onChange={(event) =>
                  updateRow(index, { field: event.target.value })
                }
                placeholder="expiration_date"
                sx={{ flex: 2 }}
              />
              <TextField
                select
                label="Condition"
                value={row.operator}
                onChange={(event) =>
                  updateRow(index, { operator: event.target.value })
                }
                sx={{ flex: 2 }}
              >
                {OPERATORS.map((operator) => (
                  <MenuItem key={operator.id} value={operator.id}>
                    {operator.name}
                  </MenuItem>
                ))}
              </TextField>
              {!OPERATORS_WITHOUT_VALUE.has(row.operator) && (
                <>
                  <TextField
                    select
                    label="Value is"
                    value={row.valueMode}
                    onChange={(event) =>
                      updateRow(index, {
                        valueMode: event.target.value as ConditionRow['valueMode'],
                        value: '',
                      })
                    }
                    sx={{ flex: 2 }}
                  >
                    <MenuItem value="fixed">a fixed value</MenuItem>
                    <MenuItem value="relative">a date, recalculated each run</MenuItem>
                  </TextField>

                  {row.valueMode === 'relative' ? (
                    <TextField
                      select
                      label="Date"
                      value={row.value}
                      onChange={(event) =>
                        updateRow(index, { value: event.target.value })
                      }
                      helperText="Recalculated every time the email runs"
                      sx={{ flex: 3 }}
                    >
                      {DATE_TOKENS.map((token) => (
                        <MenuItem key={token.id} value={token.id}>
                          {token.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <TextField
                      label="Value"
                      value={row.value}
                      onChange={(event) =>
                        updateRow(index, { value: event.target.value })
                      }
                      helperText="Stays exactly as entered"
                      sx={{ flex: 3 }}
                    />
                  )}
                </>
              )}
              <IconButton
                aria-label="Remove condition"
                onClick={() =>
                  setRows((current) =>
                    current.length === 1
                      ? [emptyRow()]
                      : current.filter((_, i) => i !== index)
                  )
                }
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

          <Button
            startIcon={<AddIcon />}
            onClick={() => setRows((current) => [...current, emptyRow()])}
            sx={{ alignSelf: 'flex-start' }}
          >
            Add condition
          </Button>

          <Alert severity={hasRelativeValue ? 'success' : 'info'}>
            {hasRelativeValue
              ? 'This query updates itself. Its dates are recalculated every time the email runs, so it never needs replacing.'
              : 'This query is fixed. Set a value to “a date, recalculated each run” if you want it to keep up to date on its own — otherwise it will mean the same dates forever.'}
          </Alert>

          <FormControlLabel
            control={
              <Switch
                checked={isPublic}
                onChange={(event) => setIsPublic(event.target.checked)}
              />
            }
            label="Available to everyone"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving} variant="contained">
          Create query
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSavedQueryDialog;
