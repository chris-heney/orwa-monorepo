import { FileInput, FormSection, NumberInput } from "mj-react-form-builder";
import { useMembershipsContext } from "../providers/MembershipContextProvider";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import currencyFormatter from "../helpers/currencyFormatter";

const ALLOWED_IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "svg", "webp"];
const ALLOWED_IMAGE_EXTENSIONS_LABEL = ALLOWED_IMAGE_EXTENSIONS.map((ext) =>
  ext.toUpperCase(),
).join(", ");

const validateImageFile = (file: File): string | true => {
  const isImageMime = file.type.startsWith("image/");
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const isAllowedExtension = ALLOWED_IMAGE_EXTENSIONS.includes(extension);

  if (!isImageMime || !isAllowedExtension) {
    return `Invalid file type. Please upload an image file (${ALLOWED_IMAGE_EXTENSIONS_LABEL}). Archives like .zip are not allowed.`;
  }

  return true;
};

const AssociateMembershipStep = () => {
  const { memberships } = useMembershipsContext();
  const { setValue, getValues, watch } = useFormContext();

  const associateMemberships = memberships.filter(
    (membership) => membership.context === "Associate",
  );

  // Update payment_amount based on the total cost
  useEffect(() => {
    setValue(
      "payment_amount",
      (getValues("fee_connections") || 0) +
        (getValues("fee_membership") || 0) +
        (getValues("fee_scholarship") || 0),
    );
  }, [
    watch("fee_connections"),
    watch("fee_membership"),
    watch("fee_scholarship"),
    watch("membership"),
  ]);

  const selectedMembership = watch("membership");

  return (
    <div className="container mx-auto max-w-6xl px-4">
      <FormSection title="Membership Info">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(selectedMembership === 2 || selectedMembership === 3) && (
            <FileInput
              source="primary_ad"
              label="Primary Ad"
              required
              validate={validateImageFile}
              helperText={`Premier Ad placement is included with your membership selection. Please upload your AD below as an image file (${ALLOWED_IMAGE_EXTENSIONS_LABEL}). Archives like .zip are not accepted. Failure to provide an AD will be interpreted as a decision NOT to participate in ORWA AD Placement Opportunities. ORWA and its associates retain the right to determine whether the provided AD is suitable for use. Inappropriate content, such as explicit or offensive material, will not be accepted.`}
            />
          )}
          <FileInput
            source="logo"
            label="Company Logo"
            required
            validate={validateImageFile}
            helperText={`Please upload your organization's logo as an image file (${ALLOWED_IMAGE_EXTENSIONS_LABEL}). Archives like .zip are not accepted. Failure to provide your organization's logo will result in its absence from printed/digital listings/publications offered.`}
          />
        </div>
      </FormSection>

      <FormSection title="Membership Packages Available">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
          {associateMemberships.map((membership) => (
            <div
              key={membership.id}
              className={`p-4 border rounded cursor-pointer ${
                selectedMembership === membership.id
                  ? "border-blue-500 bg-blue-100"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => {
                setValue("membership", membership.id);
                setValue("fee_membership", membership.price);
              }}
            >
              <div className="font-semibold">{membership.name}</div>
              <ul className="text-sm text-black list-disc text-left px-5 my-5">
                {membership.description?.split("\n").map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
              <div className="text-sm">
                {currencyFormatter.format(membership.price)}
              </div>
            </div>
          ))}
        </div>
        {/* Display validation error for membership selection */}
      </FormSection>

      {/* Optional Donation */}
      <FormSection title="Optional Donation">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumberInput
            source="fee_scholarship"
            label="Scholarship Fund"
            mask="currency"
          />
        </div>
        <p className="text-md text-center mb-4 italic">
          This support is a tax-deductible donation.
        </p>
      </FormSection>
    </div>
  );
};

export default AssociateMembershipStep;
