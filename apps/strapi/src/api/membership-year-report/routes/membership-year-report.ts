export default {
  routes: [
    {
      method: 'GET',
      path: '/membership-year-report',
      handler: 'membership-year-report.getYearReport',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
