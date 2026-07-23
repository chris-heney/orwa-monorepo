import { IExtraOption } from "../types/types";

/**
 * Returns booth-context extras that would be shown in the booth modal / AddExtras.
 * Matches AddExtras filtering: context === "Booth", and for kiosk only priced extras.
 */
export const getBoothExtras = (
  extraOptions: IExtraOption[] | undefined,
  registrationSource: "online" | "kiosk" | string
): IExtraOption[] => {
  if (!extraOptions?.length) return [];

  return extraOptions.filter((extra) => {
    if (extra.context !== "Booth") return false;
    if (registrationSource === "kiosk") {
      return (extra.price_event ?? 0) > 0;
    }
    return true;
  });
};

export const boothHasExtras = (
  extraOptions: IExtraOption[] | undefined,
  registrationSource: "online" | "kiosk" | string
): boolean => getBoothExtras(extraOptions, registrationSource).length > 0;
