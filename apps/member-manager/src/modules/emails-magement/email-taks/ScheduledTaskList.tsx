import React from 'react';
import {
  FunctionField,
  List,
  ListView,
  RaRecord,
  TextField,
  CloneButton,
} from 'react-admin';
import { DatagridConfigurable } from '@orwa/entity-id';
import { useTheme } from '@mui/material/styles';
import { emailDatagridStyle } from '../emailDatagridStyle';
import { useEditRowClick } from '../../rbac-manager/useCan';

/** The scheduled-tasks grid — shared by the framework panel and the resource list. */
export const ScheduledTasksGrid = () => {
  const theme = useTheme();
  // Rendered outside a resource route, so name the api explicitly.
  const rowClick = useEditRowClick('scheduled-email-task');

  return (
      <DatagridConfigurable
        bulkActionButtons={false}
        rowClick={rowClick}
        sx={emailDatagridStyle(theme)}
      >
        <TextField source="name" />
        <FunctionField
          label="Last Sent"
          render={(record: RaRecord) => {
            if (!record.last_sent) return 'N/A';

            const date = new Date(record.last_sent);
            return date.toLocaleString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true,
            });
          }}
          noWrap
        />
        {/* IS Active green check else red x */}
        <FunctionField
          label="Active"
          render={(record: RaRecord) => (record.active ? '✅' : '❌')}
          noWrap
        />
        <FunctionField
          label="Duplicate"
          render={(record: RaRecord) => (
            <CloneButton label="" size="small" record={record} />
          )}
          noWrap
        />
      </DatagridConfigurable>
  );
};

/** Framework tab panel — renders inside the tab's ListScope. */
const ScheduledTaskList = () => (
  <ListView actions={false} title=" ">
    <ScheduledTasksGrid />
  </ListView>
);

export default ScheduledTaskList;

/** Standalone `/scheduled-email-tasks` resource list. */
export const ScheduledTasksStandaloneList = () => (
  <List
    disableSyncWithLocation
    title=" "
    resource="scheduled-email-tasks"
    actions={false}
    exporter={false}
  >
    <ScheduledTasksGrid />
  </List>
);
