export default ({ strapi }) => ({
  /**
   * `cutoff` reaches MySQL as a binding, never as interpolated text — it comes
   * straight off the query string and would otherwise be an injection vector.
   */
  getUnearnedDues: async (entity, cutoff) => {
    const result = strapi.db.connection
      .select(
        strapi.db.connection.raw(
          `SUM(
            payment_amount * (
              365 - DATEDIFF(
                ?,
                CASE
                  WHEN payment_last_date > ? THEN payment_previous_date
                  ELSE payment_last_date
                END
              )
            ) / 365
          ) as 'unearnedTotal',
          AVG(
            payment_amount * (
              365 - DATEDIFF(
                ?,
                CASE
                  WHEN payment_last_date > ? THEN payment_previous_date
                  ELSE payment_last_date
                END
              )
            ) / 365
          ) as 'unearnedDailyAverage',
          AVG(payment_amount) as 'collectedDailyAverage',
          SUM(payment_amount) as 'collectedTotal'`,
          [cutoff, cutoff, cutoff, cutoff],
        ),
      )
      .from(entity)
      // Two ways a member's dues fall in the 12 months ending at the cutoff,
      // mirroring the CASE above. Each branch is grouped so the OR can't be
      // swallowed by AND precedence.
      .where((qb) =>
        // The most recent payment already applies as of the cutoff.
        qb
          .where('payment_last_date', '<', cutoff)
          .andWhere(
            strapi.db.connection.raw(`DATEDIFF(?, payment_last_date)`, [
              cutoff,
            ]),
            '<',
            365,
          ),
      )
      .orWhere((qb) =>
        // Already renewed past the cutoff, so the prior payment is the one
        // covering that date.
        qb
          .where('payment_last_date', '>', cutoff)
          .andWhere('payment_previous_date', '<', cutoff)
          .andWhere(
            strapi.db.connection.raw(`DATEDIFF(?, payment_previous_date)`, [
              cutoff,
            ]),
            '<',
            365,
          ),
      );

    return result;
  },
});
