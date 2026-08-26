import React from 'react';
import {
  CloneButton,
  FunctionField,
  List,
  RaRecord,
  TextField,
} from 'react-admin';
import { DatagridConfigurable } from "@orwa/entity-id";
import { useTheme } from '@mui/material/styles';
import { useEmailManagementContext } from '../EmailManagementContextProvider';
import { emailDatagridStyle } from '../emailDatagridStyle';
import { useEditRowClick } from '../../rbac-manager/useCan';

interface EmailInterfaceProps {
  module?: string;
}
const EmailInterface = ({ module }: EmailInterfaceProps) => {
  const { emailFilters } = useEmailManagementContext();
  const theme = useTheme();
  // Rendered outside a resource route, so name the api explicitly.
  const rowClick = useEditRowClick('email-template');

  return (
    <List
      hasCreate={false}
      disableSyncWithLocation
      filter={emailFilters ? emailFilters : module ? { module: module } : {}}
      title={' '}
      resource="email-templates"
      actions={false}
      exporter={false}
    >
      <DatagridConfigurable
        bulkActionButtons={false}
        rowClick={rowClick}
        sx={emailDatagridStyle(theme)}
      >
        <TextField source="email_name" />
        <TextField source="module" />
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

export default EmailInterface;
