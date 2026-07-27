import { IExtraOption } from "../types/types";
import { filterVisibleExtras } from "./filterVisibleExtras";

/**
 * Returns booth-context extras that would be shown in the booth modal / AddExtras.
 * Same rule as AddExtras: context + excluded only (no kiosk price gate).
 */
export const getBoothExtras = (
  extraOptions: IExtraOption[] | undefined,
  registrationSource?: "online" | "kiosk" | string,
  ticketTypeId?: string | number | null
): IExtraOption[] =>
  filterVisibleExtras({
    extras: extraOptions,
    context: "Booth",
    registrationSource,
    ticketTypeId,
  });

export const boothHasExtras = (
  extraOptions: IExtraOption[] | undefined,
  registrationSource?: "online" | "kiosk" | string,
  ticketTypeId?: string | number | null
): boolean => getBoothExtras(extraOptions, registrationSource, ticketTypeId).length > 0;
