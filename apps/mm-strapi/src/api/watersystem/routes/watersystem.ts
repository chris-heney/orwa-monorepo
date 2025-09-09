/**
 *  watersystem service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::watersystem.watersystem', {
    config: {
      find: {
        middlewares: ['api::watersystem.get-active-systems'], 
      },
    },
  });