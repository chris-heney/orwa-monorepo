/**
 * Admin-only user impersonation. Mints a short-lived session token for a
 * target user so an Admin can reproduce that user's exact experience
 * (their role, their linked contact/data, their saved view settings) without
 * ever knowing their password. Every use is audit-logged server-side.
 */
export default {
  routes: [
    {
      method: 'POST',
      path: '/impersonation',
      handler: 'impersonation.start',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
