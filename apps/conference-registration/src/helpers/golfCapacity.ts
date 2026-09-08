import { ITicketOption, ITicketPayload } from "../types/types";
import { ticketMatchesContext, ticketNameRepresents } from "./ticketMatchesContext";
/**
 * Golf tournament capacity (conference.available_contestants).
 *
 * Mirrors the Strapi webhook's counting exactly (helpers/
 * contestant-capacity.ts). Per binding user directive (2026-09-07): ANY
 * contestant-routed ticket whose name CONTAINS "Golfer" (case-insensitive)
 * consumes a slot. Legacy no-context routing recognizes names containing
 * Golfer/Fisher/Contestant. Fisher tickets never count. The field is a live remaining counter and can be negative after
 * an oversell — always clamp to zero before comparing.
 */
export const GOLF_CAPACITY_NAME_SUBSTRING = "golfer";

export const countsAgainstGolfCapacity = (
  ticketType: Pick<ITicketOption, "name" | "context"> | null | undefined
): boolean =>
  !!ticketType &&
  ticketMatchesContext(ticketType, "Contestant") &&
  ticketNameRepresents(ticketType.name ?? "", GOLF_CAPACITY_NAME_SUBSTRING);

/**
 * Golf slots consumed by the cart. `excludeIndex` skips one row — used when
 * editing an existing golfer so the person being edited doesn't count
 * against themselves.
 */
export const golfersInCart = (
  tickets: ITicketPayload[] | null | undefined,
  excludeIndex?: number
): number =>
  (tickets ?? []).filter(
    (ticket, index) =>
      index !== excludeIndex && countsAgainstGolfCapacity(ticket?.ticket_type)
  ).length;

/** Remaining sellable slots, or `null` when no cap is configured. */
export const remainingGolfCapacity = (available: unknown): number | null => {
  if (available === null || available === undefined || available === "") {
    return null;
  }
  const numeric = Math.floor(Number(available));
  if (!Number.isFinite(numeric)) return null;
  return Math.max(0, numeric);
};

/**
 * Slots still available for NEW golfers, after subtracting golfers already
 * in the cart. `null` = unlimited.
 */
export const remainingGolfSlots = (
  available: unknown,
  inCart: number
): number | null => {
  const remaining = remainingGolfCapacity(available);
  if (remaining === null) return null;
  return remaining - inCart;
};

/** Same wording as the server-side rejection so users see one message. */
export const golfCapacityMessage = (
  remaining: number,
  requested: number
): string => {
  if (remaining <= 0) {
    return "The golf tournament is sold out — no golfer spots remain. Please remove the golfer entries and try again.";
  }
  const over = requested - remaining;
  return `Only ${remaining} golfer spot${remaining === 1 ? "" : "s"} remain${
    remaining === 1 ? "s" : ""
  } for the golf tournament, but this registration includes ${requested} golfer${
    requested === 1 ? "" : "s"
  }. Please remove ${over} golfer entr${over === 1 ? "y" : "ies"} and try again.`;
};

export const GOLF_SOLD_OUT_MESSAGE = golfCapacityMessage(0, 1);
