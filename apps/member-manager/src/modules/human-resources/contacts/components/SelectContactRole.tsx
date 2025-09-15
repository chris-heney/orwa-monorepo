import React, { useEffect, useState } from "react";
import { useDataProvider, useNotify } from "react-admin";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useHumanResourcesContext } from "../../HumanResourcesContext";
import IContact from "../types/IContact";
import { useUserContext } from "../../../../context/UserContextProvider";

interface SelectContactRoleProps {
  contact: IContact
}

const SelectContactRole = ({ contact }: SelectContactRoleProps) => {
  const { roles } = useHumanResourcesContext();
  const { user } = useUserContext();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const [selectedRole, setSelectedRole] = useState<string>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (contact.user) {
          const { data } = await dataProvider.getOne("users", {
            id: contact.user,
          });
          setSelectedRole(data.role.id);
        }
      } catch (error) {
        notify("Error fetching user", { type: "error" });
      }
    };
    fetchUser();
  }, []);

  const handleRoleChange = async (event: SelectChangeEvent<string>) => {
    const roleId = event.target.value
    try {
      const updatedUser = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/users/${contact.user}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          role: roleId,
        }),
      });

      if (!updatedUser.ok) {
        const errorData = await updatedUser.json();
        throw new Error(errorData?.error?.message || "Unknown error occurred");
      }

      setSelectedRole(roleId as string);
      notify(`Updated role for ${contact.email} successfully`, { type: 'success' });
    } catch (error: any) {
      notify(`Error updating role: ${error.message}`, { type: 'error' });
    }
  };

  return !selectedRole ? (
    <>Loading</>
  ) : (
    <Select
    fullWidth
      sx={{
        textAlign: "center",
        mr: 2,
        
        "& .css-6hp17o-MuiList-root-MuiMenu-list": {
          paddingTop: 0,
          paddingBottom: 0,
        },
      }}
      MenuProps={{
        MenuListProps: {
          disablePadding: true,
        },
      }}
      SelectDisplayProps={{
        style: {
          padding: 2,
          paddingLeft: 10,
          paddingRight: 20,
        },
      }}
      value={selectedRole}
      onChange={(e) => handleRoleChange(e)}
    >
      {roles.map((role) => (
        <MenuItem key={role.id} value={role.id.toString()}>
          {role.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default SelectContactRole;