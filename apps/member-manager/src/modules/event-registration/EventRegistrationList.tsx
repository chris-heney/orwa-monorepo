import { Box, useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';
import CustomExportFunction from '../../helpers/custom-export-function';
import React from 'react';
import {
  List,
  TextField,
  SelectColumnsButton,
  ExportButton,
  ConfigurableDatagridColumn,
  useStore,
  SimpleList,
  useDataProvider,
  Title,
} from 'react-admin';
import { DatagridConfigurable } from "@orwa/entity-id";
import CreateButton from '../_components/CustomCreateButton';
import PageHeadingBar from '../_components/PageHeadingBar';
import { useEditRowClick } from '../rbac-manager/useCan';
import { useLocation } from 'react-router-dom';

const barButtonSx = {
  color: 'white',
  '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
};

const EventRegistrationList = () => {
  const rowClick = useEditRowClick();
  const preferenceKey = 'training-event-registrationss.datagrid';
  const [availableColumns] = useStore<ConfigurableDatagridColumn[]>(
    `preferences.${preferenceKey}.availableColumns`,
    []
  );

  const [columnIds] = useStore<string[]>(
    `preferences.${preferenceKey}.columns`,
    []
  );

  const dataProvider = useDataProvider();
  const exporter = (records: ConfigurableDatagridColumn[]) => {
    CustomExportFunction(
      records,
      availableColumns,
      columnIds,
      'Class Roster',
      dataProvider
    );
  };

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const filterParam = searchParams.get('filter');
  let eventId;
  if (filterParam) {
    const filterObject = JSON.parse(decodeURIComponent(filterParam));
    eventId = filterObject.event;
  }

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
  return (
    <Box sx={{ width: 1, minWidth: 0, boxSizing: 'border-box' }}>
      <Title title="Class Rosters" />
      <List
        hasCreate
        exporter={exporter}
        actions={false}
        title=" "
        resource="training-event-registrationss"
        sx={{
          '& .RaList-main': { marginTop: 0 },
          '& .RaList-content': { boxShadow: 'none' },
        }}
      >
        <PageHeadingBar
          title="Class Rosters"
          actions={
            <>
              {!isSmall && (
                <Box sx={{ '& .MuiButton-root': barButtonSx }}>
                  <SelectColumnsButton />
                </Box>
              )}
              <ExportButton sx={barButtonSx} />
              <CreateButton
                label="Register Attendee"
                sx={barButtonSx}
                to={{
                  pathname: `/training-event-registrationss/create/${eventId}`,
                }}
              />
            </>
          }
        />
        {isSmall ? (
          <Box style={{ whiteSpace: 'nowrap' }}>
            <SimpleList
              primaryText={(record) => record.first + ' ' + record.last}
              secondaryText={(record) =>
                'Attendee ID: ' + record.attendee_id + ' | ' + record.email
              }
              tertiaryText={(record) => record.phone}
            />
          </Box>
        ) : (
          <DatagridConfigurable rowClick={rowClick}>
            <TextField source="event" label="Event" noWrap />
            <TextField source="first" label="First Name" noWrap />
            <TextField source="last" label="Last Name" noWrap />
            <TextField source="attendee_id" label="Attendee ID" noWrap />
            <TextField source="email" label="Email" noWrap />
            <TextField source="phone" label="Phone" noWrap />
          </DatagridConfigurable>
        )}
      </List>
    </Box>
  );
};
export default EventRegistrationList;
