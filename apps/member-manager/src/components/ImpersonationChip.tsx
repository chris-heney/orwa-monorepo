import React, { useMemo, useSyncExternalStore } from 'react';
import { Chip, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import {
  getImpersonationRaw,
  IMPERSONATION_EVENT,
  IMPERSONATION_STORAGE_KEY,
  parseImpersonation,
  stopImpersonation,
} from '../helpers/impersonation';

const subscribe = (onStoreChange: () => void) => {
  const handler = (event: StorageEvent) => {
    if (event.key === IMPERSONATION_STORAGE_KEY || event.key === null) {
      onStoreChange();
    }
  };
  window.addEventListener('storage', handler);
  window.addEventListener(IMPERSONATION_EVENT, onStoreChange);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(IMPERSONATION_EVENT, onStoreChange);
  };
};

/**
 * App-bar banner shown while an Admin is impersonating another user. Lives in
 * the app bar (not a module-gated page) so "Exit" is always reachable even
 * when the impersonated user's role cannot see the page you're on. Exiting
 * restores the Admin's own session and reloads.
 */
const ImpersonationChip = () => {
  const raw = useSyncExternalStore(subscribe, getImpersonationRaw, () => null);
  const state = useMemo(() => parseImpersonation(raw), [raw]);

  if (!state) {
    return null;
  }

  const exit = () => {
    stopImpersonation();
    // Hard reload so the data provider, identity, module access and
    // preferences all re-read the restored Admin token from scratch.
    window.location.hash = '#/human-resources/dashboard';
    window.location.reload();
  };

  const who = state.email || state.username || `user #${state.userId}`;

  return (
    <Tooltip
      title={`You are viewing the app as ${who}${
        state.roleName ? ` (${state.roleName})` : ''
      }. Their saved view settings are not being changed. Click to exit and return to your Admin session.`}
    >
      <Chip
        icon={<PersonSearchIcon />}
        label={`Viewing as ${who}`}
        color="warning"
        size="small"
        onClick={exit}
        onDelete={exit}
        deleteIcon={<CloseIcon aria-label="Exit impersonation" />}
        sx={{ ml: 'auto', mr: 1, fontWeight: 600, maxWidth: 320 }}
      />
    </Tooltip>
  );
};

export default ImpersonationChip;
