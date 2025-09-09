/**
 * A set of functions called "actions" for `conference-summary`
 */

export default ({strapi}) => ({

  getConferenceSummary: async (ctx) => {
    
    try {
      // If no conference id or year are provided, use "-1" to indicate no filtering
      const conferenceId = ctx.params.id || "-1";
      const year = ctx.params.year || "-1";

      const boothCountSummary = await strapi.service('api::conference-summary.conference-summary').getBoothCount(
        conferenceId,
        year
      );

      const itemCountsSummary = await strapi.service('api::conference-summary.conference-summary').getItemsSummary(
        conferenceId,
        year
      )

      console.log("itemCountsSummary", itemCountsSummary);

      
      const {attendees, contestants} = await strapi.service('api::conference-summary.conference-summary').getHeadCounts(
        conferenceId,
        year
      )
      
      // Only fetch specific conference details if an actual ID is provided
      const conference = conferenceId !== "-1" ? 
        await strapi.documents('api::conference.conference').findOne({
          documentId: "__TODO__",
          populate: ['*']
        }) : 
        {name: 'All Conferences', booths_available: 5000}; // Default value when no specific conference

      ctx.body = {
        conference,
        boothCount: boothCountSummary,
        itemCounts: itemCountsSummary,
        headCountAttendees: attendees,  
        headCountContestants: contestants      
      }

    } catch (err) {
      ctx.body = err;
    }
  }
});


