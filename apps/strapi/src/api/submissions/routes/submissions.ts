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
    {
      method: 'POST',
      path: '/submissions/award-nomination',
      handler: 'submissions.createAwardNomination',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};