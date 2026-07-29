import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import AddVendorComponent from "../components/_components/AddTicket";
import currencyFormatter from "../helpers/currencyFormat";
import TicketModal from "../components/_components/TicketModal";
import {
  useRegistrationOptions,
  useRegistrationSource,
  useStepContext,
  useTicketIndex,
} from "../AppContextProvider";
import { ITicketPayload } from "../types/types";
import SelectPreviousRegistration from "../components/_components/SelectPreviousRegistration";
import { ticketMatchesContext } from "../helpers/ticketMatchesContext";
import { ValidationHighlight } from "../helpers/validationHighlight";

const StepVendors = () => {
  const { watch } = useFormContext();
  const { setFormSteps } = useStepContext();
  const { ticketIndex } = useTicketIndex();

  const [isVendorModalOpen, setIsVendorModalOpen] = useState({
    open: false,
    context: "create",
  });

  const [subtotal, setSubtotal] = useState(0);

  const booths = watch("booths") || [];
  const tickets = watch("tickets") || [];
  const registrationSource = useRegistrationSource();
  const { ConferenceOptions } = useRegistrationOptions();

  useEffect(() => {
    const ticketPrice = tickets
      .filter((ticket: ITicketPayload) => {
        return (
          ticket.ticket_type &&
          (ticketMatchesContext(ticket.ticket_type, "Vendor") ||
            ticket.type === "Vendor")
        );
      })
      ?.reduce((acc: number, ticket: ITicketPayload) => acc + ticket.price, 0);
    setSubtotal(ticketPrice || 0);
  }, [tickets]);

  const vendorCount = tickets.filter(
    (ticket: ITicketPayload) => ticket.type === "Vendor"
  ).length;

  const showPreviousRegistration =
    booths.length === 0 || registrationSource === "kiosk";
  const showBoothClosedNotice =
    registrationSource === "kiosk" ||
    ConferenceOptions?.booths_available === 0;
  const showVendorRepCallout =
    registrationSource === "online" &&
    ConferenceOptions?.booths_available !== 0 &&
    booths.length !== 0;
  const showBackToBooths =
    booths.length === 0 &&
    registrationSource === "online" &&
    ConferenceOptions?.booths_available !== 0;

  const handleAddBoothStep = () => {
    setFormSteps((prev) =>
      prev.map((step) =>
        step.key === "booth_registration" ? { ...step, active: true } : step
      )
    );
  };

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
          Vendor Information
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Add each vendor representative for your booth. Meal extras and ticket
          options can be configured when you add a vendor.
        </p>
      </header>

      {showBackToBooths && (
        <div className="mb-4">
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleAddBoothStep}
          >
            Back to Booths
          </button>
        </div>
      )}

      {showBoothClosedNotice && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
          Booth sales are closed. If you need to add an additional vendor rep to
          an existing booth, use Add Vendor below.
        </div>
      )}

      {showPreviousRegistration && (
        <section className="mb-6 rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Organization
          </h3>
          <SelectPreviousRegistration />
        </section>
      )}

      <ValidationHighlight
        field="vendors"
        className="p-2"
        clearWhen={vendorCount > 0}
      >
        <section aria-label="Vendors">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Vendor Representatives
            </h3>
            <span className="text-xs text-slate-400">
              {vendorCount} added
            </span>
          </div>

          <AddVendorComponent
            type="Vendor"
            setIsModalOpen={setIsVendorModalOpen}
          />

          {showVendorRepCallout && (
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              You must have at least{" "}
              <strong className="font-semibold text-slate-900">
                1 Vendor Rep
              </strong>{" "}
              to staff your booth.
            </div>
          )}
        </section>
      </ValidationHighlight>

      <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
        <span className="text-sm text-slate-500">
          {vendorCount === 0
            ? "No vendors added yet"
            : `${vendorCount} vendor${vendorCount === 1 ? "" : "s"}`}
        </span>
        <p className="text-lg text-slate-900">
          Subtotal:{" "}
          <span className="font-bold tabular-nums">
            {currencyFormatter.format(subtotal)}
          </span>
        </p>
      </div>

      {isVendorModalOpen.open && ticketIndex !== null && ticketIndex >= 0 && (
        <TicketModal
          setIsOpen={setIsVendorModalOpen}
          type="Vendor"
          isOpen={isVendorModalOpen}
        />
      )}
    </div>
  );
};

export default StepVendors;
