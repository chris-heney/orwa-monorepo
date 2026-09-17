import { describe, expect, it, vi } from "vitest";

import {
  CONTESTANT_LIFECYCLE_ACTIONS,
  CONTESTANT_LIFECYCLE_ROLE_GRANTS,
  NAYLOR_EXPORT_ACTIONS,
  NAYLOR_EXPORT_ROLE_GRANTS,
  configureContestantLifecyclePermissions,
  configureNaylorExportPermissions,
} from "./index";
import { contestantActionPermissionUid } from "../../member-manager/src/modules/conference/helpers/contestantStatus";

/**
 * Custom Strapi routes carry no role permission by default, so a newly added
 * action 403s for every user until bootstrap grants it. Conference Manager
 * gates its Cancel/Restore buttons on these exact permission uids, so the
 * granted list and the uids the frontend checks must never drift apart — and
 * the grant must never widen past Admin, since cancelling moves golf capacity.
 */
describe("contestant lifecycle bootstrap permissions", () => {
  it("grants the cancel and restore routes", () => {
    expect(CONTESTANT_LIFECYCLE_ACTIONS).toEqual([
      "api::conference-contestant.conference-contestant.cancel",
      "api::conference-contestant.conference-contestant.restore",
    ]);
  });

  it("grants exactly the uids Conference Manager checks before rendering the buttons", () => {
    expect(CONTESTANT_LIFECYCLE_ACTIONS).toEqual([
      contestantActionPermissionUid("cancel"),
      contestantActionPermissionUid("restore"),
    ]);
  });

  it("targets the admin role and nothing else", () => {
    expect(CONTESTANT_LIFECYCLE_ROLE_GRANTS).toEqual([
      { roleWhere: { type: "admin" }, actions: CONTESTANT_LIFECYCLE_ACTIONS },
    ]);
  });
});

/** Fake enough of Strapi's query engine to record what bootstrap asks for. */
const fakeStrapi = () => {
  const roleFindOne = vi.fn(async ({ where }) => ({ id: 7, ...where }));
  const permissionCreate = vi.fn(async () => ({}));

  return {
    log: { warn: vi.fn() },
    db: {
      query: (uid: string) =>
        uid === "plugin::users-permissions.role"
          ? { findOne: roleFindOne }
          : { findMany: async () => [], create: permissionCreate },
    },
    roleFindOne,
    permissionCreate,
  };
};

describe("configureContestantLifecyclePermissions", () => {
  it("only ever looks up the admin role", async () => {
    const strapi = fakeStrapi();

    await configureContestantLifecyclePermissions(strapi);

    expect(strapi.roleFindOne).toHaveBeenCalledTimes(1);
    expect(strapi.roleFindOne).toHaveBeenCalledWith({
      where: { type: "admin" },
    });
  });

  it("never grants the routes to public or authenticated", async () => {
    const strapi = fakeStrapi();

    await configureContestantLifecyclePermissions(strapi);

    const targetedRoles = strapi.roleFindOne.mock.calls.map(
      ([{ where }]) => where.type
    );

    expect(targetedRoles).not.toContain("public");
    expect(targetedRoles).not.toContain("authenticated");
  });

  it("creates a permission row per action for that role", async () => {
    const strapi = fakeStrapi();

    await configureContestantLifecyclePermissions(strapi);

    expect(
      strapi.permissionCreate.mock.calls.map(([{ data }]) => data)
    ).toEqual(
      CONTESTANT_LIFECYCLE_ACTIONS.map((action) => ({ action, role: 7 }))
    );
  });

  // Bootstrap must not take the whole server down because one role is missing.
  it("warns instead of throwing when the role lookup fails", async () => {
    const strapi = fakeStrapi();
    strapi.roleFindOne.mockRejectedValue(new Error("db offline"));

    await expect(
      configureContestantLifecyclePermissions(strapi)
    ).resolves.toBeUndefined();
    expect(strapi.log.warn).toHaveBeenCalledOnce();
  });
});

/**
 * GET /api/watersystems/naylor-export is a custom route, so it 403s for every
 * user until bootstrap grants it. member-manager's "Naylor Export" is nothing
 * but a download of that URL, so the action uid here must match the route's
 * handler (`watersystem.naylorExport`).
 */
describe("Naylor export bootstrap permissions", () => {
  it("grants the route's action", () => {
    expect(NAYLOR_EXPORT_ACTIONS).toEqual([
      "api::watersystem.watersystem.naylorExport",
    ]);
  });

  it("targets Admin and Staff, never public or authenticated", async () => {
    expect(NAYLOR_EXPORT_ROLE_GRANTS.map(({ roleWhere }) => roleWhere.type)).toEqual([
      "admin",
      "staff",
    ]);

    const strapi = fakeStrapi();
    await configureNaylorExportPermissions(strapi);

    const targetedRoles = strapi.roleFindOne.mock.calls.map(
      ([{ where }]) => where.type
    );
    expect(targetedRoles).toEqual(["admin", "staff"]);
    expect(
      strapi.permissionCreate.mock.calls.map(([{ data }]) => data.action)
    ).toEqual([...NAYLOR_EXPORT_ACTIONS, ...NAYLOR_EXPORT_ACTIONS]);
  });

  it("warns instead of throwing when the role lookup fails", async () => {
    const strapi = fakeStrapi();
    strapi.roleFindOne.mockRejectedValue(new Error("db offline"));

    await expect(configureNaylorExportPermissions(strapi)).resolves.toBeUndefined();
    expect(strapi.log.warn).toHaveBeenCalledOnce();
  });
});
