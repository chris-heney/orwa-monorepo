/**
 * Advances training-event statuses from event dates:
 *   RSVP        -> LIVE      while start <= now < end
 *   RSVP | LIVE -> COMPLETE  once end < now
 *
 * Replaces the legacy member-manager behavior of writing status changes from
 * the browser whenever someone opened the event list. Never touches
 * DRAFT / REVIEW / DEQ / CANCELLED events.
 */
export default {
  advanceTrainingEventStatuses: {
    task: async ({ strapi }) => {
      const now = new Date().toISOString();

      try {
        const goLive = await strapi.db
          .query("api::training-event.training-event")
          .findMany({
            where: {
              status: "RSVP",
              start: { $lte: now },
              end: { $gt: now },
            },
            select: ["id"],
          });

        const complete = await strapi.db
          .query("api::training-event.training-event")
          .findMany({
            where: {
              status: { $in: ["RSVP", "LIVE"] },
              end: { $lt: now },
            },
            select: ["id"],
          });

        for (const event of goLive) {
          await strapi.db
            .query("api::training-event.training-event")
            .update({ where: { id: event.id }, data: { status: "LIVE" } });
        }

        for (const event of complete) {
          await strapi.db
            .query("api::training-event.training-event")
            .update({ where: { id: event.id }, data: { status: "COMPLETE" } });
        }

        if (goLive.length || complete.length) {
          console.log(
            `🏫 Training status cron: ${goLive.length} -> LIVE, ${complete.length} -> COMPLETE`
          );
        }
      } catch (error) {
        console.error("❌ Training status cron failed:", error);
      }
    },
    options: {
      rule: "0 * * * *", // hourly, on the hour
    },
  },
};
