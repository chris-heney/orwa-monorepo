import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { CookieStore } from '../../helpers/ra-strapi-data-provider';
import { ALL_MODULE_KEYS, ModuleKey } from '../../config/modules';

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
}

const fetchMe = async (): Promise<MeResponse> => {
  const token = CookieStore.getCookie('token');

  const res = await fetch(
    `${import.meta.env.VITE_API_ENDPOINT}/api/users/me?populate=role`,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
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
 * - Fetch errors never hard-fail the app (login must not break on a role
 *   fetch): the hook falls back to `['settings']`.
 */
export const useModuleAccess = (): ModuleAccess => {
  const { data, isError, isLoading } = useMeQuery();

  return useMemo(() => {
    if (isLoading) {
      return {
        modules: [],
        roleName: null,
        roleId: null,
        roleType: null,
        isLoading: true,
      };
    }

    const role = data?.role ?? null;

    if (isError || !role) {
      return {
        modules: ['settings' as ModuleKey],
        roleName: role?.name ?? null,
        roleId: role?.id ?? null,
        roleType: role?.type ?? null,
        isLoading: false,
      };
    }

    const isAdmin = role.type === 'admin' || role.name === 'Admin';
    const stored = role.modules ?? [];
    const modules = isAdmin
      ? [...ALL_MODULE_KEYS]
      : stored.includes('settings')
      ? [...stored]
      : [...stored, 'settings' as ModuleKey];

    return {
      modules,
      roleName: role.name,
      roleId: role.id,
      roleType: role.type,
      isLoading: false,
    };
  }, [data, isError, isLoading]);
};
