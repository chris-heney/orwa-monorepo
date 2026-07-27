import React, { useEffect, useMemo, useState } from "react";
import {
  TextInput,
  MaskedPhoneInput,
  EmailInput,
  useNotify,
} from "mj-react-form-builder";
import { FormControlLabel, RadioGroup, Radio } from "@mui/material";
import CustomSecondaryHeader from "./CustomSecondaryHeader";
import currencyFormatter, { formatCurrency } from "../../helpers/currencyFormat";
import { useFormContext, useFieldArray } from "react-hook-form";
import {
  useConferenceId,
  useRegistrationOptions,
  useRegistrationSource,
  useTicketIndex,
} from "../../AppContextProvider";
import { ITicketPayload } from "../../types/types";
import AddExtras from "../AddExtras";
import { getExtraData } from "../../helpers/getExtraData";
import {
  availableContestantSports,
  ContestantSport,
} from "../../helpers/contestantSport";
import {
  FisherTier,
  resolveContestantTicket,
} from "../../helpers/resolveContestantTicket";
import {
  contactFieldsFromPerson,
  emailAutoSelect,
} from "../../helpers/copyContestantPerson";
import { useGetRegistrations } from "../../data/API";
import { isStandaloneContestantTicket } from "../../helpers/contestantTicketTiers";

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
  const { control, watch, setValue, trigger } = useFormContext();
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
  const [fisherTier, setFisherTier] = useState<FisherTier | null>(null);
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

  const cartPeople = (tickets as ITicketPayload[]).filter(
    (row) => row.type === "Attendee" || row.type === "Vendor"
  );

  const needsFisherTier = sport === "fish" && isContestantOnly;
  const isFishAddon =
    sport === "fish" &&
    (isAttendeeVendorCheckout || fisherTier === "addon");
  const showOrgPersonPicker = isContestantOnly && isFishAddon;
  const showCartPersonPicker = isAttendeeVendorCheckout && sport != null;
  const showContactFields =
    sport != null &&
    !showOrgPersonPicker &&
    !showCartPersonPicker &&
    (!needsFisherTier || fisherTier != null);

  const priceOf = (ticketOption: { price_online?: number; price_event?: number } | null) =>
    registrationSource === "kiosk"
      ? ticketOption?.price_event
      : ticketOption?.price_online;

  const resolvedTicket = useMemo(() => {
    if (!sport) return null;
    if (needsFisherTier && !fisherTier) return null;
    return resolveContestantTicket({
      ticketOptions: TicketOptions,
      sport,
      fisherTier: fisherTier ?? undefined,
      registrationType,
    });
  }, [sport, fisherTier, needsFisherTier, TicketOptions, registrationType]);

  const fishAddonTicket = resolveContestantTicket({
    ticketOptions: TicketOptions,
    sport: "fish",
    fisherTier: "addon",
    registrationType: "Contestant",
  });
  const fishStandaloneTicket = resolveContestantTicket({
    ticketOptions: TicketOptions,
    sport: "fish",
    fisherTier: "standalone",
    registrationType: "Contestant",
  });

  const applyResolvedTicket = (nextSport: ContestantSport, tier?: FisherTier) => {
    const option = resolveContestantTicket({
      ticketOptions: TicketOptions,
      sport: nextSport,
      fisherTier: tier,
      registrationType,
    });
    if (!option) return;
    const base =
      registrationSource === "kiosk"
        ? Number(option.price_event) || 0
        : Number(option.price_online) || 0;
    const extrasPrice = (ticket.extras || [])
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
    update(ticketIndex, {
      ...ticket,
      ticket_type: option,
      type: "Contestant",
      price: base + extrasPrice,
      ...(nextSport === "golf" || tier === "standalone"
        ? {
            previous_registration_id: undefined,
            source_ticket_id: undefined,
          }
        : {}),
    });
  };

  useEffect(() => {
    if (!resolvedTicket) return;
    if (String(ticket.ticket_type?.id) === String(resolvedTicket.id)) return;
    applyResolvedTicket(sport!, fisherTier ?? undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedTicket?.id]);

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
    if (showOrgPersonPicker) {
      if (!ticket.previous_registration_id) {
        notify("Select an existing conference registration", "error");
        return;
      }
      if (!ticket.source_ticket_id) {
        notify("Select a person from that registration", "error");
        return;
      }
    }
    if (showCartPersonPicker && !ticket.source_ticket_id) {
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
    if (ticket.promotional_emails === undefined) {
      notify("Please make a selection for Promotional Emails Consent", "error");
      return;
    }
    if (!ticket.ticket_type) {
      notify("Could not resolve contestant ticket type", "error");
      return;
    }
    applyResolvedTicket(sport, fisherTier ?? undefined);
    setIsOpen({ open: false, context: "create" });
  };

  const selectCardClass = (selected: boolean) =>
    `flex cursor-pointer flex-col rounded-lg border-2 px-4 py-3 text-left transition ${
      selected
        ? "border-blue-600 bg-blue-50"
        : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
    }`;

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
                      if (option === "golf") {
                        applyResolvedTicket("golf");
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
                        "My organization is registered (or registering separately) as an Attendee or Vendor",
                      price: priceOf(fishAddonTicket),
                    },
                    {
                      value: "standalone" as const,
                      title: "Contestant only",
                      detail:
                        "My organization is not otherwise registered for this conference",
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
                    ticket.source_ticket_id != null
                      ? String(ticket.source_ticket_id)
                      : ""
                  }
                  onChange={(event) => {
                    const index = Number(event.target.value);
                    const selected = cartPeople[index];
                    if (!selected) return;
                    update(ticketIndex, {
                      ...ticket,
                      ...contactFieldsFromPerson({
                        id: index,
                        first: selected.first,
                        last: selected.last,
                        email: selected.email,
                        phone: selected.phone,
                        license: selected.license,
                      }),
                      previous_registration_id: undefined,
                      promotional_emails: ticket.promotional_emails,
                      ticket_type: ticket.ticket_type,
                      type: "Contestant",
                      extras: ticket.extras ?? [],
                    });
                  }}
                >
                  <option value="">Select a person…</option>
                  {cartPeople.map((person, index) => (
                    <option key={`cart-person-${index}`} value={index}>
                      {[person.first, person.last].filter(Boolean).join(" ") ||
                        `Person ${index + 1}`}{" "}
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

          <section className="mt-6 rounded-lg border border-slate-200 bg-slate-50/80 p-4">
            <p className="mb-2 text-sm font-medium text-slate-800">
              Promotional Emails Consent <span className="text-red-500">*</span>
            </p>
            <RadioGroup
              name={`tickets[${ticketIndex}].promotional_emails`}
              value={watch(`tickets[${ticketIndex}].promotional_emails`)}
              onChange={(e) =>
                setValue(
                  `tickets[${ticketIndex}].promotional_emails`,
                  e.target.value === "true" ? true : false
                )
              }
            >
              <FormControlLabel
                value={true}
                control={<Radio />}
                label="I consent to receive informational and promotional emails from select conference vendors."
                className="items-start text-sm"
              />
              <FormControlLabel
                value={false}
                control={<Radio />}
                label="I DO NOT consent to receive informational and promotional emails from select conference vendors."
                className="items-start text-sm"
              />
            </RadioGroup>
          </section>

          {resolvedTicket && (
            <p className="mt-4 text-right text-sm text-slate-600">
              Ticket:{" "}
              <span className="font-semibold text-slate-900">
                {resolvedTicket.name}{" "}
                {formatCurrency(Number(priceOf(resolvedTicket) || 0))}
              </span>
              {isStandaloneContestantTicket(resolvedTicket) ? "" : ""}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4 sm:px-6">
          <button
            type="button"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            onClick={handleSave}
          >
            Save Contestant
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContestantModal;
