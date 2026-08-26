import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
  } from "@mui/material";
  import { useTheme } from "@mui/material/styles";
  import React, { useState } from "react";
  import {
  List,
  RaRecord,
  TextField,
  FunctionField,
  ReferenceField,
} from "react-admin";
import { DatagridConfigurable } from "@orwa/entity-id";
import { useEmailManagementContext } from "../EmailManagementContextProvider";
import { emailDatagridStyle } from "../emailDatagridStyle";
  
  const EmailLogsList = ({template}: {template?: number}) => {

    const { emailLogFilters } = useEmailManagementContext();
    const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
    const theme = useTheme();
  
    return (
      <Box>
        <List filter={template ? {template: template} : emailLogFilters ? emailLogFilters : undefined} exporter={false} disableSyncWithLocation title=" " resource="email-logs">
        <DatagridConfigurable
          bulkActionButtons={false}
          expandSingle={true}
          isRowExpandable={() => true}
          isRowSelectable={() => false}
          rowClick="expand"
          sx={emailDatagridStyle(theme)}
          expand={(record: RaRecord) => {
            return (
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#ffffff",
                  color: "#222222",
                  borderRadius: 1,
                  overflow: "auto",
                }}
                dangerouslySetInnerHTML={{ __html: record.record.html || "" }}
              />
            );
         }}        
        >
            <TextField source="to" label="To" />
            <FunctionField
              label="Sent At"
              render={(record: RaRecord) =>
                record.createdAt
                  ? new Date(record.createdAt).toLocaleString()
                  : "N/A"
              }
            />
            <TextField source="from" label="From" />
            <ReferenceField
                source="template"
                reference="email-templates"
                label="Template"
                link={false}
            >
                <TextField source="email_name" />
            </ReferenceField>
          </DatagridConfigurable>
        </List>
  
        {/* Modal for Email Preview */}
        <Dialog open={!!selectedEmail} onClose={() => setSelectedEmail(null)}>
          <DialogTitle>Email Content</DialogTitle>
          <DialogContent>
            <Box
              sx={{ bgcolor: "#ffffff", color: "#222222", p: 1, borderRadius: 1 }}
              dangerouslySetInnerHTML={{ __html: selectedEmail || "" }}
            />
          </DialogContent>
        </Dialog>
      </Box>
    );
  };
  
  export default EmailLogsList;