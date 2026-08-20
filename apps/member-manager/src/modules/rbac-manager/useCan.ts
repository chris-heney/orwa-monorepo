import { useMemo } from 'react';
import { useResourceContext } from 'react-admin';
import { useMeQuery } from './useModuleAccess';

export type CrudAction = 'find' | 'findOne' | 'create' | 'update' | 'delete';

export interface CanApi {
  /**
   * Capability check against the server permission matrix for a CRUD action
   * on a Strapi api (SINGULAR api name, e.g. `can('update', 'watersystem')`
   * resolves `api::watersystem.watersystem.update`).
   */
  can: (action: CrudAction, apiName: string) => boolean;
  /**
   * Same check keyed by react-admin resource name — resolves plugin-namespaced
   * resources (users, uploads) and irregular plurals that `can` cannot.
   */
  canOnResource: (action: CrudAction, resource: string) => boolean;
  /** Same check for non-CRUD / custom actions, by full action UID. */
  canAction: (actionUid: string) => boolean;
  isLoading: boolean;
}

/**
 * react-admin resource names (plural) → Strapi api names (singular), for
 * components that only know their resource context. Covers the memberships
 * wave explicitly; anything else falls back to stripping a trailing "s".
 */
const RESOURCE_TO_API_NAME: Record<string, string> = {
  watersystems: 'watersystem',
  associates: 'associate',
  memberships: 'membership',
  'membership-items': 'membership-item',
  invoices: 'invoice',
  // Strapi api `staff-member` has pluralName "staff" (the fallback would
  // produce "staf").
  staff: 'staff-member',
  // Irregular plurals the trailing-"s" fallback gets wrong.
  activities: 'activity',
  'activity-relations': 'activity-relation',
  'training-settings': 'training-setting',
};

export const resourceToApiName = (resource: string): string =>
  RESOURCE_TO_API_NAME[resource] ?? resource.replace(/s$/, '');

/**
 * Resources whose permissions live outside the `api::` namespace, so the
 * `api::<name>.<name>.<action>` shape would never match a real permission row.
 */
const RESOURCE_TO_ACTION_PREFIX: Record<string, string> = {
  users: 'plugin::users-permissions.user',
  'upload/files': 'plugin::upload.content-api',
};

/** Full Strapi action UID prefix for a react-admin resource name. */
export const resourceToActionPrefix = (resource: string): string => {
  const pluginPrefix = RESOURCE_TO_ACTION_PREFIX[resource];
  if (pluginPrefix) {
    return pluginPrefix;
  }
  const apiName = resourceToApiName(resource);
  return `api::${apiName}.${apiName}`;
};

/**
 * Capability checks for the current user, from server truth
 * (`GET /users/me?populate=role` — shared query with `useModuleAccess`,
 * one fetch). Cosmetic UX gating only; `up_permissions` is the real
 * enforcement layer.
 *
 * Rules:
 * - Admin role (type `admin` or name `Admin`) → every check passes.
 * - Otherwise the action UID must be present in `role.permissions`.
 * - While loading (or after a fetch error) every check returns `false`:
 *   capability-gated UI stays hidden until the role is known, then appears.
 */
export const useCan = (): CanApi => {
  const { data, isLoading } = useMeQuery();

  return useMemo(() => {
    const role = data?.role ?? null;
    const isAdmin =
      role != null && (role.type === 'admin' || role.name === 'Admin');
    const permissions = role?.permissions ?? [];

    const canAction = (actionUid: string): boolean => {
      if (isLoading) return false;
      if (isAdmin) return true;
      return permissions.includes(actionUid);
    };

    const can = (action: CrudAction, apiName: string): boolean =>
      canAction(`api::${apiName}.${apiName}.${action}`);

    const canOnResource = (action: CrudAction, resource: string): boolean =>
      canAction(`${resourceToActionPrefix(resource)}.${action}`);

    return { can, canOnResource, canAction, isLoading };
  }, [data, isLoading]);
};

/**
 * Datagrid `rowClick` value for the resource in context: navigate to the edit
 * page only when the role may update it, otherwise make the row inert.
 * Pass `resourceName` for lists rendered outside a resource route.
 */
export const useEditRowClick = (resourceName?: string): 'edit' | false => {
  const contextResource = useResourceContext();
  const { canOnResource } = useCan();
  return canOnResource('update', resourceName ?? contextResource ?? '')
    ? 'edit'
    : false;
};
