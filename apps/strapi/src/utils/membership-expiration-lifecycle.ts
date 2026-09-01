import { getMembershipExpirationDate } from './membership-expiration';

/**
 * Keeps the stored `expiration_date` in step with the payment dates.
 *
 * The column exists so filters, saved queries and scheduled emails can select
 * on the real membership end date at the database level. It is derived, never
 * authored: anything a client sends for it is overwritten here.
 *
 * On update the incoming payload often carries only one of the two payment
 * dates, so the missing side is read back from the stored row before deriving.
 */
const buildLifecycles = (uid: string) => ({
  async beforeCreate(event: any) {
    const { data } = event.params;
    data.expiration_date = getMembershipExpirationDate(
      data.payment_previous_date,
      data.payment_last_date,
    );
  },

  async beforeUpdate(event: any) {
    const { data, where } = event.params;

    const touchesPaymentDates =
      'payment_last_date' in data || 'payment_previous_date' in data;
    if (!touchesPaymentDates) {
      return;
    }

    let previous = data.payment_previous_date;
    let last = data.payment_last_date;

    if (!('payment_previous_date' in data) || !('payment_last_date' in data)) {
      const current = where?.id
        ? await strapi.db.query(uid).findOne({ where: { id: where.id } })
        : null;

      if (!('payment_previous_date' in data)) {
        previous = current?.payment_previous_date ?? null;
      }
      if (!('payment_last_date' in data)) {
        last = current?.payment_last_date ?? null;
      }
    }

    data.expiration_date = getMembershipExpirationDate(previous, last);
  },
});

export default buildLifecycles;
