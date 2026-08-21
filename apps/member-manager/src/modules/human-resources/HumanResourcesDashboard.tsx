import React from 'react';
import { Box } from '@mui/material';
import { Title } from 'react-admin';
import ContactList from './contacts/ContactList';
import ContactsHeader from './_components/ContactsHeader';
import HumanResourcesFilters from './_components/HumanResourceFilters';

/**
 * Contacts page. Staff, Instructors, Users, and Badges moved to Settings, so
 * this is now a single Contacts list (no tab selector) with the standardized
 * heading bar flush under the app bar.
 */
const HumanResourcesDashboard = () => {
  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      <Title title="Contacts" />
      <ContactsHeader />
      {/* Table scrolls horizontally on its own so wide columns never push the
          heading actions off-screen. */}
      <Box sx={{ backgroundColor: 'background.paper', overflowX: 'auto', width: '100%' }}>
        <ContactList title=" " />
      </Box>
      <HumanResourcesFilters />
    </Box>
  );
};

export default HumanResourcesDashboard;
