import React from "react";
import {
  List,
  TextField,
  DatagridConfigurable,
  SimpleList,
  FunctionField,
  EditButton,
  DateField,
} from "react-admin";
import { Box, useMediaQuery } from "@mui/material";
import { Theme } from "@mui/material/styles";
import CreateUserModal from "../users/CreateUserModal";
import { customDatagridStyle } from "../../../css";
import useCurrentUser from "../../_helpers/useCurrentUser";
import { useHumanResourcesContext } from "../HumanResourcesContext";
import RolesContextProvider from "../../../context/RolesContextProvider";

interface ContactListProps {
  title?: string;
}

const ContactList = ({ title = "Contacts" }: ContactListProps) => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
  const { role } = useCurrentUser();
  const { contactFilters } = useHumanResourcesContext();
    
  return (
    <List
      disableSyncWithLocation
      title={title}
      resource="contacts"
      actions={false}
      filter={contactFilters || {}}
      sx={{
        '& .RaList-noActions': {
          mt: '0',
        },
      }}
    >
      {isSmall ? (
        <Box style={{ whiteSpace: "nowrap" }}>
          <SimpleList
            linkType="show"
            primaryText={(record) => record.title}
            secondaryText={(record) => record.email}
            tertiaryText={(record) => record.phone}
          />
        </Box>
      ) : (
        <DatagridConfigurable
          sx={customDatagridStyle}
          bulkActionButtons={false}
          rowClick={role === "Admin" ? false : "show"}
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
          {/* <FunctionField
            label="Role"
            noWrap
            render={(record: any) => typeof record.user === "number" ? <SelectContactRole contact={record}/> : <CreateUserModal contact={record}/>}
          /> */}
          {role === "Admin" && <FunctionField
            label="Actions"
            render={(record: any) => {
              return (
                <Box sx={{display: "flex",justifyContent: "flex-end"}}>
                  {typeof record.user !== "number" && 
                  <RolesContextProvider>
                    <CreateUserModal contact={record} />
                  </RolesContextProvider>
                  }
                  <EditButton  sx={{ minWidth: 0, justifyContent: "flex-end"}} fullWidth label="" record={record} />
                </Box>
              );
            }}
          />}
        </DatagridConfigurable>
      )}
    </List>
  );
};

export default ContactList;
