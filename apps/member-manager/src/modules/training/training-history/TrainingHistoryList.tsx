import { Box, Theme, useMediaQuery } from '@mui/material';
import {
  ListView,
  TextField,
  SimpleList,
  ReferenceField,
  Pagination,
  RaRecord,
  DateField,
  FunctionField,
} from 'react-admin';
import { DatagridConfigurable } from '@orwa/entity-id';
import React from 'react';
import { YearMonthDayMinute } from '../../../helpers/Data';

export const TRAINING_HISTORY_PREFERENCE_KEY = 'training-event-logs.datagrid';

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

/** Credit hours: stored value first, legacy type-based fallback second. */
const creditHours = (record: RaRecord) =>
  record.hours ?? (record.type === 'Block' ? 4 : 1);

/** Body of the `training.history` page — renders inside the page's ListScope. */
const TrainingHistoryList = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

  return (
    <ListView
      title=" "
      actions={false}
      pagination={
        <Box sx={{ maxWidth: '32vw', position: 'sticky', left: 0 }}>
          <Pagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            sx={{ flexDirection: 'row-reverse' }}
          />
        </Box>
      }
      sx={{
        '& .RaList-main': { marginTop: 0 },
        '& .RaList-content': { boxShadow: 'none' },
      }}
    >
      {isSmall ? (
        <SimpleList
          linkType="show"
          primaryText={
            <ReferenceField
              source="contact"
              label="Name"
              reference="contacts"
              link={false}
            >
              <TextField source="first" /> <TextField source="last" />
            </ReferenceField>
          }
          secondaryText={(record) =>
            `${record.type} · ${creditHours(record)} hrs`
          }
          tertiaryText={(record) =>
            new Date(record.createdAt).toLocaleDateString(
              'en-US',
              YearMonthDayMinute
            )
          }
        />
      ) : (
        <DatagridConfigurable
          bulkActionButtons={false}
          rowClick="show"
          sx={datagridSx}
        >
          <ReferenceField
            source="contact"
            label="Name"
            reference="contacts"
            link="show"
          >
            <>
              <TextField source="first" /> <TextField source="last" />
            </>
          </ReferenceField>
          <ReferenceField
            source="event"
            label="Event"
            reference="training-events"
            link="show"
          >
            <TextField source="training_type" />
          </ReferenceField>
          <DateField source="createdAt" label="Checked In" showTime noWrap />
          <TextField source="type" label="Type" noWrap />
          <ReferenceField
            source="block"
            label="Block"
            reference="training-schedule-blocks"
            link={false}
          >
            <TextField source="id" />
          </ReferenceField>
          <ReferenceField
            source="session"
            label="Session"
            reference="training-sessions"
            link={false}
          >
            <TextField source="id" />
          </ReferenceField>
          <FunctionField render={creditHours} label="Hours" />
        </DatagridConfigurable>
      )}
    </ListView>
  );
};

export default TrainingHistoryList;
