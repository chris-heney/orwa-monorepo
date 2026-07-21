import { IExtraOption, ITicketPayload } from "../types/types";
import { getExtraData } from "./getExtraData";

export const isExtraIncluded = (
  ticket: ITicketPayload,
  extraOptions: IExtraOption[] | undefined,
  extraOptionId: number | string | { id?: number | string } | undefined
): boolean => {
  if (!Array.isArray(extraOptions) || extraOptionId == null) return false;

  const selectedExtraOption = getExtraData(extraOptions, extraOptionId);

  if (!selectedExtraOption) return false;

  const included = selectedExtraOption.included;
  if (!Array.isArray(included)) return false;

  return included.some((include) => {
    return String(include.id) === String(ticket.ticket_type?.id);
  });
};
