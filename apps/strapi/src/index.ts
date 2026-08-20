// Frontend module keys. Must stay in sync with the frontend registry in
// apps/member-manager/src/config/modules.ts.
const MODULE_KEYS = [
  'dashboard',
  'emails',
  'memberships',
  'contacts',
  'assets',
  'media-library',
  'training',
  'conference',
  'terms',
  'grants',
  'scholarships',
  'awards',
  'rbac',
  'settings',
];

const TERM_PUBLIC_ACTIONS = ['api::term.term.find', 'api::term.term.findOne'];

const TERM_AUTHENTICATED_ACTIONS = [
  ...TERM_PUBLIC_ACTIONS,
  'api::term.term.create',
  'api::term.term.update',
  'api::term.term.delete',
];

const ensureRolePermissions = async (strapi, roleWhere, actions) => {
  const roleQuery = strapi.db.query('plugin::users-permissions.role');
  const permissionQuery = strapi.db.query(
    'plugin::users-permissions.permission',
  );
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
        }),
      ),
  );
};

const configureTermPermissions = async (strapi) => {
  try {
    await ensureRolePermissions(
      strapi,
      { type: 'public' },
      TERM_PUBLIC_ACTIONS,
    );
    await ensureRolePermissions(
      strapi,
      { type: 'authenticated' },
      TERM_AUTHENTICATED_ACTIONS,
    );
    // Custom Admin role used by member-manager
    await ensureRolePermissions(
      strapi,
      { type: 'admin' },
      TERM_AUTHENTICATED_ACTIONS,
    );
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

const SCHOLARSHIP_CRUD = [
  'api::scholarship-application.scholarship-application.find',
  'api::scholarship-application.scholarship-application.findOne',
  'api::scholarship-application.scholarship-application.create',
  'api::scholarship-application.scholarship-application.update',
  'api::scholarship-application.scholarship-application.delete',
];

const AWARD_CRUD = [
  'api::award-nomination.award-nomination.find',
  'api::award-nomination.award-nomination.findOne',
  'api::award-nomination.award-nomination.create',
  'api::award-nomination.award-nomination.update',
  'api::award-nomination.award-nomination.delete',
];

const SUBMISSION_PUBLIC_ACTIONS = [
  'api::submissions.submissions.createScholarshipApplication',
  'api::submissions.submissions.createAwardNomination',
];

const configureScholarshipAwardPermissions = async (strapi) => {
  try {
    await ensureRolePermissions(
      strapi,
      { type: 'public' },
      SUBMISSION_PUBLIC_ACTIONS,
    );
    await ensureRolePermissions(strapi, { type: 'authenticated' }, [
      ...SCHOLARSHIP_CRUD,
      ...AWARD_CRUD,
      ...SUBMISSION_PUBLIC_ACTIONS,
    ]);
    await ensureRolePermissions(strapi, { type: 'admin' }, [
      ...SCHOLARSHIP_CRUD,
      ...AWARD_CRUD,
      ...SUBMISSION_PUBLIC_ACTIONS,
    ]);
  } catch (error) {
    strapi.log.warn(
      `Unable to configure scholarship/award permissions: ${error.message}`,
    );
  }
};

const seedOrwefFormEmails = async (strapi) => {
  try {
    const { seedOrwefEmailTemplates } = require('./api/submissions/form-email');
    await seedOrwefEmailTemplates(strapi);
  } catch (error) {
    strapi.log.warn(`Unable to seed ORWEF email templates: ${error.message}`);
  }
};

const configureUserPreferencesPermissions = async (strapi) => {
  try {
    await ensureRolePermissions(
      strapi,
      { type: 'authenticated' },
      USER_PREFERENCES_ACTIONS,
    );
    await ensureRolePermissions(
      strapi,
      { type: 'admin' },
      USER_PREFERENCES_ACTIONS,
    );
    await ensureRolePermissions(
      strapi,
      { type: 'staff' },
      USER_PREFERENCES_ACTIONS,
    );
  } catch (error) {
    strapi.log.warn(
      `Unable to configure user preferences permissions: ${error.message}`,
    );
  }
};

// Scopes for the users-permissions role/permission endpoints consumed by the
// RBAC Manager. Grant these to the Admin role only (never public/authenticated/staff).
const ADMIN_RBAC_ACTIONS = [
  'plugin::users-permissions.role.find',
  'plugin::users-permissions.role.findOne',
  'plugin::users-permissions.role.createRole',
  'plugin::users-permissions.role.updateRole',
  'plugin::users-permissions.role.deleteRole',
  'plugin::users-permissions.permissions.getPermissions',
];

const configureAdminRbacPermissions = async (strapi) => {
  try {
    await ensureRolePermissions(strapi, { type: 'admin' }, ADMIN_RBAC_ACTIONS);
  } catch (error) {
    strapi.log.warn(
      `Unable to configure Admin RBAC permissions: ${error.message}`,
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
  'plugin::users-permissions.user.me',
];

const configureStaffRole = async (strapi) => {
  try {
    const roleQuery = strapi.db.query('plugin::users-permissions.role');
    const permissionQuery = strapi.db.query(
      'plugin::users-permissions.permission',
    );

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

      // Seed defaults only on first creation; after that the RBAC Manager
      // (and the Strapi admin UI) own this role's permissions.
      await Promise.all(
        STAFF_ALLOWED_ACTIONS.map((action) =>
          permissionQuery.create({
            data: {
              action,
              role: staffRole.id,
            },
          }),
        ),
      );
    } else if (
      staffRole.name !== 'Staff' ||
      staffRole.type !== STAFF_ROLE_TYPE
    ) {
      staffRole = await roleQuery.update({
        where: { id: staffRole.id },
        data: {
          name: 'Staff',
          type: STAFF_ROLE_TYPE,
        },
      });
    }
  } catch (error) {
    strapi.log.warn(
      `Unable to configure Staff role permissions: ${error.message}`,
    );
  }
};

const configureStaffBaselinePermissions = async (strapi) => {
  try {
    // Existing Staff roles predate the /users/me whitelist entry; additively
    // ensure the scope every logged-in role needs for module gating.
    await ensureRolePermissions(strapi, { type: STAFF_ROLE_TYPE }, [
      'plugin::users-permissions.user.me',
    ]);
  } catch (error) {
    strapi.log.warn(
      `Unable to configure Staff baseline permissions: ${error.message}`,
    );
  }
};

const seedDefaultRoleModules = async (strapi) => {
  try {
    const roleQuery = strapi.db.query('plugin::users-permissions.role');
    const roles = await roleQuery.findMany();

    // One-time defaults: only roles that have never had modules set.
    // Never overwrite a non-null value.
    await Promise.all(
      roles
        .filter((role) => role.modules === null || role.modules === undefined)
        .map((role) =>
          roleQuery.update({
            where: { id: role.id },
            data: {
              modules:
                role.type === 'admin'
                  ? MODULE_KEYS
                  : role.type === STAFF_ROLE_TYPE
                    ? ['memberships']
                    : [],
            },
          }),
        ),
    );
  } catch (error) {
    strapi.log.warn(`Unable to seed default role modules: ${error.message}`);
  }
};

/**
 * Renewal queries that keep themselves current.
 *
 * `$now` tokens are expanded on every run (src/utils/relative-dates.ts), so
 * "expiring within a month" keeps meaning that instead of freezing on the day
 * it was saved — which is what left the renewal tasks matching nobody.
 *
 * Seeded rather than linked: creating a query sends no email, so an admin
 * still chooses it on the task. Matched by name, so this is idempotent and
 * never overwrites an edited query.
 */
const RENEWAL_SAVED_QUERIES = [
  {
    name: 'Water Systems — ORWAAG, expiring within a month',
    resource: 'watersystems',
    filters: {
      $and: [
        { orwaag: true },
        { expiration_date: { $between: ['$now', '$now+1M'] } },
      ],
    },
  },
  {
    name: 'Water Systems — expiring within a month',
    resource: 'watersystems',
    filters: { expiration_date: { $between: ['$now', '$now+1M'] } },
  },
  {
    name: 'Associates — expiring within a month',
    resource: 'associates',
    filters: { expiration_date: { $between: ['$now', '$now+1M'] } },
  },
];

const seedRenewalSavedQueries = async (strapi) => {
  try {
    const query = strapi.db.query('api::saved-query.saved-query');

    for (const definition of RENEWAL_SAVED_QUERIES) {
      const existing = await query.findOne({
        where: { name: definition.name },
      });
      if (existing) {
        continue;
      }

      await query.create({
        data: {
          ...definition,
          is_public: true,
        },
      });
      strapi.log.info(`Seeded saved query: ${definition.name}`);
    }
  } catch (error) {
    strapi.log.warn(`Unable to seed renewal saved queries: ${error.message}`);
  }
};

const MEMBERSHIP_YEAR_REPORT_ACTIONS = [
  'api::membership-year-report.membership-year-report.getYearReport',
];

/** The memberships summary chart reads this; every logged-in role needs it. */
const configureMembershipYearReportPermissions = async (strapi) => {
  try {
    for (const type of ['admin', 'authenticated', STAFF_ROLE_TYPE]) {
      await ensureRolePermissions(
        strapi,
        { type },
        MEMBERSHIP_YEAR_REPORT_ACTIONS,
      );
    }
  } catch (error) {
    strapi.log.warn(
      `Unable to configure membership year report permissions: ${error.message}`,
    );
  }
};

const MEMBERSHIP_EXPIRATION_UIDS = [
  'api::watersystem.watersystem',
  'api::associate.associate',
];

/**
 * Fills `expiration_date` for rows written before the column existed.
 *
 * Only touches rows where it is still null, so this is idempotent and cheap on
 * every boot after the first. Ongoing writes are handled by the content-type
 * lifecycles; this is purely the one-time catch-up for historical data.
 */
const backfillMembershipExpirations = async (strapi) => {
  const {
    getMembershipExpirationDate,
  } = require('./utils/membership-expiration');

  for (const uid of MEMBERSHIP_EXPIRATION_UIDS) {
    try {
      const query = strapi.db.query(uid);
      const stale = await query.findMany({
        where: {
          expiration_date: { $null: true },
          $or: [
            { payment_last_date: { $notNull: true } },
            { payment_previous_date: { $notNull: true } },
          ],
        },
        select: ['id', 'payment_last_date', 'payment_previous_date'],
      });

      if (stale.length === 0) {
        continue;
      }

      let filled = 0;
      for (const row of stale) {
        const expiration_date = getMembershipExpirationDate(
          row.payment_previous_date,
          row.payment_last_date,
        );
        if (!expiration_date) {
          continue;
        }
        await query.update({
          where: { id: row.id },
          data: { expiration_date },
        });
        filled += 1;
      }

      strapi.log.info(`Backfilled ${filled} ${uid} expiration dates.`);
    } catch (error) {
      strapi.log.warn(
        `Unable to backfill expiration dates for ${uid}: ${error.message}`,
      );
    }
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
    // Admin "test as role": after JWT auth, optionally rebuild ability from
    // X-Impersonate-Role. See src/utils/role-impersonation.ts.
    const {
      wrapAuthWithRoleImpersonation,
    } = require('./utils/role-impersonation');
    wrapAuthWithRoleImpersonation(strapi);

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
    await configureStaffBaselinePermissions(strapi);
    await configureTermPermissions(strapi);
    await configureUserPreferencesPermissions(strapi);
    await configureAdminRbacPermissions(strapi);
    await configureScholarshipAwardPermissions(strapi);
    await seedOrwefFormEmails(strapi);
    await configureMembershipYearReportPermissions(strapi);
    await seedRenewalSavedQueries(strapi);
    await seedDefaultRoleModules(strapi);
    await backfillMembershipExpirations(strapi);
  },
};
