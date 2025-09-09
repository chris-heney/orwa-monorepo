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
});
