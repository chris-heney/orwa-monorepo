const TERM_PUBLIC_ACTIONS = [
  'api::term.term.find',
  'api::term.term.findOne',
];

const TERM_AUTHENTICATED_ACTIONS = [
  ...TERM_PUBLIC_ACTIONS,
  'api::term.term.create',
  'api::term.term.update',
  'api::term.term.delete',
];

const ensureRolePermissions = async (strapi, roleWhere, actions) => {
  const roleQuery = strapi.db.query('plugin::users-permissions.role');
  const permissionQuery = strapi.db.query('plugin::users-permissions.permission');
  const role = await roleQuery.findOne({ where: roleWhere });
  if (!role) {
    return;
  }

  const existingPermissions = await permissionQuery.findMany({
    where: { role: { id: role.id } },
  });
  const existingActions = new Set(existingPermissions.map((p) => p.action));

  await Promise.all(
    actions
      .filter((action) => !existingActions.has(action))
      .map((action) =>
        permissionQuery.create({
          data: {
            action,
            role: role.id,
          },
        })
      )
  );
};

const configureTermPermissions = async (strapi) => {
  try {
    await ensureRolePermissions(strapi, { type: 'public' }, TERM_PUBLIC_ACTIONS);
    await ensureRolePermissions(
      strapi,
      { type: 'authenticated' },
      TERM_AUTHENTICATED_ACTIONS
    );
    // Custom Admin role used by member-manager
    await ensureRolePermissions(strapi, { type: 'admin' }, TERM_AUTHENTICATED_ACTIONS);
  } catch (error) {
    strapi.log.warn(`Unable to configure Term permissions: ${error.message}`);
  }
};

/** Self-only RaStore sync for member-manager. */
const USER_PREFERENCES_ACTIONS = [
  // Current dedicated API
  'api::my-preferences.my-preferences.getMine',
  'api::my-preferences.my-preferences.updateMine',
  // Legacy paths on api::user (kept for in-flight clients)
  'api::user.user.getMyPreferences',
  'api::user.user.updateMyPreferences',
];

const configureUserPreferencesPermissions = async (strapi) => {
  try {
    await ensureRolePermissions(
      strapi,
      { type: 'authenticated' },
      USER_PREFERENCES_ACTIONS
    );
    await ensureRolePermissions(strapi, { type: 'admin' }, USER_PREFERENCES_ACTIONS);
    await ensureRolePermissions(strapi, { type: 'staff' }, USER_PREFERENCES_ACTIONS);
  } catch (error) {
    strapi.log.warn(
      `Unable to configure user preferences permissions: ${error.message}`
    );
  }
};

const STAFF_ROLE_TYPE = 'staff';
const STAFF_ALLOWED_ACTIONS = [
  'api::associate.associate.find',
  'api::associate.associate.findOne',
  'api::watersystem.watersystem.find',
  'api::watersystem.watersystem.findOne',
  'api::membership.membership.find',
  'api::membership.membership.findOne',
  'api::saved-query.saved-query.find',
  'api::saved-query.saved-query.findOne',
  'plugin::upload.content-api.find',
  'plugin::upload.content-api.findOne',
  'api::my-preferences.my-preferences.getMine',
  'api::my-preferences.my-preferences.updateMine',
  'api::user.user.getMyPreferences',
  'api::user.user.updateMyPreferences',
];

const configureStaffRole = async (strapi) => {
  try {
    const roleQuery = strapi.db.query('plugin::users-permissions.role');
    const permissionQuery = strapi.db.query('plugin::users-permissions.permission');

    let staffRole = await roleQuery.findOne({
      where: { $or: [{ type: STAFF_ROLE_TYPE }, { name: 'Staff' }] },
    });

    if (!staffRole) {
      staffRole = await roleQuery.create({
        data: {
          name: 'Staff',
          description: 'Memberships-only read access.',
          type: STAFF_ROLE_TYPE,
        },
      });
    } else if (staffRole.name !== 'Staff' || staffRole.type !== STAFF_ROLE_TYPE) {
      staffRole = await roleQuery.update({
        where: { id: staffRole.id },
        data: {
          name: 'Staff',
          type: STAFF_ROLE_TYPE,
        },
      });
    }

    const existingPermissions = await permissionQuery.findMany({
      where: { role: { id: staffRole.id } },
    });
    const allowedActions = new Set(STAFF_ALLOWED_ACTIONS);

    await Promise.all(
      existingPermissions
        .filter((permission) => !allowedActions.has(permission.action))
        .map((permission) => permissionQuery.delete({ where: { id: permission.id } }))
    );

    const existingActions = new Set(
      existingPermissions
        .filter((permission) => allowedActions.has(permission.action))
        .map((permission) => permission.action)
    );

    await Promise.all(
      STAFF_ALLOWED_ACTIONS
        .filter((action) => !existingActions.has(action))
        .map((action) =>
          permissionQuery.create({
            data: {
              action,
              role: staffRole.id,
            },
          })
        )
    );
  } catch (error) {
    strapi.log.warn(`Unable to configure Staff role permissions: ${error.message}`);
  }
};

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    // Strapi 4 coerced write-payload primitive types; Strapi 5 validates
    // strictly. Restore v4-compatible coercion (and strip system fields)
    // for every api:: create/update so legacy clients and intake forms
    // keep working. See src/utils/coerce-to-schema.ts.
    const { coerceToSchema } = require('./utils/coerce-to-schema');

    strapi.documents.use((context, next) => {
      if (
        (context.action === 'create' || context.action === 'update') &&
        typeof context.uid === 'string' &&
        context.uid.startsWith('api::') &&
        context.params?.data
      ) {
        coerceToSchema(context.uid, context.params.data);
      }
      return next();
    });

    // When project_costs is present on a grant application write, snapshot
    // type name/classification and recompute combined_cost_of_projects as
    // the rounded sum. Runs after coerce so amounts are already integers.
    const { enrichProjectCosts } = require('./utils/enrich-project-costs');
    const GRANT_APPLICATION_UID =
      'api::grant-application-final.grant-application-final';

    strapi.documents.use(async (context, next) => {
      if (
        (context.action === 'create' || context.action === 'update') &&
        context.uid === GRANT_APPLICATION_UID &&
        context.params?.data &&
        Array.isArray(context.params.data.project_costs)
      ) {
        await enrichProjectCosts(context.params.data);
      }
      return next();
    });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    await configureStaffRole(strapi);
    await configureTermPermissions(strapi);
    await configureUserPreferencesPermissions(strapi);
  },
};