import React from 'react';
import {
  FunctionField,
  List,
  RaRecord,
  TextField,
  CloneButton,
} from 'react-admin';
import { DatagridConfigurable } from "@orwa/entity-id";
import { useTheme } from '@mui/material/styles';
import { useEmailManagementContext } from '../EmailManagementContextProvider';
import { emailDatagridStyle } from '../emailDatagridStyle';
import { useEditRowClick } from '../../rbac-manager/useCan';

const ScheduledTaskList = () => {
  const { emailTaskFilters } = useEmailManagementContext();
  const theme = useTheme();
  // Rendered outside a resource route, so name the api explicitly.
  const rowClick = useEditRowClick('scheduled-email-task');

  return (
    <List
      disableSyncWithLocation
      title={' '}
      resource="scheduled-email-tasks"
      actions={false}
      exporter={false}
      filter={emailTaskFilters}
    >
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
          render={(record: RaRecord) => {
            return record.active ? '✅' : '❌';
          }}
          noWrap
        />
        <FunctionField
          label="Duplicate"
          render={(record: RaRecord) => {
            return <CloneButton label="" size="small" record={record} />;
          }}
          noWrap
        />
      </DatagridConfigurable>
    </List>
  );
};

export default ScheduledTaskList;
