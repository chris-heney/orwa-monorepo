import { describe, expect, it } from "vitest";
import { fetchSingleTicket } from "./fetchSingleTicket";
import type { IExtraOption, ITicketOption } from "../types/types";

const ticket = (
  id: number,
  name: string,
  context?: ITicketOption["context"]
): ITicketOption =>
  ({
    id,
    name,
    context,
    price_online: 100,
    price_event: 100,
  }) as ITicketOption;

describe("fetchSingleTicket", () => {
  it("returns the only matching ticket", () => {
    const result = fetchSingleTicket(
      [ticket(1, "Vendor", "Vendor")],
      [] as IExtraOption[],
      "Vendor"
    );
    expect(result.ticket_type).toMatchObject({ id: 1, name: "Vendor" });
  });

  it("prefers exact context name when Attendee and Guest both match", () => {
    const result = fetchSingleTicket(
      [ticket(2, "Guest"), ticket(1, "Attendee")],
      [] as IExtraOption[],
      "Attendee"
    );
    expect(result.ticket_type).toMatchObject({ id: 1, name: "Attendee" });
  });

  it("returns empty ticket_type when nothing matches", () => {
    const result = fetchSingleTicket(
      [ticket(1, "Vendor", "Vendor")],
      [] as IExtraOption[],
      "Attendee"
    );
    expect(result.ticket_type).toEqual({});
  });
});
