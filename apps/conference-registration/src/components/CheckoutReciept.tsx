import React, { useContext, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import currencyFormatter from "../helpers/currencyFormat";
import { useFormContext } from "react-hook-form";
import {
  useRegistrationOptions,
  RegistrationSource,
} from "../AppContextProvider";
import { isExtraIncluded } from "../helpers/isExtraIncluded";
import { calculateSubtotal } from "../helpers/calculateSubtotal";
import { getExtraData } from "../helpers/getExtraData";
import {
  IRegistrationPayload,
  ITicketPayload,
  ISponsorPayload,
} from "../types/types";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mt-3">
    <h2 className="text-md font-semibold text-gray-800 text-left">{title}</h2>
    <Divider className="my-2" />
    <div>{children}</div>
  </div>
);

const LineItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
  index?: number;
}) => (
  <div className={`flex justify-between items-center py-2`}>
    <span className="font-medium text-gray-800">{label}</span>
    <span className="font-semibold text-gray-900">{value}</span>
  </div>
);

const CheckoutReceipt = () => {
  const { ConferenceOptions, ExtraOptions, RegistrationAddons } =
    useRegistrationOptions();
  const { getValues, watch } = useFormContext();
  const registrationSource = useContext(RegistrationSource);
  const [expanded, setExpanded] = useState<boolean>(true);

  const boothCount = watch("booths")?.length || 0;

  const freeVendors = () => {
    return boothCount === 1 ? 2 : boothCount >= 2 ? 3 : 0;
  };

  if (!ConferenceOptions) return null;

  const {
    tickets,
    booths,
    registrationExtrasIds,
    sponsors,
    agency,
    member_status,
    registrationAddonIds,
  } = getValues() as IRegistrationPayload;

  const totalAmount = currencyFormatter.format(
    calculateSubtotal(
      getValues() as IRegistrationPayload,
      registrationSource,
      agency === "false" && member_status === "Non Member"
        ? ConferenceOptions.non_member_fee
        : 0,
      ExtraOptions
    )
  );

  return (
    <Accordion
      disableGutters
      square
      sx={{
        boxShadow: "none",
        position: "relative",
      }}
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
    >
      <AccordionSummary
        sx={{
          bgcolor: "rgb(203 213 225)",
          color: "black",
          borderBottom: "1px solid rgb(100 116 139)",
        }}
        expandIcon={<ExpandMoreIcon />}
      >
        <div className="flex justify-between w-full">
          <h2 className="text-lg">Checkout</h2>
          <span className="text-lg">{totalAmount}</span>
        </div>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          maxHeight: 500,
          overflow: "auto",
        }}
      >
        {member_status === "Non Member" && agency === "false" && (
          <LineItem
            label="Non Member Fee"
            value={currencyFormatter.format(ConferenceOptions.non_member_fee)}
          />
        )}
        {tickets?.length > 0 && (
          <Section title={`Tickets (${tickets.length})`}>
            {tickets.map((ticket: ITicketPayload, index: number) => (
              <div key={ticket.email} className="mb-4">
                <LineItem
                  index={index}
                  label={`${ticket.first} ${ticket.last}`}
                  value={
                    ticket.ticket_type.context === "Vendor"
                      ? freeVendors() > 0
                        ? "Included"
                        : currencyFormatter.format(ticket.price)
                      : currencyFormatter.format(ticket.price)
                  }
                />
                {ticket.extras.map((extra, index) => {
                  const currentExtra = getExtraData(ExtraOptions, extra);
                  return (
                    <LineItem
                      key={index}
                      index={index}
                      label={currentExtra?.name || ""}
                      value={
                        isExtraIncluded(ticket, ExtraOptions, extra)
                          ? "Included"
                          : currencyFormatter.format(
                              registrationSource === "online"
                                ? currentExtra?.price_online || 0
                                : currentExtra?.price_event || 0
                            )
                      }
                    />
                  );
                })}
              </div>
            ))}
          </Section>
        )}
        {booths?.length > 0 && (
          <Section title={`Booths (${booths.length})`}>
            {booths.map((booth, index) => (
              <LineItem
                index={index}
                key={index + booth.subtotal || 0}
                label={`Booth ${index + 1}`}
                value={
                  index === 0
                    ? currencyFormatter.format(ConferenceOptions.booth_price)
                    : currencyFormatter.format(ConferenceOptions.booth_price_2)
                }
              />
            ))}
          </Section>
        )}
        {sponsors?.length > 0 && (
          <Section title={`Sponsorships (${sponsors.length})`}>
            {sponsors.map((sponsor: ISponsorPayload, index: number) => (
              <LineItem
                index={index}
                key={sponsor.id}
                label={sponsor.name}
                value={currencyFormatter.format(sponsor.amount)}
              />
            ))}
          </Section>
        )}
        {/* Registration Extras */}

        {registrationAddonIds?.length > 0 && (
          <Section
            title={`Registration Addons (${registrationAddonIds.length})`}
          >
            {registrationAddonIds.map((addon, index) => {
              const currentExtra = getExtraData(RegistrationAddons, addon);
              return (
                <LineItem
                  key={addon}
                  index={index}
                  label={currentExtra?.name || ""}
                  value={currencyFormatter.format(
                    currentExtra?.price_online || 0
                  )}
                />
              );
            })}
          </Section>
        )}

        {registrationExtrasIds?.length > 0 && (
          <Section
            title={`Registration Extras (${registrationExtrasIds.length})`}
          >
            {registrationExtrasIds.map((extra, index) => {
              const currentExtra = getExtraData(ExtraOptions, extra);
              return (
                <LineItem
                  index={index}
                  key={extra}
                  label={currentExtra?.name || ""}
                  value={
                    currentExtra?.price_online === 0 ||
                    currentExtra?.price_event === 0
                      ? " "
                      : currencyFormatter.format(
                          registrationSource === "online"
                            ? currentExtra?.price_online || 0
                            : currentExtra?.price_event || 0
                        )
                  }
                />
              );
            })}
          </Section>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default CheckoutReceipt;
