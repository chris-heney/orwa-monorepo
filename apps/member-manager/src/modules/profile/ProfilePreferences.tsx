import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useActionLabels } from '../../helpers/useActionLabels';
import { userPreferencesStore } from '../../helpers/userPreferencesStore';

/**
 * Personal app preferences, shown under the profile form. Kept separate from
 * the contact record: these are UI settings (stored in RaStore →
 * user_preferences), not contact data.
 */
const ProfilePreferences = () => {
  const [showLabels, setShowLabels] = useActionLabels();
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    setResetting(true);
    try {
      await userPreferencesStore.resetAllPreferences();
    } finally {
      window.location.reload();
    }
  };

  return (
    <Card
      sx={{
        mt: 2,
        bgcolor: 'background.paper',
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Preferences
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
            />
          }
          label="Show text labels on action buttons"
        />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 6, mt: -0.5 }}>
          When off, page toolbar buttons show icons only (with tooltips on
          hover). Turn on to show a label next to every icon.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" gutterBottom>
          Saved view settings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Columns, filters, and tab choices are saved to your account. If a page
          ever looks wrong or won&apos;t load, reset them — your data is not
          affected.
        </Typography>
        <Box>
          <Button
            variant="outlined"
            color="warning"
            startIcon={
              resetting ? <CircularProgress size={16} /> : <RestartAltIcon />
            }
            disabled={resetting}
            onClick={handleReset}
          >
            {resetting ? 'Resetting…' : 'Reset my saved view settings'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfilePreferences;
