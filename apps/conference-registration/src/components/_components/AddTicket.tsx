import { Dispatch, SetStateAction } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { formatCurrency } from "../../helpers/currencyFormat";
import {
  useRegistrationOptions,
  useRegistrationSource,
  useTicketIndex,
} from "../../AppContextProvider";
import { ITicketPayload } from "../../types/types";
import { isExtraIncluded } from "../../helpers/isExtraIncluded";
import { fetchSingleTicket } from "../../helpers/fetchSingleTicket";
import { getExtraData } from "../../helpers/getExtraData";

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
  const { append } = useFieldArray({
    control,
    name: "tickets",
  });

  const registrationSource = useRegistrationSource();
  const tickets = watch("tickets") || [];
  const typedTickets = tickets.filter(
    (ticket: ITicketPayload) => ticket.type === type
  );

  const boothCount = watch("booths")?.length || 0;

  const freeVendors = () => {
    return boothCount === 1 ? 2 : boothCount >= 2 ? 3 : 0;
  };

  const handleEdit = (ticketIndex: number) => {
    const allTickets = getValues("tickets");
    const filteredTickets = allTickets.filter(
      (ticket: ITicketPayload) => ticket.type === type
    );
    const actualIndex = allTickets.findIndex(
      (ticket: ITicketPayload) => ticket === filteredTickets[ticketIndex]
    );

    setTicketIndex(actualIndex);
    setIsModalOpen({
      open: true,
      context: "edit",
    });
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
      ...fetchSingleTicket(TicketOptions, ExtraOptions, type),
    });
    setTicketIndex(getValues("tickets").length - 1);
    setIsModalOpen({
      open: true,
      context: "create",
    });
  };

  return (
    <div className={sx}>
      {typedTickets.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
          <p className="text-sm font-medium text-slate-600">
            No {type.toLowerCase()}s added yet
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Add at least one {type.toLowerCase()} to continue.
          </p>
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
                      </div>
                      <p className="mt-0.5 text-sm text-slate-500">
                        {ticket.ticket_type?.name || "Ticket type not set"}
                      </p>
                    </div>
                    <span className="text-base font-bold tabular-nums text-slate-900">
                      {formatCurrency(ticket.price)}
                    </span>
                  </div>

                  <ul className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-sm">
                    <li className="flex justify-between gap-4 text-slate-600">
                      <span>{ticket.ticket_type?.name || "N/A"}</span>
                      <span className="tabular-nums text-slate-800">
                        {ticket.ticket_type?.name === "Vendor" &&
                        ticketIndex + 1 <= freeVendors()
                          ? "Included"
                          : formatCurrency(
                              registrationSource === "online"
                                ? ticket.ticket_type?.price_online
                                : ticket.ticket_type?.price_event
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
                              : formatCurrency(
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
          Add {type}
        </button>
      </div>
    </div>
  );
};

export default AddTicketComponent;
