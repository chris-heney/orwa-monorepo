import { ITicketOption, ticketType } from "../types/types";

const NAME_FALLBACKS: Record<ticketType, string[]> = {
  // Keep this tight — VIP/Staff/etc. stay admin-only via isAdminView.
  Attendee: ["Attendee", "Guest"],
  Vendor: ["Vendor"],
  Guest: ["Guest"],
  Contestant: ["Golfer", "Fisher", "Contestant"],
};

export const ticketNameRepresents = (ticketName: string, label: string): boolean => {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pluralSuffix = label.toLowerCase() === "golfer" ? "s?" : "";
  const token = new RegExp(`(^|[^a-z0-9])${escaped}${pluralSuffix}([^a-z0-9]|$)`, "i");
  const negated = new RegExp(`(^|[^a-z0-9])non[-\\s]+${escaped}${pluralSuffix}([^a-z0-9]|$)`, "i");
  return token.test(ticketName) && !negated.test(ticketName);
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
  const ticketName = ticket.name ?? "";
  return names.some((name) => ticketNameRepresents(ticketName, name));
};
