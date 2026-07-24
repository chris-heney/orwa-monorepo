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
import { ticketMatchesContext } from "../helpers/ticketMatchesContext";

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
  const { register, watch, setValue, unregister } = useFormContext();

  const registrationType = watch("registration_type");
  const showContestantsStep = watch("showContestantsStep") || false;
  const selectedAddons = watch("selectedAddons") || [];
  const previousRegistrationChange = watch("previous_registration_change");
  const hasAvailableSponsorships =
    registrationSource === "online" &&
    (SponsorshipOptions?.some((option) => option.available > 0) ?? false);

  // Fall: Golfer/Fisher tickets. Annual: Water Taste Test addon toggle.
  const hasContestantTickets = (TicketOptions ?? []).some((ticket) =>
    ticketMatchesContext(ticket, "Contestant")
  );
  const hasContestantAddons = (RegistrationAddons ?? []).some(
    (addon) => addon.context === "Contestant"
  );
  const showContestants =
    hasContestantTickets || (hasContestantAddons && showContestantsStep);
  // Contestant-only registration is offered when contestant tickets exist.
  const offerContestantOnly = hasContestantTickets;

  useEffect(() => {
    const stepsToHide: string[] = [];

    // Sponsorships available online when packages exist (Attendee and Vendor).
    if (!hasAvailableSponsorships) {
      stepsToHide.push("sponsorship");
    }

    if (!showContestants) {
      stepsToHide.push("contestant_registration");
    }

    switch (registrationType) {
      case "Attendee":
        stepsToHide.push("booth_registration", "vendor_registration");
        break;
      case "Contestant":
        // Contestant-only: Type → Contestants → Billing.
        stepsToHide.push(
          "attendee_registration",
          "booth_registration",
          "vendor_registration",
          "sponsorship"
        );
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
    showContestants,
    hasAvailableSponsorships,
  ]);

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
          Enter the point of contact for this registration, then choose your
          registration type.
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
            ticket — it is the person submitting this registration.
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
              registrationType === "Attendee" ||
              registrationType === "Vendor" ||
              registrationType === "Contestant"
            }
          >
            <div
              className={`grid gap-3 ${
                offerContestantOnly ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2"
              }`}
            >
              <VendorOrAttendeeBox
                {...register("registration_type")}
                registrationType="Attendee"
                checked={registrationType}
                setRegistrationType={() => {
                  if (registrationType !== "Attendee") {
                    setValue("registration_type", "Attendee");
                    setValue("booths", []);
                    setValue("tickets", []);
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
              {offerContestantOnly && (
                <VendorOrAttendeeBox
                  {...register("registration_type")}
                  registrationType="Contestant"
                  label="Contestant Only"
                  checked={registrationType}
                  setRegistrationType={() => {
                    if (registrationType !== "Contestant") {
                      setValue("registration_type", "Contestant");
                      setValue("booths", []);
                      setValue("tickets", []);
                      unregister("organization");
                    }
                  }}
                />
              )}
            </div>
          </ValidationHighlight>

          {!registrationType && (
            <p className="mt-3 text-xs font-medium text-amber-700">
              {offerContestantOnly
                ? "Select Attendee, Vendor, or Contestant Only to continue."
                : "Select Attendee or Vendor to continue."}
              {hasAvailableSponsorships
                ? " Sponsorship packages are available for any registration type."
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

      <aside
        className="mt-6 flex gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3.5 text-left shadow-sm"
        aria-label="Registration help"
      >
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a1 1 0 0 0 0 2v3a1 1 0 0 0 1 1h1a1 1 0 1 0 0-2v-3a1 1 0 0 0-1-1H9Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800">Need help?</p>
          <p className="mt-0.5 text-sm leading-relaxed text-slate-600">
            For any questions please email{" "}
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
        </div>
      </aside>
    </div>
  );
};

export default RegistrationStep;
