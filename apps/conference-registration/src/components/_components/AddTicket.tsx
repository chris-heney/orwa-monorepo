import { Dispatch, SetStateAction } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { formatMoneyOrIncluded } from "../../helpers/currencyFormat";
import {
  useRegistrationOptions,
  useRegistrationSource,
  useTicketIndex,
} from "../../AppContextProvider";
import { ITicketPayload } from "../../types/types";
import { isExtraIncluded } from "../../helpers/isExtraIncluded";
import { fetchSingleTicket } from "../../helpers/fetchSingleTicket";
import { getExtraData } from "../../helpers/getExtraData";
import { ticketMatchesContext } from "../../helpers/ticketMatchesContext";
import { freeVendorAllowance } from "../../helpers/freeVendorAllowance";
import currencyFormatter from "../../helpers/currencyFormat";

interface IAddTicketComponentProps {
  setIsModalOpen: Dispatch<
    SetStateAction<{
      open: boolean;
      context: string;
    }>
  >;
  type: "Vendor" | "Attendee" | "Guest" | "Contestant";
  sx?: string;
}

const AddTicketComponent = ({
  setIsModalOpen,
  type,
  sx,
}: IAddTicketComponentProps) => {
  const { setTicketIndex } = useTicketIndex();
  const { TicketOptions, ExtraOptions } = useRegistrationOptions();
  const { watch, control, getValues } = useFormContext();
  const { append, remove } = useFieldArray({
    control,
    name: "tickets",
  });

  const registrationSource = useRegistrationSource();
  const tickets = watch("tickets") || [];
  const typedTickets = tickets.filter(
    (ticket: ITicketPayload) => ticket.type === type
  );

  const registrationType = watch("registration_type");
  // ContestantModal resolves Golfer vs Fisher (and Fisher tier) itself.
  const optionsForType =
    type === "Contestant"
      ? (TicketOptions ?? []).filter((ticket) =>
          ticketMatchesContext(ticket, "Contestant")
        )
      : TicketOptions;

  const boothCount = watch("booths")?.length || 0;
  const freeVendors = () => freeVendorAllowance(boothCount);

  const resolveAbsoluteIndex = (typedIndex: number) => {
    const allTickets = getValues("tickets") as ITicketPayload[];
    const filteredTickets = allTickets.filter(
      (ticket: ITicketPayload) => ticket.type === type
    );
    return allTickets.findIndex(
      (ticket: ITicketPayload) => ticket === filteredTickets[typedIndex]
    );
  };

  const handleEdit = (typedIndex: number) => {
    const actualIndex = resolveAbsoluteIndex(typedIndex);
    if (actualIndex < 0) return;
    setTicketIndex(actualIndex);
    setIsModalOpen({
      open: true,
      context: "edit",
    });
  };

  const handleRemove = (typedIndex: number) => {
    const actualIndex = resolveAbsoluteIndex(typedIndex);
    if (actualIndex < 0) return;
    remove(actualIndex);
  };

  const handleAddTicket = () => {
    append({
      first: "",
      last: "",
      email: "",
      phone: "",
      type,
      training_type: "None",
      price: 0,
      ...fetchSingleTicket(optionsForType, ExtraOptions, type),
    });
    setTicketIndex(getValues("tickets").length - 1);
    setIsModalOpen({
      open: true,
      context: "create",
    });
  };

  const emptyCopy =
    type === "Contestant"
      ? {
          title: "No contestants added yet",
          hint:
            registrationType === "Contestant"
              ? "Add at least one contestant to continue."
              : "Optional — add participants below, or click Next to skip.",
          button: "Add Contestant",
        }
      : {
          title: `No ${type.toLowerCase()}s added yet`,
          hint: `Add at least one ${type.toLowerCase()} to continue.`,
          button: `Add ${type}`,
        };

  return (
    <div className={sx}>
      {typedTickets.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
          <p className="text-sm font-medium text-slate-600">{emptyCopy.title}</p>
          <p className="mt-1 text-xs text-slate-400">{emptyCopy.hint}</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 bg-white">
          {typedTickets.map((ticket: ITicketPayload, ticketIndex: number) => {
            const displayName =
              [ticket.first, ticket.last].filter(Boolean).join(" ") ||
              `Untitled ${type}`;

            return (
              <li key={`ticket-${type}-${ticketIndex}`}>
                <div className="px-4 py-4 hover:bg-slate-50/80">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-semibold text-slate-900">
                          {displayName}
                        </span>
                        <button
                          type="button"
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                          onClick={() => handleEdit(ticketIndex)}
                        >
                          Edit
                        </button>
                        {type === "Contestant" && (
                          <button
                            type="button"
                            className="text-sm font-medium text-red-600 hover:text-red-800"
                            onClick={() => handleRemove(ticketIndex)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-slate-500">
                        {ticket.ticket_type?.name || "Ticket type not set"}
                      </p>
                    </div>
                    <span className="text-base font-bold tabular-nums text-slate-900">
                      {type === "Vendor" && ticketIndex < freeVendors() ? (
                        <span className="inline-flex items-baseline gap-1.5">
                          <span className="font-normal text-slate-400 line-through">
                            {currencyFormatter.format(
                              registrationSource === "online"
                                ? ticket.ticket_type?.price_online || 0
                                : ticket.ticket_type?.price_event || 0
                            )}
                          </span>
                          <span>{currencyFormatter.format(0)}</span>
                        </span>
                      ) : (
                        formatMoneyOrIncluded(ticket.price)
                      )}
                    </span>
                  </div>

                  <ul className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-sm">
                    <li className="flex justify-between gap-4 text-slate-600">
                      <span>{ticket.ticket_type?.name || "N/A"}</span>
                      <span className="tabular-nums text-slate-800">
                        {ticket.ticket_type?.name === "Vendor" &&
                        ticketIndex < freeVendors() ? (
                          <span className="inline-flex items-baseline gap-1.5">
                            <span className="text-slate-400 line-through">
                              {currencyFormatter.format(
                                registrationSource === "online"
                                  ? ticket.ticket_type?.price_online || 0
                                  : ticket.ticket_type?.price_event || 0
                              )}
                            </span>
                            <span>{currencyFormatter.format(0)}</span>
                          </span>
                        ) : (
                          formatMoneyOrIncluded(
                            registrationSource === "online"
                              ? ticket.ticket_type?.price_online
                              : ticket.ticket_type?.price_event
                          )
                        )}
                      </span>
                    </li>
                    {ticket.extras?.map((extra: string | number, extraIndex: number) => {
                      const currentExtra = getExtraData(ExtraOptions, extra);
                      if (!currentExtra) return null;

                      return (
                        <li
                          key={`extra-${ticketIndex}-${extraIndex}`}
                          className="flex justify-between gap-4 text-slate-600"
                        >
                          <span>{currentExtra.name}</span>
                          <span className="tabular-nums text-slate-800">
                            {isExtraIncluded(
                              ticket,
                              ExtraOptions,
                              currentExtra.id
                            )
                              ? "Included"
                              : formatMoneyOrIncluded(
                                  registrationSource === "online"
                                    ? currentExtra.price_online
                                    : currentExtra.price_event
                                )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={handleAddTicket}
        >
          {emptyCopy.button}
        </button>
      </div>
    </div>
  );
};

export default AddTicketComponent;
