import { Box, Theme, useMediaQuery } from '@mui/material';
import React from 'react';
import {
  ListView,
  TextField,
  BooleanField,
  DateField,
  Pagination,
  ReferenceField,
  FunctionField,
  RaRecord,
} from 'react-admin';
import { DatagridConfigurable } from '@orwa/entity-id';
import TrainingClassActionsButton from './components/EventListActionsPopUp';
import EventCardGird from './components/EventListCardGridMobile';
import TrainingStatusChip from '../_components/TrainingStatusChip';

export const TRAINING_EVENTS_PREFERENCE_KEY = 'training-events.datagrid';

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

/** Body of the `training.events` page — renders inside the page's ListScope. */
const TrainingEventList = () => {
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
        <EventCardGird />
      ) : (
        <DatagridConfigurable
          bulkActionButtons={false}
          sx={datagridSx}
          omit={[
            'audience',
            'location',
            'address.street',
            'address.city',
            'address.state',
            'address.zip',
            'phone',
            'deq_exam',
            'exam_datetime',
          ]}
        >
          <FunctionField
            label="Actions"
            render={() => <TrainingClassActionsButton />}
          />
          <FunctionField
            source="status"
            label="Status"
            render={(record: RaRecord) => (
              <TrainingStatusChip status={record.status} />
            )}
          />
          <TextField source="training_type" label="Training Type" noWrap />
          <DateField source="start" label="Start" noWrap />
          <DateField source="end" label="End" noWrap />
          <TextField source="deq_class_number" label="DEQ Class #" noWrap />
          <ReferenceField
            reference="training-instructors"
            source="instructor"
            label="Instructor"
            link={false}
          >
            <ReferenceField
              reference="contacts"
              source="instructor"
              link={false}
            >
              <Box sx={{ display: 'flex' }}>
                <TextField source="first" noWrap />
                <TextField source="last" ml={1} noWrap />
              </Box>
            </ReferenceField>
          </ReferenceField>
          <TextField source="hours" label="Hours" noWrap />
          <ReferenceField
            reference="programs"
            source="program_billed"
            label="Program Billed"
            link={false}
          >
            <TextField source="name" noWrap />
          </ReferenceField>
          <TextField source="audience" label="Audience" noWrap />
          <TextField source="location" label="Location Code" noWrap />
          <TextField source="address.street" label="Street" noWrap />
          <TextField source="address.city" label="City" noWrap />
          <TextField source="address.state" label="State" noWrap />
          <TextField source="address.zip" label="Zip" noWrap />
          <TextField source="phone" label="Phone" noWrap />
          <BooleanField source="deq_exam" label="DEQ Exam" noWrap />
          <DateField source="exam_datetime" label="Exam Date" noWrap />
        </DatagridConfigurable>
      )}
    </ListView>
  );
};

export default TrainingEventList;
