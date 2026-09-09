import React from 'react';
import { Divider } from '@mui/material';
import { FilterList, FilterListItem, FilterLiveSearch } from 'react-admin';
import ActiveIcon from '@mui/icons-material/CheckCircle';
import { isSelected, toggleFilter } from '../../conference/helpers/selectFilters';
import { SavedFiltersSection } from '../../_components/SavedFiltersSection';

/** Filters drawer body for Corporate Sponsors (renders inside the page's ListScope). */
const CorporateSponsorsFilters = () => (
  <>
    <SavedFiltersSection />
    <FilterLiveSearch source="name][$contains" label="Search by Name" alwaysOn />
    <Divider sx={{ mb: 2 }} />
    <FilterList label="Status" icon={<ActiveIcon />}>
      <FilterListItem
        label="Active"
        value={{ active: true }}
        isSelected={isSelected}
        toggleFilter={(val, filters) => toggleFilter(val, filters, undefined, false)}
      />
      <FilterListItem
        label="Inactive"
        value={{ active: false }}
        isSelected={isSelected}
        toggleFilter={(val, filters) => toggleFilter(val, filters, undefined, false)}
      />
    </FilterList>
  </>
);

export default CorporateSponsorsFilters;
