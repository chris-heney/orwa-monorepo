// Goal: check all tickets opptions for their context if only one ticket is available return that ticket else return an empty array

import { IExtraOption, ITicketOption, ticketType } from "../types/types";
import { ticketMatchesContext } from "./ticketMatchesContext";

export const fetchSingleTicket = (
  ticketOptions: ITicketOption[],
  extraOptions: IExtraOption[],
  context: ticketType,
  // registrationSource: string
) => {
  if (!ticketOptions)
    return {
      extras: [],
      ticket_type: {},
    };

  const filteredTickets = ticketOptions.filter((ticket: ITicketOption) => {
    return ticketMatchesContext(ticket, context);
  });

  const includedExtras = extraOptions.filter((extra) => {
    const included = extra.included;
    if (!Array.isArray(included)) return false;
    return included.find((includedTicket: ITicketOption) => {
      return String(includedTicket.id) === String(filteredTickets[0]?.id);
    });
  });

  return filteredTickets.length === 1
    ? {
        extras: includedExtras.map((extra) => extra.id),
        ticket_type: filteredTickets[0],
      }
    : {
        extras: [],
        ticket_type: {},
      };
};
