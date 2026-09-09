import React from 'react';
import { CircularProgress } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import { useNotify } from 'react-admin';
import { useNavigate, useParams as useRouteParams } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import type {
  ActionManifest,
  ModuleManifest,
  PageCtx,
} from '../../framework/manifest';
import { usePageValue } from '../../framework/PageLocalState';
import HeadingAction from '../_components/heading/HeadingAction';
import RbacDashboard from './RbacDashboard';
import RoleEditor from './RoleEditor';

/* ---------- bar action components (read page-local state) ---------- */

const RefreshRolesAction = () => {
  const [refetch] = usePageValue<(() => unknown) | undefined>(
    'rbac.refresh',
    undefined
  );
  const [refreshing] = usePageValue('rbac.refreshing', false);
  return (
    <HeadingAction
      icon={<RefreshIcon fontSize="small" />}
      label="Refresh roles"
      disabled={refreshing || !refetch}
      onClick={() => refetch?.()}
    />
  );
};

const SaveRoleAction = () => {
  const [save] = usePageValue<(() => void) | undefined>('rbac.save', undefined);
  const [saving] = usePageValue('rbac.saving', false);
  const [disabled] = usePageValue('rbac.saveDisabled', true);
  return (
    <HeadingAction
      icon={
        saving ? (
          <CircularProgress size={18} color="inherit" />
        ) : (
          <SaveIcon fontSize="small" />
        )
      }
      label="Save"
      forceLabel
      emphasis
      color="primary"
      onClick={() => save?.()}
      disabled={disabled || !save}
    />
  );
};

const refreshRolesAction: ActionManifest = {
  id: 'refresh-roles',
  label: 'Refresh roles',
  icon: RefreshIcon,
  scope: 'list',
  component: RefreshRolesAction,
};

const createRoleAction: ActionManifest = {
  id: 'create-role',
  label: 'Create Role',
  icon: AddIcon,
  scope: 'list',
  onClick: (_ctx, api) => api.navigate('/rbac/roles/new'),
};

const saveRoleAction: ActionManifest = {
  id: 'save-role',
  label: 'Save',
  icon: SaveIcon,
  scope: 'list',
  component: SaveRoleAction,
};

/* ---------- page bodies ---------- */

const roleIdOf = (params: PageCtx['params']): number | 'new' => {
  const raw = params.roleId;
  return raw === 'new' || raw == null ? 'new' : Number(raw);
};

const RoleEditorBody = () => {
  const navigate = useNavigate();
  const notify = useNotify();
  const queryClient = useQueryClient();
  // Route param, read directly (the body has no ctx prop).
  const roleId = roleIdOf(useRouteParams());
  return (
    <RoleEditor
      roleId={roleId}
      onSaved={() => {
        notify('Role saved', { type: 'success' });
        queryClient.invalidateQueries('rbac-roles');
        navigate('/rbac/dashboard');
      }}
    />
  );
};

const EditorTitle = () => {
  const [name] = usePageValue<string | undefined>('rbac.roleName', undefined);
  const roleId = useRouteParams().roleId;
  return (
    <>
      {roleId === 'new'
        ? 'Create Role'
        : `Edit Role${name ? ` — ${name}` : ''}`}
    </>
  );
};

/* ---------- manifest ---------- */

export const rbacModule: ModuleManifest = {
  id: 'rbac',
  title: 'RBAC Manager',
  icon: AdminPanelSettingsIcon,
  menu: { label: 'RBAC Manager', to: '/rbac/dashboard' },
  permissions: { pathPrefixes: ['/rbac'], resources: [] },
  pages: [
    {
      id: 'rbac.dashboard',
      route: 'rbac/dashboard',
      kind: 'custom',
      titleBar: {
        title: 'RBAC Manager',
        infoTooltip:
          'Create roles, choose which modules each role can see in the admin, and grant per-endpoint API permissions. Module access is UX-only; the API permissions are enforced by the server. Use Test as role to preview UI and API grants.',
      },
      actions: [createRoleAction, refreshRolesAction],
      body: RbacDashboard,
    },
    {
      id: 'rbac.roleEditor',
      route: 'rbac/roles/:roleId',
      kind: 'custom',
      titleBar: {
        title: () => <EditorTitle />,
        appBarTitle: 'RBAC Manager',
        infoTooltip:
          'Name and description, the modules this role can see in the admin, and the API permissions enforced by the server. The entire permission matrix is saved on every save.',
        // Cancel is the far-right Back arrow (returns to the role list).
        back: '/rbac/dashboard',
        backLabel: 'Cancel',
      },
      actions: [saveRoleAction],
      body: RoleEditorBody,
    },
  ],
};

export default rbacModule;
