import React, { useEffect, useState } from "react";
import {
  TextInput,
  MaskedPhoneInput,
  SelectInput,
  useNotify,
  CheckboxInput,
  EmailInput,
} from "mj-react-form-builder";
import { Checkbox, FormControlLabel, RadioGroup, Radio } from "@mui/material";
import CustomSecondaryHeader from "./CustomSecondaryHeader";
import currencyFormatter from "../../helpers/currencyFormat";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import {
  useRegistrationOptions,
  useRegistrationSource,
  useTicketIndex,
  useUserContext,
} from "../../AppContextProvider";
import { IExtraOption, ITicketOption, ITicketPayload } from "../../types/types";
import AddExtras from "../AddExtras";

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

  const { notify } = useNotify();
  const tickets = watch("tickets") || [];
  const ticket = tickets[ticketIndex] || {};
  const [noEmail, setNoEmail] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isOpen.context === "create") {
          remove(ticketIndex);
          return setIsOpen({
            open: false,
            context: "create",
          });
        } else {
          return setIsOpen({
            open: false,
            context: "create",
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
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
      .map((extraId: string) =>
        ExtraOptions.find((extra) => extra.id === extraId)
      )
      .filter((extra: number) => extra) // Ensure the extra exists
      .filter((extra: IExtraOption) => {
        // Check if the extra is included
        return !extra?.included.data.some(
          (includedTicket: ITicketOption) =>
            includedTicket.id === ticket.ticket_type?.id
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
      return extra.included.data.find((includedTicket: ITicketOption) => {
        return includedTicket.id === ticketType?.id;
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
    const isValid = await trigger(`tickets[${ticketIndex}]`);
    
    // Check if promotional emails choice is made
    if (watch(`tickets[${ticketIndex}].promotional_emails`) === undefined) {
      notify("Please make a selection for Promotional Emails Consent", "error");
      return;
    }
    
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

    const updatedTicket = { ...ticket, price: calculateSubtotal() };
    if (ticketIndex === -1) append(updatedTicket);
    else update(ticketIndex, updatedTicket);

    setIsOpen({
      open: false,
      context: "create",
    });
  };

  const isModalOpen = () => {
    if (isOpen.context === "create") {
      remove(ticketIndex);
      return setIsOpen({
        open: false,
        context: "create",
      });
    } else {
      return setIsOpen({
        open: false,
        context: "create",
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 overflow-y-auto border-r-2">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 sm:mx-6 md:mx-auto overflow-y-scroll">
        <CustomSecondaryHeader title={`Add ${type}`} setIsOpen={isModalOpen} />
        <div className="p-6 space-y-1 max-h-[50vh] md:max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
            <div className="sm:col-span-2 flex items-center space-x-4">
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
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-gray-700 text-sm">
                I do not have an email
              </label>
            </div>
            {!noEmail && (
              <EmailInput
                source={`tickets[${ticketIndex}].email`}
                label="Email"
                required
              />
            )}
            <MaskedPhoneInput
              source={`tickets[${ticketIndex}].phone`}
              required={!isAdminView}
            />
            {/* title */}
            {isAdminView && type === "Attendee" && (
              <TextInput
                source={`tickets[${ticketIndex}].title`}
                label="Title"
              />
            )}
            <SelectInput
              source={`tickets[${ticketIndex}].ticket_type.name`}
              label="Ticket Type"
              options={TicketOptions.filter((ticket) => {
                return ticket.context === type || isAdminView;
              }).map((t) => ({
                value: t.name,
                label: t.name,
              }))}
              required
              onChange={(e) => handleTicketTypeChange(e)}
            />
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
              <CheckboxInput
                source={`tickets[${ticketIndex}].speaker`}
                label="Speaker"
                helperText="Check if the attendee is a speaker at the conference."
              />
            )}
            {type === "Attendee" &&
              watch(`tickets[${ticketIndex}].ticket_type.name`) &&
              watch(`tickets[${ticketIndex}].ticket_type.name`) !== "Guest" && (
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
                  {(trainingType === "Operator" || trainingType === "Both") && (
                    <TextInput
                      source={`tickets[${ticketIndex}].license`}
                      label="License"
                      required
                    />
                  )}
                </>
              )}

            <div className="sm:col-span-2 mb-2">
              <p className="text-sm mb-2 font-medium">
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
                  className="text-sm"
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="I DO NOT consent to receive informational and promotional emails from select conference vendors."
                  className="text-sm"
                />
              </RadioGroup>
              {!watch(`tickets[${ticketIndex}].promotional_emails`) && 
                watch(`tickets[${ticketIndex}].promotional_emails`) !== false && (
                <p className="text-red-500 text-xs mt-1">Please select an option</p>
              )}
            </div>
          </div>
          <AddExtras
            field={"tickets"}
            fieldIndex={ticketIndex}
            context={type}
          />
        </div>
        <div className="border-t p-4 bg-gray-100 rounded-b-xl flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          {calculateSubtotal() > 0 && (
            <p className="text-lg font-semibold text-gray-800 text-center sm:text-left">
              Subtotal: {currencyFormatter.format(calculateSubtotal())}
            </p>
          )}
          <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              className="bg-blue-600 text-white w-full sm:w-auto px-6 py-2 rounded-lg hover:bg-blue-700 transition text-center"
              onClick={handleSave}
            >
              {isOpen.context === "edit" ? "Update" : "Add"} {type}
            </button>
            {/* remove button */}

            {isOpen.context === "edit" && (
              <button
                className="bg-red-500 text-white w-full sm:w-auto px-6 py-2 rounded-lg hover:bg-red-600 transition text-center"
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
              className="bg-gray-500 text-white w-full sm:w-auto px-6 py-2 rounded-lg hover:bg-gray-600 transition text-center"
              onClick={() => {
                if (isOpen.context === "edit") {
                  setIsOpen({
                    open: false,
                    context: "create",
                  });
                } else {
                  remove(ticketIndex);
                  setIsOpen({
                    open: false,
                    context: "create",
                  });
                }
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
