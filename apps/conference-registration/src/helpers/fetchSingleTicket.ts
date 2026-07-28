// Goal: pick the default ticket option for a registration step context so
// public users don't need a Ticket Type dropdown (admin can still override).

import { IExtraOption, ITicketOption, ticketType } from "../types/types";
import { ticketMatchesContext } from "./ticketMatchesContext";

const nameEquals = (a?: string, b?: string) =>
  !!a &&
  !!b &&
  a.localeCompare(b, undefined, { sensitivity: "accent" }) === 0;

/**
 * Prefer an exact name match to the step context (Attendee over Guest),
 * otherwise the sole matching option.
 */
export const pickDefaultTicket = (
  ticketOptions: ITicketOption[] | null | undefined,
  context: ticketType
): ITicketOption | undefined => {
  if (!ticketOptions?.length) return undefined;

  const filtered = ticketOptions.filter((ticket) =>
    ticketMatchesContext(ticket, context)
  );
  if (filtered.length === 0) return undefined;

  return (
    filtered.find((ticket) => nameEquals(ticket.name, context)) ??
    (filtered.length === 1 ? filtered[0] : undefined)
  );
};

export const fetchSingleTicket = (
  ticketOptions: ITicketOption[],
  extraOptions: IExtraOption[],
  context: ticketType
  // registrationSource: string
) => {
  if (!ticketOptions) {
    return {
      extras: [],
      ticket_type: {},
    };
  }

  const preferred = pickDefaultTicket(ticketOptions, context);

  if (!preferred) {
    return {
      extras: [],
      ticket_type: {},
    };
  }

  const includedExtras = extraOptions.filter((extra) => {
    const included = extra.included;
    if (!Array.isArray(included)) return false;
    return included.find((includedTicket: ITicketOption) => {
      return String(includedTicket.id) === String(preferred.id);
    });
  });

  return {
    extras: includedExtras.map((extra) => extra.id),
    ticket_type: preferred,
  };
};
