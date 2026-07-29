import { useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { TextInput } from "mj-react-form-builder";
import AddTicketComponent from "../components/_components/AddTicket";
import { RegistrationOptions, useTicketIndex } from "../AppContextProvider";
import currencyFormatter from "../helpers/currencyFormat";
import TicketModal from "../components/_components/TicketModal";
import { ITicketPayload } from "../types/types";
import { ticketMatchesContext } from "../helpers/ticketMatchesContext";
import { ValidationHighlight } from "../helpers/validationHighlight";

const StepAttendees = () => {
  const { ticketIndex } = useTicketIndex();
  const { ConferenceOptions } = useContext(RegistrationOptions);
  const { watch } = useFormContext();

  const [isModalOpen, setIsModalOpen] = useState({
    open: false,
    context: "create",
  });

  const [subtotal, setSubtotal] = useState(0);
  const tickets = watch("tickets") || [];

  useEffect(() => {
    const ticketPrice = tickets
      .filter((ticket: ITicketPayload) => {
        return (
          ticket.ticket_type &&
          (ticketMatchesContext(ticket.ticket_type, "Attendee") ||
            ticket.type === "Attendee")
        );
      })
      ?.reduce((acc: number, ticket: ITicketPayload) => acc + ticket.price, 0);
    setSubtotal(ticketPrice || 0);
  }, [tickets]);

  const attendeeCount = tickets.filter(
    (ticket: ITicketPayload) => ticket.type === "Attendee"
  ).length;

  if (!ConferenceOptions) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16 text-center text-slate-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-0 py-6 text-left">
      <header className="mb-6 border-b border-slate-200 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Attendee Information
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Enter your organization, then add each person attending. Guests and
          meal extras can be configured when you add an attendee.
        </p>
      </header>

      <ValidationHighlight
        field="organization"
        className="mb-6 rounded-lg border border-slate-200 bg-white p-5"
        clearWhen={Boolean(watch("organization"))}
      >
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Organization
        </h3>
        <TextInput source="organization" label="Organization" required />
      </ValidationHighlight>

      <ValidationHighlight
        field="attendees"
        className="p-2"
        clearWhen={attendeeCount > 0}
      >
        <section aria-label="Attendees">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Attendees
            </h3>
            <span className="text-xs text-slate-400">
              {attendeeCount} added
            </span>
          </div>
          <AddTicketComponent type="Attendee" setIsModalOpen={setIsModalOpen} />
        </section>
      </ValidationHighlight>

      <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
        <span className="text-sm text-slate-500">
          {attendeeCount === 0
            ? "No attendees added yet"
            : `${attendeeCount} attendee${attendeeCount === 1 ? "" : "s"}`}
        </span>
        <p className="text-lg text-slate-900">
          Subtotal:{" "}
          <span className="font-bold tabular-nums">
            {currencyFormatter.format(subtotal)}
          </span>
        </p>
      </div>

      {isModalOpen.open && ticketIndex !== null && ticketIndex >= 0 && (
        <TicketModal
          setIsOpen={setIsModalOpen}
          type="Attendee"
          isOpen={isModalOpen}
        />
      )}
    </div>
  );
};

export default StepAttendees;
