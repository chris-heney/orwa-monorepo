/**
 * users-permissions plugin extension.
 *
 * The stock role service's `updateRole` only persists `name` and `description`
 * (`_.pick(data, ['name', 'description'])` in
 * @strapi/plugin-users-permissions/server/services/role.js), so the custom
 * `modules` attribute added in content-types/role/schema.json would be dropped
 * on PUT. Wrap the service factory to persist `modules` after the stock update.
 *
 * Plugin internals are untyped, hence the `any`s.
 */
const USER_ME_ACTION = 'plugin::users-permissions.user.me';

// Every role's users need GET /api/users/me just to hold a session (the
// frontend's module gating reads it on every load), but the RBAC UI hides
// plugin permissions under "Advanced" so admins won't reliably grant it — and
// the stock updateRole reconcile deletes any permission row missing from the
// submitted matrix. Re-ensure the row after every content-api role write.
const ensureUserMePermission = async (strapi: any, roleId: number) => {
  const permissionQuery = strapi.db.query(
    'plugin::users-permissions.permission',
  );
  const existing = await permissionQuery.findOne({
    where: { role: { id: roleId }, action: USER_ME_ACTION },
  });

  if (!existing) {
    await permissionQuery.create({
      data: { action: USER_ME_ACTION, role: roleId },
    });
  }
};

export default (plugin: any) => {
  const originalRoleService = plugin.services.role;

  // The stock `me` controller sanitizes the query against the caller's scopes,
  // so `?populate=role` is silently stripped unless the caller holds
  // `plugin::users-permissions.role.find` — and granting that scope would open
  // the full roles listing to every role (the RBAC endpoints must stay
  // Admin-only). Instead, after the stock handler runs (keeping all of its
  // user-body sanitization), attach the caller's OWN role as a minimal safe
  // object. Its `permissions` is a flat array of the role's permission action
  // strings — that exposes only the caller's own capabilities, which they can
  // already discover empirically by calling endpoints; it does not expose
  // other roles or the permission registry. Unlike the services, the plugin's
  // controllers are plain objects, so wrap the method directly.
  const originalMe = plugin.controllers.user.me;

  plugin.controllers.user.me = async (ctx: any) => {
    await originalMe(ctx);

    if (!ctx.state.user || !ctx.body) {
      return;
    }

    // When Admin is testing as another role, expose that role's modules /
    // permissions so useModuleAccess / useCan stay server-driven.
    const impersonating = ctx.state.impersonator;
    const roleFromAuth = ctx.state.user.role;

    let role = roleFromAuth;
    if (!impersonating) {
      const user = await strapi.db
        .query('plugin::users-permissions.user')
        .findOne({
          where: { id: ctx.state.user.id },
          populate: ['role'],
        });
      role = user?.role ?? roleFromAuth;
    } else if (roleFromAuth?.id != null) {
      // Always reload — auth may hand us a partial row (or modules: null
      // from an incomplete findOne) and module gating must see the DB value.
      role =
        (await strapi.db.query('plugin::users-permissions.role').findOne({
          where: { id: roleFromAuth.id },
        })) ?? roleFromAuth;
    }

    if (role) {
      const { id, name, description, type, modules } = role;
      const permissionRows = await strapi.db
        .query('plugin::users-permissions.permission')
        .findMany({
          where: { role: { id } },
          select: ['action'],
        });

      ctx.body.role = {
        id,
        name,
        description,
        type,
        modules,
        permissions: permissionRows.map((permission: any) => permission.action),
      };
    }

    if (impersonating && role) {
      ctx.body.impersonating = {
        roleId: role.id,
        roleName: role.name,
      };
    }
  };

  plugin.services.role = (ctx: { strapi: any }) => {
    const service = originalRoleService(ctx);
    const originalCreateRole = service.createRole;
    const originalUpdateRole = service.updateRole;

    service.createRole = async (params: any) => {
      const result = await originalCreateRole(params);

      // The stock createRole returns nothing, but it derives and mutates
      // params.type in place when absent, and type is unique — so it
      // identifies the just-created role.
      const role = await ctx.strapi.db
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: params.type } });

      if (role) {
        await ensureUserMePermission(ctx.strapi, role.id);
      }

      return result;
    };

    service.updateRole = async (roleID: number, data: any) => {
      const result = await originalUpdateRole(roleID, data);

      if (data.modules !== undefined) {
        await ctx.strapi.db.query('plugin::users-permissions.role').update({
          where: { id: roleID },
          data: { modules: data.modules },
        });
      }

      await ensureUserMePermission(ctx.strapi, roleID);

      return result;
    };

    return service;
  };

  return plugin;
};
