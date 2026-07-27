import { ITicketOption } from "../types/types";
import { ticketMatchesContext } from "./ticketMatchesContext";

export type ContestantSport = "golf" | "fish";

export const contestantSportOf = (
  ticket: Pick<ITicketOption, "name"> | null | undefined
): ContestantSport | null => {
  const name = ticket?.name ?? "";
  if (/golf/i.test(name)) return "golf";
  if (/fish/i.test(name)) return "fish";
  return null;
};

/** Unique sports present among Contestant-context tickets. */
export const availableContestantSports = (
  tickets: ITicketOption[] | null | undefined
): ContestantSport[] => {
  const sports = new Set<ContestantSport>();
  for (const ticket of tickets ?? []) {
    if (!ticketMatchesContext(ticket, "Contestant")) continue;
    const sport = contestantSportOf(ticket);
    if (sport) sports.add(sport);
  }
  const order: ContestantSport[] = ["golf", "fish"];
  return order.filter((sport) => sports.has(sport));
};
