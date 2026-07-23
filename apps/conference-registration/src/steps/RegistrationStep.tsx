import { useContext, useEffect } from "react";
import {
  TextInput,
  MaskedPhoneInput as _MaskedPhoneInput,
  EmailInput,
} from "mj-react-form-builder";

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
import { ValidationHighlight } from "../helpers/validationHighlight";

const RegistrationStep = () => {
  const { setFormSteps } = useContext(FormSteps);
  const {
    ConferenceOptions,
    ExtraOptions,
    TicketOptions,
    RegistrationAddons,
    SponsorshipOptions,
  } = useRegistrationOptions();
  const { isAdminView, isLoggedIn } = useUserContext();
  const registrationSource = useRegistrationSource();
  const { register, watch, setValue, unregister, getValues } = useFormContext();

  const registrationType = watch("registration_type");
  const showContestantsStep = watch("showContestantsStep") || false;
  const selectedAddons = watch("selectedAddons") || [];
  const previousRegistrationChange = watch("previous_registration_change");
  const hasAvailableSponsorships =
    registrationSource === "online" &&
    (SponsorshipOptions?.some((option) => option.available > 0) ?? false);
  const showSponsorshipStep =
    registrationType === "Vendor" && hasAvailableSponsorships;

  useEffect(() => {
    const stepsToHide: string[] = [];

    // Sponsorships are vendor-only (and still require online + available packages).
    if (!showSponsorshipStep) {
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
        if (
          ConferenceOptions.booths_available <= 0 &&
          !(isAdminView && isLoggedIn)
        ) {
          stepsToHide.push("booth_registration");
        }
        if (registrationSource === "kiosk") {
          stepsToHide.push("booth_registration");
        }
        // Skipping booths when editing a previous registration
        if (previousRegistrationChange === "Yes") {
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
  }, [
    ConferenceOptions.booths_available,
    isAdminView,
    isLoggedIn,
    previousRegistrationChange,
    registrationSource,
    registrationType,
    showContestantsStep,
    showSponsorshipStep,
  ]);

  // Attendees (and unset type) must not keep sponsor packages from a prior Vendor selection or draft.
  useEffect(() => {
    if (registrationType === "Vendor") return;
    const sponsors = getValues("sponsors");
    if (Array.isArray(sponsors) && sponsors.length > 0) {
      setValue("sponsors", []);
    }
  }, [getValues, registrationType, setValue]);

  if (!ConferenceOptions || !ExtraOptions || !TicketOptions) return <Loading />;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6 text-left">
      <header className="mb-6 border-b border-slate-200 pb-5 text-center">
        <div className="mb-4 flex justify-center">
          <img
            src={`${import.meta.env.VITE_API_ENDPOINT.replace("/api", "")}${
              ConferenceOptions.logo?.url ??
              ConferenceOptions.logo?.data?.url ??
              ""
            }`}
            className="max-h-44 bg-white object-contain"
            alt="Conference Logo"
          />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Registration Contact
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Enter the point of contact for this registration, then choose Attendee
          or Vendor. Already invoiced? Email{" "}
          <a
            href="mailto:sjohnson@orwa.org"
            className="font-medium text-blue-600 hover:underline"
          >
            sjohnson@orwa.org
          </a>{" "}
          or call{" "}
          <a
            href="tel:405-671-3301"
            className="font-medium text-blue-600 hover:underline"
          >
            405-671-3301
          </a>
          .
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        <ValidationHighlight
          field="contact"
          className="rounded-lg border border-slate-200 bg-white p-5"
          clearWhen={Boolean(
            watch("registrant.first") &&
              watch("registrant.last") &&
              watch("registrant.email") &&
              watch("registrant.phone")
          )}
        >
          <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Contact details
          </h3>
          <p className="mb-4 text-xs leading-relaxed text-slate-500">
            This is <span className="font-semibold text-red-600">not</span> a
            ticket — it is the person placing this registration.
          </p>
          <div className="flex flex-col space-y-3">
            <TextInput source="registrant.first" label="First Name" required />
            <TextInput source="registrant.last" label="Last Name" required />
            <EmailInput source="registrant.email" label="Email" required />
            <MaskedPhoneInput source="registrant.phone" required />
          </div>
        </ValidationHighlight>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Registration type
          </h3>
          <p className="mb-4 text-xs leading-relaxed text-slate-500">
            Required — this determines the rest of your registration steps.
          </p>

          <ValidationHighlight
            field="registration_type"
            className="p-1"
            clearWhen={
              registrationType === "Attendee" || registrationType === "Vendor"
            }
          >
            <div className="grid grid-cols-2 gap-3">
              <VendorOrAttendeeBox
                {...register("registration_type")}
                registrationType="Attendee"
                checked={registrationType}
                setRegistrationType={() => {
                  if (registrationType !== "Attendee") {
                    setValue("registration_type", "Attendee");
                    setValue("booths", []);
                    setValue("tickets", []);
                    setValue("sponsors", []);
                    unregister("organization");
                  }
                }}
              />
              <VendorOrAttendeeBox
                {...register("registration_type")}
                registrationType="Vendor"
                checked={registrationType}
                setRegistrationType={() => {
                  if (registrationType !== "Vendor") {
                    setValue("registration_type", "Vendor");
                    setValue("tickets", []);
                    unregister("organization");
                  }
                }}
              />
            </div>
          </ValidationHighlight>

          {!registrationType && (
            <p className="mt-3 text-xs font-medium text-amber-700">
              Select Attendee or Vendor to continue.
              {hasAvailableSponsorships
                ? " Sponsorship packages are available for Vendor registration."
                : ""}
            </p>
          )}

          {registrationSource === "online" && RegistrationAddons.length > 0 && (
            <div className="mt-5 border-t border-slate-200 pt-4">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Optional add-ons
              </h4>
              <div className="flex flex-col gap-2">
                {RegistrationAddons.map((addon) => {
                  const selected = selectedAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      className={`rounded-lg border px-3 py-2.5 text-left text-sm font-semibold transition ${
                        selected
                          ? "border-blue-600 bg-blue-50 text-blue-800"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();

                        const updatedAddons = selected
                          ? selectedAddons.filter(
                              (id: number) => id !== addon.id
                            )
                          : [...selectedAddons, addon.id];

                        setValue("selectedAddons", updatedAddons);

                        if (addon.context === "Contestant") {
                          setValue("showContestantsStep", !selected);
                        }
                      }}
                    >
                      {addon.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
            <p className="text-sm font-semibold text-slate-800">
              Payment options available
            </p>
            <p className="mt-0.5 text-xs text-slate-600">
              Pay by credit card or request an invoice at checkout.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RegistrationStep;
