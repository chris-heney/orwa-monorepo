import { useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { TextInput } from "mj-react-form-builder";
import AddTicketComponent from "../components/_components/AddTicket";
import { RegistrationOptions, useTicketIndex } from "../AppContextProvider";
import currencyFormatter from "../helpers/currencyFormat";
import TicketModal from "../components/_components/TicketModal";
import AddExtras from "../components/AddExtras";
import { ITicketPayload } from "../types/types";
import { ticketMatchesContext } from "../helpers/ticketMatchesContext";
import { ValidationHighlight } from "../helpers/validationHighlight";

const StepContestants = () => {
  const { ticketIndex } = useTicketIndex();
  const { ConferenceOptions, ExtraOptions } = useContext(RegistrationOptions);
  const { watch } = useFormContext();

  const [isModalOpen, setIsModalOpen] = useState({
    open: false,
    context: "create",
  });
  const [subtotal, setSubtotal] = useState(0);

  const tickets = watch("tickets") || [];
  const organization = watch("organization");

  const contestantTickets = tickets.filter(
    (ticket: ITicketPayload) =>
      ticket.type === "Contestant" ||
      ticketMatchesContext(ticket.ticket_type, "Contestant")
  );
  const contestantCount = contestantTickets.length;
  const golferCount = contestantTickets.filter(
    (ticket: ITicketPayload) => ticket.ticket_type?.name === "Golfer"
  ).length;
  const needsTeamName = golferCount >= 2;
  const hasContestantExtras = (ExtraOptions ?? []).some(
    (extra) =>
      extra.context === "Contestant" || extra.context === "Contestants"
  );

  useEffect(() => {
    const ticketPrice = contestantTickets.reduce(
      (acc: number, ticket: ITicketPayload) => acc + (ticket.price || 0),
      0
    );
    setSubtotal(ticketPrice || 0);
  }, [tickets]);

  if (!ConferenceOptions) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16 text-center text-slate-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6 text-left">
      <header className="mb-6 border-b border-slate-200 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Golf &amp; Bass Tournament
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Optional — add golfers and/or bass tournament fishers for this
          registration, or click Next to skip.
        </p>
      </header>

      <ValidationHighlight
        field="organization"
        className="mb-6 rounded-lg border border-slate-200 bg-white p-5"
        clearWhen={Boolean(organization)}
      >
        <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Organization
        </h3>
        <p className="mb-4 text-xs leading-relaxed text-slate-500">
          Shown with your tournament participants.
        </p>
        <TextInput source="organization" label="Organization" required />
      </ValidationHighlight>

      {needsTeamName && (
        <section className="mb-6 rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Golf team
          </h3>
          <p className="mb-4 text-xs leading-relaxed text-slate-500">
            Required when registering two or more golfers.
          </p>
          <TextInput source="team" label="Team Name" required />
        </section>
      )}

      <ValidationHighlight
        field="contestants"
        className="p-2"
        clearWhen={contestantCount > 0}
      >
        <section aria-label="Tournament participants">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Participants
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Choose Golfer or Fisher when you add each person.
              </p>
            </div>
            <span className="shrink-0 text-xs tabular-nums text-slate-400">
              {contestantCount} added
            </span>
          </div>

          <AddTicketComponent
            type="Contestant"
            setIsModalOpen={setIsModalOpen}
          />
        </section>
      </ValidationHighlight>

      {hasContestantExtras && (
        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
          <AddExtras field="registrationExtras" context="Contestant" />
        </section>
      )}

      <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
        <span className="text-sm text-slate-500">
          {contestantCount === 0
            ? "No participants added"
            : `${contestantCount} participant${contestantCount === 1 ? "" : "s"}`}
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
          type="Contestant"
          isOpen={isModalOpen}
        />
      )}
    </div>
  );
};

export default StepContestants;
