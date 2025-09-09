/**
 * associate router.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::associate.associate', {
    config: {
        find: {
          middlewares: ['api::associate.get-active-associates'], 
        },
      },
});

