import { useEffect, useState } from "react";
import { Divider, Modal, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { FormSection } from "mj-react-form-builder";
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
  const registrationSource = useRegistrationSource();
  const { ConferenceOptions } = useRegistrationOptions();

  useEffect(() => {
    const ticketPrice = watch("tickets")
      .filter((ticket: ITicketPayload) => {
        return ticket.ticket_type && ticket.ticket_type.context === "Vendor";
      })
      ?.reduce((acc: number, ticket: ITicketPayload) => acc + ticket.price, 0);
    setSubtotal(ticketPrice || 0);
  }, [watch("tickets")]);

  const handleAddBoothStep = () => {

      setFormSteps((prev) => {
        return prev.map(step => {
          return step.key === 'booth_registration' ? { ...step, active: true } : step
        })
      })

  };

  return !ConferenceOptions ? (
    <>Loading...</>
  ) : (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {(registrationSource === "kiosk" ||
        ConferenceOptions.booths_available === 0) && (
        <p className="-mt-10 mb-5">
          Booth sales are closed, however if you need to add an additional
          vendor rep to your existing vendor booth, please click the add vendor
          button below.
        </p>
      )}
      {(booths.length === 0 && registrationSource === "online" && ConferenceOptions.booths_available !== 0) && (
        <div className="flex justify-start mb-3">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddBoothStep}
          >
            Back
          </button>
        </div>
      )}

      <FormSection title="Vendor Information">
        {(booths.length === 0 || registrationSource === "kiosk") && (
          <SelectPreviousRegistration/>
        )}
        <div className="grid md:grid-cols-1 col-span-2 gap-4">
            <AddVendorComponent
              type="Vendor"
              setIsModalOpen={setIsVendorModalOpen}
            />
            {(registrationSource === "online" &&
              ConferenceOptions.booths_available !== 0 && booths.length !== 0) && (
                <p className="mt-3">
                  You must have at least{" "}
                  <strong className="text-red-600">1 Vendor Rep</strong> to man
                  your booth.
                </p>
              )}
        </div>
      </FormSection>

      <Typography variant="h6" textAlign="right" sx={{ mt: 4 }}>
        Total Price:{" "}
        <strong className="text-red-600">
          {currencyFormatter.format(subtotal)}
        </strong>
      </Typography>
      <Divider />

      {ticketIndex !== null && isVendorModalOpen && (
        <Modal
          disableAutoFocus
          open={isVendorModalOpen.open}
          onClose={() =>
            setIsVendorModalOpen({ open: false, context: "create" })
          }
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <TicketModal
            setIsOpen={setIsVendorModalOpen}
            type="Vendor"
            isOpen={isVendorModalOpen}
          />
        </Modal>
      )}
    </div>
  );
};

export default StepVendors;
