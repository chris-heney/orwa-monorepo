import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';
import { userPreferencesStore } from '../../helpers/userPreferencesStore';
import { clearRolePreview } from '../../modules/rbac-manager/rolePreview';

interface ErrorRecoveryFallbackProps {
  error: Error;
  errorInfo?: React.ErrorInfo;
  resetErrorBoundary: (...args: unknown[]) => void;
}

/**
 * Friendly full-page error state with self-service recovery.
 *
 * Saved view settings (columns, filters, tabs) live in the DB and follow the
 * user across devices — when a stored value references a field that no longer
 * exists, every login reproduces the crash. "Reset saved view settings" wipes
 * server + local preferences (and any stuck role preview) and reloads, which
 * un-bricks the account without developer intervention.
 */
const ErrorRecoveryFallback = ({
  error,
  errorInfo,
  resetErrorBoundary,
}: ErrorRecoveryFallbackProps) => {
  const [resetting, setResetting] = useState(false);

  const handleResetPreferences = async () => {
    setResetting(true);
    try {
      await userPreferencesStore.resetAllPreferences();
      clearRolePreview();
    } finally {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    // ModuleRouteGuard routes '/' to the first module the role grants.
    window.location.hash = '#/';
    resetErrorBoundary();
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 560,
          width: '100%',
          p: 4,
          textAlign: 'center',
          bgcolor: 'background.paper',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
        }}
      >
        <ErrorOutlineIcon color="warning" sx={{ fontSize: 48, mb: 1 }} />
        <Typography variant="h6" gutterBottom>
          Something went wrong on this page
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          This is sometimes caused by saved view settings (columns, filters,
          tabs) from an earlier version of the app. You can retry, or reset
          your saved view settings — your data is not affected, only how lists
          and pages are laid out for you.
        </Typography>

        <Stack spacing={1.5} sx={{ alignItems: 'stretch' }}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={() => resetErrorBoundary()}
          >
            Try Again
          </Button>
          <Button
            variant="outlined"
            color="warning"
            startIcon={
              resetting ? <CircularProgress size={16} /> : <RestartAltIcon />
            }
            disabled={resetting}
            onClick={handleResetPreferences}
          >
            {resetting
              ? 'Resetting saved settings…'
              : 'Reset my saved view settings & reload'}
          </Button>
          <Button
            variant="text"
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
          >
            Back to my home page
          </Button>
        </Stack>

        <Accordion
          disableGutters
          elevation={0}
          sx={{
            mt: 3,
            bgcolor: 'transparent',
            '&:before': { display: 'none' },
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="caption" color="text.secondary">
              Technical details
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ textAlign: 'left' }}>
            <Typography
              variant="caption"
              component="pre"
              sx={{
                m: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'monospace',
                color: 'text.secondary',
              }}
            >
              {error?.message}
              {'\n\n'}
              {error?.stack}
              {errorInfo?.componentStack
                ? `\n\nComponent stack:${errorInfo.componentStack}`
                : ''}
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </Box>
  );
};

export default ErrorRecoveryFallback;
