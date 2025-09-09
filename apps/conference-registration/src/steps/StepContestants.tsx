import { useContext, useEffect, useState } from "react";
import { Divider, Modal, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { IRegistrationOptions, ITicketPayload } from "../types/types";
import { RegistrationOptions, useTicketIndex } from "../AppContextProvider";
import currencyFormatter from "../helpers/currencyFormat";
import { FormSection, TextInput } from "mj-react-form-builder";
import AddTicketComponent from "../components/_components/AddTicket";
import TicketModal from "../components/_components/TicketModal";
import AddExtras from "../components/AddExtras";

const StepContestants = () => {
  const { getValues, watch } = useFormContext();
  const { ConferenceOptions } =
    useContext<IRegistrationOptions>(RegistrationOptions);

  const {ticketIndex} = useTicketIndex();

  const [isModalOpen, setIsModalOpen] = useState({
    open: false,
    context: "create",
  });
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const ticketPrice = watch("tickets")
      .filter((ticket: ITicketPayload) => {
        return (
          ticket.ticket_type && ticket.ticket_type.context === "Contestant"
        );
      })
      ?.reduce((acc: number, ticket: ITicketPayload) => acc + ticket.price, 0);
    setSubtotal(ticketPrice || 0);
  }, [watch("tickets")]);

  return !ConferenceOptions ? (
    <>Loading</>
  ) : (
    <div className="container mx-auto max-w-3xl px-4">
      <FormSection title="Contestants">
        {/* <SelectWatersystem /> */}
        <TextInput source="organization" label="Organization" required />
        {getValues("tickets").filter((ticket: ITicketPayload) => {
          return ticket.ticket_type?.name === "Golfer";
        }).length >= 2 && (
          <>
            <TextInput source="team" label="Team Name" required />
            <p className="text-sm text-gray-600 mt-1 text-left">
              Choose a team name for your golfers
            </p>
          </>
        )}

        <div className="grid md:grid-cols-1 col-span-2 gap-4">
          <AddTicketComponent
            type="Contestant"
            setIsModalOpen={setIsModalOpen}
          />
        </div>
      </FormSection>
      <Typography variant="h6" textAlign="right">
        Subtotal:{" "}
        <strong className="text-red-600">
          {currencyFormatter.format(subtotal)}
        </strong>
      </Typography>
      <Divider />
      {ticketIndex !== null && isModalOpen && (
        <Modal
          disableAutoFocus
          open={isModalOpen.open}
          onClose={() => setIsModalOpen({ open: false, context: "create" })}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <TicketModal
            setIsOpen={setIsModalOpen}
            type="Contestant"
            isOpen={isModalOpen}
          />
        </Modal>
      )}
          <AddExtras field="registrationExtras" context="Registration" />
    </div>
  );
};

export default StepContestants;
