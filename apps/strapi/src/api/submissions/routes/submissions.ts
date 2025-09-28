/**
 * submissions router
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/submissions/scholarship-application',
      handler: 'submissions.createScholarshipApplication',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};