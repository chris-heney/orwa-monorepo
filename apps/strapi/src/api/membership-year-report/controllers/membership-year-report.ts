export default ({ strapi }) => ({
  getYearReport: async (ctx) => {
    try {
      ctx.body = await strapi
        .service('api::membership-year-report.membership-year-report')
        .getYearReport();
    } catch (err) {
      strapi.log.error('getYearReport failed', err);
      return ctx.internalServerError(
        'Could not build the membership year report',
      );
    }
  },
});
