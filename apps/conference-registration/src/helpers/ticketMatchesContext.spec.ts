import { describe, expect, it } from "vitest";
import { ticketMatchesContext } from "./ticketMatchesContext";

describe("ticketMatchesContext", () => {
  it("matches by context when set", () => {
    expect(
      ticketMatchesContext({ name: "Attendee", context: "Attendee" }, "Attendee")
    ).toBe(true);
    expect(
      ticketMatchesContext({ name: "Vendor", context: "Vendor" }, "Attendee")
    ).toBe(false);
  });

  it("falls back to name when context is null (Fall Conference)", () => {
    expect(
      ticketMatchesContext(
        { name: "Attendee", context: null as unknown as "Attendee" },
        "Attendee"
      )
    ).toBe(true);
    expect(
      ticketMatchesContext(
        { name: "Golfer", context: null as unknown as "Contestant" },
        "Contestant"
      )
    ).toBe(true);
    expect(
      ticketMatchesContext(
        { name: "Vendor", context: null as unknown as "Vendor" },
        "Vendor"
      )
    ).toBe(true);
  });
});
