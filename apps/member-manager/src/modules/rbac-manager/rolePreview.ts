import { ALL_MODULE_KEYS, ModuleKey } from '../../config/modules';

export const ROLE_PREVIEW_STORAGE_KEY = 'orwa.rbac.rolePreview';
/** sessionStorage writes don't fire `storage` in the writing tab. */
export const ROLE_PREVIEW_EVENT = 'orwa-role-preview-change';

export interface RolePreviewState {
  roleId: number;
  roleName: string;
  /** Modules snapshotted at preview start — used if /users/me is slow/fails. */
  modules: ModuleKey[];
}

/**
 * Raw stored value. Subscribers must snapshot this (a stable primitive) rather
 * than a parsed object: `useSyncExternalStore` compares snapshots with
 * `Object.is`, so returning a freshly parsed object every call re-renders
 * forever ("Maximum update depth exceeded").
 */
export const getRolePreviewRaw = (): string | null => {
  try {
    return sessionStorage.getItem(ROLE_PREVIEW_STORAGE_KEY);
  } catch {
    return null;
  }
};

export const parseRolePreview = (
  raw: string | null
): RolePreviewState | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<RolePreviewState>;
    if (
      typeof parsed?.roleId !== 'number' ||
      !Number.isFinite(parsed.roleId) ||
      typeof parsed?.roleName !== 'string'
    ) {
      return null;
    }
    const modules = Array.isArray(parsed.modules)
      ? (parsed.modules.filter(
          (key): key is ModuleKey => typeof key === 'string'
        ) as ModuleKey[])
      : [];
    return {
      roleId: parsed.roleId,
      roleName: parsed.roleName,
      modules,
    };
  } catch {
    return null;
  }
};

export const getRolePreview = (): RolePreviewState | null =>
  parseRolePreview(getRolePreviewRaw());

const notifyChange = () => {
  window.dispatchEvent(new Event(ROLE_PREVIEW_EVENT));
};

export const setRolePreview = (state: RolePreviewState): void => {
  sessionStorage.setItem(ROLE_PREVIEW_STORAGE_KEY, JSON.stringify(state));
  notifyChange();
};

export const clearRolePreview = (): void => {
  sessionStorage.removeItem(ROLE_PREVIEW_STORAGE_KEY);
  notifyChange();
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
