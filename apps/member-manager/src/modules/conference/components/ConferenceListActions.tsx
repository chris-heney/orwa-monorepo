import React from 'react';
import {
  ExportButton,
  FilterLiveSearch,
  SelectColumnsButton,
  useListContext,
  useResourceContext,
} from 'react-admin';

import { Box, Button, Theme, useMediaQuery } from '@mui/material';
import TopToolbar from '../../_components/CustomToptoolBar';
import { useCan } from '../../rbac-manager/useCan';

interface ConferenceListActionsProps {
  setIsCreating?: (value: boolean) => void;
  isCreating?: boolean;
  filterLiveSearch?: boolean;
  selectColumnsButton?: boolean;
  exportButton?: boolean;
  createButtonLabel?: string;
  filterLiveSearchLabel?: string;
}
const ConferenceListActions = ({
  isCreating,
  setIsCreating = () => {},
  filterLiveSearch = false,
  selectColumnsButton = true,
  exportButton = true,
  createButtonLabel = 'Add New',
  filterLiveSearchLabel = 'Search',
}: ConferenceListActionsProps) => {
  const total = useListContext().total;
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
  const resource = useResourceContext();
  const { canOnResource } = useCan();
  const canCreate = canOnResource('create', resource ?? '');
  return (
    <TopToolbar sx={{ flexGrow: 1, px: 2 }}>
      {filterLiveSearch && <FilterLiveSearch label={filterLiveSearchLabel} />}
      {total > 0 && (
        <Box
          sx={{ fontSize: isSmall ? 8 : 18, fontWeight: 'bold', ml: 'auto' }}
        >{`${total} Records`}</Box>
      )}
      {selectColumnsButton && !isSmall && <SelectColumnsButton />}
      {exportButton && <ExportButton />}
      {typeof isCreating !== 'undefined' && canCreate && (
        <Button
          onClick={() =>
            isCreating ? setIsCreating(false) : setIsCreating(true)
          }
        >
          {' '}
          {createButtonLabel}
        </Button>
      )}
    </TopToolbar>
  );
};

export default ConferenceListActions;
