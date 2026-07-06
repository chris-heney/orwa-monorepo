import type { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('activity-feed')
      .service('myService')
      .getWelcomeMessage();
  },
});
