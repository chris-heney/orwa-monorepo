/**
 * A set of functions called "actions" for `remove-registration`
 *
 * Hard-deletes a conference registration and every registration-owned child
 * record (attendees, booths, contestants, taste-test contestants,
 * sponsorships, and the sponsor record). Extras ride along automatically:
 * they live as `items` components on the attendee/contestant rows, and
 * Strapi deletes components with their parent entry. The conference itself
 * and shared records (contacts, teams) are never touched.
 */

import { findOneById } from '../../../utils/document-compat';

export default ({ strapi }) => {
  return {
    removeRegistration: async (ctx) => {
      const { registrationId } = ctx.request.body ?? {};

      if (!registrationId) {
        return ctx.badRequest('registrationId is required');
      }

      // Accepts a v5 documentId (what member-manager sends) or a legacy
      // numeric entity id.
      const registration = await findOneById(
        'api::conference-registration.conference-registration',
        registrationId,
        { populate: '*' }
      );

      if (!registration) {
        return ctx.notFound(
          `Registration ${registrationId} was not found — it may already have been removed.`
        );
      }

      // The sponsor record points at the registration (not the reverse), so
      // look it up by relation. Filter on documentId — a bare string here
      // would silently match nothing.
      const sponsors = await strapi
        .documents('api::conference-sponsor.conference-sponsor')
        .findMany({
          filters: { registration: { documentId: registration.documentId } },
        });

      // Populated v5 relations always carry documentId; empty relations can
      // come back null, so guard every list.
      const children: Array<{ uid: string; rows: Array<{ documentId: string }> }> = [
        {
          uid: 'api::conference-attendee.conference-attendee',
          rows: registration.attendees ?? [],
        },
        {
          uid: 'api::conference-booth.conference-booth',
          rows: registration.booths ?? [],
        },
        {
          uid: 'api::conference-contestant.conference-contestant',
          rows: registration.contestants ?? [],
        },
        {
          uid: 'api::taste-test-contestant.taste-test-contestant',
          rows: registration.taste_test_contestants ?? [],
        },
        {
          uid: 'api::conference-sponsorship.conference-sponsorship',
          rows: registration.sponsorships ?? [],
        },
        {
          uid: 'api::conference-sponsor.conference-sponsor',
          rows: sponsors ?? [],
        },
      ];

      try {
        for (const { uid, rows } of children) {
          for (const row of rows) {
            if (row?.documentId) {
              await strapi.documents(uid).delete({ documentId: row.documentId });
            }
          }
        }

        await strapi
          .documents('api::conference-registration.conference-registration')
          .delete({ documentId: registration.documentId });

        ctx.body = { result: 'success' };
      } catch (err) {
        strapi.log.error('remove-registration failed', err);
        ctx.status = 500;
        ctx.body = {
          result: 'Error',
          error: err.message,
        };
      }
    },
  };
};
