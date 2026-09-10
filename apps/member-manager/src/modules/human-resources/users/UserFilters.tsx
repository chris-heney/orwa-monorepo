import React from 'react';
import { Box, Divider } from '@mui/material';
import {
  FilterList,
  FilterListItem,
  FilterLiveSearch,
  Loading,
  useListFilterContext,
} from 'react-admin';
import BadgeIcon from '@mui/icons-material/Badge';
import RolesContextProvider, {
  useRolesContext,
} from '../../../context/RolesContextProvider';
import { SavedFiltersSection } from '../../_components/SavedFiltersSection';

const UserFiltersBody = () => {
  const { filterValues } = useListFilterContext();
  const { roles } = useRolesContext();

  return !filterValues ? (
    <Loading />
  ) : (
    <Box sx={{ p: 2 }}>
      <SavedFiltersSection />
      <Divider sx={{ mt: 2, mb: 2 }} />
      <FilterLiveSearch />
      <FilterList label="Role" icon={<BadgeIcon />}>
        {roles.map((role, index) => (
          <FilterListItem
            key={`${role.id} ${index}`}
            label={role.name}
            value={{ role: role.id }}
          />
        ))}
      </FilterList>
      <FilterList label="Status" icon={<BadgeIcon />}>
        <FilterListItem label="Confirmed" value={{ confirmed: true }} />
        <FilterListItem label="Not Confirmed" value={{ confirmed: false }} />
      </FilterList>
    </Box>
  );
};

/** Filters drawer body for the Settings → Users tab (inside its ListScope). */
const UserFilters = () => (
  <RolesContextProvider>
    <UserFiltersBody />
  </RolesContextProvider>
);

export default UserFilters;
