import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  IconButton,
  Tooltip,
  TableSortLabel,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { Loading, useDataProvider, useNotify } from "react-admin";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { customDatagridStyle } from "../../../css";
import { IUser } from "./types";
import SendResetPasswordButton from "../_components/SendResetPasswordButton";
import EditUserModal from "./EditUserModal";
import { useHumanResourcesContext } from "../HumanResourcesContext";
import CookieStore from "../../../helpers/ra-strapi-data-provider/src/CookieStore";
import { userPreferencesStore } from "../../../helpers/userPreferencesStore";
import {
  startImpersonation,
  isImpersonating,
} from "../../../helpers/impersonation";
import { getDisplayEntityId } from "../../../helpers/strapiIds";

const UserList: React.FC = () => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const { userFilters, userListVersion } = useHumanResourcesContext();

  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]); // Users matching the search criteria
  const [users, setUsers] = useState<IUser[]>([]); // Holds the current page users
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [sortField, setSortField] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<IUser | null>(
    null
  );
  const [editUser, setEditUser] = useState<IUser | null>(null);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [impersonateUser, setImpersonateUser] = useState<IUser | null>(null);
  const [impersonating, setImpersonating] = useState<boolean>(false);

  // Fetch all users on initial load
  useEffect(() => {
    setLoading(true);
    dataProvider
      .getList<IUser>("users", {
        pagination: { page: 1, perPage: 1000 }, // Fetch a large number of users
        sort: { field: sortField, order: sortOrder },
        meta: { raw: true, populate: true },
        filter: userFilters || {},
      })
      .then(({ data }) => {
        setFilteredUsers(data); // Initialize filtered users
        setLoading(false);
      })
      .catch(() => {
        setFilteredUsers([]);
        setLoading(false);
      });
  }, [dataProvider, sortField, sortOrder, userFilters, userListVersion]);

  // Update displayed users based on pagination and search filter
  useEffect(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    setUsers(filteredUsers.slice(start, end));
  }, [page, rowsPerPage, filteredUsers]);

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  const handleSort = (field: string) => {
    const isAsc = sortField === field && sortOrder === "ASC";
    setSortOrder(isAsc ? "DESC" : "ASC");
    setSortField(field);
  };

  const handleEdit = (user: IUser) => {
    openEditModal(user);
  };

  const handleDeleteConfirm = () => {
    if (confirmDeleteUser) {
      dataProvider
        .delete("users", { id: confirmDeleteUser.id })
        .then(() => {
          setConfirmDeleteUser(null); // Close confirmation dialog
          notify(`User "${confirmDeleteUser.username}" deleted successfully`, {
            type: "success",
          });
        })
        .catch((error) => {
          notify(`Error: ${error.message}`, { type: "error" });
        });
    }
  };

  const handleDeleteClick = (user: IUser) => {
    setConfirmDeleteUser(user);
  };

  const handleCloseDeleteDialog = () => {
    setConfirmDeleteUser(null);
  };

  const openEditModal = (user: IUser) => {
    setEditUser(user);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditUser(null);
    setEditModalOpen(false);
  };

  const handleUserUpdated = (updatedUser: IUser) => {
    setFilteredUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  const confirmImpersonate = async () => {
    if (!impersonateUser) return;
    setImpersonating(true);
    try {
      const token = CookieStore.getCookie("token");
      if (!token) {
        throw new Error("Your session has expired. Please log in again.");
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/impersonation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: impersonateUser.id }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(
          errorData?.error?.message || "Could not start impersonation"
        );
      }

      const data = await res.json();

      // Persist the Admin's own pending view settings to the Admin account
      // BEFORE swapping the session (writes are suppressed once impersonating).
      await userPreferencesStore.flush();

      startImpersonation(data);

      // Hard reload as the target so every provider re-reads the new token.
      window.location.hash = "#/human-resources/dashboard";
      window.location.reload();
    } catch (error: any) {
      notify(`Error: ${error.message}`, { type: "error" });
      setImpersonating(false);
      setImpersonateUser(null);
    }
  };

  const rowSx = {
    textAlign: "left",
    textWrap: "nowrap",
  };

  return (
    <Box>
      <Table
        sx={{
          ...customDatagridStyle,
          borderCollapse: "collapse",
          width: "100%",
          boxShadow: 1,
          borderRadius: "4px",
          overflow: "hidden",
          "tr th": {
            py: 1,
            border: "1px solid",
            borderColor: "divider",
          },
          "tr td": {
            py: 0,
            border: "1px solid",
            borderColor: "divider",
          }
        }}
      >
        <TableHead
          sx={{
            fontWeight: "bold",
            fontSize: "1.1em",
            boxShadow: 1,
          }}
        >
          <TableRow>
            <TableCell sx={rowSx}>
              <TableSortLabel
                active={sortField === "id"}
                direction={
                  sortField === "id"
                    ? (sortOrder.toLowerCase() as "asc" | "desc")
                    : "asc"
                }
                onClick={() => handleSort("id")}
              >
                ID
              </TableSortLabel>
            </TableCell>
            <TableCell sx={rowSx}>
              <TableSortLabel
                active={sortField === "username"}
                direction={
                  sortField === "username"
                    ? (sortOrder.toLowerCase() as "asc" | "desc")
                    : "asc"
                }
                onClick={() => handleSort("username")}
              >
                Username
              </TableSortLabel>
            </TableCell>
            <TableCell sx={rowSx}>
              <TableSortLabel
                active={sortField === "confirmed"}
                direction={
                  sortField === "confirmed"
                    ? (sortOrder.toLowerCase() as "asc" | "desc")
                    : "asc"
                }
                onClick={() => handleSort("confirmed")}
              >
                Status
              </TableSortLabel>
            </TableCell>
            <TableCell sx={rowSx}>
              <TableSortLabel
                active={sortField === "role.name"}
                direction={
                  sortField === "role.name"
                    ? (sortOrder.toLowerCase() as "asc" | "desc")
                    : "asc"
                }
                onClick={() => handleSort("role.name")}
              >
                Role
              </TableSortLabel>
            </TableCell>
            <TableCell sx={rowSx}>
              <TableSortLabel
                active={sortField === "email"}
                direction={
                  sortField === "email"
                    ? (sortOrder.toLowerCase() as "asc" | "desc")
                    : "asc"
                }
                onClick={() => handleSort("email")}
              >
                Email
              </TableSortLabel>
            </TableCell>
            <TableCell sx={rowSx}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user: IUser, i) => (
            <TableRow
              key={user.id}
              sx={{
                borderBottom: "1px solid",
                borderColor: "divider",
                bgcolor: i % 2 === 0 ? "action.hover" : "transparent",
              }}
            >
              <TableCell align="left">
                {getDisplayEntityId(user) ?? user.id}
              </TableCell>
              <TableCell align="left">{user.username || "N/A"}</TableCell>
              <TableCell align="left">
                {user.confirmed ? "Confirmed" : "Unconfirmed"}
              </TableCell>
              <TableCell align="left">{user.role?.name || "—"}</TableCell>
              <TableCell align="left">{user.email}</TableCell>
              <TableCell align="left">
                <Box display="flex" gap={1}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => handleEdit(user)}>
                      <EditIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                  <SendResetPasswordButton isSmall email={user.email} />
                  <Tooltip
                    title={
                      isImpersonating()
                        ? "Exit your current impersonation session before starting another — jumping straight to a new user loses your way back to your real Admin session."
                        : "Test as this user (impersonate)"
                    }
                  >
                    <span>
                      <IconButton
                        size="small"
                        disabled={isImpersonating()}
                        onClick={() => setImpersonateUser(user)}
                      >
                        <PersonSearchIcon color="warning" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton  size="small" onClick={() => handleDeleteClick(user)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
          {loading && <Loading />}
          {users.length === 0 && !loading && (
            <TableRow>
              <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                No Users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={filteredUsers.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog
        open={Boolean(confirmDeleteUser)}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the user &quot;
            {confirmDeleteUser?.username}&quot;?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleCloseDeleteDialog}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDeleteConfirm}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <EditUserModal
        user={editUser}
        open={editModalOpen}
        onClose={closeEditModal}
        onUserUpdated={handleUserUpdated}
      />
      <Dialog
        open={Boolean(impersonateUser)}
        onClose={() => !impersonating && setImpersonateUser(null)}
      >
        <DialogTitle>Test as this user?</DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            You&apos;ll browse the app as{" "}
            <strong>{impersonateUser?.email}</strong>
            {impersonateUser?.role?.name
              ? ` (${impersonateUser.role.name})`
              : ""}
            , seeing exactly what they see — their role, data, and saved view
            settings.
            <Box component="ul" sx={{ mt: 1, mb: 0, pl: 3 }}>
              <li>Their saved view settings will not be overwritten.</li>
              <li>
                Any records you create or change are attributed to them, and
                this action is logged.
              </li>
              <li>
                Exit anytime from the orange banner to return to your Admin
                session.
              </li>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="inherit"
            disabled={impersonating}
            onClick={() => setImpersonateUser(null)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="warning"
            disabled={impersonating}
            onClick={confirmImpersonate}
          >
            {impersonating ? "Starting…" : "Test as user"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserList;
