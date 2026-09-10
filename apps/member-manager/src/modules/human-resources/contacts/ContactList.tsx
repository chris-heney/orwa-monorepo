import React from 'react';
import {
  DateField,
  EditButton,
  FunctionField,
  ListView,
  SimpleList,
  TextField,
} from 'react-admin';
import { DatagridConfigurable } from '@orwa/entity-id';
import { Box, useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';
import CreateUserModal from '../users/CreateUserModal';
import { customDatagridStyle } from '../../../css';
import { useCan } from '../../rbac-manager/useCan';
import RolesContextProvider from '../../../context/RolesContextProvider';

/** The contacts grid — reads the enclosing ListContext (framework ListScope). */
export const ContactsGrid = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
  const { can } = useCan();
  // Editors get the Actions column (edit + create-user) instead of rowClick.
  const canEditContacts = can('update', 'contact');

  if (isSmall) {
    return (
      <Box style={{ whiteSpace: 'nowrap' }}>
        <SimpleList
          linkType="show"
          primaryText={(record) => record.title}
          secondaryText={(record) => record.email}
          tertiaryText={(record) => record.phone}
        />
      </Box>
    );
  }

  const grid = (
    <DatagridConfigurable
      sx={customDatagridStyle}
      bulkActionButtons={false}
      rowClick={canEditContacts ? false : 'show'}
    >
      <TextField source="id" label="ID" />
      <TextField source="first" label="First Name" noWrap />
      <TextField source="last" label="Last Name" noWrap />
      <TextField source="email" label="Email" noWrap />
      <TextField source="phone" label="Phone" noWrap />
      <TextField source="title" label="Title" noWrap />
      <TextField source="contact_type" label="Type" noWrap />
      <TextField source="license" label="License" noWrap />
      <DateField source="createdAt" label="Created At" noWrap />
      {canEditContacts && (
        <FunctionField
          label="Actions"
          render={(record: any) => (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {typeof record.user !== 'number' && (
                <CreateUserModal contact={record} />
              )}
              <EditButton
                sx={{ minWidth: 0, justifyContent: 'flex-end' }}
                fullWidth
                label=""
                record={record}
              />
            </Box>
          )}
        />
      )}
    </DatagridConfigurable>
  );

  // One roles fetch for the whole grid (CreateUserModal's role select) instead
  // of one provider per row as before.
  return canEditContacts ? (
    <RolesContextProvider>{grid}</RolesContextProvider>
  ) : (
    grid
  );
};

/**
 * Framework body for `contacts.list`: renders inside the page's ListScope
 * (no second `<List>`); the table scrolls horizontally on its own so wide
 * columns never push the heading actions off-screen. `width: 0` +
 * `minWidth: 100%` keeps the nowrap table out of the content column's
 * intrinsic width (a flex item), so the bar stays inside the viewport and
 * under an open drawer's inset.
 */
const ContactsPanel = () => (
  <Box sx={{ overflowX: 'auto', width: 0, minWidth: '100%' }}>
    <ListView actions={false} title=" ">
      <ContactsGrid />
    </ListView>
  </Box>
);

export default ContactsPanel;
