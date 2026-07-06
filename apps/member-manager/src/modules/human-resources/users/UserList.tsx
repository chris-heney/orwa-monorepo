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
import { customDatagridStyle } from "../../../css";
import { IUser } from "./types";
import SendResetPasswordButton from "../_components/SendResetPasswordButton";
import EditUserModal from "./EditUserModal";
import { useHumanResourcesContext } from "../HumanResourcesContext";

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
          boxShadow: "0 1px 5px 0 rgba(0,0,0,0.2)",
          borderRadius: "4px",
          overflow: "hidden",
          "tr th": {
            py: 1,
            border: "1px solid #ccc",
          },
          "tr td": {
            py: 0,
            border: "1px solid #ccc",
          }
        }}
      >
        <TableHead
          sx={{
            fontWeight: "bold",
            fontSize: "1.1em",
            boxShadow: "0 1px 5px 0 rgba(0,0,0,0.2)",
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
            <TableRow key={user.id} sx={{ borderBottom: "1px solid #ccc", bgcolor: i % 2 === 0 ? "#eeeeee": null }}>
              <TableCell align="left">{user.id}</TableCell>
              <TableCell align="left">{user.username || "N/A"}</TableCell>
              <TableCell align="left">
                {user.confirmed ? "Confirmed" : "Unconfirmed"}
              </TableCell>
              <TableCell align="left">{user.role.name}</TableCell>
              <TableCell align="left">{user.email}</TableCell>
              <TableCell align="left">
                <Box display="flex" gap={1}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => handleEdit(user)}>
                      <EditIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                  <SendResetPasswordButton isSmall email={user.email} />
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
    </Box>
  );
};

export default UserList;
