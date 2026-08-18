/**
 * Role impersonation for Admin "test as role".
 *
 * After users-permissions JWT auth succeeds, if `X-Impersonate-Role` is set,
 * rebuild the CASL ability from the target role's permissions (unless the
 * route is an exempt RBAC management action).
 */

const HEADER = 'x-impersonate-role';

/** Role/permission management actions always authorize as the real Admin. */
export const EXEMPT_IMPERSONATION_ACTIONS = new Set([
  'plugin::users-permissions.role.find',
  'plugin::users-permissions.role.findOne',
  'plugin::users-permissions.role.createRole',
  'plugin::users-permissions.role.updateRole',
  'plugin::users-permissions.role.deleteRole',
  'plugin::users-permissions.permissions.getPermissions',
]);

/**
 * Identity actions keep the real Admin ability (so the session survives
 * previewing a role without the `user.me` grant, e.g. Public) but still report
 * the previewed role in the response, which is what the frontend gates on.
 */
export const IDENTITY_IMPERSONATION_ACTIONS = new Set([
  'plugin::users-permissions.user.me',
]);

const isAdminRole = (
  role: { type?: string; name?: string } | null | undefined,
) => role != null && (role.type === 'admin' || role.name === 'Admin');

const routeScopes = (ctx: any): string[] => {
  const scope = ctx.state?.route?.config?.auth?.scope;
  if (!scope) return [];
  return Array.isArray(scope) ? scope : [scope];
};

/**
 * Mutates ctx.state when impersonating. Returns false if the response was
 * already sent (forbidden/badRequest); true to continue the middleware chain.
 */
export const applyRoleImpersonation = async (
  strapi: any,
  ctx: any,
): Promise<boolean> => {
  const raw = ctx.request?.headers?.[HEADER];
  if (raw == null || raw === '') {
    return true;
  }

  // Routes configured `auth: false` short-circuit Strapi's authenticate before
  // any strategy runs, and every request passes through such a pass before its
  // real authenticated route. Nothing is authorized there, so impersonation is
  // a no-op instead of a 403 — rejecting here failed every previewed list.
  const user = ctx.state.user;
  if (!user?.role) {
    return true;
  }

  const realRole = user.role;
  if (!isAdminRole(realRole)) {
    ctx.forbidden('Only Admin can impersonate a role');
    return false;
  }

  const scopes = routeScopes(ctx);
  if (scopes.some((action) => EXEMPT_IMPERSONATION_ACTIONS.has(action))) {
    return true;
  }

  const roleId = Number(Array.isArray(raw) ? raw[0] : raw);
  if (!Number.isFinite(roleId) || roleId <= 0) {
    ctx.badRequest('Invalid X-Impersonate-Role header');
    return false;
  }

  const targetRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { id: roleId } });

  if (!targetRole) {
    ctx.badRequest('Impersonation role not found');
    return false;
  }

  ctx.state.impersonator = {
    roleId: realRole.id,
    roleName: realRole.name,
    roleType: realRole.type,
  };
  ctx.state.user.role = targetRole;

  const keepRealAbility = scopes.some((action) =>
    IDENTITY_IMPERSONATION_ACTIONS.has(action),
  );

  if (ctx.state.auth) {
    ctx.state.auth.credentials = ctx.state.user;

    if (!keepRealAbility) {
      const permissionService = strapi
        .plugin('users-permissions')
        .service('permission');
      const permissionRows = await permissionService.findRolePermissions(
        targetRole.id,
      );
      ctx.state.auth.ability =
        await strapi.contentAPI.permissions.engine.generateAbility(
          permissionRows.map(permissionService.toContentAPIPermission),
        );
    }
  }

  return true;
};

/**
 * Wrap strapi auth.authenticate so impersonation runs after JWT auth sets
 * ctx.state.user / ability, and before the rest of the middleware chain
 * (including verify/authorize).
 */
export const wrapAuthWithRoleImpersonation = (strapi: any) => {
  const auth = strapi.get('auth');
  const originalAuthenticate = auth.authenticate.bind(auth);

  auth.authenticate = async (ctx: any, next: () => Promise<void>) => {
    await originalAuthenticate(ctx, async () => {
      const ok = await applyRoleImpersonation(strapi, ctx);
      if (!ok) {
        return;
      }
      return next();
    });
  };
};
