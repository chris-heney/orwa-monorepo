import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import {
  List,
  ListView,
  RaRecord,
  TextField,
  FunctionField,
  ReferenceField,
} from 'react-admin';
import { DatagridConfigurable } from '@orwa/entity-id';
import { emailDatagridStyle } from '../emailDatagridStyle';

/** The email-logs grid — shared by the framework panel and the task show page. */
export const EmailLogsGrid = () => {
  const theme = useTheme();
  return (
    <DatagridConfigurable
      bulkActionButtons={false}
      expandSingle={true}
      isRowExpandable={() => true}
      isRowSelectable={() => false}
      rowClick="expand"
      sx={emailDatagridStyle(theme)}
      expand={(record: RaRecord) => (
        <Box
          sx={{
            p: 2,
            bgcolor: '#ffffff',
            color: '#222222',
            borderRadius: 1,
            overflow: 'auto',
          }}
          dangerouslySetInnerHTML={{ __html: record.record.html || '' }}
        />
      )}
    >
      <TextField source="to" label="To" />
      <FunctionField
        label="Sent At"
        render={(record: RaRecord) =>
          record.createdAt ? new Date(record.createdAt).toLocaleString() : 'N/A'
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
  );
};

/** Framework tab panel — renders inside the tab's ListScope. */
export const EmailLogsPanel = () => (
  <ListView actions={false} title=" ">
    <EmailLogsGrid />
  </ListView>
);

export default EmailLogsPanel;

/** Standalone logs for one template (ShowEmailTask). */
const EmailLogsList = ({ template }: { template?: number }) => (
  <Box>
    <List
      filter={template ? { template } : undefined}
      exporter={false}
      disableSyncWithLocation
      title=" "
      resource="email-logs"
      actions={false}
    >
      <EmailLogsGrid />
    </List>
  </Box>
);

export { EmailLogsList };
