/**
 * A set of functions called "actions" for `data-corps`
 */

export default ({ strapi }) => ({

  /**
   * Medics job is to come in and fix things after a mission.  Every soldier has a primary mission objective,
   * and a secondary mission objective.  This "Worker Function" is designed to resolve post-launch issues.
   * @param ctx Ex
   * @param next 
   */
  dataCorps: async (ctx, next) => { ctx.body = 'Hoowah'; },
  dataCorpsDivision: async (ctx, next) => { ctx.body = 'Hoowah'; },
  dataCorpsDivisionBrigade: async (ctx, next) => { ctx.body = 'Hoowah'; },
  dataCorpsDivisionBrigadeBattalion: async (ctx, next) => { ctx.body = 'Hoowah'; },
  dataCorpsDivisionBrigadeBattalionCompany: async (ctx, next) => { ctx.body = 'Hoowah'; },
  dataCorpsDivisionBrigadeBattalionCompanyPlatoon: async (ctx, next) => { ctx.body = 'Hoowah'; },
  dataCorpsDivisionBrigadeBattalionCompanyPlatoonSquad: async (ctx, next) => { ctx.body = 'Hoowah'; },
  dataCorpsDivisionBrigadeBattalionCompanyPlatoonSquadSoldier: async (ctx, next) => { ctx.body = 'Hoowah'; },
  dataCorpsDivisionBrigadeBattalionCompanyPlatoonSquadSoldierMedic: async (ctx, next) => {

    try {
      const { mission } = ctx.params;

      console.log('Medic is on the way to resolve: ', mission);

      switch (mission) {
        case 'heal-attendee-ticket-types':
          /**
           * The mission is to heal the attendee's ticket types.  This is a multi-step process.
           * 1. Use strapi's entity service to find and cache all ticket types in a key/value store.
           * 2. Also using strapi's entity service, fin all conference-attendees, lopo through them, and update the
           *    type_id (relationship) using the type (string).
           */
          break;
        case 'heal-organization': {
          const healOrganization = async () => {

            const registrations = await strapi.documents('api::conference-registration.conference-registration').findMany({
              fields: ['organization'],
              populate: ['attendees', 'booths']
            });

            for (const registration of registrations) {
              console.log('Registration: ', registration.id, registration.organization, registration.attendees.length, registration.booths.length);

              if (registration.organization !== null && registration.organization !== '') { continue; }
              for (const booth of registration.booths) {

                if (booth.organization === null || booth.organization === '') { continue; }
                for (const attendee of registration.attendees) {

                  if (attendee.organization !== null && attendee.organization !== '') { continue; }

                  console.log('Updating attendee organization from booth: ', booth.organization);

                  await strapi.documents('api::conference-attendee.conference-attendee').update({
                    documentId: "__TODO__",

                    data: {
                      organization: booth.organization
                    }
                  });
                }

                console.log('Updating registration organization from booth: ', booth.organization);

                await strapi.documents('api::conference-registration.conference-registration').update({
                  documentId: "__TODO__",

                  data: {
                    organization: booth.organization
                  }
                });

                break;
              }

              // Loop through each attendee (non-vendor) and update the organization
              for (const attendee of registration.attendees) {

                if (attendee.type === 'Vendor' || ( registration.organization !== null && registration.organization !== '' ) || (attendee.organization === null || attendee.organization === '') ) {
                  continue;
                }

                console.log('Updating registration with attendee\'s organization: ', attendee.organization);

                // Update the attendee's organization
                await strapi.documents('api::conference-registration.conference-registration').update({
                  documentId: "__TODO__",

                  data: {
                    organization: attendee.organization
                  }
                });

                break;
              }
            }
          }

          await healOrganization()

          break;
        }
        case 'heal-registration-type': {

          const healRegistrationType = async () => {

            const registrations = await strapi.documents('api::conference-registration.conference-registration').findMany({
              fields: ['type'],
              populate: ['attendees', 'booths']
            });

            console.log('Registrations: ', registrations.length);

            for (const registration of registrations) {

              if (registration.type !== null && registration.type !== '') { continue; }
              if (registration.booths.length > 0) {

                console.log('Updating registration type: Vendor')

                await strapi.documents('api::conference-registration.conference-registration').update({
                  documentId: "__TODO__",

                  data: {
                    type: 'Vendor'
                  }
                });
              } else {

                console.log('Updating registration type: Attendee')

                await strapi.documents('api::conference-registration.conference-registration').update({
                  documentId: "__TODO__",

                  data: {
                    type: 'Attendee'
                  }
                });
              }
            }
          }

          await healRegistrationType()

          break;
        }
        case 'heal-names':
          // Do something
          break;
      }

      ctx.body = 'Hoowah';
    } catch (err) {
      console.log(err);
      ctx.body = err;
    }
  }
});
