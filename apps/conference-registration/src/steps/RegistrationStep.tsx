import { useContext, useEffect, useState } from "react";
import { TextInput, MaskedPhoneInput as _MaskedPhoneInput, EmailInput } from "mj-react-form-builder";

// Type fix for React 19 compatibility
const MaskedPhoneInput = _MaskedPhoneInput as React.ComponentType<{
  source: string;
  required?: boolean;
}>;
import VendorOrAttendeeBox from "../components/_components/VendorOrAttendexBox";
import {
  FormSteps,
  useRegistrationOptions,
  useRegistrationSource,
  useUserContext,
} from "../AppContextProvider";
import { useFormContext } from "react-hook-form";
import Loading from "../components/Loading";

const RegistrationStep = () => {
  const { setFormSteps } = useContext(FormSteps);
  const {
    ConferenceOptions,
    ExtraOptions,
    TicketOptions,
    RegistrationAddons,
  } = useRegistrationOptions();
  const {isAdminView, isLoggedIn} = useUserContext();
  const registrationSource = useRegistrationSource();
  const { register, watch, setValue, unregister} = useFormContext();

  const [showSponsorshipOptions, setShowSponsorshipOptions] = useState(false);

  // Watch the state from the form context
  const registrationType = watch("registration_type");
  const showContestantsStep = watch("showContestantsStep") || false;
  const selectedAddons = watch("selectedAddons") || [];

  useEffect(() => {
    const stepsToHide: string[] = [];

    if (!showSponsorshipOptions) {
      stepsToHide.push("sponsorship");
    }

    if (!showContestantsStep) {
      stepsToHide.push("contestant_registration");
    }

    switch (registrationType) {
      case "Attendee":
        stepsToHide.push("booth_registration", "vendor_registration");
        break;
      case "Vendor":
        stepsToHide.push("attendee_registration");
        if (ConferenceOptions.booths_available <= 0 && !(isAdminView && isLoggedIn)) {
          stepsToHide.push("booth_registration");
        }
        if (registrationSource === "kiosk") {
          stepsToHide.push("booth_registration");
        }
        break;
      default:
        stepsToHide.push(
          "attendee_registration",
          "booth_registration",
          "vendor_registration"
        );
        break;
    }

    setFormSteps((steps) =>
      steps.map((step) => {
        return step.key === "guest_registration"
          ? step
          : {
              ...step,
              active: !stepsToHide.includes(step.key),
            };
      })
    );
  }, [showSponsorshipOptions, registrationType, showContestantsStep]);

  if (!ConferenceOptions || !ExtraOptions || !TicketOptions) return <Loading />;

  return (
    <div className="container mx-auto max-w-3xl px-4">
      <div className="flex justify-center py-3">
        <img
          src={`${import.meta.env.VITE_API_ENDPOINT.replace("/api", "")}${
            ConferenceOptions.logo.data.url
          }`}
          className="max-h-52 md:ml-0 bg-white"
          alt="Conference Logo"
        />
      </div>
      <div className="text-center my-4">
        <p>
          If you’re trying to pay your registration that’s already been submitted as an invoice, either email{" "}
          <a href="mailto:sjohnson@orwa.org" className="text-blue-500 hover:underline">sjohnson@orwa.org</a> or call{" "}
          <a href="tel:405-671-3301" className="text-blue-500 hover:underline">405-671-3301</a>.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-12 justify-center w-full">
        <div className="grow">
          <div className="flex flex-col space-y-4">
            <TextInput source="registrant.first" label="First Name" required />
            <TextInput source="registrant.last" label="Last Name" required />
            <EmailInput source="registrant.email" label="Email" required />
            <MaskedPhoneInput source="registrant.phone" required />
            <p className="italic text-slate-700 mt-3">
              This is <strong className="text-red-600">not</strong> a ticket.
              <br />
              It is the <strong>point of contact</strong> for the person placing
              this registration.
            </p>
          </div>
        </div>

        <div className="grow">
          <p className="italic text-slate-700 text-nowrap mb-2">
            Choose your type of registration.
          </p>
          <div className="flex justify-evenly space-x-4 mb-2">
            <VendorOrAttendeeBox
              {...register("registration_type")}
              registrationType="Attendee"
              checked={registrationType}
              setRegistrationType={() => {
                if (registrationType === "Attendee") {
                  setValue("registration_type", null);
                } else {
                  setValue("registration_type", "Attendee");
                  setValue("booths", []);
                  setValue("tickets", []);
                }
                unregister("organization");
              }}
            />
            <VendorOrAttendeeBox
              {...register("registration_type")}
              registrationType="Vendor"
              checked={registrationType}
              setRegistrationType={() => {
                if (registrationType === "Vendor") {
                  setValue("registration_type", null);
                } else {
                  setValue("registration_type", "Vendor");
                  setValue("tickets", []);
                }
                unregister("organization");
              }}
            />
          </div>

          {registrationSource === "online" && (
            <div className="mt-4">
              <button
                className={`w-full font-bold py-2 px-4 rounded-md ${
                  showSponsorshipOptions
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setShowSponsorshipOptions(!showSponsorshipOptions);
                }}
              >
                Available Sponsorships
              </button>
              <div className="flex flex-col py-2">
                {RegistrationAddons.map((addon) => (
                  <button
                    key={addon.id}
                    className={`font-bold py-2 px-4 rounded-md mt-2 ${
                      selectedAddons.includes(addon.id)
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();

                      // Toggle the add-on selection
                      const updatedAddons = selectedAddons.includes(addon.id)
                        ? selectedAddons.filter((id: number) => id !== addon.id)
                        : [...selectedAddons, addon.id];

                      setValue("selectedAddons", updatedAddons);

                      // Check if the add-on's context is "contestant"
                      if (addon.context === "Contestant") {
                        setValue(
                          "showContestantsStep",
                          !selectedAddons.includes(addon.id)
                        );
                      }
                    }}
                  >
                    {addon.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          <h3 className="text-xl font-extrabold mt-6">
            Payment Options Available!
          </h3>
          <h4 className="text-lg">Pay by Credit Card or via Invoice.</h4>
        </div>
      </div>
    </div>
  );
};

export default RegistrationStep;