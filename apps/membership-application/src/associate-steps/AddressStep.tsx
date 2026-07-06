import {
    FormSection,
    SelectInput,
    TextInput,
    ZipCodeInput,
  } from "mj-react-form-builder";
  import { useFormContext } from "react-hook-form";
  import { stateOptions } from "../data/stateOptions";
  import { useMembershipsContext } from "../providers/MembershipContextProvider";
  
  const AddressStep = () => {
    const { watch } = useFormContext();
    const { memberships } = useMembershipsContext();
  
    if (!memberships) return;
  
    const physical_same_as_mailing = watch("physical_same_as_mailing");
  
    return (
      <div className="container mx-auto max-w-6xl px-4">
        <p className="text-red-600 text-xs md:text-sm text-left py-2">
          Fields marked with * are required
        </p>
        <FormSection title="Primary Mailing Address">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TextInput source="address_street" label="Street/PoBox" required />
            <TextInput source="address_city" label="City" required />
            <SelectInput
              source="address_state"
              label="State"
              options={stateOptions}
              required
              helperText="Choose from dropdown"
            />
            <ZipCodeInput source="address_zip" />
          </div>
        </FormSection>
        {!physical_same_as_mailing && (
          <FormSection title="Secondary Mailing Address">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TextInput
                source="mailing_address_street"
                label="Street/PoBox"
              />
              <TextInput source="mailing_address_city" label="City" />
              <SelectInput
                source="mailing_address_state"
                label="State"
                options={stateOptions}
                helperText="Choose from dropdown"
              />
              <TextInput source="mailing_address_zip" label="Zip Code" maxLength={5} />
            </div>
          </FormSection>
        )}
      </div>
    );
  };
  
  export default AddressStep;
  