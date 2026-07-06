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
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    await configureStaffRole(strapi);
  },
};