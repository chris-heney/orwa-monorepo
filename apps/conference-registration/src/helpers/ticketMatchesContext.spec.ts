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

  it("matches contextless standalone golfer ticket names as Contestant", () => {
    expect(
      ticketMatchesContext(
        { name: "Golfer - Contestant Only", context: null as unknown as "Contestant" },
        "Contestant"
      )
    ).toBe(true);
  });

  it.each(["Non-Golfer Guest", "Non Golfer", "Golfer Spouse (Non-Golfer)"])(
    "does not treat negated %s as Contestant when context is missing",
    (name) => {
      expect(
        ticketMatchesContext(
          { name, context: null as unknown as "Contestant" },
          "Contestant"
        )
      ).toBe(false);
    }
  );

  it("still honors explicit Contestant context for routing without implying golf capacity", () => {
    expect(
      ticketMatchesContext(
        { name: "Non-Golfer Guest", context: "Contestant" },
        "Contestant"
      )
    ).toBe(true);
  });
});
