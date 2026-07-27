import { IExtraOption } from "../types/types";

export type ExtraVisibilityContext =
  | "Attendee"
  | "Vendor"
  | "Registration"
  | "Contestant"
  | "Booth";

export type FilterVisibleExtrasArgs = {
  extras: IExtraOption[] | undefined;
  context: ExtraVisibilityContext;
  /** Kept for call-site compatibility; price/source no longer affect visibility. */
  registrationSource?: "online" | "kiosk" | string;
  /** Ticket type id for excluded checks. */
  ticketTypeId?: string | number | null;
};

export const extraMatchesContext = (
  extra: IExtraOption,
  context: ExtraVisibilityContext
): boolean => {
  if (extra.context === context) return true;
  // Strapi has "Contestants" (plural) on Mulligan; UI context is "Contestant"
  if (context === "Contestant" && (extra.context as string) === "Contestants") {
    return true;
  }
  return false;
};

const isExcludedForTicket = (
  extra: IExtraOption,
  context: ExtraVisibilityContext,
  ticketTypeId: string | number | null | undefined
): boolean => {
  if (context === "Booth") return false;
  const excluded = extra.excluded;
  if (!Array.isArray(excluded) || ticketTypeId == null) return false;
  return excluded.some(
    (excludedTicket) => String(excludedTicket.id) === String(ticketTypeId)
  );
};

/**
 * Single visibility set for Extras heading + option list.
 *
 * Filters by context and excluded tickets only. Price ($0 / priced) and
 * registration source never hide an extra — free Lunch/Dinner still need RSVPs.
 */
export const filterVisibleExtras = ({
  extras,
  context,
  ticketTypeId,
}: FilterVisibleExtrasArgs): IExtraOption[] => {
  if (!extras?.length) return [];

  return extras.filter((extra) => {
    if (!extraMatchesContext(extra, context)) return false;
    if (isExcludedForTicket(extra, context, ticketTypeId)) return false;
    return true;
  });
};
