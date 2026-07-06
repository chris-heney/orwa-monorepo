/**
 * A set of functions called "actions" for `remove-registration`
 */

import { findOneById } from '../../../utils/document-compat';

export default ({ strapi }) => {

  return {
    removeRegistration: async (ctx) => {
      const { registrationId } = ctx.request.body

      const registration = await findOneById('api::conference-registration.conference-registration', registrationId, {
        populate: '*'
      })

      const sponsor = await strapi.documents('api::conference-sponsor.conference-sponsor').findMany({
        populate: '*',
        filters: { registration: registrationId }
      })

      const attendeeIds = registration.attendees.map(attendee => attendee.id)
      const boothIds = registration.booths.map(booth => booth.id)
      const contestantIds = registration.contestants.map(contestant => contestant.id)
      
      const attendees = await strapi.documents('api::conference-attendee.conference-attendee').findMany({
        populate: '*',
        filters: { id: attendeeIds }
      })

      const booths = await strapi.documents('api::conference-booth.conference-booth').findMany({
        populate: '*',
        filters: { id: boothIds }
      })

      const contestants = await strapi.documents('api::conference-contestant.conference-contestant').findMany({
        populate: '*',
        filters: { id: contestantIds }
      })

      // delete all the attendees and booths and finally the registration

      try {
        for (const attendee of attendees) {
          await strapi.documents('api::conference-attendee.conference-attendee').delete({
            documentId: attendee.documentId
          })
        }

        for (const booth of booths) {
          await strapi.documents('api::conference-booth.conference-booth').delete({
            documentId: booth.documentId
          })
        }

        for (const contestantId of contestants) {
          await strapi.documents('api::conference-contestant.conference-contestant').delete({
            documentId: contestantId.documentId
          })
        }

       if (sponsor.length > 0) {
          await strapi.documents('api::conference-sponsor.conference-sponsor').delete({
            documentId: sponsor[0].documentId
          })
       }


        await strapi.documents('api::conference-registration.conference-registration').delete({
          documentId: registration.documentId
        })

        return ctx.body = {
          result: 'success'
        }
      } catch (err) {
        ctx.body = {
          result: 'Error',
          error: err.message
        }
      }
    }
  };
};
