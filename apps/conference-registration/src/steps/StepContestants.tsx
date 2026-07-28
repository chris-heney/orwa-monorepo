import { useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { TextInput } from "mj-react-form-builder";
import AddTicketComponent from "../components/_components/AddTicket";
import {
  RegistrationOptions,
  useTicketIndex,
} from "../AppContextProvider";
import currencyFormatter from "../helpers/currencyFormat";
import ContestantModal from "../components/_components/ContestantModal";
import { ITicketPayload } from "../types/types";
import { ticketMatchesContext } from "../helpers/ticketMatchesContext";
import { ValidationHighlight } from "../helpers/validationHighlight";
import { hasSelectedId } from "../helpers/hasSelectedId";
import { resolveCartAttachIndex } from "../helpers/isContestantLinkedToCart";

const StepContestants = () => {
  const { ticketIndex } = useTicketIndex();
  const { ConferenceOptions } = useContext(RegistrationOptions);
  const { watch, getValues, setValue } = useFormContext();

  const [isModalOpen, setIsModalOpen] = useState({
    open: false,
    context: "create",
  });
  const [subtotal, setSubtotal] = useState(0);

  const tickets = watch("tickets") || [];
  const registrationType = watch("registration_type");
  const isContestantOnly = registrationType === "Contestant";

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

  useEffect(() => {
    const ticketPrice = contestantTickets.reduce(
      (acc: number, ticket: ITicketPayload) => acc + (ticket.price || 0),
      0
    );
    setSubtotal(ticketPrice || 0);
  }, [tickets]);

  // Repair contestant attach ids wiped by older Golfer-save (name kept, id cleared).
  useEffect(() => {
    if (registrationType !== "Attendee" && registrationType !== "Vendor") {
      return;
    }
    const all = (getValues("tickets") as ITicketPayload[]) || [];
    all.forEach((row, index) => {
      if (row.type !== "Contestant") return;
      if (hasSelectedId(row.source_ticket_id)) return;
      const repaired = resolveCartAttachIndex(row, all);
      if (repaired != null) {
        setValue(`tickets.${index}.source_ticket_id`, repaired, {
          shouldDirty: true,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrationType, contestantCount]);

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
          Add Contestant
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          {isContestantOnly
            ? "Add each tournament contestant below. At least one contestant is required."
            : "Optional — add tournament contestants for this registration, or click Next to skip."}
        </p>
      </header>

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

      <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
        <span className="text-sm text-slate-500">
          {contestantCount === 0
            ? "No participants added"
            : `${contestantCount} participant${
                contestantCount === 1 ? "" : "s"
              }`}
        </span>
        <p className="text-lg text-slate-900">
          Subtotal:{" "}
          <span className="font-bold tabular-nums">
            {currencyFormatter.format(subtotal)}
          </span>
        </p>
      </div>

      {isModalOpen.open && ticketIndex !== null && ticketIndex >= 0 && (
        <ContestantModal setIsOpen={setIsModalOpen} isOpen={isModalOpen} />
      )}
    </div>
  );
};

export default StepContestants;
