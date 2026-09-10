import React from 'react';
import { Box, Divider } from '@mui/material';
import {
  FilterList,
  FilterListItem,
  FilterLiveSearch,
  Loading,
  useListFilterContext,
} from 'react-admin';
import EmailIcon from '@mui/icons-material/Email';
import { SavedFiltersSection } from '../../_components/SavedFiltersSection';

/** Filters drawer body for the Contacts page (renders inside its ListScope). */
const ContactFilters = () => {
  const { filterValues } = useListFilterContext();

  return !filterValues ? (
    <Loading />
  ) : (
    <Box sx={{ p: 2 }}>
      <SavedFiltersSection />
      <Divider sx={{ mt: 2, mb: 2 }} />
      <FilterLiveSearch />
      <FilterList label="Contact Filters" icon={<EmailIcon />}>
        <FilterListItem
          label="Valid Emails"
          value={{
            $and: [
              { email: { $notContains: 'anonymous' } },
              { email: { $notNull: true } },
            ],
          }}
        />
        <FilterListItem
          label="Invalid Emails"
          value={{
            $or: [
              { email: { $contains: 'anonymous' } },
              { email: { $null: true } },
            ],
          }}
        />
      </FilterList>
    </Box>
  );
};

export default ContactFilters;
