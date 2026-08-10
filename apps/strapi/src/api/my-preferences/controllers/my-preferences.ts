'use strict';

/**
 * Self-only user_preferences bag for member-manager RaStore sync.
 */
export default ({ strapi }) => ({
  getMine: async (ctx) => {
    const user = ctx.state.user;
    if (!user?.id) {
      return ctx.unauthorized('You must be authenticated');
    }

    const userService = strapi.plugins['users-permissions'].services.user;
    const full =
      typeof userService.fetch === 'function'
        ? await userService.fetch(user.id)
        : await strapi.db.query('plugin::users-permissions.user').findOne({
            where: { id: user.id },
          });
    const prefs = full?.user_preferences ?? null;
    ctx.body = {
      data:
        prefs && typeof prefs === 'object' && !Array.isArray(prefs)
          ? prefs
          : prefs ?? null,
    };
  },

  updateMine: async (ctx) => {
    const user = ctx.state.user;
    if (!user?.id) {
      return ctx.unauthorized('You must be authenticated');
    }

    const incoming =
      ctx.request.body?.data?.user_preferences ??
      ctx.request.body?.user_preferences;

    if (
      incoming === undefined ||
      incoming === null ||
      typeof incoming !== 'object' ||
      Array.isArray(incoming)
    ) {
      return ctx.badRequest(
        'Expected data.user_preferences to be a JSON object'
      );
    }

    const updated = await strapi.plugins['users-permissions'].services.user.edit(
      user.id,
      { user_preferences: incoming }
    );

    ctx.body = {
      data:
        updated?.user_preferences &&
        typeof updated.user_preferences === 'object' &&
        !Array.isArray(updated.user_preferences)
          ? updated.user_preferences
          : incoming,
    };
  },
});
