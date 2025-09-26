/**
 * scholarship-application router
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/scholarship-applications',
      handler: 'scholarship-application.createScholarshipApplication',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};