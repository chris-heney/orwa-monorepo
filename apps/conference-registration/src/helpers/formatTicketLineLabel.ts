import { ITicketPayload } from "../types/types";

/** Title-cases each word/hyphenated part, e.g. "stephanie o'neil" -> "Stephanie O'neil". */
export const toTitleCase = (value: string): string =>
  value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) =>
      word
        .split("-")
        .map((part) =>
          part ? part[0].toUpperCase() + part.slice(1).toLowerCase() : part
        )
        .join("-")
    )
    .join(" ");

type TicketLineRef = Pick<ITicketPayload, "first" | "last"> & {
  ticket_type?: { name?: string } | null;
};

/**
 * Builds an Order Summary line label as `{ticket type name}: {Holder Name}`,
 * falling back gracefully when the ticket type or name is missing.
 */
export const formatTicketLineLabel = (ticket: TicketLineRef): string => {
  const holderName = toTitleCase(
    [ticket.first, ticket.last].filter(Boolean).join(" ")
  );
  const ticketTypeName = ticket.ticket_type?.name?.trim();

  if (!ticketTypeName) return holderName;
  if (!holderName) return ticketTypeName;

  return `${ticketTypeName}: ${holderName}`;
};
