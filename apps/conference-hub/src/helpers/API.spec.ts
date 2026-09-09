import { beforeEach, describe, expect, it, vi } from "vitest";

describe("conference hub API queries", () => {
  beforeEach(() => {
    vi.stubGlobal("window", {
      location: { search: "?conference_id=3" },
    });
  });

  it("fetches active contestants with an explicit NULL-safe status filter", async () => {
    const { contestantQuery } = await import("./API");

    expect(contestantQuery(2026, "3")).toContain(
      "filters[$or][0][status][$eq]=active&filters[$or][1][status][$null]=true"
    );
    expect(contestantQuery(2026, "3")).not.toContain("filters[status][$eq]=active");
  });
});
