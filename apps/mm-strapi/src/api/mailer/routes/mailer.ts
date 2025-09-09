'use strict';

/**
 * mailer router
 */

export default {
  routes: [
     {
      method: 'POST',
      path: '/mailer/send-email',
      handler: 'mailer.sendEmail',
      config: {
        policies: [],
        middlewares: [],
      },
     },
  ],
};
