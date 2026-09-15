import React from 'react';
import { Box } from '@mui/material';
import { useListFilterContext } from 'react-admin';
import SoonerwarnStatusFilter from './SoonerwarnStatusFilter';
import { SavedFiltersSection } from '../../_components/SavedFiltersSection';

/**
 * Filters drawer body: the status radio list bound to the ListScope's
 * `status` filter value (was a `useState` in the old module context).
 */
const StatusFilterBody = ({ statusResource }: { statusResource: string }) => {
  const { filterValues, setFilters, displayedFilters } = useListFilterContext();
  const raw = (filterValues ?? {}).status;
  const selected: string[] = Array.isArray(raw)
    ? raw.map(String)
    : raw != null && raw !== ''
    ? [String(raw)]
    : [];

  const setSelected = (next: string[]) => {
    const rest = { ...(filterValues ?? {}) };
    if (next.length) rest.status = next;
    else delete rest.status;
    setFilters(rest, displayedFilters, false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <SavedFiltersSection />
      <SoonerwarnStatusFilter
        resource={statusResource}
        selectedStatuses={selected}
        setSelectedStatuses={setSelected}
      />
    </Box>
  );
};

/** Applications / Volunteer tabs (`soonerwarns`). */
export const SoonerwarnStatusFilters = () => (
  <StatusFilterBody statusResource="soonerwarn-statuses" />
);

/** Needs Assistance tab (`soonerwarn-requests`). */
export const RequestStatusFilters = () => (
  <StatusFilterBody statusResource="request-statuses" />
);

export default SoonerwarnStatusFilters;
