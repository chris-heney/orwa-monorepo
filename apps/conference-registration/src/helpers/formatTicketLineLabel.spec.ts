import { describe, expect, it } from "vitest";
import { formatTicketLineLabel, toTitleCase } from "./formatTicketLineLabel";

describe("toTitleCase", () => {
  it("title-cases lowercase names", () => {
    expect(toTitleCase("stephanie johnson")).toBe("Stephanie Johnson");
  });

  it("normalizes shouting/mixed case input", () => {
    expect(toTitleCase("STEPHANIE johnson")).toBe("Stephanie Johnson");
  });

  it("title-cases hyphenated names", () => {
    expect(toTitleCase("mary-jane o'connor")).toBe("Mary-Jane O'connor");
  });

  it("collapses extra whitespace", () => {
    expect(toTitleCase("  stephanie   johnson  ")).toBe("Stephanie Johnson");
  });
});

describe("formatTicketLineLabel", () => {
  it("prefixes the ticket type name before the holder name", () => {
    expect(
      formatTicketLineLabel({
        first: "stephanie",
        last: "johnson",
        ticket_type: { name: "Attendee" },
      })
    ).toBe("Attendee: Stephanie Johnson");
  });

  it("uses the real ticket type name from data, e.g. Golfer", () => {
    expect(
      formatTicketLineLabel({
        first: "stephanie",
        last: "johnson",
        ticket_type: { name: "Golfer" },
      })
    ).toBe("Golfer: Stephanie Johnson");
  });

  it("uses the real ticket type name from data, e.g. Fisher", () => {
    expect(
      formatTicketLineLabel({
        first: "stephanie",
        last: "johnson",
        ticket_type: { name: "Fisher" },
      })
    ).toBe("Fisher: Stephanie Johnson");
  });

  it("falls back to just the holder name when ticket type is missing", () => {
    expect(
      formatTicketLineLabel({ first: "stephanie", last: "johnson" })
    ).toBe("Stephanie Johnson");
  });

  it("falls back to just the ticket type name when the holder name is missing", () => {
    expect(
      formatTicketLineLabel({
        first: "",
        last: "",
        ticket_type: { name: "Attendee" },
      })
    ).toBe("Attendee");
  });
});
