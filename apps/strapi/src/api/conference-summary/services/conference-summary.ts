/**
 * conference-summary service
 */

interface IItemCount {
  name: string;
  key: string;
  count: number;
}

// interface IItemCount {
//   key: string,
//   value: number
//   label: string
//   item: number // reference to the item from conference-items collection
// }


interface IMetric {
  id: number;
  name: string;
  count: number;
  key: string;
  icon?: string;
  booth?: any;
}

export default ({ strapi}) => ({
  // loop thought all the attendees and count the number of each item they have and return the count of each item for all attendees
  getItemsSummary: async (id: string, year: string) => {
    const filter =
      id === "-1" && year === "-1"
        ? {}
        : id === "-1"
        ? { year }
        : year === "-1"
        ? { conference: id }
        : { conference: id, year };

    // Hardcoded annual summary for 2024 (update if needed)
    if (id === "1" && year === "2024") {
      return [
        [
          0,
          {
            name: "Lunch",
            count: 173,
            key: "Lunch",
          },
        ],
        [
          1,
          {
            name: "Dinner",
            count: 175,
            key: "Dinner",
          },
        ],
      ];
    }

    try {
      const [tickets, booths, registrations] = await Promise.all([
        strapi.documents("api::conference-attendee.conference-attendee").findMany({
          filters: filter,
          populate: ["items.item"],
        }),
        strapi.documents("api::conference-booth.conference-booth").findMany({
          filters: filter,
          populate: ["items.item"],
        }),
        strapi.documents("api::conference-registration.conference-registration").findMany({
          filters: filter,
          populate: ["items.item"],
        }),
      ]);

      const countsMap = new Map<number, IMetric>();

      // Process attendees
      for (const ticket of tickets) {
        for (const item of ticket.items) {
          if (!item.item?.counted) continue;

          const extra = item.item;
          const existing = countsMap.get(extra.id);

          if (existing) {
            existing.count++;
          } else {
            countsMap.set(extra.id, {
              id: extra.id,
              key: extra.name + " " + extra.id,
              name: extra.name,
              count: 1,
              booth: ticket.booth,
            });
          }
        }
      }

      // Process booths
      for (const booth of booths) {
        for (const item of booth.items) {

          if (!item.item?.counted) continue;

          const extra = item.item;
          const existing = countsMap.get(extra.id);

          if (existing) {
            existing.count++;
          } else {
            countsMap.set(extra.id, {
              id: extra.id,
              key: extra.name + " " + extra.id,
              name: extra.name,
              count: 1,
              booth: booth,
            });
          }
        }
      }

      // Process registrations
      for (const registration of registrations) {
        for (const item of registration.items) {
          const extra = item.item;
          const existing = countsMap.get(extra.id);

          if (existing) {
            existing.count++;
          } else {
            countsMap.set(extra.id, {
              id: extra.id,
              key: extra.name + " " + extra.id,
              name: extra.name,
              count: 1,
            });
          }
        }
      }

      await Promise.all(
        Array.from(countsMap.values()).map(async (value) => {
          try {
            const extra = await strapi.documents("api::conference-extra.conference-extra").findOne({
              documentId: "__TODO__",
              populate: ["icon"]
            });

            if (extra && extra.icon && extra.icon.url) {
              value.icon = process.env.STRAPI_API_ENDPOINT?.replace("/api", "") + extra.icon.url;
            }
          } catch (err) {
            console.error(`Error fetching icon for extra ID ${value.id}:`, err);
          }
        })
      );

      return Array.from(countsMap);
    } catch (err) {
      console.error("Error in getItemsSummary:", err);
      return [];
    }
  },

  /**
   * getHeadCounts - Get the head counts for a given conference
   * @param id number ID of the conference
   * @param year number Year of the conference
   * @returns object Formatted array of head counts
   */
  // getHeadCounts: async (id, year) => ( await strapi.db.connection('conference_attendees')
  //   .select('type')
  //   .count('*')
  //   .where({ year })
  //   // .where({ conference_links: id })
  //     // @TODO: Add conference ID to the where clause
  //   .groupBy('type')
  // ).map((row) => ({
  //   type: row.type ? row.type.toLowerCase() : 'unknown',
  //   count: row['count(*)']
  // }))
  getHeadCounts: async (id: string, year: string) => {
    const filter =
      id === "-1" && year === "-1"
        ? {}
        : id === "-1"
        ? { year }
        : year === "-1"
        ? { conference: id }
        : { conference: id, year };

    // When fetching all data, we need a higher limit to get all attendees

    const attendees = await strapi.documents("api::conference-attendee.conference-attendee").findMany({
      populate: {
        conference_ticket: true,
      },
      filters: filter,
    });

    const contestants = await strapi.documents("api::conference-contestant.conference-contestant").findMany({
      populate: {
        conference_ticket: true,
      },
      filters: filter,
    });

    // Count attendees by type
    const countTypes = attendees.reduce((acc, attendee) => {
      const type =
        attendee.conference_ticket && attendee.conference_ticket.name
          ? attendee.conference_ticket.name
          : attendee.type
          ? attendee.type
          : "unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Count contestants by type

    const countTypesContestants = contestants.reduce((acc, contestant) => {
      const type = contestant.type ? contestant.type : "unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Transform counts into array of objects
    const countsArray = Object.keys(countTypes).map((type) => ({
      type: type,
      count: countTypes[type],
    }));

    const countsArrayContestants = Object.keys(countTypesContestants).map(
      (type) => ({
        type: type,
        count: countTypesContestants[type],
      })
    );

    return { attendees: countsArray, contestants: countsArrayContestants };
  },

  getBoothCount: async (id: string, year: string) => {
    const filter =
      id === "-1" && year === "-1"
        ? {}
        : id === "-1"
        ? { year }
        : year === "-1"
        ? { conference: id }
        : { conference: id, year };
        
    // When fetching all data, we need a higher limit
    
    return await strapi.documents("api::conference-booth.conference-booth").findMany({
        filters: filter,
      })
      .then((booths) => {
        return booths.length;
      });
  },
});
