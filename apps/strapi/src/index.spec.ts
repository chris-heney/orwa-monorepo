import { describe, expect, it } from "vitest";

import { CONTESTANT_LIFECYCLE_ACTIONS } from "./index";
import { contestantActionPermissionUid } from "../../member-manager/src/modules/conference/helpers/contestantStatus";

/**
 * Custom Strapi routes carry no role permission by default, so a newly added
 * action 403s for every user until bootstrap grants it. Conference Manager
 * gates its Cancel/Restore buttons on these exact permission uids, so the
 * granted list and the uids the frontend checks must never drift apart.
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
});
