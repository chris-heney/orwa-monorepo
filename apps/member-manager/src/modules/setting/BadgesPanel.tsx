import React from 'react';
import { Box } from '@mui/material';
import BadgeList from '../human-resources/contacts/badges/BadgeList';

/** Settings → Badges tab (no list scope): the contact-badge manager card. */
const BadgesPanel = () => (
  <Box sx={{ p: 2 }}>
    <BadgeList />
  </Box>
);

export default BadgesPanel;
