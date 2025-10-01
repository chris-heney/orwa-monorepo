import React from "react";
import { CloneButton, DatagridConfigurable, FunctionField, List, RaRecord, TextField } from "react-admin";
import { useEmailManagementContext } from "../EmailManagementContextProvider";
import { customDatagridStyle } from "../../../css"; 

interface EmailInterfaceProps {
  module?: string;
}
const EmailInterface = ({ module }: EmailInterfaceProps) => {
  const { emailFilters } =
    useEmailManagementContext();

  return (
      <List
        disableSyncWithLocation
        filter={emailFilters ? emailFilters : module ? { module: module } : {}}
        title={" "}
        resource="email-templates"
        actions={false}
        exporter={false}
        sx={{
          '& .RaList-noActions': {
            mt: '0',
          },
        }}
      >
        <DatagridConfigurable
          bulkActionButtons={false}
          rowClick="edit"
          sx={{...customDatagridStyle}}
        >
          <TextField source="email_name" />
          <TextField source="module" />
          <FunctionField
          label="Duplicate"
          render={(record: RaRecord) => {
            return <CloneButton label="" size="small" record={record} />
          }}
          noWrap
        />
        </DatagridConfigurable>
      </List>
  );
};

export default EmailInterface;
