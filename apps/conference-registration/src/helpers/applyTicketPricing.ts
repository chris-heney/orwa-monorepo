import { getExtraData } from "./getExtraData";
import { freeVendorAllowance } from "./freeVendorAllowance";
import { PriceTier, priceFor } from "./priceTier";
import {
  IExtraOption,
  ITicketOption,
  ITicketPayload,
} from "../types/types";

/**
 * Re-derive every ticket line's price from the catalog at checkout.
 *
 * `ticket.price` is written when a ticket modal is saved and survives in the
 * sessionStorage wizard draft, so summing it as-is charges whatever was true
 * at save time: a Vendor saved before a booth was added keeps its list price,
 * and a ticket saved while early pricing was open keeps `price_online` after
 * `online_registration_end` has passed. Each line is ticket type + paid
 * extras at the current tier, with the first N Vendors free per booth count.
 */
export const applyTicketPricing = (
  tickets: ITicketPayload[],
  boothCount: number,
  priceTier: PriceTier,
  extraOptions: IExtraOption[]
): ITicketPayload[] => {
  const freeSlots = freeVendorAllowance(boothCount);
  let vendorOrdinal = 0;

  return tickets.map((ticket) => {
    const isVendor = ticket.type === "Vendor";
    const ordinal = isVendor ? vendorOrdinal++ : -1;
    const ticketType = ticket.ticket_type;

    // A non-Vendor line without a ticket type has nothing to price from.
    if (!isVendor && !ticketType) return ticket;

    const ticketPrice =
      isVendor && ordinal < freeSlots ? 0 : priceFor(ticketType, priceTier);

    const extrasPrice = (ticket.extras || [])
      .map((extraId) => getExtraData(extraOptions, extraId))
      .filter((extra): extra is IExtraOption => !!extra)
      .filter((extra) => {
        const included = extra.included;
        if (!Array.isArray(included)) return true;
        return !included.some(
          (includedTicket: ITicketOption) =>
            String(includedTicket.id) === String(ticketType?.id)
        );
      })
      .reduce((sum, extra) => sum + priceFor(extra, priceTier), 0);

    return { ...ticket, price: ticketPrice + extrasPrice };
  });
};
