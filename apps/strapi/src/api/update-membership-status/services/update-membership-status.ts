/**
 * update-membership-status service
 */

import dayjs from 'dayjs'

import { updateById } from '../../../utils/document-compat'
import { coerceToSchema } from '../../../utils/coerce-to-schema'

export default ({ strapi }) => ({

    getExpirationDate: (previousPayment: string, lastPayment: string) => {

        //previous = last payment
        //last = current payment
        const paymentLastDate = dayjs(lastPayment)
        const paymentPreviousDate = previousPayment ? dayjs(previousPayment) : null

        const daysToAdd = (
            paymentPreviousDate !== null
            && paymentPreviousDate !== undefined && paymentPreviousDate.add(1, 'year').isAfter(lastPayment)
            && !paymentPreviousDate.isSame(lastPayment)
            && dayjs(paymentPreviousDate).diff(dayjs(paymentLastDate).subtract(1, 'year'), 'day') < 31
        )
            ? dayjs(paymentPreviousDate).diff(dayjs(paymentLastDate).subtract(1, 'year'), 'day')
            : 0

        return daysToAdd > 0
            ? paymentLastDate.add(1, 'year').add(daysToAdd, 'day')
            : paymentLastDate.add(1, 'year')
    },

    batchUpdateWaterSystems: async (watersystems, status) => {

        console.log('Batch update started.')
        console.log(`UPDATING OBJECTS: ${watersystems.length} `)

        try {
            for (const watersystem of watersystems) {
                // NOTE: "active" is not a watersystem attribute (no schema field or
                // DB column). v4 silently dropped it; Strapi 5 throws "Invalid key",
                // so strip to schema keys and skip empty updates to preserve the
                // (already no-op) v4 behavior.
                const data = coerceToSchema('api::watersystem.watersystem', {
                    active: status,
                })
                if (Object.keys(data).length === 0) continue

                await updateById('api::watersystem.watersystem', watersystem.id, { data })
            }
            console.log(`Batch Updated ${watersystems.length} to ${status} .`);
        } catch (error) {
            console.error('Error in batchUpdate:', error);
        }
    },

    batchUpdateAssociates: async (associates, status) => {

        console.log('Batch update started.')
        console.log(`UPDATING OBJECTS: ${associates.length} `)

        try {
            for (const associate of associates) {
                // Same as above: "active" is not an associate attribute.
                const data = coerceToSchema('api::associate.associate', {
                    active: status,
                })
                if (Object.keys(data).length === 0) continue

                await updateById('api::associate.associate', associate.id, { data })
            }
            console.log(`Batch Updated ${associates.length} to ${status} .`);
        } catch (error) {
            console.error('Error in batchUpdate:', error);
        }
    }
});
