import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { useNotify } from "react-admin";
import { IUser } from "./types";
import CustomSecondaryHeader from "../../_components/CustomSecondaryHeader";
import { useRolesContext } from "../../../context/RolesContextProvider";
import { useGetIdentity } from "../../../helpers/useGetIdentity";

interface EditUserModalProps {
  user: IUser | null;
  open: boolean;
  onClose: () => void;
  onUserUpdated: (updatedUser: IUser) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  open,
  onClose,
  onUserUpdated,
}) => {
  const { roles } = useRolesContext();

  const identity = useGetIdentity();

  const notify = useNotify();

  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "" as string | number,
  });

  useEffect(() => {
    if (user?.id == null) {
      return;
    }
    setFormData({
      username: user.username || "",
      email: user.email || "",
      role: user.role?.id ?? "",
    });
  }, [user]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name as string]: value }));
  };

  const handleUpdateUser = async () => {
    if (!formData.username || !formData.email || !formData.role) {
      notify("Please fill in all required fields", { type: "warning" });
      return;
    }

    setLoading(true);

    try {
      const userResponse = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/users/${user?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${identity?.token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData?.error?.message || "Unknown error occurred");
      }
      const createdUser = await userResponse.json();

      onUserUpdated(createdUser);

      notify(`User "${user?.username}" updated successfully`, {
        type: "success",
      });
      onClose();
    } catch (error: any) {
      notify(`Error: ${error.message}`, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (user?.id == null) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <CustomSecondaryHeader title={`User ${user.email}`}/>
      <DialogContent>
        <Box
          component="form"
          sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
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
          onClick={onClose}
          sx={{
            backgroundColor: "gray",
            color: "white",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpdateUser}
          color="primary"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Update User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserModal;
