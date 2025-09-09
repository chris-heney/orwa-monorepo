import { useContext, useEffect, useState } from "react";
import { Divider, Modal, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { FormSection, TextInput } from "mj-react-form-builder";
import AddTicketComponent from "../components/_components/AddTicket";
import { RegistrationOptions, useTicketIndex } from "../AppContextProvider";
import currencyFormatter from "../helpers/currencyFormat";
import TicketModal from "../components/_components/TicketModal";
import { ITicketPayload } from "../types/types";

const StepAttendees = () => {
  const { ticketIndex } = useTicketIndex();
  const { ConferenceOptions } = useContext(RegistrationOptions);
  const { watch } = useFormContext();

  const [isModalOpen, setIsModalOpen] = useState({
    open: false,
    context: "create",
  });

  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const ticketPrice = watch("tickets")
      .filter((ticket: ITicketPayload) => {
        return ticket.ticket_type && ticket.ticket_type.context === "Attendee";
      })
      ?.reduce((acc: number, ticket: ITicketPayload) => acc + ticket.price, 0);
    setSubtotal(ticketPrice || 0);
  }, [watch("tickets")]);

  return !ConferenceOptions ? (
    <>Loading...</>
  ) : (
    <div className="container mx-auto max-w-3xl px-4">
      <FormSection title="Attendee Information">
        <TextInput source="organization" label="Organization" required />
        <div className="grid md:grid-cols-1 col-span-2 gap-4">
          <AddTicketComponent type="Attendee" setIsModalOpen={setIsModalOpen} />
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
          <>
            <TicketModal
              setIsOpen={setIsModalOpen}
              type="Attendee"
              isOpen={isModalOpen}
            />
          </>
        </Modal>
      )}
    </div>
  );
};

export default StepAttendees;
