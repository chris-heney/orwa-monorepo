import { getExtraData } from "./getExtraData";
import { freeVendorAllowance } from "./freeVendorAllowance";
import {
  IExtraOption,
  ITicketOption,
  ITicketPayload,
} from "../types/types";

/**
 * Re-apply booth-bundled free Vendor ticket pricing using current booth count.
 * TicketModal only zeros price at save time; if a booth is added/removed later
 * without re-saving each vendor, checkout would charge the stale list price.
 */
export const applyFreeVendorPricing = (
  tickets: ITicketPayload[],
  boothCount: number,
  registrationSource: string,
  extraOptions: IExtraOption[]
): ITicketPayload[] => {
  const freeSlots = freeVendorAllowance(boothCount);
  let vendorOrdinal = 0;

  return tickets.map((ticket) => {
    if (ticket.type !== "Vendor") return ticket;

    const ordinal = vendorOrdinal;
    vendorOrdinal += 1;

    const ticketType = ticket.ticket_type;
    const listPrice =
      registrationSource === "online"
        ? ticketType?.price_online || 0
        : ticketType?.price_event || 0;
    const ticketPrice = ordinal < freeSlots ? 0 : listPrice;

    const extrasPrice = (ticket.extras || [])
      .map((extraId) => getExtraData(extraOptions, extraId))
      .filter((extra): extra is IExtraOption => !!extra)
      .filter((extra) => {
        const included = extra.included;
        if (!Array.isArray(included)) return true;
        return !included.some(
          (includedTicket: ITicketOption) =>
            String(includedTicket.id) === String(ticket.ticket_type?.id)
        );
      })
      .reduce(
        (sum, extra) =>
          sum +
          (registrationSource === "online"
            ? extra?.price_online || 0
            : extra?.price_event || 0),
        0
      );

    return { ...ticket, price: ticketPrice + extrasPrice };
  });
};
