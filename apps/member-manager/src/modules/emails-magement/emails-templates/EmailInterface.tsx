import React from 'react';
import {
  CloneButton,
  FunctionField,
  List,
  ListView,
  RaRecord,
  TextField,
} from 'react-admin';
import { DatagridConfigurable } from '@orwa/entity-id';
import { useTheme } from '@mui/material/styles';
import { emailDatagridStyle } from '../emailDatagridStyle';
import { useEditRowClick } from '../../rbac-manager/useCan';

/** The email-templates grid — shared by the framework panel and legacy embeds. */
export const EmailTemplatesGrid = () => {
  const theme = useTheme();
  // Rendered outside a resource route, so name the api explicitly.
  const rowClick = useEditRowClick('email-template');
  return (
    <DatagridConfigurable
      bulkActionButtons={false}
      rowClick={rowClick}
      sx={emailDatagridStyle(theme)}
    >
      <TextField source="email_name" />
      <TextField source="module" />
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

/** Framework tab panel: renders inside the tab's ListScope (no second List). */
export const EmailTemplatesPanel = () => (
  <ListView actions={false} title=" ">
    <EmailTemplatesGrid />
  </ListView>
);

export default EmailTemplatesPanel;

interface EmailInterfaceProps {
  module?: string;
}

/**
 * Standalone list of templates for one module — embedded in other modules'
 * Settings tabs (Grant / Memberships / Training / SoonerWARN).
 */
const EmailInterface = ({ module }: EmailInterfaceProps) => (
  <List
    hasCreate={false}
    disableSyncWithLocation
    filter={module ? { module } : {}}
    title={' '}
    resource="email-templates"
    actions={false}
    exporter={false}
  >
    <EmailTemplatesGrid />
  </List>
);

export { EmailInterface };
