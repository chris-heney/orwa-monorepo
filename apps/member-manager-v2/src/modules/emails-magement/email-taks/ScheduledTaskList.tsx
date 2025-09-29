import React from "react";
import {
  DatagridConfigurable,
  FunctionField,
  List,
  RaRecord,
  TextField,
  CloneButton,
} from "react-admin";
import { customDatagridStyle } from "../../../css";
import { useEmailManagementContext } from "../EmailManagementContextProvider";

const ScheduledTaskList = () => {

  const { emailTaskFilters } = useEmailManagementContext();
  
  return (
    <List
      disableSyncWithLocation
      title={" "}
      resource="scheduled-email-tasks"
      actions={false}
      exporter={false}
      filter={emailTaskFilters}
    >
      <DatagridConfigurable
        bulkActionButtons={false}
        rowClick="edit"
        sx={{ ...customDatagridStyle }}
      >
        <TextField source="name" />
        <FunctionField
          label="Last Sent"
          render={(record: RaRecord) => {
            if (!record.last_sent) return "N/A";

            const date = new Date(record.last_sent);
            return date.toLocaleString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            });
          }}
          noWrap
        />
        {/* IS Active green check else red x */}
        <FunctionField
          label="Active"
          render={(record: RaRecord) => {
            return record.active ? "✅" : "❌";
          }}
          noWrap
        />
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

export default ScheduledTaskList;
