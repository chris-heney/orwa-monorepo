import { useFormContext } from "react-hook-form";
import PaymentTypeOptions from "../components/_components/PaymentTypeOptions";
import CheckoutReciept from "../components/CheckoutReciept";
import CardForm from "../components/CardForm";
import {
  FormSection,
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

const BillingStep = () => {
  const { ConferenceOptions, ExtraOptions } = useRegistrationOptions();
  const { submitted } = useFormSubmitted();
  const { register, watch, setValue, getValues } = useFormContext();
  const paymentType = watch("paymentType");
  const registrationSource = useRegistrationSource();

  const {
    agency,
    member_status,
  } = getValues() as IRegistrationPayload;

  const totalAmount = 
    calculateSubtotal(
      getValues() as IRegistrationPayload,
      registrationSource,
      agency === "false" && member_status === "Non Member"
        ? ConferenceOptions.non_member_fee
        : 0,
      ExtraOptions
  );

  return submitted ? (
    <div className="h-screen p-3 flex justify-center items-center -mt-44">
      <div className="text-center">
        <div>
          <h1 className="text-3xl font-semibold text-green-700">
            Thank you for your submission!
          </h1>
          <p className="text-gray-800 mt-4">
            Your registration has been submitted successfully.
          </p>
          <p className="text-gray-800 mt-4">
            You will receive a confirmation email shortly.
          </p>
        </div>
      </div>
    </div>
  ) : (
    <div className="container mx-auto max-w-6xl px-6">
      {/* Review Section */}
      <div className="mb-6">
        <CheckoutReciept />
      </div>
      {/* Form Section with Checkout and Billing */}
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 md:gap-6">
          {/* Checkout Type Section */}
          <div className="col-span-1">
            {(totalAmount as unknown as number) > 0 && (
              <FormSection title="Checkout Type">
                <div className="flex flex-col space-y-4 mb-2">
                  <PaymentTypeOptions
                    {...register("paymentType")}
                    paymentType={"Card"}
                    checked={paymentType}
                    setRegistrationType={() => setValue("paymentType", "Card")}
                  />
                  <PaymentTypeOptions
                    {...register("paymentType")}
                    paymentType={"Invoice"}
                    checked={paymentType}
                    setRegistrationType={() =>
                      setValue("paymentType", "Invoice")
                    }
                  />
                </div>
              </FormSection>
            )}
            {/* Card Information */}
          </div>

          {/* Billing Information */}
          {(totalAmount as unknown as number) > 0 && <div className="col-span-2">
            <FormSection title="Billing Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </FormSection>
          </div>}
          <div className="col-span-1" />
          <div className="col-span-2">
            {paymentType === "Card" && <CardForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingStep;
