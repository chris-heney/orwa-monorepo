import { Box, Theme, useMediaQuery } from '@mui/material';
import {
  List,
  TextField,
  SimpleList,
  DatagridConfigurable,
  ConfigurableDatagridColumn,
  useStore,
  ReferenceField,
  Pagination,
  RaRecord,
  DateField,
  FunctionField,
  ExportButton,
  SelectColumnsButton,
  Title,
  useDataProvider,
} from 'react-admin';
import CreateButton from '../../_components/CustomCreateButton';
import React from 'react';
import CustomExportFunction from '../../../helpers/custom-export-function';
import PageHeadingBar from '../../_components/PageHeadingBar';
import { YearMonthDayMinute } from '../../../helpers/Data';

const barButtonSx = {
  color: 'white',
  '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
};

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

const TrainingHistoryList = () => {
  const preferenceKey = 'training-event-logs.datagrid';
  const [availableColumns] = useStore<ConfigurableDatagridColumn[]>(
    `preferences.${preferenceKey}.availableColumns`,
    []
  );
  const [columnIds] = useStore<string[]>(
    `preferences.${preferenceKey}.columns`,
    []
  );
  const dataProvider = useDataProvider();
  const exporter = (records: RaRecord[]) => {
    CustomExportFunction(
      records,
      availableColumns,
      columnIds,
      'Training History',
      dataProvider
    );
  };
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        width: 1,
        minWidth: 0,
        boxSizing: 'border-box',
      }}
    >
      <Title title="Training History" />
      <List
        exporter={exporter}
        title=" "
        actions={false}
        sort={{ field: 'createdAt', order: 'DESC' }}
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
        <PageHeadingBar
          title="Training History"
          info="Attendance and credit-hour records from event check-ins."
          actions={
            <>
              <CreateButton label="New Record" sx={barButtonSx} />
              {!isSmall && (
                <Box sx={{ '& .MuiButton-root': barButtonSx }}>
                  <SelectColumnsButton />
                </Box>
              )}
              <ExportButton sx={barButtonSx} />
            </>
          }
        />
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
      </List>
    </Box>
  );
};

export default TrainingHistoryList;
