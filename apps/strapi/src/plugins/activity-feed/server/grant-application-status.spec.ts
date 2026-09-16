import { describe, expect, it } from "vitest";
import { grantApplicationStatusChange } from "./grant-application-status";

const app = (overrides: Record<string, unknown> = {}) => ({
  id: 20421,
  legal_entity_name: "Creek County Rural Water District",
  application_id: "RIG-2026-0421",
  status: { id: 14, name: "Award Letter Sent" },
  grant: { id: 4, name: "Rural Infrastructure Grant" },
  point_of_contact: { id: 3081, first: "Pat", last: "Doe" },
  ...overrides,
});

describe("grantApplicationStatusChange", () => {
  it("logs a transition with application, grant, and contact relations", () => {
    const result = grantApplicationStatusChange(
      app({ status: { id: 12, name: "Grant Agreement Signed" } }),
      app()
    );
    expect(result).toEqual({
      message: [
        "Grant Application #RIG-2026-0421 for Creek County Rural Water District",
        "was updated to Award Letter Sent",
        "from Grant Agreement Signed",
        "(Rural Infrastructure Grant)",
      ],
      relations: [
        { id: 20421, name: "grant-application" },
        { id: 4, name: "grant" },
        { id: 3081, name: "contact" },
      ],
    });
  });

  it("returns null when the status did not change", () => {
    expect(grantApplicationStatusChange(app(), app())).toBeNull();
    expect(
      grantApplicationStatusChange(app(), app({ legal_entity_name: "Renamed" }))
    ).toBeNull();
  });

  it("logs a first status assignment without a 'from' clause", () => {
    const result = grantApplicationStatusChange(app({ status: null }), app());
    expect(result?.message).toEqual([
      "Grant Application #RIG-2026-0421 for Creek County Rural Water District",
      "was updated to Award Letter Sent",
      "(Rural Infrastructure Grant)",
    ]);
  });

  it("does not log a cleared status or a missing record", () => {
    expect(grantApplicationStatusChange(app(), app({ status: null }))).toBeNull();
    expect(grantApplicationStatusChange(app(), null)).toBeNull();
    expect(grantApplicationStatusChange(null, app({ id: undefined }))).toBeNull();
  });

  it("omits relations it cannot resolve and tolerates a missing snapshot", () => {
    const result = grantApplicationStatusChange(
      null,
      app({ grant: null, point_of_contact: null, application_id: null, legal_entity_name: "  " })
    );
    expect(result).toEqual({
      message: ["Grant Application for an applicant", "was updated to Award Letter Sent"],
      relations: [{ id: 20421, name: "grant-application" }],
    });
  });
});
