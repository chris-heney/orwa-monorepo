/**
 * update-membership-status service
 */

import dayjs from 'dayjs'

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
                const response = await strapi.documents('api::watersystem.watersystem').update({
                    documentId: "__TODO__",
                    previousData: { ...watersystem },

                    data: {
                        active: status,
                    }
                })
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
                const response = await strapi.documents('api::associate.associate').update({
                    documentId: "__TODO__",
                    previousData: { ...associate },

                    data: {
                        active: status,
                    }
                })
            }
            console.log(`Batch Updated ${associates.length} to ${status} .`);
        } catch (error) {
            console.error('Error in batchUpdate:', error);
        }
    }
});
