import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from '@mui/material';
import React, { useState } from 'react';
import {
  SaveButton,
  useGetRecordId,
  useNotify,
  useRefresh,
  useResetStore,
  useResourceContext,
} from 'react-admin';
import authProvider from '../../../authProvider';
import { useCan } from '../../rbac-manager/useCan';

interface CustomToolBarProps {
  onEdit?: (data: FormData) => void;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}
const CustomToolBar = ({ onEdit, setIsEditing }: CustomToolBarProps) => {
  const id = useGetRecordId();
  const notify = useNotify();
  const resource = useResourceContext();
  const { canOnResource } = useCan();

  const reset = useResetStore();
  const refresh = useRefresh();

  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);

  const removeRegistration = async () => {
    const identity = await authProvider.getIdentity?.();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/remove-registration`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${identity?.token}`,
          },
          body: JSON.stringify({
            registrationId: id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData.result === 'success') {
        notify('Registration Removed!', { type: 'success' });
        setIsEditing(false);
        reset();
        refresh();
      } else {
        notify('Error Removing Registration', { type: 'error' });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error:', error);
      notify('Error Removing Registration', { type: 'error' });
      setIsEditing(false);
    }
  };

  return (
    <>
      <Box
        display="flex"
        alignContent={'center'}
        sx={{ backgroundColor: 'background.default', padding: 2 }}
      >
        <Grid container spacing={2}>
          {/* Draft Button */}
          {canOnResource('update', resource ?? '') && (
            <Grid item>
              {onEdit && <SaveButton alwaysEnable onSubmit={() => onEdit} />}
              {!onEdit && <SaveButton alwaysEnable />}
            </Grid>
          )}
          {/* Delete Button */}
          {canOnResource('delete', resource ?? '') && (
            <Grid
              item
              sx={{
                marginLeft: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Button color="error" onClick={() => setConfirmRemoveOpen(true)}>
                Remove Registration
              </Button>
              <span>
                This will remove all data attached to the registration
              </span>
            </Grid>
          )}
        </Grid>
      </Box>
      <Dialog
        open={confirmRemoveOpen}
        onClose={() => setConfirmRemoveOpen(false)}
      >
        <DialogTitle>Remove this registration?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently remove the registration and ALL attached
            data: attendees and their extras, booths, contestants, and the
            linked sponsor record (if any). Sponsorship packages themselves
            are not deleted. This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setConfirmRemoveOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setConfirmRemoveOpen(false);
              removeRegistration();
            }}
          >
            Remove Registration
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomToolBar;
