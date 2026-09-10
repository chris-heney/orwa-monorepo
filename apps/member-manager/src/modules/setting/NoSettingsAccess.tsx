import React from 'react';
import { Box } from '@mui/material';
import { useCan } from '../rbac-manager/useCan';

/** Body of `settings.dashboard` when the role can see none of its tabs. */
const NoSettingsAccess = () => {
  const { isLoading } = useCan();
  // Tabs appear once the role is known — don't flash the message meanwhile.
  if (isLoading) return null;
  return (
    <Box sx={{ p: 3, color: 'text.secondary' }}>
      You don&apos;t have access to any settings sections.
    </Box>
  );
};

export default NoSettingsAccess;
