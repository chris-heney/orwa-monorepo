import { ITicketOption } from "../types/types";
import { ticketMatchesContext } from "./ticketMatchesContext";

/**
 * Contestant tickets come in two price tiers:
 * - "add-on" tickets (e.g. "Fishing Tournament" @ $75) for people who are
 *   registered — or registering — as an Attendee or Vendor.
 * - "standalone" tickets (e.g. "Fishing Tournament - Contestant Only" @ $150)
 *   for contestant-only registrations with no other registration behind them.
 *
 * The tier is a naming convention on the Strapi ticket row: a contestant
 * ticket whose name contains "Contestant Only" is standalone-priced.
 * Staff manage both rows (names and prices) in Conference Manager → Tickets.
 */
export const isStandaloneContestantTicket = (
  ticket: Pick<ITicketOption, "name"> | null | undefined
): boolean => /contestant\s*only/i.test(ticket?.name ?? "");

export type RegistrationTypeValue =
  | "Attendee"
  | "Vendor"
  | "Contestant"
  | null
  | undefined;

/**
 * Which contestant tickets may be offered right now?
 *
 * Attendee/Vendor registrations (and contestant-only buyers who indicate they
 * are already registered / registering separately) get the add-on tier;
 * everyone else in the contestant-only flow gets the standalone tier.
 * If a conference only defines one tier, fall back to it so the step never
 * dead-ends.
 */
export const allowedContestantTickets = (
  ticketOptions: ITicketOption[] | null | undefined,
  registrationType: RegistrationTypeValue,
  alreadyRegistered: boolean
): ITicketOption[] => {
  const contestantTickets = (ticketOptions ?? []).filter((ticket) =>
    ticketMatchesContext(ticket, "Contestant")
  );
  const standalone = contestantTickets.filter(isStandaloneContestantTicket);
  const addOn = contestantTickets.filter(
    (ticket) => !isStandaloneContestantTicket(ticket)
  );

  if (registrationType === "Contestant" && !alreadyRegistered) {
    return standalone.length > 0 ? standalone : contestantTickets;
  }
  return addOn.length > 0 ? addOn : contestantTickets;
};

/** Both tiers exist, so the contestant-only flow needs the price toggle. */
export const hasBothContestantTiers = (
  ticketOptions: ITicketOption[] | null | undefined
): boolean => {
  const contestantTickets = (ticketOptions ?? []).filter((ticket) =>
    ticketMatchesContext(ticket, "Contestant")
  );
  return (
    contestantTickets.some(isStandaloneContestantTicket) &&
    contestantTickets.some((ticket) => !isStandaloneContestantTicket(ticket))
  );
};

/** Lowest price of a tier, for showing "$75" / "$150" on the toggle. */
export const tierMinPrice = (
  tickets: ITicketOption[],
  registrationSource: string | null | undefined
): number | null => {
  const prices = tickets
    .map((ticket) =>
      registrationSource === "kiosk" ? ticket.price_event : ticket.price_online
    )
    .filter((price): price is number => typeof price === "number");
  return prices.length > 0 ? Math.min(...prices) : null;
};
