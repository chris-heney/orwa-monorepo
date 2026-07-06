import type { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('grant-management')
      .service('myService')
      .getWelcomeMessage();
  },
});
