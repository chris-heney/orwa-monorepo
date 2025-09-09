import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { RestoreOutlined, AddCircleOutline } from '@mui/icons-material';
import { formatSavedDataTimestamp } from '../helpers/formPersistence';

interface PreviousSessionModalProps {
  open: boolean;
  savedTimestamp: number;
  onContinue: () => void;
  onStartFresh: () => void;
}

const PreviousSessionModal: React.FC<PreviousSessionModalProps> = ({
  open,
  savedTimestamp,
  onContinue,
  onStartFresh,
}) => {
  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          bgcolor: 'background.paper',
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Typography variant="h5" component="h2" fontWeight="bold">
          Previous Session Found
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          We found a previous session where you were filling out this form 
          (last updated {formatSavedDataTimestamp(savedTimestamp)}). Would you like to 
          continue where you left off or start fresh?
        </Typography>
        
        <Box 
          sx={{ 
            bgcolor: 'success.light', 
            color: 'success.contrastText', 
            p: 2, 
            borderRadius: 1,
            mb: 1
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            📎 Great news! All your form data and uploaded files will be restored from your previous session.
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            Please re-check all steps to make sure they are all filled out.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ flexDirection: 'column', gap: 1, px: 3, pb: 3 }}>
        <Button
          onClick={onContinue}
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          startIcon={<RestoreOutlined />}
          sx={{
            borderRadius: 2,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 'medium',
          }}
        >
          CONTINUE WHERE I LEFT OFF
        </Button>
        
        <Button
          onClick={onStartFresh}
          variant="outlined"
          color="inherit"
          fullWidth
          size="large"
          startIcon={<AddCircleOutline />}
          sx={{
            borderRadius: 2,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 'medium',
            borderColor: 'grey.400',
            color: 'text.secondary',
            '&:hover': {
              borderColor: 'grey.600',
              bgcolor: 'grey.50',
            },
          }}
        >
          START FRESH
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreviousSessionModal; 