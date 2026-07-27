import { filterVisibleExtras } from "./filterVisibleExtras";
import { isExtraIncluded } from "./isExtraIncluded";
import { IExtraOption, ITicketPayload } from "../types/types";

export type GetUncheckedOptionalExtrasArgs = {
  ticket: Pick<ITicketPayload, "extras" | "ticket_type">;
  extras: IExtraOption[] | undefined;
  context: "Attendee" | "Vendor";
};

const isSelected = (
  ticketExtras: ITicketPayload["extras"] | undefined,
  extraId: IExtraOption["id"]
): boolean => {
  if (!Array.isArray(ticketExtras)) return false;
  return ticketExtras.some((id) => String(id) === String(extraId));
};

export const getUncheckedOptionalExtras = ({
  ticket,
  extras,
  context,
}: GetUncheckedOptionalExtrasArgs): IExtraOption[] => {
  const visibilityContext = context === "Vendor" ? "Attendee" : context;
  const visible = filterVisibleExtras({
    extras,
    context: visibilityContext,
    ticketTypeId: ticket.ticket_type?.id,
  });

  const optionals = visible.filter(
    (extra) =>
      !isExtraIncluded(ticket as ITicketPayload, extras, extra.id)
  );

  const hasOptionalPick = optionals.some((extra) =>
    isSelected(ticket.extras, extra.id)
  );
  if (hasOptionalPick) return [];

  return optionals
    .filter((extra) => !isSelected(ticket.extras, extra.id))
    .sort((a, b) => {
      if (!a.order || !b.order) return 0;
      return a.order - b.order;
    });
};

export const formatExtrasConfirmList = (names: string[]): string => {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} or ${names[1]}`;
  const head = names.slice(0, -1).join(", ");
  return `${head}, or ${names[names.length - 1]}`;
};
