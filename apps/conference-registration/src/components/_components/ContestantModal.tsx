import React, { useEffect, useMemo, useState } from "react";
import {
  TextInput,
  MaskedPhoneInput,
  EmailInput,
  useNotify,
} from "mj-react-form-builder";
import CustomSecondaryHeader from "./CustomSecondaryHeader";
import currencyFormatter, { formatCurrency } from "../../helpers/currencyFormat";
import { useFormContext, useFieldArray } from "react-hook-form";
import {
  useConferenceId,
  useRegistrationOptions,
  useRegistrationSource,
  useTicketIndex,
} from "../../AppContextProvider";
import { IExtraOption, ITicketPayload } from "../../types/types";
import AddExtras from "../AddExtras";
import { getExtraData } from "../../helpers/getExtraData";
import {
  availableContestantSports,
  ContestantSport,
  contestantSportOf,
} from "../../helpers/contestantSport";
import {
  ContestantTier,
  resolveContestantTicket,
} from "../../helpers/resolveContestantTicket";
import { isStandaloneContestantTicket } from "../../helpers/contestantTicketTiers";
import {
  contactFieldsFromPerson,
  emailAutoSelect,
} from "../../helpers/copyContestantPerson";
import { useGetRegistrations } from "../../data/API";
import { hasSelectedId } from "../../helpers/hasSelectedId";
import { availableCartParticipants } from "../../helpers/availableCartParticipants";
import { resolveCartAttachIndex } from "../../helpers/isContestantLinkedToCart";

interface ContestantModalProps {
  setIsOpen: React.Dispatch<
    React.SetStateAction<{ open: boolean; context: string }>
  >;
  isOpen: { open: boolean; context: string };
}

