import { ITicketOption, ticketType } from "../types/types";

const NAME_FALLBACKS: Record<ticketType, string[]> = {
  // Keep this tight — VIP/Staff/etc. stay admin-only via isAdminView.
  Attendee: ["Attendee", "Guest"],
  Vendor: ["Vendor"],
  Guest: ["Guest"],
  Contestant: ["Golfer", "Fisher", "Contestant"],
};

/**
 * Match a ticket option to a registration step context.
 * Falls back to ticket name when Strapi `context` is unset (Fall Conference).
 */
export const ticketMatchesContext = (
  ticket: Pick<ITicketOption, "name" | "context"> | null | undefined,
  context: ticketType
): boolean => {
  if (!ticket) return false;
  if (ticket.context === context) return true;
  if (ticket.context) return false;

  const names = NAME_FALLBACKS[context] || [context];
  return names.some(
    (name) => ticket.name?.localeCompare(name, undefined, { sensitivity: "accent" }) === 0
  );
};
