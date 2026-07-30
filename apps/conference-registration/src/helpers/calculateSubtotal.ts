import {
  IBoothPayload,
  IExtraOption,
  IRegistrationPayload,
  ITicketPayload,
} from "../types/types";
import { getExtraData } from "./getExtraData";
import { applyFreeVendorPricing } from "./applyFreeVendorPricing";

export const calculateSubtotal = (
  payload: IRegistrationPayload,
  registrationSource = "online",
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

  // Re-apply booth-bundled free Vendor pricing from current booth count so
  // stale ticket.price values (saved before a booth was added) cannot inflate
  // the charged total.
  const pricedTickets = applyFreeVendorPricing(
    tickets ?? [],
    booths?.length ?? 0,
    registrationSource,
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
    subtotal +=
      registrationSource === "online"
        ? currentExtra.price_online
        : currentExtra.price_event;
  });

  registrationExtrasIds?.forEach((extra) => {
    const currentExtra = getExtraData(extraOptions, extra);
    if (!currentExtra) return 0;
    subtotal +=
      registrationSource === "online"
        ? currentExtra.price_online
        : currentExtra.price_event;
  });

  sponsors.forEach((sponsor) => {
    subtotal += sponsor.amount;
  });

  subtotal +=
    member_status === "Non Member" && agency === "false" ? non_member_fee : 0;
  return subtotal;
};
