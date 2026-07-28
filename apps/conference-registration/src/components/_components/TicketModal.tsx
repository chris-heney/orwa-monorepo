import React, { useEffect, useRef, useState } from "react";
import {
  TextInput,
  MaskedPhoneInput,
  SelectInput,
  useNotify,
  EmailInput,
} from "mj-react-form-builder";
import { Checkbox } from "@mui/material";
import CustomSecondaryHeader from "./CustomSecondaryHeader";
import { formatCurrency } from "../../helpers/currencyFormat";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import {
  useRegistrationOptions,
  useRegistrationSource,
  useTicketIndex,
  useUserContext,
} from "../../AppContextProvider";
import { IExtraOption, ITicketOption, ITicketPayload } from "../../types/types";
import AddExtras from "../AddExtras";
import { getExtraData } from "../../helpers/getExtraData";
import {
  formatExtrasConfirmList,
  getUncheckedOptionalExtras,
} from "../../helpers/getUncheckedOptionalExtras";

interface ITicketModalProps {
  setIsOpen: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      context: string;
    }>
  >;
  isOpen: {
    open: boolean;
    context: string;
  };
  type: "Attendee" | "Vendor" | "Contestant";
}

export const VotingStatusOptions = [
  { value: "Non Voting", label: "Non Voting" },
  { value: "Voting Delegate", label: "Voting Delegate" },
  { value: "Voting Alternate", label: "Voting Alternate" },
];

