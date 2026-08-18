import { ALL_MODULE_KEYS, ModuleKey } from '../../config/modules';

const STORAGE_KEY = 'orwa.rbac.rolePreview';

export interface RolePreviewState {
  roleId: number;
  roleName: string;
}

export const getRolePreview = (): RolePreviewState | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RolePreviewState;
    if (
      typeof parsed?.roleId !== 'number' ||
      !Number.isFinite(parsed.roleId) ||
      typeof parsed?.roleName !== 'string'
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const setRolePreview = (state: RolePreviewState): void => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event('orwa-role-preview-change'));
};

export const clearRolePreview = (): void => {
  sessionStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event('orwa-role-preview-change'));
};

/** Header value for active preview, or null when not previewing. */
export const getImpersonateRoleHeader = (): string | null => {
  const preview = getRolePreview();
  return preview ? String(preview.roleId) : null;
};

/**
 * Modules to land on when starting a preview — mirrors useModuleAccess rules
 * without waiting for /users/me.
 */
export const previewModulesForRole = (role: {
  type?: string;
  name?: string;
  modules?: ModuleKey[] | null;
}): ModuleKey[] => {
  const isAdmin = role.type === 'admin' || role.name === 'Admin';
  if (isAdmin) {
    return [...ALL_MODULE_KEYS];
  }
  const stored = role.modules ?? [];
  return stored.includes('settings')
    ? [...stored]
    : [...stored, 'settings' as ModuleKey];
};
