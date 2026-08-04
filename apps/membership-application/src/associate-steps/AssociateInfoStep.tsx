import {
  TextInput,
  SelectInput,
  MaskedPhoneInput,
} from "mj-react-form-builder";
import { useMembershipsContext } from "../providers/MembershipContextProvider";
import { assoociateCategoryOptions } from "../types/AssociateMembership";
import SelectAssociateInput from "../components/SelectAssociateInput";
import ValidateAssociateNameInput from "../components/ValidateAssociateNameInput";
import FormSection from "../components/FormSection";

const AssociateInfoStep = () => {
  const { memberships } = useMembershipsContext();

  const path = window.location.hash.substring(2);

  if (!memberships) return;

  return (
    <div className="container mx-auto max-w-6xl px-4">
      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-left text-sm leading-relaxed text-blue-800">
        If you've already submitted a membership form to be invoiced, no need to submit it again. Just give the ORWA office a call at{" "}
        <a href="tel:405-672-8925" className="font-semibold underline">405-672-8925</a> to make a credit card payment.
      </div>
      <p className="py-2 text-left text-sm text-slate-600">
        Fields marked with <span className="font-semibold text-red-500">*</span>{" "}
        are required
      </p>
      <FormSection title="Associate Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectAssociateInput />
          {path !== "associate-renewal" && <ValidateAssociateNameInput />}
          <SelectInput
            options={assoociateCategoryOptions}
            source="category"
            label="Category"
            helperText="Please check ONE category that applies to your company's products and/or services. This information is for your free listing and ORWA Service Offerings."
          />
          <TextInput source="website" label="Website" />
          <TextInput source="email" label="Email" required />
          <MaskedPhoneInput source="phone" required />
          <SelectInput
            options={[
              { value: "Mail", label: "Mail" },
              { value: "Digital", label: "Digital" },
              { value: "Both", label: "Both" },
              { value: "None", label: "None" },
            ]}
            required
            source="membership_directory_type"
            label="How would you like to receive the ORWA Membership Directory?"
          />
          {/* <SelectInput
            options={[
              { value: "Mail", label: "Mail" },
              { value: "Digital", label: "Digital" },
              { value: "Both", label: "Both" },
              { value: "None", label: "None" },
            ]}
            source="annual_report_type"
            label="How would you like to receive the ORWA Annual Report?"
            required
          /> */}
        </div>
      </FormSection>
    </div>
  );
};

export default AssociateInfoStep;
