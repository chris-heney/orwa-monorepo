import { describe, expect, it } from "vitest";

import lifecycles from "./lifecycles";
import {
  withContestantHardDelete,
  withContestantLifecycleTransition,
  withContestantRestCreate,
} from "../../services/contestant-lifecycle-context";

const event = (data: Record<string, unknown> = {}) => ({ params: { data } });

describe("conference contestant lifecycle guard", () => {
  it("blocks direct lifecycle field changes from Content Manager/document service", async () => {
    await expect(
      lifecycles.beforeUpdate(event({ status: "cancelled" }) as never)
    ).rejects.toThrow("cancel/restore actions");

    await expect(
      lifecycles.beforeCreate(event({ cancelled_at: "2026-09-08T00:00:00Z" }) as never)
    ).rejects.toThrow("cancel/restore actions");
  });

  it("allows lifecycle changes only inside the explicit cancel/restore context", async () => {
    await expect(
      withContestantLifecycleTransition(() =>
        lifecycles.beforeUpdate(
          event({
            status: "cancelled",
            cancelled_at: "2026-09-08T00:00:00Z",
            cancelled_reason: "Duplicate",
          }) as never
        )
      )
    ).resolves.toBeUndefined();
  });

  it("blocks direct conference and ticket relation repoints", async () => {
    await expect(
      lifecycles.beforeUpdate(event({ conference_ticket: "other-ticket" }) as never)
    ).rejects.toThrow("Cancel and create");
    await expect(
      lifecycles.beforeUpdate(event({ conference: "other-conference" }) as never)
    ).rejects.toThrow("Cancel and create");
  });

  it("blocks Content Manager hard deletes but allows whole-registration cleanup context", async () => {
    await expect(lifecycles.beforeDelete({} as never)).rejects.toThrow(
      "must be cancelled"
    );

    await expect(
      withContestantHardDelete(() => lifecycles.beforeDelete({} as never))
    ).resolves.toBeUndefined();
  });

  it("blocks direct creates outside the guarded REST create path", async () => {
    await expect(
      lifecycles.beforeCreate(event({ conference: "conf-1", conference_ticket: "golfer" }) as never)
    ).rejects.toThrow("guarded Add Contestant flow");

    await expect(
      withContestantRestCreate(() =>
        lifecycles.beforeCreate(
          event({ conference: "conf-1", conference_ticket: "golfer" }) as never
        )
      )
    ).resolves.toBeUndefined();
  });
});
