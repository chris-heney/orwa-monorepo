import { Dispatch, SetStateAction } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import currencyFormatter from "../../helpers/currencyFormat";
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

  const boothCount = watch("booths")?.length || 0;

  const freeVendors = () => {
    return boothCount === 1 ? 2 : boothCount >= 2 ? 3 : 0;
  };

  const handleEdit = (ticketIndex: number) => {
    // Find the actual index of the ticket in the entire tickets array
    const allTickets = getValues("tickets");
    const filteredTickets = allTickets.filter(
      (ticket: any) => ticket.type === type
    );
    const actualIndex = allTickets.findIndex(
      (ticket: any) => ticket === filteredTickets[ticketIndex]
    );

    // Set the correct ticket index
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
    <div>
      <div className={`flex flex-col items-center ${sx}`}>
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getValues("tickets")
              .filter((ticket: any) => ticket.type === type)
              .map((ticket: ITicketPayload, ticketIndex: number) => (
                <div key={`ticket-${ticketIndex}`} className="mb-3">
                  <div className="flex items-start text-base font-semibold">
                    <span className="mr-3">
                      {ticket.first + " " + ticket.last}
                    </span>
                    <button
                      className="text-blue-500 underline mr-auto italic"
                      type="button"
                      onClick={() => handleEdit(ticketIndex)}
                    >
                      (Edit)
                    </button>
                    <span className="ml-auto">
                      {currencyFormatter.format(ticket.price)}
                    </span>
                  </div>
                  <ul className="border-t-2 border-slate-300">
                    <li className="flex justify-between ml-3 border-b border-gray-100">
                      <span>{ticket.ticket_type?.name || "N/A"}</span>
                      <span>
                        {ticket.ticket_type?.name === "Vendor" &&
                        ticketIndex + 1 <= freeVendors()
                          ? "Included"
                          : currencyFormatter.format(
                              registrationSource === "online"
                                ? ticket.ticket_type?.price_online
                                : ticket.ticket_type?.price_event
                            )}
                      </span>
                    </li>
                    {ticket.extras?.map((extra: any, extraIndex: number) => {
                      const currentExtra = getExtraData(ExtraOptions, extra);

                      return (
                        <li
                          key={`extra-${extraIndex}`}
                          className={`flex justify-between ml-3 border-b border-gray-100 ${
                            extraIndex % 2 !== 0 ? "bg-white" : "bg-gray-200"
                          }`}
                        >
                          <span>{currentExtra?.name}</span>
                          <span>
                            {isExtraIncluded(
                              ticket,
                              ExtraOptions,
                              currentExtra?.id
                            )
                              ? "Included"
                              : registrationSource === "online"
                              ? currencyFormatter.format(
                                  currentExtra?.price_online as number
                                )
                              : currencyFormatter.format(
                                  currentExtra?.price_event as number
                                )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
          </div>
        </div>

        {/* Button */}
        <div className="py-3">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddTicket}
          >
            Add {type}
          </button>
          {/* {<p className="text-red-500 italic text-center">Add Another {type}</p>} */}
        </div>
      </div>
    </div>
  );
};

export default AddTicketComponent;
