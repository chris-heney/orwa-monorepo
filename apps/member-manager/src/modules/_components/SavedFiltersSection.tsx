import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { ListFilterContext, useResourceContext } from 'react-admin';
import SavedFilters from './SavedFilters';
import SaveFilterModal from './SaveFilter';
import { useCan } from '../rbac-manager/useCan';
import { useDrawerFlag } from './drawer/DrawerLocalState';

/**
 * Saved-query picker for Filters drawer bodies. The "save current filter"
 * modal lives in the drawer *header* (`SaveQueryHeaderAction`) so it works on
 * every list, including the ones whose body never renders this picker; both
 * share the drawer's local state so no module context is needed.
 */
export const SavedFiltersSection = ({ resource }: { resource?: string }) => {
  const contextResource = useResourceContext();
  const [savingQuery] = useDrawerFlag('savingQuery');
  // Null on Filters drawers mounted without a list (grant-manager's Summary /
  // Map reuse `GrantFilters` there); SavedFilters' list hooks would throw.
  const hasList = useContext(ListFilterContext) != null;
  const effective = resource ?? contextResource;
  if (!hasList || !effective) return null;
  return <SavedFilters resource={effective} savingQuery={savingQuery} />;
};

/**
 * Header button for the Filters drawer: opens the save-current-filter modal.
 * Owns the modal too — the picker in the body is optional, the header is not.
 */
export const SaveQueryHeaderAction = () => {
  const [savingQuery, setSavingQuery] = useDrawerFlag('savingQuery');
  const resource = useResourceContext();
  const { can } = useCan();
  // Some tabs mount a Filters drawer with no list at all (grant-manager's
  // Summary / Map reuse it for grant + date-range pickers). There is nothing
  // to save there, and the modal's list hooks would throw.
  const hasList = useContext(ListFilterContext) != null;
  if (!hasList || !resource || !can('create', 'saved-query')) return null;
  return (
    <>
      <Tooltip title="Save Current Filter">
        <IconButton
          onClick={() => setSavingQuery((prev) => !prev)}
          size="small"
          sx={{ color: 'inherit' }}
          aria-label="Save current filter"
        >
          <FavoriteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <SaveFilterModal
        resource={resource}
        savingQuery={savingQuery}
        setSavingQuery={setSavingQuery}
      />
    </>
  );
};

/**
 * Header button for the Filters drawer: clears the user's filter values.
 * Filters only — sort, page size and columns are not this drawer's business.
 */
export const ResetFiltersHeaderAction = () => {
  // Null on list-less Filters drawers — see SaveQueryHeaderAction.
  const listFilters = useContext(ListFilterContext);
  if (!listFilters) return null;
  const { filterValues, setFilters } = listFilters;
  const hasFilters = Object.keys(filterValues ?? {}).length > 0;
  return (
    <Tooltip title={hasFilters ? 'Reset filters' : 'No filters to reset'}>
      {/* span: a disabled IconButton fires no events, so Tooltip needs a host. */}
      <span>
        <IconButton
          onClick={() => setFilters({}, {})}
          disabled={!hasFilters}
          size="small"
          sx={{ color: 'inherit', '&.Mui-disabled': { color: 'inherit', opacity: 0.4 } }}
          aria-label="Reset filters"
        >
          <CancelRoundedIcon fontSize="small" />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default SavedFiltersSection;
