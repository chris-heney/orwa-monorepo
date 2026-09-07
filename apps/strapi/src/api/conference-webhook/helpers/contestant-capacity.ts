import type { ITicketPayload } from "../types";

/**
 * Golf tournament capacity enforcement.
 *
 * `conference.available_contestants` ("Available Golf Contestants" in
 * Conference Manager) is a live remaining-slot counter. Per user directive
 * (2026-09-07): ANY Contestant ticket whose name CONTAINS "Golfer"
 * (case-insensitive) consumes a slot — e.g. both "Golfer" and
 * "Golfer - Contestant Only". Fisher tickets never count. Both the
 * capacity gate and the webhook decrement use this one predicate, and the
 * frontend (`apps/conference-registration/src/helpers/golfCapacity.ts`)
 * mirrors it exactly. The counter can already be negative (2026-09
 * oversell), so remaining capacity is always clamped to zero.
 */

// Mirrors the frontend's ticketMatchesContext fallback: legacy Fall tickets
// have no `context`, so match by name too or they get stored as attendees.
const CONTESTANT_NAME_FALLBACKS = ["Golfer", "Fisher", "Contestant"];

export const isContestantTicket = (ticket: ITicketPayload): boolean => {
  if (ticket?.ticket_type?.context === "Contestant") return true;
  if (ticket?.ticket_type?.context) return false;
  return CONTESTANT_NAME_FALLBACKS.some(
    (name) =>
      ticket?.ticket_type?.name?.localeCompare(name, undefined, {
        sensitivity: "accent",
      }) === 0
  );
};

export const GOLF_CAPACITY_NAME_SUBSTRING = "golfer";

/**
 * Does one cart line consume a golf slot? Same rule as the decrement:
 * a Contestant ticket whose name contains "Golfer" (case-insensitive).
 */
export const countsAgainstGolfCapacity = (ticket: ITicketPayload): boolean =>
  isContestantTicket(ticket) &&
  (ticket?.ticket_type?.name ?? "")
    .toLowerCase()
    .includes(GOLF_CAPACITY_NAME_SUBSTRING);

/** How many golf slots does this payload consume? */
export const golferCount = (
  tickets: ITicketPayload[] | null | undefined
): number => (tickets ?? []).filter(countsAgainstGolfCapacity).length;

/** Remaining sellable slots. `null` = no cap configured on the conference. */
export const remainingGolfCapacity = (available: unknown): number | null => {
  if (available === null || available === undefined || available === "") {
    return null;
  }
  const numeric = Math.floor(Number(available));
  if (!Number.isFinite(numeric)) return null;
  return Math.max(0, numeric);
};

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

export class ContestantCapacityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContestantCapacityError";
  }
}

/**
 * Authoritative capacity gate — run at write time, BEFORE charging the card.
 * Throws ContestantCapacityError when the payload's golfer lines exceed the
 * conference's remaining "Available Golf Contestants".
 */
export const assertGolfCapacity = (
  available: unknown,
  requested: number
): void => {
  if (requested <= 0) return;
  const remaining = remainingGolfCapacity(available);
  if (remaining === null) return; // no cap configured
  if (requested <= remaining) return;
  throw new ContestantCapacityError(golfCapacityMessage(remaining, requested));
};
