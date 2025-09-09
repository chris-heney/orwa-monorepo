/**
 * A set of functions called "actions" for `update-membership-status`
 */
import dayjs from 'dayjs'

export default ({ strapi }) => ({
  
  updateMembershipStatus: async () => {
    try {
      // Fetch associates with active status true
      const watersystems = await strapi
        .db.query('api::watersystem.watersystem')
        .findMany({
          populate: true,
          offset: 1, 
          limit: 2000,
        });

      const associates = await strapi
        .db.query('api::associate.associate')
        .findMany({
          populate: true,
          limit: 2000,
          offset: 1, 
        });

      const associateToUpdateTrue: any = []
      const associateToUpdateFalse: any= []
      const watersystemToUpdateTrue: any = []
      const watersystemToUpdateFalse: any = []
        
      associates.forEach(async (associate) => {
        
        const expirationDate = await strapi.service('api::update-membership-status.update-membership-status').getExpirationDate(associate.payment_previous_date, associate.payment_last_date);

        //  ExpirationDate > Today        
         if (expirationDate.isAfter(dayjs())) {
          associateToUpdateTrue.push(associate);
        }

        //  ExpirationDate < Today        
        if (expirationDate.isBefore(dayjs())) {
          associateToUpdateFalse.push(associate);
        }
      })

      watersystems.forEach((watersystem) => {

        const expirationDate = strapi.service('api::update-membership-status.update-membership-status').getExpirationDate(watersystem.payment_previous_date, watersystem.payment_last_date);

        //  ExpirationDate > Today 
        if (expirationDate.isAfter(dayjs())) {
          watersystemToUpdateTrue.push(watersystem);
        }

        // ExpirationDate < Today 
        if (expirationDate.isBefore(dayjs())) {
          watersystemToUpdateFalse.push(watersystem);
        }
      });

      strapi.service('api::update-membership-status.update-membership-status').batchUpdateWaterSystems(watersystemToUpdateTrue, true);
      strapi.service('api::update-membership-status.update-membership-status').batchUpdateWaterSystems(watersystemToUpdateFalse, false);
      strapi.service('api::update-membership-status.update-membership-status').batchUpdateAssociates(associateToUpdateTrue, true);
      strapi.service('api::update-membership-status.update-membership-status').batchUpdateAssociates(associateToUpdateFalse, false);
      
      return 'updateMembershipStatus';
    } catch (error) {

      console.error('Error in updateMembershipStatus:', error);

      return 'updateMembershipStatus failed';
    }
  },
});
