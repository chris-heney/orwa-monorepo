import { NumberInput } from "mj-react-form-builder";
import FormSection from "../components/FormSection";
import { useMembershipsContext } from "../providers/MembershipContextProvider";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import currencyFormatter from "../helpers/currencyFormatter";
import { MembershipItem } from "../types";

/**
 * Strapi 5: membership_items is a flat array.
 * Legacy v4 populate nested as { data: [...] }.
 */
function resolveMembershipItems(
  items: MembershipItem[] | { data?: MembershipItem[] | null } | null | undefined
): MembershipItem[] {
  if (items == null) return [];
  if (Array.isArray(items)) return items;
  if (typeof items === "object" && Array.isArray(items.data)) return items.data;
  return [];
}

const MembershipInfo = () => {
  const { memberships } = useMembershipsContext();
  const { setValue, watch } = useFormContext();

  const meters = watch("meters");
  const feeConnections = watch("fee_connections");
  const feeMembership = watch("fee_membership");
  const feeScholarship = watch("fee_scholarship");

  const watersystemMembership = (memberships ?? []).find(
    (membership) => membership.context === "Watersystem"
  );
  const connectionItem = resolveMembershipItems(
    watersystemMembership?.membership_items
  )[0];
  const perConnectionPrice =
    connectionItem?.price != null ? Number(connectionItem.price) : null;
  const maxConnectionFee =
    connectionItem?.max_price != null ? Number(connectionItem.max_price) : null;
  const baseMembershipFee =
    watersystemMembership?.price != null
      ? Number(watersystemMembership.price)
      : null;

  useEffect(() => {
    if (
      watersystemMembership == null ||
      perConnectionPrice == null ||
      meters == null
    ) {
      return;
    }

    const metersCount = Number(meters) || 0;
    let connectionFee = perConnectionPrice * metersCount;

    if (maxConnectionFee != null && connectionFee > maxConnectionFee) {
      connectionFee = maxConnectionFee;
    }

    setValue("fee_connections", connectionFee);
    setValue("fee_membership", baseMembershipFee ?? 0);
  }, [
    meters,
    perConnectionPrice,
    maxConnectionFee,
    baseMembershipFee,
    watersystemMembership,
    setValue,
  ]);

  useEffect(() => {
    const scholarshipFee = isNaN(feeScholarship) ? 0 : feeScholarship || 0;
    const connectionFee = isNaN(feeConnections) ? 0 : feeConnections || 0;
    const membershipFee = isNaN(feeMembership) ? 0 : feeMembership || 0;

    setValue("payment_amount", scholarshipFee + connectionFee + membershipFee);
  }, [feeConnections, feeMembership, feeScholarship, setValue]);

  return (
    <div className="container mx-auto max-w-6xl px-4">
      <p className="py-2 text-left text-sm text-slate-600">
        Fields marked with <span className="font-semibold text-red-500">*</span>{" "}
        are required
      </p>
      <p className="mb-4 text-center text-sm text-slate-600">
        Annual Dues ={" "}
        <span className="font-semibold text-slate-900 tabular-nums">
          {currencyFormatter.format(baseMembershipFee ?? 0)}
        </span>{" "}
        membership fee +{" "}
        <span className="font-semibold text-slate-900 tabular-nums">
          {currencyFormatter.format(perConnectionPrice ?? 0)}
        </span>{" "}
        per connection (Maximum:{" "}
        {maxConnectionFee != null && baseMembershipFee != null && (
          <span className="font-semibold text-slate-900 tabular-nums">
            {currencyFormatter.format(maxConnectionFee + baseMembershipFee)}
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
            helperText={
              perConnectionPrice != null
                ? `× ${currencyFormatter.format(perConnectionPrice)} per connection`
                : "Loading connection rate…"
            }
          />
          <NumberInput
            source="fee_connections"
            label="Fee Connections"
            disabled
            helperText={
              baseMembershipFee != null
                ? `+ ${currencyFormatter.format(baseMembershipFee)} Base Membership Fee`
                : "Loading membership fee…"
            }
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
    </div>
  );
};

export default MembershipInfo;
