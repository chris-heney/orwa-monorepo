import React, { useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { Alert, Button, Box } from '@mui/material';
import {
  clearRolePreview,
  getRolePreview,
  RolePreviewState,
} from './rolePreview';

const STORAGE_KEY = 'orwa.rbac.rolePreview';

const subscribe = (onStoreChange: () => void) => {
  const handler = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      onStoreChange();
    }
  };
  window.addEventListener('storage', handler);
  // Same-tab updates don't fire `storage`; poll via custom event.
  window.addEventListener('orwa-role-preview-change', onStoreChange);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener('orwa-role-preview-change', onStoreChange);
  };
};

const getSnapshot = (): RolePreviewState | null => getRolePreview();

/** Notify same-tab listeners after set/clear. */
export const notifyRolePreviewChange = () => {
  window.dispatchEvent(new Event('orwa-role-preview-change'));
};

/**
 * Sticky banner while Admin is testing as another role. Not module-gated —
 * Exit is always reachable even when the previewed role cannot see RBAC.
 */
const RolePreviewBanner = () => {
  const preview = useSyncExternalStore(subscribe, getSnapshot, () => null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (!preview) {
    return null;
  }

  const exitPreview = () => {
    clearRolePreview();
    notifyRolePreviewChange();
    queryClient.invalidateQueries(['auth', 'moduleAccess']);
    navigate('/rbac/dashboard');
  };

  return (
    <Box
      sx={{
        position: 'sticky',
        top: { xs: 56, sm: 48 },
        zIndex: (theme) => theme.zIndex.appBar + 2,
      }}
    >
      <Alert
        severity="warning"
        action={
          <Button color="inherit" size="small" onClick={exitPreview}>
            Exit preview
          </Button>
        }
        sx={{ borderRadius: 0 }}
      >
        Testing as <strong>{preview.roleName}</strong> — UI and API permissions
        match that role. Role management endpoints still use your Admin grants.
      </Alert>
    </Box>
  );
};

export default RolePreviewBanner;
