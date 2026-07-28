import { describe, expect, it } from "vitest";
import {
  isContestantLinkedToCart,
  resolveCartAttachIndex,
} from "./isContestantLinkedToCart";
import type { ITicketPayload } from "../types/types";

const person = (
  type: ITicketPayload["type"],
  email: string,
  name = "P"
): ITicketPayload =>
  ({
    type,
    email,
    first: name,
    last: "Test",
  }) as ITicketPayload;

describe("isContestantLinkedToCart", () => {
  const cart = [
    person("Attendee", "sarah@example.com", "Sarah"),
    person("Attendee", "chris@example.com", "Chris"),
    { type: "Contestant", email: "sarah@example.com", first: "Sarah" } as ITicketPayload,
  ];

  it("accepts a valid source_ticket_id including 0", () => {
    expect(
      isContestantLinkedToCart({ source_ticket_id: 0, email: "" }, cart)
    ).toBe(true);
  });

  it("rejects source_ticket_id pointing at a Contestant row", () => {
    expect(
      isContestantLinkedToCart({ source_ticket_id: 2, email: "" }, cart)
    ).toBe(false);
  });

  it("recovers from wiped source_ticket_id via unique email", () => {
    expect(
      isContestantLinkedToCart(
        { email: "chris@example.com", first: "Chris", last: "Test" },
        cart
      )
    ).toBe(true);
  });

  it("rejects wiped id when email matches nobody", () => {
    expect(
      isContestantLinkedToCart({ email: "nobody@example.com" }, cart)
    ).toBe(false);
  });
});

describe("resolveCartAttachIndex", () => {
  const cart = [
    person("Attendee", "sarah@example.com", "Sarah"),
    person("Attendee", "chris@example.com", "Chris"),
  ];

  it("returns source_ticket_id when valid", () => {
    expect(resolveCartAttachIndex({ source_ticket_id: 1 }, cart)).toBe(1);
  });

  it("recovers unique email match", () => {
    expect(
      resolveCartAttachIndex({ email: "  Sarah@Example.com " }, cart)
    ).toBe(0);
  });
});
