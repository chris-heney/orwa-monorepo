import {
  MaskedPhoneInput,
  SelectInput,
  TextInput,
  ZipCodeInput,
} from "mj-react-form-builder";
import { useFormContext } from "react-hook-form";
import PaymentTypeOptions from "../components/PaymentTypesOptions";
import CardForm from "../components/CardForm";
import FormSection from "../components/FormSection";
import { stateOptions } from "../data/stateOptions";
import currencyFormatter from "../helpers/currencyFormatter";
import {
  useFormSubmittedContext,
  useMembershipsContext,
} from "../providers/MembershipContextProvider";
import { useEffect } from "react";

const AssociateReviewStep = () => {
  const { getValues, register, setValue, watch } = useFormContext();
  const paymentType = watch("payment_method");
  const { isFormSubmitted } = useFormSubmittedContext();
  const { memberships } = useMembershipsContext();

  useEffect(() => {

    const total = getValues("fee_membership") + getValues("fee_scholarship");

    setValue("payment_amount", total);

  }, [getValues("fee_membership"), getValues("fee_scholarship")]);

  return isFormSubmitted ? (
    <></>
  ) : (
    <div className="container mx-auto max-w-6xl px-4">
      {/* Review Section */}
      <FormSection title="Review">
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Membership Information */}
            <div className="md:border-r md:border-slate-200 md:pr-6">
              <h3 className="mb-3 text-left text-sm font-semibold uppercase tracking-wide text-slate-500">
                {
                  memberships.find(
                    (membership) => membership.id === getValues("membership")
                  )?.name
                }{" "}
                Membership
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-left text-slate-700">
                  <strong className="text-slate-900">Membership Dues:</strong>{" "}
                  <span className="tabular-nums">
                    {currencyFormatter.format(getValues("fee_membership"))}
                  </span>
                </p>
              </div>
            </div>

            {/* Donation Information */}
            <div className="md:pl-6">
              <h3 className="mb-3 text-left text-sm font-semibold uppercase tracking-wide text-slate-500">
                Donation Information
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-left text-slate-700">
                  <strong className="text-slate-900">ORWEF Scholarship Fund:</strong>{" "}
                  <span className="tabular-nums">
                    {currencyFormatter.format(getValues("fee_scholarship"))}
                  </span>
                </p>
                <p className="text-left text-sm text-slate-500">
                  This support is a tax deductible donation.
                </p>
              </div>
            </div>
          </div>
          <hr className="my-6 border-slate-200" />
          <p className="text-left text-base text-slate-900">
            <strong>Total Fee:</strong>{" "}
            <span className="text-lg font-bold tabular-nums text-blue-700">
              {currencyFormatter.format(getValues("payment_amount"))}
            </span>
          </p>
        </div>
      </FormSection>
      {/* Form Section with Checkout and Billing */}
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Checkout Type Section */}
          <div className="col-span-1">
            <FormSection title="Checkout Type">
              <div className="flex flex-col space-y-4 mb-2">
                <PaymentTypeOptions
                  {...register("payment_method")}
                  paymentType={"Card"}
                  checked={paymentType}
                  setRegistrationType={() => setValue("payment_method", "Card")}
                />
                <PaymentTypeOptions
                  {...register("payment_method")}
                  paymentType={"Invoice"}
                  checked={paymentType}
                  setRegistrationType={() =>
                    setValue("payment_method", "Invoice")
                  }
                />
              </div>
            </FormSection>
            {/* Card Information */}
            {paymentType === "Card" && (
              <CardForm source="payment_information" />
            )}
          </div>

          {/* Billing Information */}
          <div className="col-span-2">
            <FormSection title="Billing Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput source="billing_email" label="Email" required />
                <MaskedPhoneInput source="billing_phone" required />
                    <TextInput
                      source="billing_first_name"
                      label="First Name"
                      required
                    />
                    <TextInput
                      source="billing_last_name"
                      label="Last Name"
                      required
                    />
                     <TextInput
                      source="address_billing_line1"
                      label="Street"
                      required
                    />
                    <TextInput
                      source="address_billing_city"
                      label="City"
                      required
                    />
                    <SelectInput
                      source="address_billing_state"
                      label="State"
                      options={stateOptions}
                      helperText="Choose from dropdown"
                    />
                    <ZipCodeInput source="address_billing_zip" />
              </div>
            </FormSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssociateReviewStep;