const ContestantModal: React.FC<ContestantModalProps> = ({
  setIsOpen,
  isOpen,
}) => {
  const { ticketIndex } = useTicketIndex();
  const conferenceId = useConferenceId();
  const { TicketOptions, ExtraOptions } = useRegistrationOptions();
  const registrationSource = useRegistrationSource();
  const { control, watch, setValue, trigger, getValues } = useFormContext();
  const { update, remove } = useFieldArray({ control, name: "tickets" });
  const { notify } = useNotify();

  const tickets = watch("tickets") || [];
  const ticket: ITicketPayload = tickets[ticketIndex] || ({} as ITicketPayload);
  const registrationType = watch("registration_type");
  const registrantEmail = watch("registrant.email");
  const isContestantOnly = registrationType === "Contestant";
  const isAttendeeVendorCheckout =
    registrationType === "Attendee" || registrationType === "Vendor";

  const sports = availableContestantSports(TicketOptions);
  const [sport, setSport] = useState<ContestantSport | null>(null);
  const [fisherTier, setFisherTier] = useState<ContestantTier | null>(null);
  // Attendee/Vendor checkout: is this participant on the cart, or an
  // "Add Unregistered Contestant" entry priced at the standalone tier?
  const [participantTier, setParticipantTier] =
    useState<ContestantTier | null>(null);
  const [autoSelectDone, setAutoSelectDone] = useState(false);

  const { data: registrations, isLoading: registrationsLoading } =
    useGetRegistrations(String(conferenceId), new Date().getFullYear());
  const eligibleRegistrations = (registrations ?? []).filter(
    (registration) =>
      registration.type === "Attendee" || registration.type === "Vendor"
  );

  const selectedRegistration = eligibleRegistrations.find(
    (registration) =>
      String(registration.id) === String(ticket.previous_registration_id)
  );

  // Same person may golf AND fish — only same-sport attaches are excluded.
  const cartPeople = availableCartParticipants({
    tickets: tickets as ITicketPayload[],
    currentContestantIndex: ticketIndex,
    currentSourceTicketId: ticket.source_ticket_id,
    sport,
  });

  const needsFisherTier = sport === "fish" && isContestantOnly;
  const isFishAddon =
    sport === "fish" &&
    (isAttendeeVendorCheckout || fisherTier === "addon");
  const showOrgPersonPicker = isContestantOnly && isFishAddon;

  const resolveTierTicket = (
    targetSport: ContestantSport,
    tier: ContestantTier
  ) =>
    resolveContestantTicket({
      ticketOptions: TicketOptions,
      sport: targetSport,
      tier,
    });

  // Attendee/Vendor carts may add a participant who isn't on this
  // registration ("Add Unregistered Contestant") at the standalone/
  // contestant-only price — offered for both Golfer and Fisher, but only
  // when the conference actually defines a distinct ticket for that tier.
  const sportHasUnregisteredOption = (targetSport: ContestantSport): boolean => {
    const standaloneTicket = resolveTierTicket(targetSport, "standalone");
    return !!standaloneTicket && isStandaloneContestantTicket(standaloneTicket);
  };

  const needsParticipantTier =
    isAttendeeVendorCheckout &&
    sport != null &&
    sportHasUnregisteredOption(sport);

  const showCartPersonPicker =
    isAttendeeVendorCheckout &&
    sport != null &&
    (!needsParticipantTier || participantTier === "addon");

  const showContactFields =
    sport != null &&
    !showOrgPersonPicker &&
    !showCartPersonPicker &&
    (!needsFisherTier || fisherTier != null) &&
    (!needsParticipantTier || participantTier != null);

  const priceOf = (ticketOption: { price_online?: number; price_event?: number } | null) =>
    registrationSource === "kiosk"
      ? ticketOption?.price_event
      : ticketOption?.price_online;

  const effectiveTier: ContestantTier | undefined = needsFisherTier
    ? (fisherTier ?? undefined)
    : needsParticipantTier
      ? (participantTier ?? undefined)
      : undefined;

  const resolvedTicket = useMemo(() => {
    if (!sport) return null;
    if (needsFisherTier && !fisherTier) return null;
    if (needsParticipantTier && !participantTier) return null;
    return resolveContestantTicket({
      ticketOptions: TicketOptions,
      sport,
      tier: effectiveTier,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sport,
    fisherTier,
    participantTier,
    needsFisherTier,
    needsParticipantTier,
    TicketOptions,
  ]);

  const fishAddonTicket = resolveTierTicket("fish", "addon");
  const fishStandaloneTicket = resolveTierTicket("fish", "standalone");

  const applyResolvedTicket = (
    nextSport: ContestantSport,
    tier?: ContestantTier
  ) => {
    const option = resolveContestantTicket({
      ticketOptions: TicketOptions,
      sport: nextSport,
      tier,
    });
    if (!option) return;
    // Always read fresh row — stale `ticket` from render can drop attach fields.
    const fresh =
      (getValues(`tickets.${ticketIndex}`) as ITicketPayload | undefined) ||
      ticket;
    const allTickets = (getValues("tickets") as ITicketPayload[]) || [];
    const preservedAttach = resolveCartAttachIndex(fresh, allTickets);
    const base =
      registrationSource === "kiosk"
        ? Number(option.price_event) || 0
        : Number(option.price_online) || 0;
    const extrasPrice = (fresh.extras || [])
      .map((extraId) => getExtraData(ExtraOptions, extraId))
      .filter(Boolean)
      .reduce((sum, extra) => {
        const included = extra?.included;
        if (
          Array.isArray(included) &&
          included.some((t) => String(t.id) === String(option.id))
        ) {
          return sum;
        }
        return (
          sum +
          (registrationSource === "online"
            ? Number(extra?.price_online) || 0
            : Number(extra?.price_event) || 0)
        );
      }, 0);

    // Standalone/contestant-only tickets never attach to a cart or another
    // registration. Contestant-only-checkout golf never attaches either
    // (it has no cart of its own).
    const clearOrgAttach =
      tier === "standalone" ||
      (!isAttendeeVendorCheckout && nextSport === "golf");

    update(ticketIndex, {
      ...fresh,
      ticket_type: option,
      type: "Contestant",
      price: base + extrasPrice,
      // Attendee/Vendor carts must keep (or repair) source_ticket_id unless
      // this is an unregistered ("standalone") participant.
      ...(clearOrgAttach
        ? {
            previous_registration_id: undefined,
            source_ticket_id: undefined,
          }
        : isAttendeeVendorCheckout && preservedAttach != null
          ? { source_ticket_id: preservedAttach }
          : {}),
    });
  };

  // Hydrate Golfer/Fisher (and tier) when opening edit, reset on create.
  useEffect(() => {
    if (!isOpen.open) return;
    if (isOpen.context === "edit") {
      const fromTicket = contestantSportOf(ticket.ticket_type);
      setSport(fromTicket);
      if (fromTicket === "fish" && isContestantOnly) {
        setFisherTier(
          isStandaloneContestantTicket(ticket.ticket_type)
            ? "standalone"
            : "addon"
        );
      } else {
        setFisherTier(null);
      }
      if (isAttendeeVendorCheckout) {
        setParticipantTier(
          isStandaloneContestantTicket(ticket.ticket_type)
            ? "standalone"
            : "addon"
        );
      } else {
        setParticipantTier(null);
      }
      setAutoSelectDone(true);
      return;
    }
    // create
    setSport(null);
    setFisherTier(null);
    setParticipantTier(null);
    setAutoSelectDone(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen.open, isOpen.context, ticketIndex]);

  useEffect(() => {
    if (!resolvedTicket) return;
    if (String(ticket.ticket_type?.id) === String(resolvedTicket.id)) return;
    applyResolvedTicket(sport!, effectiveTier);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedTicket?.id]);

  // Repair attach ids wiped by older Golfer-save bug (names kept, source cleared).
  useEffect(() => {
    if (!isOpen.open || !isAttendeeVendorCheckout) return;
    const fresh =
      (getValues(`tickets.${ticketIndex}`) as ITicketPayload | undefined) ||
      ticket;
    if (hasSelectedId(fresh.source_ticket_id)) return;
    const repaired = resolveCartAttachIndex(
      fresh,
      (getValues("tickets") as ITicketPayload[]) || []
    );
    if (repaired != null) {
      setValue(`tickets.${ticketIndex}.source_ticket_id`, repaired, {
        shouldDirty: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen.open, ticketIndex, isAttendeeVendorCheckout]);

  useEffect(() => {
    if (autoSelectDone || isOpen.context !== "create" || !showOrgPersonPicker) {
      return;
    }
    const hint = emailAutoSelect({
      email: registrantEmail,
      registrations: eligibleRegistrations.map((registration) => ({
        id: registration.id,
        organization: registration.organization,
        attendees: (registration as { attendees?: Array<{ id: number; first?: string; last?: string; email?: string; phone?: string }> }).attendees,
      })),
    });
    setAutoSelectDone(true);
    if (hint.registrationId != null) {
      setValue(`tickets[${ticketIndex}].previous_registration_id`, hint.registrationId);
      const reg = eligibleRegistrations.find(
        (r) => String(r.id) === String(hint.registrationId)
      );
      if (reg) {
        setValue("organization", reg.organization, { shouldDirty: true });
      }
    }
    if (hint.personId != null) {
      const people =
        (
          eligibleRegistrations.find(
            (r) => String(r.id) === String(hint.registrationId)
          ) as { attendees?: Array<{ id: number; first?: string; last?: string; email?: string; phone?: string; license?: string }> } | undefined
        )?.attendees ?? [];
      const person = people.find((p) => String(p.id) === String(hint.personId));
      if (person) {
        update(ticketIndex, {
          ...ticket,
          ...contactFieldsFromPerson(person),
          previous_registration_id: hint.registrationId,
          promotional_emails: ticket.promotional_emails,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOrgPersonPicker, eligibleRegistrations, registrantEmail]);

  const closeModal = () => {
    if (isOpen.context === "create") {
      remove(ticketIndex);
    }
    setIsOpen({ open: false, context: "create" });
  };

  const handleSave = async () => {
    if (!sport) {
      notify("Select Golfer or Fisher", "error");
      return;
    }
    if (needsFisherTier && !fisherTier) {
      notify("Select Already registered or Contestant only", "error");
      return;
    }
    if (needsParticipantTier && !participantTier) {
      notify(
        "Select from this registration, or Add Unregistered Contestant",
        "error"
      );
      return;
    }
    if (showOrgPersonPicker) {
      if (!hasSelectedId(ticket.previous_registration_id)) {
        notify("Select an existing conference registration", "error");
        return;
      }
      if (!hasSelectedId(ticket.source_ticket_id)) {
        notify("Select a person from that registration", "error");
        return;
      }
    }
    // Cart person index can be 0 — must not use truthiness.
    if (showCartPersonPicker && !hasSelectedId(ticket.source_ticket_id)) {
      notify("Select an attendee or vendor from this registration", "error");
      return;
    }
    if (showContactFields) {
      const ok = await trigger([
        `tickets[${ticketIndex}].first`,
        `tickets[${ticketIndex}].last`,
        `tickets[${ticketIndex}].email`,
        `tickets[${ticketIndex}].phone`,
      ] as never);
      if (!ok) {
        notify("Please fix the contact fields before saving.", "error");
        return;
      }
    }
    // Promotional Emails Consent is only collected on Attendee tickets —
    // Contestants never need it, so no consent check happens here.
    if (!ticket.ticket_type) {
      notify("Could not resolve contestant ticket type", "error");
      return;
    }
    applyResolvedTicket(sport, effectiveTier);
    setIsOpen({ open: false, context: "create" });
  };

  const selectCardClass = (selected: boolean) =>
    `flex cursor-pointer flex-col rounded-lg border-2 px-4 py-3 text-left transition ${
      selected
        ? "border-blue-600 bg-blue-50"
        : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
    }`;

  const extrasSubtotal = (ticket.extras || [])
    .map((extraId: string | number) => getExtraData(ExtraOptions, extraId))
    .filter((extra: IExtraOption | undefined): extra is IExtraOption => !!extra)
    .reduce(
      (sum: number, extra: IExtraOption) =>
        sum + Number(priceOf(extra) || 0),
      0
    );
  const lineSubtotal =
    Number(priceOf(resolvedTicket) || 0) + extrasSubtotal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/50 p-4 sm:p-8">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contestant-modal-title"
        className="flex max-h-[min(90vh,920px)] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        <CustomSecondaryHeader
          title={`${isOpen.context === "edit" ? "Edit" : "Add"} Contestant`}
          setIsOpen={closeModal as React.Dispatch<React.SetStateAction<boolean>>}
        />

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <section className="space-y-3">
            <h3
              id="contestant-modal-title"
              className="text-sm font-semibold uppercase tracking-wide text-slate-500"
            >
              Tournament
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {sports.map((option) => {
                const selected = sport === option;
                const label = option === "golf" ? "Golfer" : "Fisher";
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={selected}
                    className={selectCardClass(selected)}
                    onClick={() => {
                      setSport(option);
                      setFisherTier(null);
                      setParticipantTier(null);
                      const willAskFisherTier =
                        option === "fish" && isContestantOnly;
                      const willAskParticipantTier =
                        isAttendeeVendorCheckout &&
                        sportHasUnregisteredOption(option);
                      if (!willAskFisherTier && !willAskParticipantTier) {
                        applyResolvedTicket(option);
                      }
                    }}
                  >
                    <span
                      className={`text-sm font-bold ${
                        selected ? "text-blue-700" : "text-slate-800"
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {needsFisherTier && (
            <section className="mt-6 space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Registration status
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(
                  [
                    {
                      value: "addon" as const,
                      title: "Already registered",
                      detail:
                        "I have already registered for the conference as an Attendee or Vendor.",
                      price: priceOf(fishAddonTicket),
                    },
                    {
                      value: "standalone" as const,
                      title: "Contestant only",
                      detail:
                        "I have not registered for the conference as an Attendee or Vendor.",
                      price: priceOf(fishStandaloneTicket),
                    },
                  ] as const
                ).map((option) => {
                  const selected = fisherTier === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={selected}
                      className={selectCardClass(selected)}
                      onClick={() => {
                        setFisherTier(option.value);
                        applyResolvedTicket("fish", option.value);
                      }}
                    >
                      <span
                        className={`text-sm font-bold ${
                          selected ? "text-blue-700" : "text-slate-800"
                        }`}
                      >
                        {option.title}
                        {option.price != null && (
                          <span className="ml-2 tabular-nums">
                            {currencyFormatter.format(Number(option.price))}
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
            </section>
          )}

          {needsParticipantTier && sport != null && (
            <section className="mt-6 space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Participant type
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(
                  [
                    {
                      value: "addon" as const,
                      title: "Select from this registration",
                      detail:
                        "Choose an Attendee or Vendor already added to this registration.",
                      price: priceOf(resolveTierTicket(sport, "addon")),
                    },
                    {
                      value: "standalone" as const,
                      title: "Add Unregistered Contestant",
                      detail:
                        "Register a participant who isn't otherwise attending this conference.",
                      price: priceOf(resolveTierTicket(sport, "standalone")),
                    },
                  ] as const
                ).map((option) => {
                  const selected = participantTier === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={selected}
                      className={selectCardClass(selected)}
                      onClick={() => {
                        setParticipantTier(option.value);
                        applyResolvedTicket(sport, option.value);
                      }}
                    >
                      <span
                        className={`text-sm font-bold ${
                          selected ? "text-blue-700" : "text-slate-800"
                        }`}
                      >
                        {option.title}
                        {option.price != null && (
                          <span className="ml-2 tabular-nums">
                            {currencyFormatter.format(Number(option.price))}
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
            </section>
          )}

          {showOrgPersonPicker && (
            <section className="mt-6 space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Existing registration
              </h3>
              <label className="block text-sm font-medium text-slate-800">
                Organization registration
                <select
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  value={ticket.previous_registration_id ?? ""}
                  disabled={registrationsLoading}
                  onChange={(event) => {
                    const value = event.target.value;
                    const selected = eligibleRegistrations.find(
                      (registration) => String(registration.id) === value
                    );
                    update(ticketIndex, {
                      ...ticket,
                      previous_registration_id: value
                        ? Number(value)
                        : undefined,
                      source_ticket_id: undefined,
                      first: "",
                      last: "",
                      email: "",
                      phone: "",
                    });
                    if (selected) {
                      setValue("organization", selected.organization, {
                        shouldDirty: true,
                      });
                    }
                  }}
                >
                  <option value="">
                    {registrationsLoading
                      ? "Loading registrations…"
                      : "Select an organization…"}
                  </option>
                  {eligibleRegistrations.map((registration) => (
                    <option
                      key={String(registration.id)}
                      value={registration.id}
                    >
                      {registration.organization} — {registration.type}
                    </option>
                  ))}
                </select>
              </label>
              {ticket.previous_registration_id != null && (
                <label className="block text-sm font-medium text-slate-800">
                  Person on that registration
                  <select
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                    value={ticket.source_ticket_id ?? ""}
                    onChange={(event) => {
                      const people =
                        (
                          selectedRegistration as
                            | {
                                attendees?: Array<{
                                  id: number;
                                  first?: string;
                                  last?: string;
                                  email?: string;
                                  phone?: string;
                                  license?: string;
                                }>;
                              }
                            | undefined
                        )?.attendees ?? [];
                      const person = people.find(
                        (row) => String(row.id) === event.target.value
                      );
                      if (!person) return;
                      update(ticketIndex, {
                        ...ticket,
                        ...contactFieldsFromPerson(person),
                        previous_registration_id: ticket.previous_registration_id,
                        promotional_emails: ticket.promotional_emails,
                        ticket_type: ticket.ticket_type,
                        type: "Contestant",
                        extras: ticket.extras ?? [],
                      });
                    }}
                  >
                    <option value="">Select a person…</option>
                    {(
                      (
                        selectedRegistration as
                          | {
                              attendees?: Array<{
                                id: number;
                                first?: string;
                                last?: string;
                              }>;
                            }
                          | undefined
                      )?.attendees ?? []
                    ).map((person) => (
                      <option key={String(person.id)} value={person.id}>
                        {[person.first, person.last].filter(Boolean).join(" ") ||
                          `Person #${person.id}`}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </section>
          )}

          {showCartPersonPicker && (
            <section className="mt-6 space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Participant
              </h3>
              <label className="block text-sm font-medium text-slate-800">
                Attendee or Vendor on this registration
                <select
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  value={
                    hasSelectedId(ticket.source_ticket_id)
                      ? String(ticket.source_ticket_id)
                      : ""
                  }
                  onChange={(event) => {
                    const absoluteIndex = Number(event.target.value);
                    if (!Number.isFinite(absoluteIndex)) return;
                    const selected = cartPeople.find(
                      (row) => row.absoluteIndex === absoluteIndex
                    )?.person;
                    if (!selected) return;
                    const fresh =
                      (getValues(`tickets.${ticketIndex}`) as
                        | ITicketPayload
                        | undefined) || ticket;
                    update(ticketIndex, {
                      ...fresh,
                      ...contactFieldsFromPerson({
                        id: absoluteIndex,
                        first: selected.first,
                        last: selected.last,
                        email: selected.email,
                        phone: selected.phone,
                        license: selected.license,
                      }),
                      // Absolute tickets[] index — never a filtered dropdown index.
                      source_ticket_id: absoluteIndex,
                      previous_registration_id: undefined,
                      // Inherit consent from the Attendee/Vendor ticket already chosen.
                      promotional_emails: selected.promotional_emails,
                      ticket_type: fresh.ticket_type,
                      type: "Contestant",
                      extras: fresh.extras ?? [],
                    });
                  }}
                >
                  <option value="">Select a person…</option>
                  {cartPeople.map(({ person, absoluteIndex }) => (
                    <option
                      key={`cart-person-${absoluteIndex}`}
                      value={absoluteIndex}
                    >
                      {[person.first, person.last].filter(Boolean).join(" ") ||
                        `Person ${absoluteIndex + 1}`}{" "}
                      ({person.type})
                    </option>
                  ))}
                </select>
              </label>
            </section>
          )}

          {showContactFields && (
            <section className="mt-6 space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Contact details
              </h3>
              <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                {isContestantOnly && (
                  <div className="sm:col-span-2">
                    <TextInput source="organization" label="Organization" required />
                  </div>
                )}
                <TextInput
                  source={`tickets[${ticketIndex}].first`}
                  label="First Name"
                  required
                />
                <TextInput
                  source={`tickets[${ticketIndex}].last`}
                  label="Last Name"
                  required
                />
                <EmailInput
                  source={`tickets[${ticketIndex}].email`}
                  label="Email"
                  required
                />
                <MaskedPhoneInput
                  source={`tickets[${ticketIndex}].phone`}
                  label="Phone"
                  required
                />
              </div>
            </section>
          )}

          {/* Hidden contact fields when person was copied */}
          {(showOrgPersonPicker || showCartPersonPicker) && (
            <div className="hidden" aria-hidden>
              <TextInput source={`tickets[${ticketIndex}].first`} label="First" />
              <TextInput source={`tickets[${ticketIndex}].last`} label="Last" />
              <EmailInput source={`tickets[${ticketIndex}].email`} label="Email" />
              <MaskedPhoneInput
                source={`tickets[${ticketIndex}].phone`}
                label="Phone"
              />
            </div>
          )}

          {resolvedTicket && (
            <section className="mt-6 space-y-3 border-t border-slate-200 pt-6">
              <AddExtras
                field="tickets"
                context="Contestant"
                fieldIndex={ticketIndex}
              />
            </section>
          )}

        </div>

        <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-center text-base font-semibold text-slate-900 sm:text-left">
            {resolvedTicket ? (
              <>
                Subtotal:{" "}
                <span className="tabular-nums">
                  {formatCurrency(lineSubtotal)}
                </span>
                {extrasSubtotal > 0 && (
                  <span className="mt-0.5 block text-xs font-normal text-slate-500 sm:mt-0 sm:ml-2 sm:inline">
                    ({resolvedTicket.name}{" "}
                    {formatCurrency(Number(priceOf(resolvedTicket) || 0))}
                    {" + extras "}
                    {formatCurrency(extrasSubtotal)})
                  </span>
                )}
              </>
            ) : (
              <span className="font-normal text-slate-500">
                {sport != null ? "Select a participant type" : "Select a tournament"}
              </span>
            )}
          </p>
          <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row sm:items-center">
            <button
              type="button"
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              onClick={handleSave}
            >
              Save Contestant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestantModal;
