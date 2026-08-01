const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * `fromDate` is user input that ends up in a date comparison — accept only a
 * real calendar date in YYYY-MM-DD form and reject anything else at the edge.
 * The picker sends "Invalid Date" while a date is half-typed.
 */
const parseCutoff = (raw: unknown): string | null => {
  if (typeof raw !== 'string' || !ISO_DATE.test(raw)) {
    return null;
  }
  const parsed = new Date(`${raw}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  // Rejects overflow like 2026-02-31, which Date silently rolls forward.
  return parsed.toISOString().slice(0, 10) === raw ? raw : null;
};

const BAD_DATE = 'fromDate must be a calendar date in YYYY-MM-DD format';

export default ({ strapi }) => ({
  getUnearnedWatersystemDues: async (ctx) => {
    const cutoff = parseCutoff(ctx.request.query.fromDate);
    if (!cutoff) {
      return ctx.badRequest(BAD_DATE);
    }

    try {
      ctx.body = await strapi
        .service('api::financial-audit.financial-audit')
        .getUnearnedDues('watersystems', cutoff);
    } catch (err) {
      strapi.log.error('getUnearnedWatersystemDues failed', err);
      return ctx.internalServerError('Could not compute unearned dues');
    }
  },

  getUnearnedAssociateDues: async (ctx) => {
    const cutoff = parseCutoff(ctx.request.query.fromDate);
    if (!cutoff) {
      return ctx.badRequest(BAD_DATE);
    }

    try {
      ctx.body = await strapi
        .service('api::financial-audit.financial-audit')
        .getUnearnedDues('associates', cutoff);
    } catch (err) {
      strapi.log.error('getUnearnedAssociateDues failed', err);
      return ctx.internalServerError('Could not compute unearned dues');
    }
  },

  getUnearnedDues: async (ctx) => {
    const cutoff = parseCutoff(ctx.request.query.fromDate);
    if (!cutoff) {
      return ctx.badRequest(BAD_DATE);
    }

    try {
      const service = strapi.service('api::financial-audit.financial-audit');
      const [watersystemDues, associateDues] = await Promise.all([
        service.getUnearnedDues('watersystems', cutoff),
        service.getUnearnedDues('associates', cutoff),
      ]);

      const watersystems = watersystemDues[0];
      const associates = associateDues[0];

      ctx.body = {
        watersystems,
        associates,
        total: {
          unearnedTotal: watersystems.unearnedTotal + associates.unearnedTotal,
          unearnedDailyAverage:
            watersystems.unearnedDailyAverage + associates.unearnedDailyAverage,
          collectedDailyAverage:
            watersystems.collectedDailyAverage +
            associates.collectedDailyAverage,
          collectedTotal:
            watersystems.collectedTotal + associates.collectedTotal,
        },
      };
    } catch (err) {
      strapi.log.error('getUnearnedDues failed', err);
      return ctx.internalServerError('Could not compute unearned dues');
    }
  },
});
