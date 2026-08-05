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
export default (plugin: any) => {
  const originalRoleService = plugin.services.role;

  // The stock `me` controller sanitizes the query against the caller's scopes,
  // so `?populate=role` is silently stripped unless the caller holds
  // `plugin::users-permissions.role.find` — and granting that scope would open
  // the full roles listing to every role (the RBAC endpoints must stay
  // Admin-only). Instead, after the stock handler runs (keeping all of its
  // user-body sanitization), attach the caller's OWN role as a minimal safe
  // object — never its permissions. Unlike the services, the plugin's
  // controllers are plain objects, so wrap the method directly.
  const originalMe = plugin.controllers.user.me;

  plugin.controllers.user.me = async (ctx: any) => {
    await originalMe(ctx);

    if (!ctx.state.user || !ctx.body) {
      return;
    }

    const user = await strapi.db
      .query('plugin::users-permissions.user')
      .findOne({
        where: { id: ctx.state.user.id },
        populate: ['role'],
      });

    if (user?.role) {
      const { id, name, description, type, modules } = user.role;
      ctx.body.role = { id, name, description, type, modules };
    }
  };

  plugin.services.role = (ctx: { strapi: any }) => {
    const service = originalRoleService(ctx);
    const originalUpdateRole = service.updateRole;

    service.updateRole = async (roleID: number, data: any) => {
      const result = await originalUpdateRole(roleID, data);

      if (data.modules !== undefined) {
        await ctx.strapi.db.query('plugin::users-permissions.role').update({
          where: { id: roleID },
          data: { modules: data.modules },
        });
      }

      return result;
    };

    return service;
  };

  return plugin;
};
