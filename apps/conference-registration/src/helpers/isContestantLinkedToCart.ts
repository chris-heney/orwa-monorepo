import { ITicketPayload } from "../types/types";
import { hasSelectedId } from "./hasSelectedId";

const normalizeEmail = (email: unknown): string =>
  typeof email === "string" ? email.trim().toLowerCase() : "";

/**
 * True when a Contestant ticket is attached to an Attendee/Vendor on this cart.
 *
 * Prefer `source_ticket_id` (absolute tickets[] index). If that was wiped by an
 * older Golfer-save bug but contact fields still match exactly one cart person
 * by email, treat as linked so Next isn't blocked on already-correct UI.
 */
export function isContestantLinkedToCart(
  ticket: Pick<
    ITicketPayload,
    "source_ticket_id" | "email" | "first" | "last" | "type"
  >,
  allTickets: ITicketPayload[] | null | undefined
): boolean {
  const tickets = allTickets ?? [];

  if (hasSelectedId(ticket.source_ticket_id)) {
    const person = tickets[Number(ticket.source_ticket_id)];
    return person?.type === "Attendee" || person?.type === "Vendor";
  }

  const email = normalizeEmail(ticket.email);
  if (!email) return false;

  const matches = tickets.filter(
    (person) =>
      (person.type === "Attendee" || person.type === "Vendor") &&
      normalizeEmail(person.email) === email
  );
  return matches.length === 1;
}

/**
 * Absolute tickets[] index of the Attendee/Vendor this contestant should attach
 * to, or undefined when it cannot be resolved uniquely.
 */
export function resolveCartAttachIndex(
  ticket: Pick<ITicketPayload, "source_ticket_id" | "email">,
  allTickets: ITicketPayload[] | null | undefined
): number | undefined {
  const tickets = allTickets ?? [];

  if (hasSelectedId(ticket.source_ticket_id)) {
    const index = Number(ticket.source_ticket_id);
    const person = tickets[index];
    if (person?.type === "Attendee" || person?.type === "Vendor") {
      return index;
    }
  }

  const email = normalizeEmail(ticket.email);
  if (!email) return undefined;

  const matches = tickets
    .map((person, index) => ({ person, index }))
    .filter(
      ({ person }) =>
        (person.type === "Attendee" || person.type === "Vendor") &&
        normalizeEmail(person.email) === email
    );
  return matches.length === 1 ? matches[0].index : undefined;
}
