import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  SelectInput,
  TextInput,
  ZipCodeInput,
  EmailInput,
  MaskedPhoneInput as _MaskedPhoneInput,
} from "mj-react-form-builder";
import { FormControlLabel, RadioGroup, Radio } from "@mui/material";
import PaymentTypeOptions from "../components/_components/PaymentTypeOptions";
import CheckoutReciept from "../components/CheckoutReciept";
import CardForm from "../components/CardForm";
import { stateOptions } from "../helpers/stateOptions";
import {
  useFormSubmitted,
  useRegistrationOptions,
  useRegistrationSource,
} from "../AppContextProvider";
import { calculateSubtotal } from "../helpers/calculateSubtotal";
import { IRegistrationPayload, ITicketPayload } from "../types/types";
import { ValidationHighlight } from "../helpers/validationHighlight";

// Type fix for React 19 compatibility
const MaskedPhoneInput = _MaskedPhoneInput as React.ComponentType<{
  source: string;
  required?: boolean;
}>;

const BillingStep = () => {
  const { ConferenceOptions, ExtraOptions } = useRegistrationOptions();
  const { submitted } = useFormSubmitted();
  const { register, watch, setValue, getValues } = useFormContext();
  const paymentType = watch("paymentType");
  const registrationSource = useRegistrationSource();

  const { agency, member_status } = getValues() as IRegistrationPayload;

  // Promotional Emails Consent is only relevant when this registration has
  // at least one Attendee ticket — never for Vendor-only or Contestant-only
  // checkouts.
  const tickets = (watch("tickets") as ITicketPayload[]) || [];
  const needsPromotionalEmailsConsent = tickets.some(
    (ticket) => ticket.type === "Attendee"
  );
  const promotionalEmailsConsent = watch("promotional_emails");

  const totalAmount = calculateSubtotal(
    getValues() as IRegistrationPayload,
    registrationSource,
    agency === "false" && member_status === "Non Member"
      ? ConferenceOptions.non_member_fee
      : 0,
    ExtraOptions
  );

  const hasCharge = (totalAmount as unknown as number) > 0;

  // Prefill billing contact from registrant when empty (Authorize.net billTo).
  useEffect(() => {
    const registrant = getValues("registrant") || {};
    const billingEmail = getValues("paymentData.billingAddress.email");
    const billingPhone = getValues("paymentData.billingAddress.phone");

    if (!billingEmail && registrant.email) {
      setValue("paymentData.billingAddress.email", registrant.email, {
        shouldDirty: false,
      });
    }
    if (!billingPhone && registrant.phone) {
      setValue("paymentData.billingAddress.phone", registrant.phone, {
        shouldDirty: false,
      });
    }
  }, [getValues, setValue]);

  return submitted ? (
    <div className="container mx-auto flex max-w-3xl items-center justify-center px-4 py-16">
      <div className="w-full rounded-lg border border-emerald-200 bg-emerald-50/60 px-6 py-10 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-emerald-800">
          Thank you for your submission!
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          Your registration has been submitted successfully.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          You will receive a confirmation email shortly.
        </p>
      </div>
    </div>
  ) : (
    <div className="container mx-auto max-w-3xl px-4 py-6 text-left">
      <header className="mb-6 border-b border-slate-200 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Billing &amp; Checkout
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Review your order, choose how you want to pay
          {hasCharge ? ", and enter your billing details" : ""}.
        </p>
      </header>

      <div className="mb-6">
        <CheckoutReciept />
      </div>

      <ValidationHighlight
        field="billing"
        className="p-1"
        clearWhen={Boolean(
          ((totalAmount as unknown as number) <= 0 || paymentType) &&
            watch("paymentData.billingAddress.email") &&
            watch("paymentData.billingAddress.phone") &&
            watch("paymentData.billingAddress.address") &&
            watch("paymentData.billingAddress.city") &&
            watch("paymentData.billingAddress.state") &&
            watch("paymentData.billingAddress.zip") &&
            (paymentType !== "Card" ||
              (watch("paymentData.cardNumber") &&
                watch("paymentData.expirationDate") &&
                watch("paymentData.cardCode")))
        )}
      >
        <div className="flex flex-col gap-6">
          {hasCharge && (
            <section className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Payment method
              </h3>
              <p className="mb-4 text-xs leading-relaxed text-slate-500">
                Select how you would like to complete this registration.
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <PaymentTypeOptions
                  {...register("paymentType")}
                  paymentType="Card"
                  checked={paymentType}
                  setRegistrationType={() => setValue("paymentType", "Card")}
                />
                <PaymentTypeOptions
                  {...register("paymentType")}
                  paymentType="Invoice"
                  checked={paymentType}
                  setRegistrationType={() =>
                    setValue("paymentType", "Invoice")
                  }
                />
              </div>
            </section>
          )}

          {hasCharge && (
            <section className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Billing contact
              </h3>
              <p className="mb-4 text-xs leading-relaxed text-slate-500">
                Sent with your payment to Authorize.net and used for billing
                questions. Prefills from the registration contact — change if
                needed.
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <EmailInput
                  source="paymentData.billingAddress.email"
                  label="Billing email"
                  required
                />
                <MaskedPhoneInput
                  source="paymentData.billingAddress.phone"
                  required
                />
              </div>
            </section>
          )}

          {hasCharge && (
            <section className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Billing address
              </h3>
              <p className="mb-4 text-xs leading-relaxed text-slate-500">
                Used for your receipt and payment processing.
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TextInput
                  source="paymentData.billingAddress.address"
                  label="Street"
                  required
                />
                <TextInput
                  source="paymentData.billingAddress.city"
                  label="City"
                  required
                />
                <SelectInput
                  source="paymentData.billingAddress.state"
                  label="State"
                  options={stateOptions}
                  helperText="Choose from dropdown"
                  required
                />
                <ZipCodeInput source="paymentData.billingAddress.zip" />
              </div>
            </section>
          )}

          {paymentType === "Card" && (
            <section className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Card details
              </h3>
              <p className="mb-4 text-xs leading-relaxed text-slate-500">
                Your card is charged securely when you submit.
              </p>
              <CardForm />
            </section>
          )}
        </div>
      </ValidationHighlight>

      {needsPromotionalEmailsConsent && (
        <ValidationHighlight
          field="promotional_emails"
          className="mt-6 rounded-lg border border-slate-200 bg-slate-50/80 p-4"
          clearWhen={promotionalEmailsConsent !== undefined}
        >
          <p className="mb-2 text-sm font-medium text-slate-800">
            Promotional Emails Consent <span className="text-red-500">*</span>
          </p>
          <RadioGroup
            name="promotional_emails"
            value={promotionalEmailsConsent ?? null}
            onChange={(e) =>
              setValue("promotional_emails", e.target.value === "true", {
                shouldDirty: true,
              })
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
          {promotionalEmailsConsent === undefined && (
            <p className="mt-1 text-xs text-red-500">Please select an option</p>
          )}
        </ValidationHighlight>
      )}
    </div>
  );
};

export default BillingStep;