const TicketModal: React.FC<ITicketModalProps> = ({
  setIsOpen,
  type,
  isOpen,
}) => {
  const { ticketIndex } = useTicketIndex();
  const { isAdminView } = useUserContext();
  const { TicketOptions, ExtraOptions } = useRegistrationOptions();
  const registrationSource = useRegistrationSource();

  const { control, watch, setValue, trigger } = useFormContext();

  const boothCount = watch("booths")?.length || 0;

  const freeVendors = () => {
    return boothCount === 1 ? 2 : boothCount >= 2 ? 3 : 0;
  };

  const { append, update, remove } = useFieldArray({
    control,
    name: "tickets",
  });

  const trainingType = useWatch({
    control,
    name: `tickets[${ticketIndex}].training_type`,
    defaultValue: "None",
  });

  // Any training credit selection requires a real email (not "I do not have an email").
  const requiresEmailForTraining =
    typeof trainingType === "string" &&
    trainingType.trim() !== "" &&
    trainingType !== "None";

  const { notify } = useNotify();
  const tickets = watch("tickets") || [];
  const ticket = tickets[ticketIndex] || {};
  const [noEmail, setNoEmail] = useState(false);
  const [extrasConfirmOpen, setExtrasConfirmOpen] = useState(false);
  const [highlightExtras, setHighlightExtras] = useState(false);
  const [pendingUncheckedExtras, setPendingUncheckedExtras] = useState<
    IExtraOption[]
  >([]);
  const extrasConfirmOpenRef = useRef(extrasConfirmOpen);
  const goBackButtonRef = useRef<HTMLButtonElement>(null);
  const saveButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    extrasConfirmOpenRef.current = extrasConfirmOpen;
  }, [extrasConfirmOpen]);

  // Focus the safer action ("Go back and choose") when the nested confirm opens.
  useEffect(() => {
    if (extrasConfirmOpen) {
      goBackButtonRef.current?.focus();
    }
  }, [extrasConfirmOpen]);

  // If Training Type leaves None, force a real email: clear no-email / anonymous state.
  useEffect(() => {
    if (!requiresEmailForTraining) return;
    if (noEmail) {
      setNoEmail(false);
    }
    const currentEmail = watch(`tickets[${ticketIndex}].email`);
    if (
      typeof currentEmail === "string" &&
      currentEmail.startsWith("anonymous+")
    ) {
      setValue(`tickets[${ticketIndex}].email`, "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requiresEmailForTraining, trainingType]);

  // Prefill Company/Organization from the parent registration form on create only.
  // Skip edit (keep ticket org) and skip if the ticket field already has a value.
  useEffect(() => {
    if (isOpen.context !== "create") return;
    const parentOrg = watch("organization");
    const ticketOrg = watch(`tickets[${ticketIndex}].organization`);
    if (
      typeof parentOrg === "string" &&
      parentOrg.trim() &&
      (!ticketOrg || (typeof ticketOrg === "string" && !ticketOrg.trim()))
    ) {
      setValue(`tickets[${ticketIndex}].organization`, parentOrg);
    }
    // Intentionally once on mount for this modal open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clear the "choose extras" highlight once the user selects an optional extra.
  useEffect(() => {
    if (!highlightExtras) return;
    if (type !== "Attendee" && type !== "Vendor") return;
    const unchecked = getUncheckedOptionalExtras({
      ticket,
      extras: ExtraOptions,
      context: type,
    });
    if (unchecked.length === 0) {
      setHighlightExtras(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightExtras, ticket?.extras, ticket?.ticket_type?.id, type, ExtraOptions]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      // While the nested "skip extras" confirm is open, Escape means
      // "go back and choose" — never close/destroy the ticket underneath it.
      if (extrasConfirmOpenRef.current) {
        goBackToExtras();
        return;
      }

      if (isOpen.context === "create") {
        remove(ticketIndex);
      }
      setIsOpen({
        open: false,
        context: "create",
      });
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate ticket subtotal
  const calculateSubtotal = () => {
    const ticketType = TicketOptions.find(
      (t) => t.name === ticket?.ticket_type?.name
    );
    let ticketPrice = 0;

    if (type === "Vendor" && freeVendors() > 0 && ticketIndex < freeVendors()) {
      ticketPrice = 0; // Free ticket
    } else {
      ticketPrice =
        registrationSource === "online"
          ? ticketType?.price_online || 0
          : ticketType?.price_event || 0;
    }

    const extrasPrice = (ticket.extras || [])
      .map((extraId: string | number) => getExtraData(ExtraOptions, extraId))
      .filter((extra: IExtraOption | undefined): extra is IExtraOption => !!extra)
      .filter((extra: IExtraOption) => {
        // Check if the extra is included
        const included = extra.included;
        if (!Array.isArray(included)) return true;
        return !included.some(
          (includedTicket: ITicketOption) =>
            String(includedTicket.id) === String(ticket.ticket_type?.id)
        );
      })
      .reduce(
        (sum: number, extra: IExtraOption) =>
          sum +
          (registrationSource === "online"
            ? extra?.price_online || 0
            : extra?.price_event || 0),
        0
      );

    return ticketPrice + extrasPrice;
  };

  const handleTicketTypeChange = (value: string) => {
    const ticketType = TicketOptions.find((t) => t.name === value) || null;

    const includedExtras = ExtraOptions.filter((extra) => {
      const included = extra.included;
      if (!Array.isArray(included)) return false;
      return included.find((includedTicket: ITicketOption) => {
        return String(includedTicket.id) === String(ticketType?.id);
      });
    }).map((extra) => extra.id); // Only store the IDs

    update(ticketIndex, {
      ...ticket,
      // extras: registrationSource === "online" ?  includedExtras : null,
      extras: includedExtras,
      ticket_type: ticketType,
    });
  };

  const checkTicketsForDuplicateEmails = () => {
    const tickets = watch("tickets") || [];
    const emails = tickets.map((t: ITicketPayload) => t.email);
    return new Set(emails).size !== emails.length;
  };

  const handleSave = async () => {
    const ticketTrainingType = watch(`tickets[${ticketIndex}].training_type`);
    const ticketRequiresEmail =
      typeof ticketTrainingType === "string" &&
      ticketTrainingType.trim() !== "" &&
      ticketTrainingType !== "None";
    const ticketEmail = watch(`tickets[${ticketIndex}].email`);

    // Training credit cannot be attributed without a real email.
    if (
      ticketRequiresEmail &&
      (noEmail ||
        !ticketEmail ||
        (typeof ticketEmail === "string" &&
          ticketEmail.startsWith("anonymous+")))
    ) {
      if (noEmail) setNoEmail(false);
      if (
        typeof ticketEmail === "string" &&
        ticketEmail.startsWith("anonymous+")
      ) {
        setValue(`tickets[${ticketIndex}].email`, "");
      }
      notify(
        "Must have an email to attribute training credit.",
        "error"
      );
      return;
    }

    const isValid = await trigger(`tickets[${ticketIndex}]`);

    // Promotional Emails Consent is now collected once at checkout (Billing
    // step) and applied to Attendee tickets on submit — see StepBilling.tsx
    // and StepNavigation.tsx.

    if (!isValid) {
      notify("Please fix the errors before saving.", "error");
      return;
    }
    if (checkTicketsForDuplicateEmails()) {
      notify(
        'Duplicate emails are not allowed either use a different email or select "I do not have an email".',
        "error"
      );
      return;
    }

    // Check if the ticket type is "A La Carte Meals" and ensure at least one meal is selected
    if (
      ticket?.ticket_type?.name === "A La Carte Meals" &&
      (!ticket.extras || ticket.extras.length === 0)
    ) {
      notify("You must select one of the meal options", "error");
      return;
    }

    if (type === "Attendee" || type === "Vendor") {
      const unchecked = getUncheckedOptionalExtras({
        ticket,
        extras: ExtraOptions,
        context: type,
      });
      if (unchecked.length > 0) {
        setPendingUncheckedExtras(unchecked);
        setExtrasConfirmOpen(true);
        return;
      }
    }

    commitSave();
  };

  const commitSave = () => {
    const updatedTicket = { ...ticket, price: calculateSubtotal() };
    if (ticketIndex === -1) append(updatedTicket);
    else update(ticketIndex, updatedTicket);
    setExtrasConfirmOpen(false);
    setHighlightExtras(false);
    setPendingUncheckedExtras([]);
    setIsOpen({
      open: false,
      context: "create",
    });
  };

  // "Go back and choose": dismiss the confirm without touching the ticket,
  // highlight the extras section, and restore focus there.
  const goBackToExtras = () => {
    setExtrasConfirmOpen(false);
    setHighlightExtras(true);
    saveButtonRef.current?.focus();
    requestAnimationFrame(() => {
      document
        .querySelector('[data-validation-field="ticket-extras"]')
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const closeModal = () => {
    if (isOpen.context === "create") {
      remove(ticketIndex);
    }
    setExtrasConfirmOpen(false);
    setHighlightExtras(false);
    setPendingUncheckedExtras([]);
    setIsOpen({
      open: false,
      context: "create",
    });
  };

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/50 p-4 sm:p-8">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-modal-title"
        className="flex max-h-[min(90vh,920px)] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        <CustomSecondaryHeader
          title={`${isOpen.context === "edit" ? "Edit" : "Add"} ${type}`}
          setIsOpen={closeModal as React.Dispatch<React.SetStateAction<boolean>>}
        />

        {/* Single scroll region — header/footer stay put */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <section className="space-y-4">
            <div>
              <h3
                id="ticket-modal-title"
                className="text-sm font-semibold uppercase tracking-wide text-slate-500"
              >
                Registration options
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
              {/* Public users already chose Attendee/Vendor on step 1;
                  ticket_type is auto-set via fetchSingleTicket. Admins can
                  override (Guest/VIP/Staff/etc.). */}
              {isAdminView && (
                <SelectInput
                  source={`tickets[${ticketIndex}].ticket_type.name`}
                  label="Ticket Type"
                  options={TicketOptions.map((t) => ({
                    value: t.name,
                    label: t.name,
                  }))}
                  required
                  onChange={(e) => handleTicketTypeChange(e)}
                />
              )}
              {isAdminView && type === "Attendee" && (
                <SelectInput
                  source={`tickets[${ticketIndex}].orwa_voting_status`}
                  label="ORWA Voting Status"
                  defualtValue="Non Voting"
                  options={VotingStatusOptions}
                />
              )}
              {isAdminView && type === "Attendee" && (
                <SelectInput
                  defualtValue="Non Voting"
                  source={`tickets[${ticketIndex}].orwaag_voting_status`}
                  label="ORWAAG Voting Status"
                  options={VotingStatusOptions}
                />
              )}
              {isAdminView && type === "Attendee" && (
                <div
                  className="sm:col-span-2 flex cursor-pointer items-start gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 transition hover:bg-slate-100"
                  onClick={() => {
                    setValue(
                      `tickets[${ticketIndex}].speaker`,
                      !watch(`tickets[${ticketIndex}].speaker`)
                    );
                  }}
                >
                  <Checkbox
                    checked={!!watch(`tickets[${ticketIndex}].speaker`)}
                    onChange={(e) => {
                      setValue(
                        `tickets[${ticketIndex}].speaker`,
                        e.target.checked
                      );
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-0.5 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    sx={{ p: 0 }}
                  />
                  <div className="flex min-w-0 flex-col">
                    <span className="text-sm text-slate-800">Speaker</span>
                    <span className="text-sm text-slate-500">
                      Check if the attendee is a speaker at the conference.
                    </span>
                  </div>
                </div>
              )}
              {type === "Attendee" &&
                watch(`tickets[${ticketIndex}].ticket_type.name`) &&
                watch(`tickets[${ticketIndex}].ticket_type.name`) !==
                  "Guest" && (
                  <>
                    <SelectInput
                      source={`tickets[${ticketIndex}].training_type`}
                      label="Training Type"
                      options={[
                        { label: "None", value: "None" },
                        { label: "Both", value: "Both" },
                        { label: "Operator", value: "Operator" },
                        { label: "Board", value: "Board" },
                      ]}
                      required={!isAdminView}
                    />
                    {(trainingType === "Operator" ||
                      trainingType === "Both") && (
                      <TextInput
                        source={`tickets[${ticketIndex}].license`}
                        label="License"
                        required
                      />
                    )}
                  </>
                )}

            </div>
          </section>

          <section className="mt-8 space-y-4 border-t border-slate-200 pt-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Contact details
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Who is this {type.toLowerCase()} registration for?
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
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
              {isAdminView && (
                <TextInput
                  source={`tickets[${ticketIndex}].organization`}
                  label="Company/Organization"
                />
              )}
              {!requiresEmailForTraining && (
                <div
                  className="sm:col-span-2 flex cursor-pointer items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 transition hover:bg-slate-100"
                  onClick={() => {
                    const isChecked = !noEmail;
                    setNoEmail(isChecked);
                    setValue(
                      `tickets[${ticketIndex}].email`,
                      isChecked
                        ? `anonymous+${ticket.first
                            ?.trim()
                            .replace(/[^a-zA-Z0-9]/g, "")}${ticket.last
                            ?.trim()
                            .replace(/[^a-zA-Z0-9]/g, "")}@orwa.org`
                        : ""
                    );
                  }}
                >
                  <Checkbox
                    checked={noEmail}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setNoEmail(isChecked);
                      setValue(
                        `tickets[${ticketIndex}].email`,
                        isChecked
                          ? `anonymous+${ticket.first
                              ?.trim()
                              .replace(/[^a-zA-Z0-9]/g, "")}${ticket.last
                              ?.trim()
                              .replace(/[^a-zA-Z0-9]/g, "")}@orwa.org`
                          : ""
                      );
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    sx={{ p: 0 }}
                  />
                  <span className="text-sm text-slate-700">
                    I do not have an email
                  </span>
                </div>
              )}
              {(requiresEmailForTraining || !noEmail) && (
                <div className="sm:col-span-2 space-y-1">
                  <EmailInput
                    source={`tickets[${ticketIndex}].email`}
                    label="Email"
                    required
                  />
                  {requiresEmailForTraining && (
                    <p className="text-sm text-slate-600">
                      Must have an email to attribute training credit.
                    </p>
                  )}
                </div>
              )}
              <MaskedPhoneInput
                source={`tickets[${ticketIndex}].phone`}
                required={!isAdminView}
              />
              {isAdminView && type === "Attendee" && (
                <TextInput
                  source={`tickets[${ticketIndex}].title`}
                  label="Title"
                />
              )}
            </div>
          </section>

          <section className="mt-8 border-t border-slate-200 pt-6">
            <AddExtras
              field={"tickets"}
              fieldIndex={ticketIndex}
              context={type}
              highlightInvalid={highlightExtras}
            />
          </section>
        </div>

        <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-center text-base font-semibold text-slate-900 sm:text-left">
            Subtotal:{" "}
            <span className="tabular-nums">
              {formatCurrency(calculateSubtotal())}
            </span>
          </p>
          <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row sm:items-center">
            <button
              type="button"
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              onClick={closeModal}
            >
              Cancel
            </button>
            {isOpen.context === "edit" && (
              <button
                type="button"
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                onClick={() => {
                  remove(ticketIndex);
                  setIsOpen({
                    open: false,
                    context: "create",
                  });
                }}
              >
                Remove
              </button>
            )}
            <button
              ref={saveButtonRef}
              type="button"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              onClick={handleSave}
            >
              {isOpen.context === "edit" ? "Update" : "Add"} {type}
            </button>
          </div>
        </div>
      </div>
    </div>
    {extrasConfirmOpen && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="extras-confirm-title"
          aria-describedby="extras-confirm-description"
          className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
        >
          <h2
            id="extras-confirm-title"
            className="text-lg font-semibold text-slate-900"
          >
            Extras
          </h2>
          <p
            id="extras-confirm-description"
            className="mt-3 text-base text-slate-700"
          >
            Are you sure you do not want to add:{" "}
            {formatExtrasConfirmList(
              pendingUncheckedExtras.map((e) => e.name)
            )}
            ?
          </p>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              ref={goBackButtonRef}
              type="button"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              onClick={goBackToExtras}
            >
              Go back and choose
            </button>
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              onClick={commitSave}
            >
              Continue without extras
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default TicketModal;
