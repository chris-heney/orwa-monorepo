import {
  IBoothPayload,
  IExtraOption,
  IRegistrationPayload,
  ITicketPayload,
} from "../types/types";
import { getExtraData } from "./getExtraData";

/**
 * Drop orphan extra IDs that don't exist on the current conference's ExtraOptions.
 * Common when resubmitting a prior-year entry under a different conference_id
 * (e.g. Expo Lunch id 34 loaded on Fall Conference, which only has 37/38/39).
 */
export const sanitizeRegistrationExtras = (
  payload: IRegistrationPayload,
  extraOptions: IExtraOption[]
): IRegistrationPayload => {
  if (!payload) return payload;

  const keep = (extraId: unknown) => !!getExtraData(extraOptions, extraId as never);

  const tickets = (payload.tickets || []).map((ticket: ITicketPayload) => ({
    ...ticket,
    extras: (ticket.extras || []).filter(keep),
  }));

  const booths = (payload.booths || []).map((booth: IBoothPayload) => ({
    ...booth,
    extras: (booth.extras || []).filter(keep),
  }));

  return {
    ...payload,
    tickets,
    booths,
    registrationAddonIds: (payload.registrationAddonIds || []).filter(keep),
    registrationExtrasIds: (payload.registrationExtrasIds || []).filter(keep),
  };
};
