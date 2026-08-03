import { FormSection, ContactArrayInput } from "mj-react-form-builder";
import { useMembershipsContext } from "../providers/MembershipContextProvider";

const AssociateContactInfoStep = () => {
  const { memberships } = useMembershipsContext();

  if (!memberships) return;

  return (
    <div className="container mx-auto max-w-6xl px-4">
      <p className="py-2 text-left text-sm text-slate-600">
        Fields marked with <span className="font-semibold text-red-500">*</span>{" "}
        are required
      </p>
      {/* COntact Inputs */}
      <FormSection title="Point of Contacts">
        <p className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-left text-sm leading-relaxed text-blue-800">
          Only the Primary Contact information will be included in the ORWA
          directory and the ORWA website Associate Member listing page.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
          <ContactArrayInput source="contact_primary" label="Primary Contact" required/>
          <ContactArrayInput
            source="contact_secondary"
            label="Secondary Contact"
          />
        </div>
      </FormSection>
    </div>
  );
};

export default AssociateContactInfoStep;
