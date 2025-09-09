/**
 * A set of functions called "actions" for `remove-registration`
 */

export default ({ strapi }) => {

  return {
    removeRegistration: async (ctx) => {
      const { registrationId } = ctx.request.body

      const registration = await strapi.documents('api::conference-registration.conference-registration').findOne({
        documentId: "__TODO__",
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
            documentId: "__TODO__"
          })
        }

        for (const booth of booths) {
          await strapi.documents('api::conference-booth.conference-booth').delete({
            documentId: "__TODO__"
          })
        }

        for (const contestantId of contestants) {
          await strapi.documents('api::conference-contestant.conference-contestant').delete({
            documentId: "__TODO__"
          })
        }

       if (sponsor.length > 0) {
          await strapi.documents('api::conference-sponsor.conference-sponsor').delete({
            documentId: "__TODO__"
          })
       }


        await strapi.documents('api::conference-registration.conference-registration').delete({
          documentId: "__TODO__"
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
