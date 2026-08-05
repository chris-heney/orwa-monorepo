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
