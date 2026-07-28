import { ITicketOption } from "../types/types";
import { isStandaloneContestantTicket } from "./contestantTicketTiers";
import { contestantSportOf, ContestantSport } from "./contestantSport";
import { ticketMatchesContext } from "./ticketMatchesContext";

export type ContestantTier = "addon" | "standalone";

export type ResolveContestantTicketArgs = {
  ticketOptions: ITicketOption[] | null | undefined;
  sport: ContestantSport;
  /**
   * "addon" (or omitted) = person is already registered — or registering — as
   * an Attendee/Vendor (this cart, or a linked previous registration).
   * "standalone" = a genuine Contestant-only participant with no other
   * registration behind them (e.g. "Add Unregistered Contestant").
   */
  tier?: ContestantTier;
};

/**
 * Map sport (+ tier) → the Strapi contestant ticket row.
 * Applies to both Golfer and Fisher: when `tier` is "standalone" and the
 * conference defines a distinct Contestant-Only ticket for that sport, it is
 * returned; otherwise the single/add-on ticket for the sport is used.
 */
export const resolveContestantTicket = ({
  ticketOptions,
  sport,
  tier,
}: ResolveContestantTicketArgs): ITicketOption | null => {
  const contestantTickets = (ticketOptions ?? []).filter((ticket) =>
    ticketMatchesContext(ticket, "Contestant")
  );
  const sportTickets = contestantTickets.filter(
    (ticket) => contestantSportOf(ticket) === sport
  );
  if (sportTickets.length === 0) return null;

  if (tier === "standalone") {
    const standalone = sportTickets.find(isStandaloneContestantTicket);
    if (standalone) return standalone;
  }

  const addOn = sportTickets.find((t) => !isStandaloneContestantTicket(t));
  return addOn ?? sportTickets[0] ?? null;
};
