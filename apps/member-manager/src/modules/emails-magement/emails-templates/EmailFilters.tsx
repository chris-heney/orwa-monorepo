import React from 'react';
import { Box } from '@mui/material';
import {
  FilterList,
  FilterListItem,
  FilterLiveSearch,
  Loading,
  useListFilterContext,
} from 'react-admin';
import MoneyIcon from '@mui/icons-material/AttachMoney';
import { SavedFiltersSection } from '../../_components/SavedFiltersSection';

/** Filters drawer body for the Emails tab (renders inside the tab's ListScope). */
const EmailFilters = () => {
  const { filterValues } = useListFilterContext();

  return !filterValues ? (
    <Loading />
  ) : (
    <Box sx={{ p: 2 }}>
      <SavedFiltersSection />
      <FilterLiveSearch />
      <FilterList label="Module" icon={<MoneyIcon />}>
        <FilterListItem label="Memberships" value={{ module: 'memberships' }} />
        <FilterListItem
          label="Grant Management"
          value={{ module: 'Grant Management' }}
        />
        <FilterListItem label="Training" value={{ module: 'Training' }} />
        <FilterListItem label="Contacts" value={{ module: 'Contacts' }} />
        <FilterListItem label="Conference" value={{ module: 'Conference' }} />
        <FilterListItem label="Scholarships" value={{ module: 'Scholarships' }} />
        <FilterListItem label="Awards" value={{ module: 'Awards' }} />
      </FilterList>
    </Box>
  );
};
export default EmailFilters;
