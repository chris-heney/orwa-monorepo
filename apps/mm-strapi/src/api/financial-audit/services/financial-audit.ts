export default ({ strapi }) => ({
  getUnearnedDues: async (entity, cutoff) => {
    const result = strapi.db.connection
      .select(
        strapi.db.connection.raw(
          `SUM(
            payment_amount * (
              365 - DATEDIFF(
                '${cutoff}', 
                CASE 
                  WHEN payment_last_date > '${cutoff}' THEN payment_previous_date
                  ELSE payment_last_date
                END
              )
            ) / 365
          ) as 'unearnedTotal',
          AVG(
            payment_amount * (
              365 - DATEDIFF(
                '${cutoff}', 
                CASE 
                  WHEN payment_last_date > '${cutoff}' THEN payment_previous_date
                  ELSE payment_last_date
                END
              )
            ) / 365
          ) as 'unearnedDailyAverage',
          AVG(payment_amount) as 'collectedDailyAverage',
          SUM(payment_amount) as 'collectedTotal'`
        )
      )
      .from(entity)
      .where("payment_last_date", "<", cutoff)
      .andWhere(strapi.db.connection.raw(`DATEDIFF('${cutoff}', payment_last_date)`), '<', 365)
      .orWhere("payment_previous_date", "<", cutoff)
      .andWhere("payment_previous_date", ">", cutoff)
      .andWhere(strapi.db.connection.raw(`DATEDIFF('${cutoff}', payment_previous_date)`), '<', 365)

    console.log(result.toSQL().sql);
    return result;
  },
});