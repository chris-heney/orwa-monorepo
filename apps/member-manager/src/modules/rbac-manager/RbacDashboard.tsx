import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Title, useNotify } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import PageHeadingBar from '../_components/PageHeadingBar';
import {
  ALL_MODULE_KEYS,
  APP_MODULES,
  firstAllowedPath,
} from '../../config/modules';
import { deleteRole, getRoles, RoleSummary } from './api';
import RoleEditor from './RoleEditor';
import { useMeQuery } from './useModuleAccess';
import { previewModulesForRole, setRolePreview } from './rolePreview';

/** Built-in Strapi roles (plus admin) that must never be deleted. */
const PROTECTED_ROLE_TYPES = ['public', 'authenticated', 'admin'];

const barButtonSx = {
  color: 'white',
  '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
};

const roleTableSx = (theme: Theme) => ({
  borderCollapse: 'collapse',
  width: '100%',
  boxShadow: 1,
  borderRadius: '4px',
  overflow: 'hidden',
  'tr th': {
    py: 1,
    border: `1px solid ${theme.palette.divider}`,
    color: 'text.primary',
    whiteSpace: 'nowrap',
    fontWeight: 'bold',
  },
  'tr td': {
    py: 0.5,
    border: `1px solid ${theme.palette.divider}`,
    color: 'text.primary',
  },
});

const moduleLabel = (key: string) =>
  APP_MODULES.find((module) => module.key === key)?.label ?? key;

const ModulesCell = ({ role }: { role: RoleSummary }) => {
  const modules = role.modules ?? [];
  const hasAll =
    role.type === 'admin' ||
    ALL_MODULE_KEYS.every((key) => modules.includes(key));

  if (hasAll) {
    return <Chip label="All" size="small" color="primary" variant="outlined" />;
  }
  if (modules.length === 0) {
    return <>—</>;
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {modules.map((key) => (
        <Chip key={key} label={moduleLabel(key)} size="small" />
      ))}
    </Box>
  );
};

/**
 * RBAC Manager — list of users-permissions roles with module access and
 * per-endpoint API permissions. Conditionally renders the full-page
 * RoleEditor for create/edit (no extra router entries needed).
 */
const RbacDashboard = () => {
  const notify = useNotify();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: me } = useMeQuery();

  const [editorRole, setEditorRole] = useState<number | 'new' | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<RoleSummary | null>(null);
  const [confirmPreview, setConfirmPreview] = useState<RoleSummary | null>(
    null
  );

  const rolesQuery = useQuery<RoleSummary[], Error>('rbac-roles', getRoles);

  const realRole = me?.role;
  const isRealAdmin =
    !me?.impersonating &&
    realRole != null &&
    (realRole.type === 'admin' || realRole.name === 'Admin');

  const deleteMutation = useMutation<{ ok: boolean }, Error, RoleSummary>(
    (role) => deleteRole(role.id),
    {
      onSuccess: (_data, role) => {
        setConfirmDelete(null);
        notify(`Role "${role.name}" deleted`, { type: 'success' });
        queryClient.invalidateQueries('rbac-roles');
      },
      onError: (error) => {
        notify(`Error: ${error.message}`, { type: 'error' });
      },
    }
  );

  const closeEditor = (saved: boolean) => {
    setEditorRole(null);
    if (saved) {
      notify('Role saved', { type: 'success' });
      queryClient.invalidateQueries('rbac-roles');
    }
  };

  const startPreview = (role: RoleSummary) => {
    setRolePreview({ roleId: role.id, roleName: role.name });
    setConfirmPreview(null);
    queryClient.invalidateQueries(['auth', 'moduleAccess']);
    const modules = previewModulesForRole(role);
    navigate(firstAllowedPath(modules));
    notify(`Testing as ${role.name}`, { type: 'info' });
  };

  if (editorRole !== null) {
    return (
      <RoleEditor
        roleId={editorRole}
        onSaved={() => closeEditor(true)}
        onCancel={() => closeEditor(false)}
      />
    );
  }

  const roles = rolesQuery.data ?? [];

  return (
    <Box sx={{ width: 1, minWidth: 0, boxSizing: 'border-box', p: 2 }}>
      <Title title="RBAC Manager" />
      <PageHeadingBar
        title="RBAC Manager"
        info="Create roles, choose which modules each role can see in the admin, and grant per-endpoint API permissions. Module access is UX-only; the API permissions are enforced by the server. Use Test as role to preview UI and API grants."
        sx={{ top: { xs: 56, sm: 48 } }}
        actions={
          <>
            <Tooltip title="Refresh roles">
              <IconButton
                size="small"
                sx={barButtonSx}
                aria-label="Refresh roles"
                onClick={() => rolesQuery.refetch()}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              startIcon={<AddIcon />}
              sx={barButtonSx}
              onClick={() => setEditorRole('new')}
            >
              Create Role
            </Button>
          </>
        }
      />
      {rolesQuery.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {rolesQuery.error.message}
        </Alert>
      )}
      <Box
        sx={{ width: 0, minWidth: '100%', maxWidth: '100%', overflowX: 'auto' }}
      >
        <Table sx={roleTableSx}>
          <TableHead sx={{ boxShadow: 1 }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Users</TableCell>
              <TableCell>Modules</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rolesQuery.isLoading && (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            )}
            {roles.map((role, i) => {
              const isProtected = PROTECTED_ROLE_TYPES.includes(role.type);

              return (
                <TableRow
                  key={role.id}
                  sx={{ bgcolor: i % 2 === 0 ? 'action.hover' : 'transparent' }}
                >
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>{role.type}</TableCell>
                  <TableCell align="right">{role.nb_users ?? 0}</TableCell>
                  <TableCell>
                    <ModulesCell role={role} />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => setEditorRole(role.id)}
                        >
                          <EditIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                      {isRealAdmin && (
                        <Tooltip title="Test as this role">
                          <IconButton
                            size="small"
                            onClick={() => setConfirmPreview(role)}
                            aria-label={`Test as ${role.name}`}
                          >
                            <SupervisedUserCircleIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip
                        title={
                          isProtected
                            ? 'Built-in roles cannot be deleted'
                            : 'Delete'
                        }
                      >
                        <span>
                          <IconButton
                            size="small"
                            disabled={isProtected}
                            onClick={() => setConfirmDelete(role)}
                          >
                            <DeleteIcon
                              color={isProtected ? 'disabled' : 'error'}
                            />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
            {roles.length === 0 && !rolesQuery.isLoading && (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                  No roles found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
      <Dialog
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
      >
        <DialogTitle>
          Delete role &quot;{confirmDelete?.name}&quot;?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDelete?.nb_users ?? 0} user(s) on this role will be
            reassigned to Public, and all of the role&apos;s API permissions
            will be removed. This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setConfirmDelete(null)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={deleteMutation.isLoading}
            onClick={() =>
              confirmDelete && deleteMutation.mutate(confirmDelete)
            }
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={Boolean(confirmPreview)}
        onClose={() => setConfirmPreview(null)}
      >
        <DialogTitle>Test as &quot;{confirmPreview?.name}&quot;?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You will see the admin UI and API permission checks as this role.
            Your login stays Admin; role management endpoints still use your
            Admin grants. Use Exit preview on the banner anytime.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="inherit"
            onClick={() => setConfirmPreview(null)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => confirmPreview && startPreview(confirmPreview)}
          >
            Start preview
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RbacDashboard;
