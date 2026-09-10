import React, { useEffect } from 'react';
import { Box, Theme, useMediaQuery } from '@mui/material';
import {
  ListView,
  ReferenceField,
  SimpleList,
  TextField,
  useListContext,
} from 'react-admin';
import { useLocation } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import { DatagridConfigurable } from '@orwa/entity-id';
import { useEditRowClick } from '../../rbac-manager/useCan';

export const TRAINING_REGISTRATIONS_PREFERENCE_KEY =
  'training-event-registrations.datagrid';

const datagridSx = (theme: Theme) => ({
  '& .RaDatagrid-thead': { whiteSpace: 'nowrap' },
  'tr th': {
    py: 1,
    border: `1px solid ${theme.palette.divider}`,
    color: 'text.primary',
  },
  'tr td': {
    py: 0.5,
    border: `1px solid ${theme.palette.divider}`,
    color: 'text.primary',
  },
});

/**
 * The event roster tab links here with react-admin's legacy
 * `?filter={"training_event":…}` query. The framework list does not sync with
 * the location, so apply that deep link once as the list's filter values.
 */
const useDeepLinkFilter = () => {
  const { filterValues, displayedFilters, setFilters } = useListContext();
  const { search } = useLocation();
  useEffect(() => {
    const raw = new URLSearchParams(search).get('filter');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && !isEqual(parsed, filterValues)) {
        setFilters(parsed, displayedFilters, false);
      }
    } catch {
      /* malformed deep link — ignore */
    }
    // Only re-run when the URL changes; filterValues are read at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);
};

/** Body of the `training.registrations` page (Class Rosters) — inside its ListScope. */
const TrainingRegistrationsList = () => {
  const rowClick = useEditRowClick();
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
  useDeepLinkFilter();

  return (
    <ListView
      title=" "
      actions={false}
      sx={{
        '& .RaList-main': { marginTop: 0 },
        '& .RaList-content': { boxShadow: 'none' },
      }}
    >
      {isSmall ? (
        <Box style={{ whiteSpace: 'nowrap' }}>
          <SimpleList
            primaryText={(record) => `${record.first} ${record.last}`}
            secondaryText={(record) =>
              `Attendee ID: ${record.attendee_id ?? '—'} | ${record.email ?? ''}`
            }
            tertiaryText={(record) => record.phone}
          />
        </Box>
      ) : (
        <DatagridConfigurable rowClick={rowClick} sx={datagridSx}>
          <ReferenceField
            source="training_event"
            label="Event"
            reference="training-events"
            link="show"
          >
            <TextField source="training_type" noWrap />
          </ReferenceField>
          <TextField source="first" label="First Name" noWrap />
          <TextField source="last" label="Last Name" noWrap />
          <TextField source="attendee_id" label="Attendee ID" noWrap />
          <TextField source="email" label="Email" noWrap />
          <TextField source="phone" label="Phone" noWrap />
        </DatagridConfigurable>
      )}
    </ListView>
  );
};

export default TrainingRegistrationsList;
