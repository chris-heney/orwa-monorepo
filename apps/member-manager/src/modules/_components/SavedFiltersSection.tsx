import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useResourceContext } from 'react-admin';
import SavedFilters from './SavedFilters';
import { useDrawerFlag } from './drawer/DrawerLocalState';

/**
 * Saved-query picker for Filters drawer bodies. The "save current filter"
 * modal is toggled by `SaveQueryHeaderAction` in the drawer header; both
 * share the drawer's local state so no module context is needed.
 */
export const SavedFiltersSection = ({ resource }: { resource?: string }) => {
  const contextResource = useResourceContext();
  const [savingQuery, setSavingQuery] = useDrawerFlag('savingQuery');
  const effective = resource ?? contextResource;
  if (!effective) return null;
  return (
    <SavedFilters
      resource={effective}
      savingQuery={savingQuery}
      setSavingQuery={setSavingQuery}
    />
  );
};

/** Header button for the Filters drawer: opens the save-current-filter modal. */
export const SaveQueryHeaderAction = () => {
  const [, setSavingQuery] = useDrawerFlag('savingQuery');
  return (
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
  );
};

export default SavedFiltersSection;
