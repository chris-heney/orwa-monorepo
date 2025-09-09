export default ({strapi}) => ({
  getUnearnedWatersystemDues: async (ctx, next) => {
    try {
      const { fromDate } = ctx.request.query;

      ctx.body = await strapi.service('api::financial-audit.financial-audit').getUnearnedDues('watersystems', fromDate);
    } catch (err) {
      ctx.body = err;
    }
  },
  getUnearnedAssociateDues: async (ctx, next) => {
    try {
      const { fromDate } = ctx.request.query;
      ctx.body = await strapi.service('api::financial-audit.financial-audit').getUnearnedDues('associates', fromDate);
    } catch (err) {
      ctx.body = err;
    }
  },
  getUnearnedDues: async (ctx, next) => {
    const { fromDate } = ctx.request.query;

    const watersystemDues = await strapi.service('api::financial-audit.financial-audit').getUnearnedDues('watersystems', fromDate);
    const associateDues = await strapi.service('api::financial-audit.financial-audit').getUnearnedDues('associates', fromDate);

    ctx.body = {
      watersystems: watersystemDues[0],
      associates: associateDues[0],
      total: {
        unearnedTotal: watersystemDues[0].unearnedTotal + associateDues[0].unearnedTotal,
        unearnedDailyAverage: watersystemDues[0].unearnedDailyAverage + associateDues[0].unearnedDailyAverage,
        collectedDailyAverage: watersystemDues[0].collectedDailyAverage + associateDues[0].collectedDailyAverage,
        collectedTotal: watersystemDues[0].collectedTotal + associateDues[0].collectedTotal
      }
    };
  }
});
