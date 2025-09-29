import React, { useState } from "react";
import {
  List,
  DatagridConfigurable,
  TextField,
  DateField,
  useRedirect,
  useNotify,
  useDataProvider,
  RaRecord,
  FunctionField,
} from "react-admin";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

const FormLogsList = () => {
  const redirect = useRedirect();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const [selectedLog, setSelectedLog] = useState<null | RaRecord>(null);

  // Handle navigating to edit pages
  const handleNavigate = async (resource: string, id: string | undefined, data: any) => {
    if (!resource) {
      notify("Invalid resource type", { type: "error" });
      return;
    }

    if (id) {
      // If ID is available, redirect to the resource's edit page
      redirect(`/${resource}/${id}`);
    } else if (data) {
      // Search for a matching entity
      try {
        const { data: matchedEntities } = await dataProvider.getList(resource, {
          filter: { name: data.name, email: data.email },
          pagination: { page: 1, perPage: 1 },
          sort: { field: "id", order: "ASC" },
        });

        if (matchedEntities.length > 0) {
          const matchedId = matchedEntities[0].id;
          redirect(`/${resource}/${matchedId}`);
        } else {
          notify("No matching entity found", { type: "warning" });
        }
      } catch (error: any) {
        notify(`Error finding entity: ${error.message}`, { type: "error" });
      }
    } else {
      notify("No ID or matching data provided", { type: "error" });
    }
  };

  return (
    <List component="div" resource="logs" title="Logs" perPage={50} actions={false}>
      <DatagridConfigurable
        bulkActionButtons={false}
        rowClick="expand"
        isRowSelectable={() => false}
        expandSingle={true}
        expand={(record: RaRecord) => (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Form Payload</Typography>
            <pre style={{ overflowX: "auto", whiteSpace: "pre-wrap" }}>
              {JSON.stringify(record.record.data, null, 2)}
            </pre>
          </Box>
        )}
      >
        <TextField source="resource" label="Resource Type" />
        <DateField source="createdAt" label="Log Date" />
        <TextField source="data.name" label="Entity Name" emptyText="No Name" />
        <TextField source="data.email" label="Email" emptyText="No Email" />
        <FunctionField
          label="View"
          render={(record: any) => (
            <IconButton
              aria-label="view-details"
              onClick={() => setSelectedLog(record)}
            >
              <VisibilityIcon />
            </IconButton>
          )}
        />
        <FunctionField
          label="Edit"
          render={(record: any) => (
            <IconButton
              onClick={() => {
                const resource = record.resource;
                const id = record.data?.associate || record.data?.watersystem;
                handleNavigate(resource, id, record.data);
              }}
            >
              <EditIcon />
            </IconButton>
          )}
        />
      </DatagridConfigurable>

      {selectedLog && (
        <Dialog
          open={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Log Details</DialogTitle>
          <DialogContent>
            <pre style={{ overflowX: "auto", whiteSpace: "pre-wrap" }}>
              {JSON.stringify(selectedLog.data, null, 2)}
            </pre>
          </DialogContent>
        </Dialog>
      )}
    </List>
  );
};

export default FormLogsList;