/**
 * Custom water system routes.
 *
 * The `01-` prefix is load-bearing: Strapi registers route files in name
 * order, and this must come before the core router in `watersystem.ts`, whose
 * `GET /watersystems/:id` would otherwise take "naylor-export" as an id.
 */
export default {
  routes: [
    {
      method: 'GET',
      path: '/watersystems/naylor-export',
      handler: 'watersystem.naylorExport',
    },
  ],
};
