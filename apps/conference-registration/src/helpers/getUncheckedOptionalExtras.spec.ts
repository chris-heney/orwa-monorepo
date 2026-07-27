import { describe, expect, it } from "vitest";
import {
  formatExtrasConfirmList,
  getUncheckedOptionalExtras,
} from "./getUncheckedOptionalExtras";
import { IExtraOption, ITicketOption, ITicketPayload } from "../types/types";

const attendeeTicket = { id: 10, name: "Attendee" } as ITicketOption;

const lunch = {
  id: 37,
  name: "Lunch",
  context: "Attendee",
  included: [],
  excluded: [],
} as unknown as IExtraOption;

const dinner = {
  id: 38,
  name: "Dinner",
  context: "Attendee",
  included: [],
  excluded: [],
} as unknown as IExtraOption;

const reception = {
  id: 39,
  name: "Reception",
  context: "Attendee",
  included: [],
  excluded: [],
} as unknown as IExtraOption;

const includedMeal = {
  id: 40,
  name: "Included Breakfast",
  context: "Attendee",
  included: [attendeeTicket],
  excluded: [],
} as unknown as IExtraOption;

const boothExtra = {
  id: 1,
  name: "Table skirt",
  context: "Booth",
  included: [],
  excluded: [],
} as unknown as IExtraOption;

const qtyExtra = {
  id: 50,
  name: "Extra Meal Ticket",
  context: "Attendee",
  max_qty_each: 5,
  included: [],
  excluded: [],
} as unknown as IExtraOption;

const baseTicket = {
  extras: [] as (string | number)[],
  ticket_type: attendeeTicket,
} as Pick<ITicketPayload, "extras" | "ticket_type">;

describe("getUncheckedOptionalExtras", () => {
  it("returns all optional visibles when none selected", () => {
    const result = getUncheckedOptionalExtras({
      ticket: baseTicket,
      extras: [lunch, dinner, includedMeal, boothExtra],
      context: "Attendee",
    });
    expect(result.map((e) => e.name).sort()).toEqual(["Dinner", "Lunch"]);
  });

  it("returns empty when at least one optional is selected", () => {
    const result = getUncheckedOptionalExtras({
      ticket: { ...baseTicket, extras: [37] },
      extras: [lunch, dinner],
      context: "Attendee",
    });
    expect(result).toEqual([]);
  });

  it("ignores included selections — still returns unchecked optionals", () => {
    const result = getUncheckedOptionalExtras({
      ticket: { ...baseTicket, extras: [40] },
      extras: [lunch, dinner, includedMeal],
      context: "Attendee",
    });
    expect(result.map((e) => e.name).sort()).toEqual(["Dinner", "Lunch"]);
  });

  it("returns empty when no visible extras for context", () => {
    const result = getUncheckedOptionalExtras({
      ticket: baseTicket,
      extras: [boothExtra],
      context: "Attendee",
    });
    expect(result).toEqual([]);
  });

  it("Vendor context uses Attendee extras visibility", () => {
    const result = getUncheckedOptionalExtras({
      ticket: baseTicket,
      extras: [lunch, boothExtra],
      context: "Vendor",
    });
    expect(result.map((e) => e.name)).toEqual(["Lunch"]);
  });

  it("quantity optional with qty >= 1 counts as selected", () => {
    const result = getUncheckedOptionalExtras({
      ticket: { ...baseTicket, extras: [50, 50] },
      extras: [lunch, qtyExtra],
      context: "Attendee",
    });
    expect(result).toEqual([]);
  });
});

describe("formatExtrasConfirmList", () => {
  it("formats one, two, and three-plus names", () => {
    expect(formatExtrasConfirmList(["Lunch"])).toBe("Lunch");
    expect(formatExtrasConfirmList(["Lunch", "Dinner"])).toBe(
      "Lunch or Dinner"
    );
    expect(formatExtrasConfirmList(["Lunch", "Dinner", "Reception"])).toBe(
      "Lunch, Dinner, or Reception"
    );
  });

  it("returns empty string for empty input", () => {
    expect(formatExtrasConfirmList([])).toBe("");
  });
});
