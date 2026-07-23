import { useFormContext } from "react-hook-form";
import PaymentTypeOptions from "../components/_components/PaymentTypeOptions";
import CheckoutReciept from "../components/CheckoutReciept";
import CardForm from "../components/CardForm";
import {
  SelectInput,
  TextInput,
  ZipCodeInput,
} from "mj-react-form-builder";
import { stateOptions } from "../helpers/stateOptions";
import {
  useFormSubmitted,
  useRegistrationOptions,
  useRegistrationSource,
} from "../AppContextProvider";
import { calculateSubtotal } from "../helpers/calculateSubtotal";
import { IRegistrationPayload } from "../types/types";
import { ValidationHighlight } from "../helpers/validationHighlight";

const BillingStep = () => {
  const { ConferenceOptions, ExtraOptions } = useRegistrationOptions();
  const { submitted } = useFormSubmitted();
  const { register, watch, setValue, getValues } = useFormContext();
  const paymentType = watch("paymentType");
  const registrationSource = useRegistrationSource();

  const { agency, member_status } = getValues() as IRegistrationPayload;

  const totalAmount = calculateSubtotal(
    getValues() as IRegistrationPayload,
    registrationSource,
    agency === "false" && member_status === "Non Member"
      ? ConferenceOptions.non_member_fee
      : 0,
    ExtraOptions
  );

  const hasCharge = (totalAmount as unknown as number) > 0;

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
    </div>
  );
};

export default BillingStep;
