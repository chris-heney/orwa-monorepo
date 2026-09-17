/**
 *  watersystem controller
 */

import { factories } from '@strapi/strapi';
import {
  buildNaylorRows,
  toNaylorCsv,
  type NaylorSystem,
} from '../helpers/naylor-export';

export default factories.createCoreController(
  'api::watersystem.watersystem',
  ({ strapi }) => ({
    /**
     * GET /api/watersystems/naylor-export → the Naylor directory file (CSV).
     *
     * Takes no parameters on purpose: the published directory is every current
     * member system (the builder selects them), in directory order, with the
     * contractual columns. A caller's grid columns, filters, sort or page size
     * have no way in.
     *
     * Reads through the query engine, not the content API: no default page
     * limit to silently truncate the directory, and no per-role sanitizing of
     * the populated contacts (the route's own permission is the gate).
     */
    async naylorExport(ctx) {
      const [systems, optedOutContacts] = await Promise.all([
        strapi.db.query('api::watersystem.watersystem').findMany({
          populate: { contacts: true },
          orderBy: { id: 'asc' },
        }),
        strapi.db.query('api::contact.contact').findMany({
          where: { directory_opt_out: true },
          select: ['email'],
        }),
      ]);

      const csv = toNaylorCsv(
        buildNaylorRows(systems as NaylorSystem[], optedOutContacts)
      );

      const stamp = new Date().toISOString().slice(0, 10);
      ctx.set(
        'Content-Disposition',
        `attachment; filename="Watersystems-Naylor-${stamp}.csv"`
      );
      // The browser reads the file name off this header cross-origin.
      ctx.set('Access-Control-Expose-Headers', 'Content-Disposition');
      ctx.set('Cache-Control', 'no-store');
      ctx.type = 'text/csv; charset=utf-8';
      ctx.body = csv;
    },
  })
);
