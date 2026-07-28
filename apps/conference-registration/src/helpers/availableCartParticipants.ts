import { Identifier, ITicketPayload } from "../types/types";
import { hasSelectedId } from "./hasSelectedId";
import {
  ContestantSport,
  contestantSportOf,
} from "./contestantSport";

export type CartParticipantOption = {
  /** Index into the registration `tickets` array (stable attach id). */
  absoluteIndex: number;
  person: ITicketPayload;
};

/**
 * Attendee/Vendor tickets on this registration still available to attach to a
 * Contestant line for a given sport.
 *
 * A person may golf AND fish — they are only excluded when already attached to
 * another contestant of the *same* sport. The person currently linked to the
 * line being edited stays available.
 */
export function availableCartParticipants(args: {
  tickets: ITicketPayload[] | null | undefined;
  currentContestantIndex: number;
  currentSourceTicketId?: Identifier;
  /** When set, only same-sport contestant attaches block reuse. */
  sport?: ContestantSport | null;
}): CartParticipantOption[] {
  const tickets = args.tickets ?? [];
  const sport = args.sport ?? null;

  const usedByOtherContestants = new Set(
    tickets
      .map((row, index) => ({ row, index }))
      .filter(({ row, index }) => {
        if (row.type !== "Contestant") return false;
        if (index === args.currentContestantIndex) return false;
        if (sport == null) return true;
        return contestantSportOf(row.ticket_type) === sport;
      })
      .map(({ row }) => row.source_ticket_id)
      .filter(hasSelectedId)
      .map(String)
  );

  const currentId = hasSelectedId(args.currentSourceTicketId)
    ? String(args.currentSourceTicketId)
    : null;

  return tickets
    .map((person, absoluteIndex) => ({ person, absoluteIndex }))
    .filter(
      ({ person }) => person.type === "Attendee" || person.type === "Vendor"
    )
    .filter(({ absoluteIndex }) => {
      const key = String(absoluteIndex);
      if (currentId != null && key === currentId) return true;
      return !usedByOtherContestants.has(key);
    });
}
