import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import { useDataProvider, useNotify } from "react-admin";
import IContact from "../contacts/types/IContact";
import CustomSecondaryHeader from "../../_components/CustomSecondaryHeader";
import { Add } from "@mui/icons-material";
import { useRolesContext } from "../../../context/RolesContextProvider";
import { useGetIdentity } from "../../../helpers/useGetIdentity";
import { useHumanResourcesContext } from "../HumanResourcesContext";

const CreateUserModal = ({
  contact,
  isSmall,
}: {
  contact?: IContact;
  isSmall?: boolean;
}) => {
  const dataProvider = useDataProvider();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: contact?.email || "",
    email: contact?.email || "",
    password: "",
    role: "",
  });
  const notify = useNotify();
  const { roles } = useRolesContext();
  const identity = useGetIdentity();
  const { refreshUserList } = useHumanResourcesContext();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "",
    });
  }

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async () => {
    setLoading(true);
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.role
    ) {
      notify("Please fill all fields*", { type: "warning" });
      setLoading(false);
      return;
    }

    try {
      if (!identity?.token) {
        throw new Error("Your session has expired. Please log in again.");
      }

      // Create the user
      const userResponse = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${identity.token}`,
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            confirmed: true,
          }),
        }
      );

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData?.error?.message || "Unknown error occurred");
      }

      if (!contact) {
        setOpen(false);
        refreshUserList();
        return notify("User created successfully", { type: "success" });
      }

      const createdUser = await userResponse.json();

      await dataProvider.update("contacts", {
        id: contact?.id,
        data: { user: createdUser.id },
        previousData: contact,
      });

      notify(`User created and attached to contact successfully`, {
        type: "success",
      });
      refreshUserList();
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "",
      });
      handleClose(); 
    } catch (error: any) {
      notify(`Error: ${error.message}`, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {isSmall ? (
        <IconButton size="small" sx={{ color: "white" }} onClick={handleOpen}>
          <Add fontSize="small" />
        </IconButton>
      ) : (
        <IconButton
          size="small"
          color="primary"
          onClick={handleOpen}
        >
         <Add  fontSize="small" />
        </IconButton>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <CustomSecondaryHeader
          title={
            contact
              ? `Create User ${contact?.email}`
              : "Create User"
          }
        />
        <DialogContent>
          <Box
            component="form"
            autoComplete="off"
            sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Username"
              name="username"
              autoComplete="new-username"
              value={formData.username}
              onChange={handleInputChange}
              required
              fullWidth
              helperText="This will be the user's login username"
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              autoComplete="new-email"
              value={formData.email}
              onChange={handleInputChange}
              required
              fullWidth
              helperText="This will be the user's email"
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleClose}
            sx={{
              backgroundColor: "gray",
              color: "white",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateUser}
            color="primary"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Create User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateUserModal;
