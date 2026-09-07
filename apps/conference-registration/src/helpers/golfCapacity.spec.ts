import { describe, expect, it } from "vitest";
import {
  countsAgainstGolfCapacity,
  golfCapacityMessage,
  golfersInCart,
  remainingGolfCapacity,
  remainingGolfSlots,
} from "./golfCapacity";
import { ITicketPayload } from "../types/types";

const line = (name: string, context?: string) =>
  ({
    type: "Contestant",
    ticket_type: { name, context },
  } as unknown as ITicketPayload);

describe("countsAgainstGolfCapacity", () => {
  it("counts the Golfer ticket (Contestant context)", () => {
    expect(
      countsAgainstGolfCapacity({ name: "Golfer", context: "Contestant" })
    ).toBe(true);
  });

  it("counts legacy Golfer tickets with no context (name fallback)", () => {
    expect(countsAgainstGolfCapacity({ name: "Golfer" } as never)).toBe(true);
  });

  it("does NOT count 'Golfer - Contestant Only' (same rule as the dashboard counter)", () => {
    expect(
      countsAgainstGolfCapacity({
        name: "Golfer - Contestant Only",
        context: "Contestant",
      })
    ).toBe(false);
  });

  it("does not count Fisher or Attendee tickets", () => {
    expect(
      countsAgainstGolfCapacity({ name: "Fisher", context: "Contestant" })
    ).toBe(false);
    expect(
      countsAgainstGolfCapacity({ name: "Attendee", context: "Attendee" })
    ).toBe(false);
  });
});

describe("golfersInCart", () => {
  const cart = [
    line("Golfer", "Contestant"),
    line("Fishing Tournament", "Contestant"),
    line("Golfer", "Contestant"),
    line("Golfer - Contestant Only", "Contestant"),
  ];

  it("counts only capacity-consuming golfers", () => {
    expect(golfersInCart(cart)).toBe(2);
  });

  it("excludes the row being edited", () => {
    expect(golfersInCart(cart, 0)).toBe(1);
  });

  it("handles empty carts", () => {
    expect(golfersInCart(undefined)).toBe(0);
  });
});

describe("remainingGolfCapacity", () => {
  it("returns null when no cap is configured", () => {
    expect(remainingGolfCapacity(null)).toBe(null);
    expect(remainingGolfCapacity(undefined)).toBe(null);
    expect(remainingGolfCapacity("")).toBe(null);
  });

  it("clamps negative (oversold) availability to zero", () => {
    expect(remainingGolfCapacity(-20)).toBe(0);
  });

  it("passes positive availability through", () => {
    expect(remainingGolfCapacity(26)).toBe(26);
    expect(remainingGolfCapacity("3")).toBe(3);
  });
});

describe("remainingGolfSlots", () => {
  it("subtracts cart golfers from availability", () => {
    expect(remainingGolfSlots(3, 2)).toBe(1);
    expect(remainingGolfSlots(3, 3)).toBe(0);
    expect(remainingGolfSlots(3, 4)).toBe(-1);
  });

  it("treats negative availability as zero", () => {
    expect(remainingGolfSlots(-20, 0)).toBe(0);
  });

  it("returns null for uncapped conferences", () => {
    expect(remainingGolfSlots(null, 5)).toBe(null);
  });
});

describe("golfCapacityMessage", () => {
  it("says sold out at zero", () => {
    expect(golfCapacityMessage(0, 1)).toMatch(/sold out/i);
  });

  it("explains how many to remove", () => {
    expect(golfCapacityMessage(1, 3)).toBe(
      "Only 1 golfer spot remains for the golf tournament, but this registration includes 3 golfers. Please remove 2 golfer entries and try again."
    );
  });
});
