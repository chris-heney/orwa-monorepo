import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import { Title } from 'react-admin';
import PageHeadingBar from '../_components/PageHeadingBar';
import { APP_MODULES, ModuleKey } from '../../config/modules';
import {
  createRole,
  getPermissionMatrix,
  getRole,
  getRoles,
  updateRole,
  PermissionMatrix,
  RoleBody,
  RoleDetail,
  RoleSummary,
} from './api';
import PermissionMatrixTable from './PermissionMatrixTable';

const barButtonSx = {
  color: 'white',
  '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
};

/**
 * Simple replication of how Strapi derives a role's unique `type` from its
 * name on create: `_.snakeCase(_.deburr(_.toLower(name)))`.
 */
const toRoleType = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

interface RoleEditorProps {
  roleId: number | 'new';
  onSaved: () => void;
  onCancel: () => void;
}

/**
 * Full-page role editor (create + edit). Saving always sends the ENTIRE
 * permission matrix — the server replaces the whole permission set on PUT, so
 * a partial matrix would delete every omitted permission.
 */
const RoleEditor = ({ roleId, onSaved, onCancel }: RoleEditorProps) => {
  const isNew = roleId === 'new';

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [modules, setModules] = useState<ModuleKey[]>([]);
  const [matrix, setMatrix] = useState<PermissionMatrix | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // cacheTime 0: never edit from a stale cached matrix — saving PUTs the whole
  // matrix, so stale data would silently revert permissions changed elsewhere.
  const roleQuery = useQuery<RoleDetail, Error>(
    ['rbac-role', roleId],
    () => getRole(roleId as number),
    { enabled: !isNew, staleTime: 0, cacheTime: 0 }
  );

  const matrixQuery = useQuery<PermissionMatrix, Error>(
    'rbac-permission-matrix',
    getPermissionMatrix,
    { enabled: isNew, staleTime: 0, cacheTime: 0 }
  );

  // Shares the dashboard's cached list. Needed for the client-side duplicate
  // pre-check: the prod DB has no unique index on up_roles.type, so the
  // server silently accepts colliding role names/types.
  const rolesQuery = useQuery<RoleSummary[], Error>('rbac-roles', getRoles);

  useEffect(() => {
    const role = roleQuery.data;
    if (!role) {
      return;
    }
    setName(role.name);
    setDescription(role.description ?? '');
    setModules(role.modules ?? []);
    setMatrix(role.permissions);
  }, [roleQuery.data]);

  useEffect(() => {
    if (isNew && matrixQuery.data) {
      setMatrix(matrixQuery.data);
    }
  }, [isNew, matrixQuery.data]);

  const saveMutation = useMutation<{ ok: boolean }, Error, RoleBody>(
    (body) => (isNew ? createRole(body) : updateRole(roleId as number, body)),
    { onSuccess: onSaved }
  );

  const trimmedName = name.trim();
  const isNameValid = trimmedName.length >= 3;

  // Blocks saving a name that collides with another role's name or (derived)
  // type, case-insensitively. On edit the role's own name is allowed.
  const duplicateRole = useMemo(() => {
    if (!trimmedName) {
      return null;
    }
    const nameLower = trimmedName.toLowerCase();
    const derivedType = toRoleType(trimmedName);

    return (
      (rolesQuery.data ?? []).find(
        (role) =>
          role.id !== roleId &&
          (role.name.toLowerCase() === nameLower ||
            toRoleType(role.name) === derivedType ||
            role.type === derivedType)
      ) ?? null
    );
  }, [rolesQuery.data, trimmedName, roleId]);

  const handleSave = () => {
    setSubmitted(true);
    if (!isNameValid || duplicateRole || !matrix) {
      return;
    }
    saveMutation.mutate({
      name: trimmedName,
      description,
      modules,
      permissions: matrix,
    });
  };

  const toggleModule = (key: ModuleKey) => {
    setModules((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const fetchError = isNew ? matrixQuery.error : roleQuery.error;
  const isFetching = isNew ? matrixQuery.isLoading : roleQuery.isLoading;

  return (
    <Box sx={{ width: 1, minWidth: 0, boxSizing: 'border-box', p: 2 }}>
      <Title title="RBAC Manager" />
      <PageHeadingBar
        title={
          isNew
            ? 'Create Role'
            : `Edit Role${roleQuery.data ? ` — ${roleQuery.data.name}` : ''}`
        }
        info="Name and description, the modules this role can see in the admin, and the API permissions enforced by the server. The entire permission matrix is saved on every save."
        // Sit below the fixed hide-on-scroll app bar (layout compensates with
        // 48px margin, 56px on xs) so Save/Cancel are never buried under it.
        sx={{ top: { xs: 56, sm: 48 } }}
        actions={
          <>
            <Button sx={barButtonSx} onClick={onCancel}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saveMutation.isLoading || isFetching || !matrix}
              startIcon={
                saveMutation.isLoading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : undefined
              }
            >
              Save
            </Button>
          </>
        }
      />
      {saveMutation.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {saveMutation.error.message}
        </Alert>
      )}
      {fetchError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {fetchError.message}
        </Alert>
      )}
      {isFetching ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Card sx={{ mb: 2 }}>
            <CardHeader
              title="Details"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxWidth: 520,
              }}
            >
              <TextField
                label="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                fullWidth
                error={(submitted && !isNameValid) || Boolean(duplicateRole)}
                helperText={
                  duplicateRole
                    ? `A role named "${duplicateRole.name}" (type "${duplicateRole.type}") already exists — role names must be unique.`
                    : submitted && !isNameValid
                    ? 'Name must be at least 3 characters'
                    : undefined
                }
              />
              <TextField
                label="Description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                fullWidth
                multiline
                minRows={2}
              />
              {!isNew && (
                <TextField
                  label="Type"
                  value={roleQuery.data?.type ?? ''}
                  disabled
                  fullWidth
                  helperText="Type is derived from the name when the role is created and cannot be changed."
                />
              )}
            </CardContent>
          </Card>
          <Card sx={{ mb: 2 }}>
            <CardHeader
              title="Module Access"
              titleTypographyProps={{ variant: 'h6' }}
              subheader="Which sections of the admin this role can see. This is UX-only gating — the API permissions below are the real enforcement layer."
              subheaderTypographyProps={{ variant: 'body2' }}
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {APP_MODULES.map((module) => {
                  const isSettings = module.key === 'settings';

                  return (
                    <FormControlLabel
                      key={module.key}
                      sx={{
                        width: { xs: '100%', sm: '50%', md: '33.33%' },
                        mx: 0,
                      }}
                      control={
                        <Checkbox
                          checked={isSettings || modules.includes(module.key)}
                          disabled={isSettings}
                          onChange={() => toggleModule(module.key)}
                        />
                      }
                      label={module.label}
                    />
                  );
                })}
              </Box>
              <Typography variant="caption" color="text.secondary">
                Settings is always available to every role.
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardHeader
              title="API Permissions"
              titleTypographyProps={{ variant: 'h6' }}
              subheader="Server-enforced endpoint permissions for this role."
              subheaderTypographyProps={{ variant: 'body2' }}
            />
            <CardContent>
              {matrix ? (
                <PermissionMatrixTable matrix={matrix} onChange={setMatrix} />
              ) : (
                <Typography color="text.secondary">
                  Permission matrix unavailable.
                </Typography>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default RoleEditor;
