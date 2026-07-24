import { useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { TextInput } from "mj-react-form-builder";
import AddTicketComponent from "../components/_components/AddTicket";
import {
  RegistrationOptions,
  useRegistrationSource,
  useTicketIndex,
} from "../AppContextProvider";
import currencyFormatter from "../helpers/currencyFormat";
import TicketModal from "../components/_components/TicketModal";
import AddExtras from "../components/AddExtras";
import { ITicketPayload } from "../types/types";
import { ticketMatchesContext } from "../helpers/ticketMatchesContext";
import {
  allowedContestantTickets,
  hasBothContestantTiers,
  isStandaloneContestantTicket,
  tierMinPrice,
} from "../helpers/contestantTicketTiers";
import { ValidationHighlight } from "../helpers/validationHighlight";

const StepContestants = () => {
  const { ticketIndex } = useTicketIndex();
  const { ConferenceOptions, ExtraOptions, TicketOptions } = useContext(
    RegistrationOptions
  );
  const registrationSource = useRegistrationSource();
  const { watch, setValue } = useFormContext();

  const [isModalOpen, setIsModalOpen] = useState({
    open: false,
    context: "create",
  });
  const [subtotal, setSubtotal] = useState(0);

  const tickets = watch("tickets") || [];
  const organization = watch("organization");
  const registrationType = watch("registration_type");
  const alreadyRegistered = watch("contestant_already_registered");

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
  const hasContestantExtras = (ExtraOptions ?? []).some(
    (extra) =>
      extra.context === "Contestant" || extra.context === "Contestants"
  );

  // Tournament copy is driven by the contestant tickets on this conference,
  // so golf-era conferences (resubmits) still read correctly.
  const contestantOptions = (TicketOptions ?? []).filter((ticket) =>
    ticketMatchesContext(ticket, "Contestant")
  );
  const hasGolf = contestantOptions.some((t) => /golf/i.test(t.name ?? ""));
  const hasFishing = contestantOptions.some((t) => /fish/i.test(t.name ?? ""));
  const tournamentTitle =
    hasGolf && hasFishing
      ? "Golf & Bass Tournament"
      : hasFishing
      ? "Fishing Tournament"
      : hasGolf
      ? "Golf Tournament"
      : "Tournament Contestants";

  // Contestant-only flow: two price tiers driven by ticket data.
  const showTierToggle = isContestantOnly && hasBothContestantTiers(TicketOptions);
  const addOnPrice = tierMinPrice(
    contestantOptions.filter((t) => !isStandaloneContestantTicket(t)),
    registrationSource
  );
  const standalonePrice = tierMinPrice(
    contestantOptions.filter(isStandaloneContestantTicket),
    registrationSource
  );

  // Default the toggle to the full (standalone) price so no one is
  // undercharged by accident; they opt in to the registered discount.
  useEffect(() => {
    if (showTierToggle && alreadyRegistered === undefined) {
      setValue("contestant_already_registered", "No");
    }
  }, [showTierToggle, alreadyRegistered, setValue]);

  const handleTierChange = (value: "Yes" | "No") => {
    if (alreadyRegistered === value) return;
    setValue("contestant_already_registered", value);

    // Drop contestant tickets priced for the other tier so carts never mix
    // $75 and $150 fishing tickets.
    const allowed = allowedContestantTickets(
      TicketOptions,
      "Contestant",
      value === "Yes"
    );
    const allowedIds = new Set(allowed.map((t) => String(t.id)));
    const pruned = tickets.filter((ticket: ITicketPayload) => {
      const isContestantTicket =
        ticket.type === "Contestant" ||
        ticketMatchesContext(ticket.ticket_type, "Contestant");
      if (!isContestantTicket) return true;
      return allowedIds.has(String(ticket.ticket_type?.id));
    });
    if (pruned.length !== tickets.length) {
      setValue("tickets", pruned);
    }
  };

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
          {tournamentTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          {isContestantOnly
            ? "Add each tournament contestant below. At least one contestant is required."
            : "Optional — add tournament contestants for this registration, or click Next to skip."}
        </p>
      </header>

      {showTierToggle && (
        <ValidationHighlight
          field="contestant_already_registered"
          className="mb-6 rounded-lg border border-slate-200 bg-white p-5"
          clearWhen={Boolean(alreadyRegistered)}
        >
          <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Conference registration status
          </h3>
          <p className="mb-4 text-xs leading-relaxed text-slate-500">
            Contestants from organizations already registered — or registering
            separately — as an Attendee or Vendor qualify for the reduced
            ticket price. ORWA staff verify this against conference
            registrations.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(
              [
                {
                  value: "Yes" as const,
                  title: "Already registered",
                  detail:
                    "My organization is registered (or registering separately) as an Attendee or Vendor",
                  price: addOnPrice,
                },
                {
                  value: "No" as const,
                  title: "Contestant only",
                  detail:
                    "My organization is not otherwise registered for this conference",
                  price: standalonePrice,
                },
              ]
            ).map((option) => {
              const selected = alreadyRegistered === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => handleTierChange(option.value)}
                  className={`flex cursor-pointer flex-col rounded-lg border-2 px-4 py-3 text-left transition ${
                    selected
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <span
                    className={`text-sm font-bold ${
                      selected ? "text-blue-700" : "text-slate-800"
                    }`}
                  >
                    {option.title}
                    {option.price != null && (
                      <span className="ml-2 tabular-nums">
                        {currencyFormatter.format(option.price)} per contestant
                      </span>
                    )}
                  </span>
                  <span
                    className={`mt-1 text-xs leading-snug ${
                      selected ? "text-blue-700/80" : "text-slate-500"
                    }`}
                  >
                    {option.detail}
                  </span>
                </button>
              );
            })}
          </div>
        </ValidationHighlight>
      )}

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
                {hasGolf && hasFishing
                  ? "Choose Golfer or Fisher when you add each person."
                  : "Enter each contestant's contact details."}
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
          {/* registrationExtrasIds is the field checkout + webhook bill from. */}
          <AddExtras field="registrationExtrasIds" context="Contestant" />
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
