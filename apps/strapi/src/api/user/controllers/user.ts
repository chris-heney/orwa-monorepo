'use strict';

/**
 * A set of functions called "actions" for `user`
 */

export default ({ strapi }) => ({
  getUsers: async (ctx, next) => {
    try {

      // const users = await getService('user').fetchAll(ctx.query.filters);
      // const users = await getService('users-permissions.user').fetchAll();
      // const users = await strapi.entityService.findMany('plugin::users-permissions.user', {});
      const users = await strapi.plugins['users-permissions'].services.user.fetchAll(ctx.query);

      if ( ! users.length ){
        await next();
      }

      // Format users to strapi standards:
      const usersFormatted = users.map( user => {
        const userFormatted = {
          id: user.id,
          attributes: {}
        };

        for (const prop in user){
          if (prop === 'id'){ continue; }
          userFormatted.attributes[prop] = user[prop];
        }

        return userFormatted;
      });

      ctx.body = { data: usersFormatted };

    } catch (err) {
      ctx.body = err;
    }
  },
  update: async (ctx, next) => {
    try {
      console.log('UserID: ', ctx.params.id);
      console.log('Data: ', ctx.request.body.data);
      const results = await strapi.plugins['users-permissions'].services.user.edit(ctx.params.id, ctx.request.body.data);
      ctx.body = results;
    } catch (err) {
      ctx.body = err;
    }
  },
  create: async (ctx, next) => {
    try {
      const results = await strapi.plugins['users-permissions'].services.user.add(ctx.request.body.data);
      ctx.body = results;

	} catch (err) {
      ctx.body = err;
	}
  },

  /**
   * GET /api/user/me/preferences — self-only RaStore bag.
   */
  getMyPreferences: async (ctx) => {
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

  /**
   * PUT /api/user/me/preferences — writes only user_preferences for the caller.
   * Body: { data: { user_preferences: Record<string, unknown> } }
   */
  updateMyPreferences: async (ctx) => {
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
