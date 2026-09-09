import React from 'react';
import { Box } from '@mui/material';
import {
  FilterList,
  FilterListItem,
  FilterLiveSearch,
  Loading,
  useGetList,
  useListFilterContext,
} from 'react-admin';
import { Email } from '@mui/icons-material';
import { SavedFiltersSection } from '../../_components/SavedFiltersSection';

/** Filters drawer body for the Email Logs tab. */
const EmailLogFilters = () => {
  const { filterValues } = useListFilterContext();

  const { data: emailTemplates = [], isLoading } = useGetList(
    'email-templates',
    {
      pagination: { page: 1, perPage: 100 },
      sort: { field: 'email_name', order: 'ASC' },
    }
  );

  return !filterValues || isLoading ? (
    <Loading />
  ) : (
    <Box sx={{ p: 2 }}>
      <SavedFiltersSection />
      <FilterLiveSearch />
      <FilterList label="Email Template" icon={<Email />}>
        {emailTemplates.map((template: any) => (
          <FilterListItem
            key={`${template.id}`}
            label={template.email_name ?? 'No Name'}
            value={{ template: template.id }}
          />
        ))}
      </FilterList>
    </Box>
  );
};
export default EmailLogFilters;
