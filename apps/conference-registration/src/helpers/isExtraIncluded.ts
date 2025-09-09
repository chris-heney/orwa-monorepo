import { IExtraOption, ITicketPayload } from "../types/types";

export const isExtraIncluded = (
  ticket: ITicketPayload,
  extraOptions: IExtraOption[] | undefined,
  extraOptionId: number
): boolean => {
  // Ensure extraOptions is an array
  if (!Array.isArray(extraOptions)) return false;

  const selectedExtraOption = extraOptions.find((extraOption) => {
    return extraOption.id === extraOptionId;
  })

  if (!selectedExtraOption) return false;

  return selectedExtraOption.included.data.some((include) => {
    return include.id === ticket.ticket_type?.id;
  });

};