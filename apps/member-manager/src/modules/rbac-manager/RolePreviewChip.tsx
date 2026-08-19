import React, { useMemo, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { Chip, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import {
  clearRolePreview,
  getRolePreviewRaw,
  parseRolePreview,
  ROLE_PREVIEW_EVENT,
  ROLE_PREVIEW_STORAGE_KEY,
} from './rolePreview';

const subscribe = (onStoreChange: () => void) => {
  const handler = (event: StorageEvent) => {
    if (event.key === ROLE_PREVIEW_STORAGE_KEY || event.key === null) {
      onStoreChange();
    }
  };
  window.addEventListener('storage', handler);
  window.addEventListener(ROLE_PREVIEW_EVENT, onStoreChange);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(ROLE_PREVIEW_EVENT, onStoreChange);
  };
};

/**
 * App bar chip shown while Admin is testing as another role. Lives in the app
 * bar (not a module-gated page) so exiting is always reachable, even when the
 * previewed role cannot see RBAC Manager.
 */
const RolePreviewChip = () => {
  const raw = useSyncExternalStore(subscribe, getRolePreviewRaw, () => null);
  const preview = useMemo(() => parseRolePreview(raw), [raw]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (!preview) {
    return null;
  }

  const exitPreview = () => {
    clearRolePreview();
    queryClient.invalidateQueries(['auth', 'moduleAccess']);
    navigate('/rbac/dashboard');
  };

  return (
    <Tooltip
      title={`Testing as ${preview.roleName} — UI and API permissions match that role. Role management endpoints still use your Admin grants. Click to exit.`}
    >
      <Chip
        icon={<SupervisedUserCircleIcon />}
        label={`Testing as ${preview.roleName}`}
        color="warning"
        size="small"
        onClick={exitPreview}
        onDelete={exitPreview}
        deleteIcon={<CloseIcon aria-label="Exit role preview" />}
        sx={{ ml: 'auto', mr: 1, fontWeight: 600 }}
      />
    </Tooltip>
  );
};

export default RolePreviewChip;
