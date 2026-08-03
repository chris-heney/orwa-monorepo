import { FormSection, NumberInput } from "mj-react-form-builder";
import { useMembershipsContext } from "../providers/MembershipContextProvider";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import currencyFormatter from "../helpers/currencyFormatter";

const MembershipInfo = () => {
  const { memberships } = useMembershipsContext();
  const { setValue, getValues } = useFormContext();

  const currentMembership = memberships.filter((membership) => {
    return membership.context === "Watersystem";
  });

  useEffect(() => {
    if (
      !currentMembership ||
      !currentMembership[0] ||
      !currentMembership[0].membership_items?.[0]?.max_price
    )
      return;

    // Calculate the fee_connection based on the number of meters
    setValue("fee_connections", 0.9 * getValues("meters"));

    // set fee_membership to the current membership price
    setValue("fee_membership", currentMembership[0].price);


    // Ensure max_price check is valid
    if (
      getValues("fee_connections") >
      currentMembership[0]?.membership_items?.[0]?.max_price
    ) {
      setValue("fee_connections", 4000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValues("meters")]);

  // Update payment_amount based on the total cost
  useEffect(() => {

    const scholarshipFee = isNaN(getValues("fee_scholarship")) ? 0 : getValues("fee_scholarship");
    const connectionFee = isNaN(getValues("fee_connections")) ? 0 : getValues("fee_connections");
    const membershipFee = isNaN(getValues("fee_membership")) ? 0 : getValues("fee_membership");

    const total = scholarshipFee + connectionFee + membershipFee;

    setValue("payment_amount", total);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValues("fee_connections"), getValues("fee_membership"),getValues("fee_scholarship")]);

  return (
    <div className="container mx-auto max-w-6xl px-4">
      <p className="py-2 text-left text-sm text-slate-600">
        Fields marked with <span className="font-semibold text-red-500">*</span>{" "}
        are required
      </p>
      <p className="mb-4 text-center text-sm text-slate-600">
        Annual Dues ={" "}
        <span className="font-semibold text-slate-900 tabular-nums">
          {currencyFormatter.format(currentMembership[0]?.price)}
        </span>{" "}
        membership fee +{" "}
        <span className="font-semibold text-slate-900 tabular-nums">
          {currencyFormatter.format(
            currentMembership[0]?.membership_items?.[0]?.price as number
          )}
        </span>{" "}
        per connection (Maximum:{" "}
        {currentMembership && currentMembership[0]?.membership_items?.[0]?.max_price && currentMembership[0]?.price && (
          <span className="font-semibold text-slate-900 tabular-nums">
            {currencyFormatter.format(
              (currentMembership[0]?.membership_items?.[0]?.max_price + currentMembership[0]?.price) as number
            )}
          </span>
        )}
        )
      </p>
      <FormSection title="Membership Info">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumberInput
            source="meters"
            label="Number of connection"
            required
            helperText="x $0.90 per connection"
          />
          <NumberInput
            source="fee_connections"
            label="Fee Connections"
            disabled
            helperText="+ $90.00 Base Membership Fee"
            mask="currency"
          />
          <NumberInput
            source="fee_membership"
            label="Membership Fee"
            disabled
            mask="currency"
          />
        </div>
      </FormSection>

      {/* Optional Donation */}

      <FormSection title="Optional Donation">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumberInput
            source="fee_scholarship"
            label="Scholarship Fund"
            mask="currency"
            min={0}
          />
         
        </div>

        <p className="mb-4 text-center text-sm italic text-slate-600">
          This support is a tax deductible donation.
        </p>
      </FormSection>

      {/* Total Cost */}
    </div>
  );
};

export default MembershipInfo;
