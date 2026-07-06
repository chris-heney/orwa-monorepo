/**
 * grant-scoring-token router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::grant-scoring-token.grant-scoring-token', {
  config: {
    // @TODO: Make this work:
    // find: {
    //   auth: false,
    //   policies: ['api::grant-scoring-token.public-key']
    // },
    update: {
      middlewares: ['api::grant-scoring-token.token-generator']
    },
  }
});
