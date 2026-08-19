import { useMemo, useSyncExternalStore } from 'react';
import { useQuery } from 'react-query';
import { CookieStore } from '../../helpers/ra-strapi-data-provider';
import { ModuleKey } from '../../config/modules';
import {
  clearRolePreview,
  getImpersonateRoleHeader,
  getRolePreviewRaw,
  parseRolePreview,
  previewModulesForRole,
  ROLE_PREVIEW_EVENT,
  ROLE_PREVIEW_STORAGE_KEY,
} from './rolePreview';

interface MeRole {
  id: number;
  name: string;
  type: string;
  modules?: ModuleKey[] | null;
  /** Flat action UIDs, e.g. "api::watersystem.watersystem.find". */
  permissions?: string[] | null;
}

export interface MeResponse {
  id: number;
  role?: MeRole | null;
  impersonating?: { roleId: number; roleName: string } | null;
}

const fetchMe = async (): Promise<MeResponse> => {
  const token = CookieStore.getCookie('token');
  const headers: Record<string, string> = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const impersonateRoleId = getImpersonateRoleHeader();
  if (impersonateRoleId) {
    headers['X-Impersonate-Role'] = impersonateRoleId;
  }

  const res = await fetch(
    `${import.meta.env.VITE_API_ENDPOINT}/api/users/me?populate=role`,
    { headers }
  );

  if (!res.ok) {
    if (res.status === 400 && impersonateRoleId) {
      clearRolePreview();
    }
    throw new Error(`Failed to fetch current user (status ${res.status})`);
  }

  return res.json();
};

/**
 * Single shared react-query fetch of `GET /users/me?populate=role`, used by
 * both `useModuleAccess` and `useCan` (same query key → one request).
 */
export const useMeQuery = () =>
  useQuery<MeResponse, Error>(['auth', 'moduleAccess'], fetchMe, {
    staleTime: 5 * 60 * 1000,
    retry: false,
    onError: (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error(error);
      }
    },
  });

export interface ModuleAccess {
  modules: ModuleKey[];
  roleName: string | null;
  roleId: number | null;
  roleType: string | null;
  isLoading: boolean;
}

const modulesFromRole = (role: {
  type?: string;
  name?: string;
  modules?: ModuleKey[] | null;
}): ModuleKey[] => previewModulesForRole(role);

const subscribePreview = (onStoreChange: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key === ROLE_PREVIEW_STORAGE_KEY || event.key === null) {
      onStoreChange();
    }
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener(ROLE_PREVIEW_EVENT, onStoreChange);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(ROLE_PREVIEW_EVENT, onStoreChange);
  };
};

/**
 * Module access for the current user, from server truth
 * (`GET /users/me?populate=role`) — never from the client-writable `role`
 * cookie. This is cosmetic UX gating only; `up_permissions` is the real
 * enforcement layer.
 *
 * Rules:
 * - Admin role (type `admin` or name `Admin`) always gets ALL modules, so an
 *   admin can never be locked out by a bad stored value.
 * - `settings` is always included.
 * - While role-previewing, prefer `/users/me` modules when present; otherwise
 *   fall back to the modules snapshotted at preview start (so a slow/failed
 *   me fetch cannot hide Memberships and bounce you to Settings-only).
 * - Fetch errors never hard-fail the app (login must not break on a role
 *   fetch): the hook falls back to `['settings']` when not previewing.
 */
export const useModuleAccess = (): ModuleAccess => {
  const { data, isError, isLoading } = useMeQuery();
  // Stable primitive — parsed object would break useMemo every render.
  const previewRaw = useSyncExternalStore(
    subscribePreview,
    getRolePreviewRaw,
    () => null
  );

  return useMemo(() => {
    const preview = parseRolePreview(previewRaw);

    if (isLoading && !preview) {
      return {
        modules: [],
        roleName: null,
        roleId: null,
        roleType: null,
        isLoading: true,
      };
    }

    const role = data?.role ?? null;

    // Active preview: keep UI gated to the role under test even if /users/me
    // is still loading or briefly errors (Strapi restart lag, etc.).
    if (preview) {
      const fromMe =
        role &&
        (data?.impersonating?.roleId === preview.roleId ||
          role.id === preview.roleId)
          ? modulesFromRole(role)
          : null;
      const modules =
        fromMe && fromMe.length > 0
          ? fromMe
          : preview.modules.length > 0
          ? preview.modules
          : (['settings'] as ModuleKey[]);

      return {
        modules,
        roleName: role?.name ?? preview.roleName,
        roleId: role?.id ?? preview.roleId,
        roleType: role?.type ?? null,
        isLoading: false,
      };
    }

    if (isError || !role) {
      return {
        modules: ['settings' as ModuleKey],
        roleName: role?.name ?? null,
        roleId: role?.id ?? null,
        roleType: role?.type ?? null,
        isLoading: false,
      };
    }

    return {
      modules: modulesFromRole(role),
      roleName: role.name,
      roleId: role.id,
      roleType: role.type,
      isLoading: false,
    };
  }, [data, isError, isLoading, previewRaw]);
};
