import React, { useContext, useState } from "react";
import currencyFormatter, {
  formatMoneyOrIncluded,
} from "../helpers/currencyFormat";
import { useFormContext } from "react-hook-form";
import {
  useRegistrationOptions,
  RegistrationSource,
} from "../AppContextProvider";
import { isExtraIncluded } from "../helpers/isExtraIncluded";
import { calculateSubtotal } from "../helpers/calculateSubtotal";
import { getExtraData } from "../helpers/getExtraData";
import { boothBasePrice } from "../helpers/boothBasePrice";
import { formatTicketLineLabel } from "../helpers/formatTicketLineLabel";
import {
  freeVendorAllowance,
  vendorOrdinalAtIndex,
} from "../helpers/freeVendorAllowance";
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
  <div className="mt-4 first:mt-0">
    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
      {title}
    </h3>
    <div className="divide-y divide-slate-100">{children}</div>
  </div>
);

const LineItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
  index?: number;
}) => (
  <div className="flex items-center justify-between gap-3 py-2">
    <span className="text-sm text-slate-700">{label}</span>
    <span className="shrink-0 text-sm font-semibold tabular-nums text-slate-900">
      {value}
    </span>
  </div>
);

const CompensatedMoney = ({ listPrice }: { listPrice: number }) => (
  <span className="inline-flex items-baseline gap-1.5">
    <span className="font-normal text-slate-400 line-through">
      {currencyFormatter.format(listPrice)}
    </span>
    <span className="font-semibold text-slate-900">Included with booth</span>
  </span>
);

const CheckoutReceipt = () => {
  const { ConferenceOptions, ExtraOptions, RegistrationAddons } =
    useRegistrationOptions();
  const { getValues, watch } = useFormContext();
  const registrationSource = useContext(RegistrationSource);
  const [expanded, setExpanded] = useState<boolean>(true);

  const boothCount = watch("booths")?.length || 0;
  const freeVendorSlots = freeVendorAllowance(boothCount);

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

  const ticketLineValue = (ticket: ITicketPayload, index: number) => {
    const isVendor = ticket.type === "Vendor";
    const listPrice =
      registrationSource === "online"
        ? ticket.ticket_type?.price_online || 0
        : ticket.ticket_type?.price_event || 0;
    const compensated =
      isVendor && vendorOrdinalAtIndex(tickets, index) < freeVendorSlots;

    if (compensated) {
      return <CompensatedMoney listPrice={listPrice} />;
    }

    // ticket.price includes paid extras; show that charged amount for the line
    return formatMoneyOrIncluded(ticket.price);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="flex w-full cursor-pointer items-center justify-between gap-3 bg-slate-50 px-4 py-3.5 text-left transition hover:bg-slate-100/80"
      >
        <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`h-4 w-4 text-slate-500 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Order summary
          </span>
        </div>
        <span className="text-lg font-bold tabular-nums text-slate-900">
          {totalAmount}
        </span>
      </button>

      {expanded && (
        <div className="max-h-[500px] overflow-auto border-t border-slate-200 px-4 py-4">
          {booths?.length > 0 && (
            <Section title={`Booths (${booths.length})`}>
              {booths.map((booth, index) => (
                <LineItem
                  index={index}
                  key={index + booth.subtotal || 0}
                  label={`Booth ${index + 1}`}
                  value={currencyFormatter.format(
                    boothBasePrice(ConferenceOptions, index)
                  )}
                />
              ))}
            </Section>
          )}
          {member_status === "Non Member" && agency === "false" && (
            <LineItem
              label="Non Member Fee"
              value={currencyFormatter.format(ConferenceOptions.non_member_fee)}
            />
          )}
          {tickets?.length > 0 && (
            <Section title={`Tickets (${tickets.length})`}>
              {tickets.map((ticket: ITicketPayload, index: number) => (
                <div key={ticket.email} className="mb-2 last:mb-0">
                  <LineItem
                    index={index}
                    label={formatTicketLineLabel(ticket)}
                    value={ticketLineValue(ticket, index)}
                  />
                  {ticket.extras.map((extra, extraIndex) => {
                    const currentExtra = getExtraData(ExtraOptions, extra);
                    return (
                      <LineItem
                        key={extraIndex}
                        index={extraIndex}
                        label={currentExtra?.name || ""}
                        value={
                          isExtraIncluded(ticket, ExtraOptions, extra)
                            ? "Included"
                            : formatMoneyOrIncluded(
                                registrationSource === "online"
                                  ? currentExtra?.price_online
                                  : currentExtra?.price_event
                              )
                        }
                      />
                    );
                  })}
                </div>
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
                    value={formatMoneyOrIncluded(currentExtra?.price_online)}
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
                    value={formatMoneyOrIncluded(
                      registrationSource === "online"
                        ? currentExtra?.price_online
                        : currentExtra?.price_event
                    )}
                  />
                );
              })}
            </Section>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
            <span className="text-sm font-semibold text-slate-700">Total</span>
            <span className="text-base font-bold tabular-nums text-slate-900">
              {totalAmount}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutReceipt;
