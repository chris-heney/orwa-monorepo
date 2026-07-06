import {
  FormSection,
  MaskedPhoneInput,
  SelectInput,
  TextInput,
  ZipCodeInput,
} from "mj-react-form-builder";
import { useFormContext } from "react-hook-form";
import PaymentTypeOptions from "../components/PaymentTypesOptions";
import CardForm from "../components/CardForm";
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
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Membership Information */}
            <div className="border-r border-gray-200 pr-6">
              <h3 className="text-xl font-semibold text-green-700 mb-4 text-left">
                {
                  memberships.find(
                    (membership) => membership.id === getValues("membership")
                  )?.name
                }{" "}
                Membership
              </h3>
              <hr className="border-gray-200 mb-4" />
              <div className="space-y-2">
                <p className="text-gray-800 text-left">
                  <strong>Membership Dues:</strong>{" "}
                  {currencyFormatter.format(getValues("fee_membership"))}
                </p>
              </div>
            </div>

            {/* Donation Information */}
            <div className="pl-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-4 text-left">
                Donation Information
              </h3>
              <hr className="border-gray-200 mb-4" />
              <div className="space-y-2">
                <p className="text-gray-800 text-left">
                  <strong>ORWEF Scholarship Fund:</strong>{" "}
                  {currencyFormatter.format(getValues("fee_scholarship"))}
                </p>
                <p className="text-sm text-gray-500 text-left">
                  This support is a tax deductible donation.
                </p>
              </div>
            </div>
          </div>
          <hr className="border-gray-200 my-6" />
          <p className="text-gray-800 text-left font-semibold">
            <strong>Total Fee:</strong>{" "}
            <span className="text-red-500">
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
