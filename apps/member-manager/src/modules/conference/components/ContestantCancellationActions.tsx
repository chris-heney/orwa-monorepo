import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { RaRecord, useNotify, useRefresh } from 'react-admin';
import httpClient from '../../../helpers/ra-strapi-data-provider/src/httpClient';
import { isCancelledContestant } from '../helpers/contestantStatus';

type ContestantAction = 'cancel' | 'restore';

interface ContestantCancellationActionsProps {
  record?: RaRecord;
}

const actionCopy: Record<
  ContestantAction,
  {
    buttonLabel: string;
    dialogTitle: string;
    dialogBody: string;
    reasonLabel: string;
    successMessage: string;
    errorMessage: string;
  }
> = {
  cancel: {
    buttonLabel: 'Cancel',
    dialogTitle: 'Cancel contestant?',
    dialogBody:
      'This keeps the contestant history, fees, and selected items visible, but removes the contestant from the active list.',
    reasonLabel: 'Cancellation reason',
    successMessage: 'Contestant cancelled.',
    errorMessage: 'Unable to cancel contestant.',
  },
  restore: {
    buttonLabel: 'Restore',
    dialogTitle: 'Restore contestant?',
    dialogBody:
      'This returns the contestant to the active list. Golf capacity will be checked again before the restore is saved.',
    reasonLabel: 'Restore reason',
    successMessage: 'Contestant restored.',
    errorMessage: 'Unable to restore contestant.',
  },
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

const ContestantCancellationActions = ({
  record,
}: ContestantCancellationActionsProps) => {
  const notify = useNotify();
  const refresh = useRefresh();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!record?.id) {
    return null;
  }

  const action: ContestantAction = isCancelledContestant({
    status: record.status as string | null | undefined,
  })
    ? 'restore'
    : 'cancel';
  const copy = actionCopy[action];
  const trimmedReason = reason.trim();

  const closeDialog = () => {
    if (isSaving) return;
    setDialogOpen(false);
    setReason('');
    setReasonError(false);
  };

  const submitAction = async () => {
    if (!trimmedReason) {
      setReasonError(true);
      return;
    }

    setIsSaving(true);
    try {
      await httpClient(
        `${import.meta.env.VITE_API_ENDPOINT}/api/conference-contestants/${
          record.id
        }/${action}`,
        {
          method: 'POST',
          headers: new Headers({
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({ reason: trimmedReason }),
        }
      );

      notify(copy.successMessage, { type: 'success' });
      setDialogOpen(false);
      setReason('');
      setReasonError(false);
      refresh();
    } catch (error) {
      notify(getErrorMessage(error, copy.errorMessage), { type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Button
        size="small"
        variant={action === 'cancel' ? 'contained' : 'outlined'}
        color={action === 'cancel' ? 'error' : 'secondary'}
        onClick={(event) => {
          event.stopPropagation();
          setDialogOpen(true);
        }}
      >
        {copy.buttonLabel}
      </Button>

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{copy.dialogTitle}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <DialogContentText>{copy.dialogBody}</DialogContentText>
            <TextField
              autoFocus
              required
              multiline
              minRows={3}
              label={copy.reasonLabel}
              value={reason}
              onChange={(event) => {
                setReason(event.target.value);
                if (event.target.value.trim()) {
                  setReasonError(false);
                }
              }}
              error={reasonError}
              helperText={reasonError ? 'A reason is required.' : ' '}
              disabled={isSaving}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={isSaving}>
            Keep Editing
          </Button>
          <Button
            variant="contained"
            color={action === 'cancel' ? 'error' : 'secondary'}
            onClick={submitAction}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : copy.buttonLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContestantCancellationActions;
