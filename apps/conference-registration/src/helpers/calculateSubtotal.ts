import {
  IBoothPayload,
  IExtraOption,
  IRegistrationPayload,
  ITicketPayload,
} from "../types/types";
import { getExtraData } from "./getExtraData";
import { applyTicketPricing } from "./applyTicketPricing";
import { PriceTier, priceFor } from "./priceTier";

export const calculateSubtotal = (
  payload: IRegistrationPayload,
  priceTier: PriceTier,
  non_member_fee = 1000,
  extraOptions: IExtraOption[]
) => {
  const {
    tickets,
    booths,
    registrationAddonIds,
    registrationExtrasIds,
    sponsors,
    member_status,
    agency,
  } = payload;

  let subtotal = 0;

  // Re-price every ticket from the catalog at the current tier so a stale
  // ticket.price (saved before a booth was added, or before early pricing
  // ended) cannot change the charged total.
  const pricedTickets = applyTicketPricing(
    tickets ?? [],
    booths?.length ?? 0,
    priceTier,
    extraOptions
  );

  pricedTickets.forEach((ticket: ITicketPayload) => {
    subtotal += ticket.price;
  });

  booths.forEach((booth: IBoothPayload) => {
    subtotal += booth.subtotal;
  });

  registrationAddonIds?.forEach((extra) => {
    const currentExtra = getExtraData(extraOptions, extra);
    if (!currentExtra) return 0;
    subtotal += priceFor(currentExtra, priceTier);
  });

  registrationExtrasIds?.forEach((extra) => {
    const currentExtra = getExtraData(extraOptions, extra);
    if (!currentExtra) return 0;
    subtotal += priceFor(currentExtra, priceTier);
  });

  sponsors.forEach((sponsor) => {
    subtotal += sponsor.amount;
  });

  subtotal +=
    member_status === "Non Member" && agency === "false" ? non_member_fee : 0;
  return subtotal;
};
