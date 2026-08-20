'use strict';

/**
 * Admin-only user impersonation.
 *
 * Security model:
 * - The caller's Admin status is re-read from the DB every call — never
 *   trusted from `ctx.state` (which the role-impersonation layer can rewrite).
 * - Success mints a real users-permissions JWT for the TARGET user, so the
 *   frontend can browse as them. Because it is a real user token, any write is
 *   attributed to the target; the UI warns about this and the server logs
 *   every impersonation start (who → whom).
 * - This is a superset of what an Admin can already do (Admins hold every
 *   permission), so it grants no new authority — it only changes attribution
 *   and makes the target's own data/preferences visible for debugging.
 */
const isAdminRole = (role: { type?: string; name?: string } | null | undefined) =>
  role != null && (role.type === 'admin' || role.name === 'Admin');

export default ({ strapi }) => ({
  start: async (ctx) => {
    const actor = ctx.state.user;
    if (!actor?.id) {
      return ctx.unauthorized('You must be authenticated');
    }

    // Re-read the actor's real role from the DB. Do NOT trust ctx.state.user.role
    // here: the X-Impersonate-Role layer may have swapped it for a preview role.
    const actorRow = await strapi.db
      .query('plugin::users-permissions.user')
      .findOne({ where: { id: actor.id }, populate: ['role'] });

    if (!isAdminRole(actorRow?.role)) {
      return ctx.forbidden('Only an Admin may impersonate a user');
    }

    const rawId =
      ctx.request.body?.userId ?? ctx.request.body?.data?.userId;
    const targetId = Number(rawId);
    if (!Number.isFinite(targetId) || targetId <= 0) {
      return ctx.badRequest('Expected a numeric "userId"');
    }

    if (targetId === actorRow.id) {
      return ctx.badRequest('You are already signed in as this user');
    }

    const target = await strapi.db
      .query('plugin::users-permissions.user')
      .findOne({ where: { id: targetId }, populate: ['role'] });

    if (!target) {
      return ctx.notFound('User not found');
    }
    if (target.blocked) {
      return ctx.badRequest('Cannot impersonate a blocked user');
    }

    const jwt = strapi
      .plugin('users-permissions')
      .service('jwt')
      .issue({ id: target.id });

    strapi.log.warn(
      `[impersonation] Admin id=${actorRow.id} <${actorRow.email}> ` +
        `started impersonating user id=${target.id} <${target.email}> ` +
        `(role=${target.role?.name ?? 'none'})`,
    );

    ctx.body = {
      jwt,
      user: {
        id: target.id,
        username: target.username,
        email: target.email,
        role: target.role
          ? {
              id: target.role.id,
              name: target.role.name,
              type: target.role.type,
            }
          : null,
      },
    };
  },
});
