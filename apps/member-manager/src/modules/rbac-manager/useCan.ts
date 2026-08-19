import { useMemo } from 'react';
import { useMeQuery } from './useModuleAccess';

export type CrudAction = 'find' | 'findOne' | 'create' | 'update' | 'delete';

export interface CanApi {
  /**
   * Capability check against the server permission matrix for a CRUD action
   * on a Strapi api (SINGULAR api name, e.g. `can('update', 'watersystem')`
   * resolves `api::watersystem.watersystem.update`).
   */
  can: (action: CrudAction, apiName: string) => boolean;
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
};

export const resourceToApiName = (resource: string): string =>
  RESOURCE_TO_API_NAME[resource] ?? resource.replace(/s$/, '');

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

    return { can, canAction, isLoading };
  }, [data, isLoading]);
};
