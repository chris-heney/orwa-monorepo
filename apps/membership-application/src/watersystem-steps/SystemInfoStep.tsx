import {
  CheckboxInput,
  SelectInput,
  TextInput,
  ZipCodeInput,
  // ContactArrayInput,
  MultiSelectInput,
} from "mj-react-form-builder";
import { useFormContext } from "react-hook-form";
import { countyOptions } from "../data/countyOptions";
import { stateOptions } from "../data/stateOptions";
import currencyFormatter from "../helpers/currencyFormatter";
import { useMembershipsContext } from "../providers/MembershipContextProvider";
import SelectWatersystem from "../components/SelectWatersystemInput";
import ValidateSystemNameInput from "../components/ValidateSystemNameInput";
import FormSection from "../components/FormSection";

const SystemInfoStep = () => {

  const { watch, setValue } = useFormContext();
  const { memberships } = useMembershipsContext();

  const path = window.location.hash.substring(2); 

  if (!memberships) return;

  const watersystemMembership = (memberships ?? []).find(
    (membership) => membership.context === "Watersystem"
  );
  const connectionItems = (() => {
    const raw = watersystemMembership?.membership_items as
      | { price?: number; max_price?: number }[]
      | { data?: { price?: number; max_price?: number }[] }
      | null
      | undefined;
    if (raw == null) return [] as { price?: number; max_price?: number }[];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "object" && Array.isArray(raw.data)) return raw.data;
    return [];
  })();
  const connectionItem = connectionItems[0];
  const baseMembershipFee =
    watersystemMembership?.price != null
      ? Number(watersystemMembership.price)
      : null;
  const perConnectionPrice =
    connectionItem?.price != null ? Number(connectionItem.price) : null;
  const maxConnectionFee =
    connectionItem?.max_price != null ? Number(connectionItem.max_price) : null;

  const physical_same_as_mailing = watch("physical_same_as_mailing");

  const handlePhysicalSameAsMailingChange = (checked: boolean) => {
    if (checked) {
      setValue("address_mailing_pobox", watch("address_physical_line1"));
      setValue("address_mailing_city", watch("address_physical_city"));
      setValue("address_mailing_state", watch("address_physical_state"));
      setValue("address_mailing_zip", watch("address_physical_zip"));
    } else {
      setValue("mailing_address_street", "");
      setValue("mailing_address_line_two", "");
      setValue("mailing_address_city", "");
      setValue("mailing_address_state", "");
      setValue("mailing_address_zip", "");
    }
  };

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
      {/* Annual Dues summary from Strapi membership + membership_items */}
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
      <FormSection title="System Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectWatersystem />
          <SelectInput
            options={countyOptions}
            source="county"
            label="County"
            required
            helperText="IMPORTANT: COUNTY NAME YOUR SYSTEM IS LOCATED IN"
          />
          <SelectInput
            options={[
              { value: "RWC", label: "Rural Water Corporation" },
              { value: "RWD", label: "Rural Water District" },
              { value: "TN", label: "Town or Public Works Authority" },
            ]}
            source="member_type"
            label="Member Type"
            required
          />
          {path !== 'watersystem-renewal' && <ValidateSystemNameInput/>}
          <TextInput
            source="legal_entity_name"
            label="Legal System Name"
            helperText="Your systems legal name."
          />
          <MultiSelectInput
            source="system_type_dirty"
            label="System Type"
            options={[
              { value: "Pur", label: "Purchased" },
              { value: "Sur", label: "Surface" },
              { value: "Well", label: "Well" },
              { value: "Sew", label: "Sewer" },
            ]}
            required
            helperText="Select all that apply"
          />
          {/* <SelectInput
            source="region"
            label="Region"
            options={[
              { value: "Region 1", label: "Region 1" },
              { value: "Region 2", label: "Region 2" },
              { value: "Region 3", label: "Region 3" },
              { value: "Region 4", label: "Region 4" },
            ]}
            required
          /> */}
          <CheckboxInput
            source="funding"
            label="Rural Development Funded?"
            helperText="Are you funded by Rural Development?"
          />
        </div>
      </FormSection>
      <FormSection title="Physical Address">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TextInput source="address_physical_line1" label="Street" required />
          <TextInput source="address_physical_line2" label="Line Two" />
          <TextInput source="address_physical_city" label="City" required />
          <SelectInput
            source="address_physical_state"
            label="State"
            options={stateOptions}
            required
            helperText="Choose from dropdown"
          />
          <ZipCodeInput source="address_physical_zip" />
        </div>
        <CheckboxInput
          source="physical_same_as_mailing"
          label="Physical address same as mailing address"
          onChange={handlePhysicalSameAsMailingChange}
        />
      </FormSection>
      {!physical_same_as_mailing && (
        <FormSection title="Mailing Address">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TextInput
              source="address_mailing_pobox"
              label="Street/PoBox"
              required
            />
            <TextInput source="address_mailing_city" label="City" required />
            <SelectInput
              source="address_mailing_state"
              label="State"
              options={stateOptions}
              helperText="Choose from dropdown"
              required
            />
            <ZipCodeInput source="address_mailing_zip" />
          </div>
        </FormSection>
      )}
      {/* COntact Inputs */}
      {/* <FormSection title="System Contacts">
        <ContactArrayInput isArray source="contacts" label="Contacts" />
      </FormSection> */}
    </div>
  );
};

export default SystemInfoStep;
