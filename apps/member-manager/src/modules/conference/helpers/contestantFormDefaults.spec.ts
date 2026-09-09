import { describe, expect, it } from "vitest";

import {
  contestantCreateDefaults,
  contestantUpdatePayload,
} from "./contestantFormDefaults";

describe("contestantFormDefaults", () => {
  it("uses scalar conference and year defaults for Add Contestant", () => {
    expect(contestantCreateDefaults({ conference: 3, year: 2026 })).toEqual({
      conference: 3,
      year: 2026,
    });
  });

  it("omits unavailable defaults instead of sending nested placeholder objects", () => {
    expect(contestantCreateDefaults({})).toEqual({});
  });

  it("strips locked relations but preserves unchanged lifecycle defaults for full-record edit submits", () => {
    expect(
      contestantUpdatePayload({
        id: "contestant-1",
        conference: { id: 3, documentId: "conf-doc" },
        conference_ticket: { id: 37, documentId: "ticket-doc" },
        status: "active",
        cancelled_at: null,
        cancelled_reason: null,
        cancelled_by: null,
        first: "Grace",
      })
    ).toEqual({
      id: "contestant-1",
      status: "active",
      cancelled_at: null,
      cancelled_reason: null,
      cancelled_by: null,
      first: "Grace",
    });
  });
});
