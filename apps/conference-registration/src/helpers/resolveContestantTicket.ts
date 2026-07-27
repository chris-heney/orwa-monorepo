import { ITicketOption } from "../types/types";
import { isStandaloneContestantTicket } from "./contestantTicketTiers";
import { contestantSportOf, ContestantSport } from "./contestantSport";
import { ticketMatchesContext } from "./ticketMatchesContext";

export type FisherTier = "addon" | "standalone";

export type ResolveContestantTicketArgs = {
  ticketOptions: ITicketOption[] | null | undefined;
  sport: ContestantSport;
  fisherTier?: FisherTier;
  registrationType: "Attendee" | "Vendor" | "Contestant" | null | undefined;
};

/**
 * Map sport (+ Fisher tier) + checkout mode → the Strapi contestant ticket row.
 * Attendee/Vendor never get Fisher standalone. Golfer is always the single
 * non-standalone golf ticket when both exist.
 */
export const resolveContestantTicket = ({
  ticketOptions,
  sport,
  fisherTier,
  registrationType,
}: ResolveContestantTicketArgs): ITicketOption | null => {
  const contestantTickets = (ticketOptions ?? []).filter((ticket) =>
    ticketMatchesContext(ticket, "Contestant")
  );
  const sportTickets = contestantTickets.filter(
    (ticket) => contestantSportOf(ticket) === sport
  );
  if (sportTickets.length === 0) return null;

  if (sport === "golf") {
    const addOn = sportTickets.find((t) => !isStandaloneContestantTicket(t));
    return addOn ?? sportTickets[0] ?? null;
  }

  // fish
  const forceAddon =
    registrationType === "Attendee" ||
    registrationType === "Vendor" ||
    fisherTier !== "standalone";

  if (forceAddon) {
    const addOn = sportTickets.find((t) => !isStandaloneContestantTicket(t));
    return addOn ?? sportTickets[0] ?? null;
  }

  const standalone = sportTickets.find(isStandaloneContestantTicket);
  return standalone ?? sportTickets[0] ?? null;
};
