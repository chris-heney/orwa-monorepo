import { useFormContext } from "react-hook-form";
import { TextInput } from "./_components/TextInput";
import { CheckboxInput } from "./_components/CheckboxInput";
import { ContactArray } from "./_components/ContactArrayInput";
import { SelectInput } from "./_components/SelectInput";
import { NumberInput } from "./_components/NumberInput";
import { countyOptions } from "../data/countyOptions";
import FormSection from "./_components/FormSection";
import { stateOptions } from "../data/stateOptions";
import ZipCodeInput from "./_components/ZipCodeInput";

const SystemAndContactStep = () => {
  const { watch, setValue } = useFormContext();
  const physical_same_as_mailing = watch("physical_same_as_mailing");
  const has_engineer = watch("has_engineer");

  const handlePhysicalSameAsMailingChange = (checked: boolean) => {
    if (checked) {
      setValue("mailing_address_street", watch("physical_address_street"));
      setValue("mailing_address_line_two", watch("physical_address_line_two"));
      setValue("mailing_address_city", watch("physical_address_city"));
      setValue("mailing_address_state", watch("physical_address_state"));
      setValue("mailing_address_zip", watch("physical_address_zip"));
    } else {
      setValue("mailing_address_street", "");
      setValue("mailing_address_line_two", "");
      setValue("mailing_address_city", "");
      setValue("mailing_address_state", "");
      setValue("mailing_address_zip", "");
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
       {/* DEQ/ORWA Rural Infrastructure Grant (RIG) Application Form */}
       <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex-1 order-2 md:order-1 mb-4 md:mb-0">
          <h2 className="block mb-3 md:mb-5 text-left text-xl font-bold">
            DEQ/ORWA Rural Infrastructure Grant (RIG) Application Form
          </h2>
          <p className="text-gray-500 text-sm md:text-medium text-left">
            Maximum of $100,000 award to each recipient, with an 80/20 match
            requirement. For more information about this program, please contact{" "}
            <a href="mailto:rig@orwa.org" className="text-blue-600 underline">
              rig@orwa.org
            </a>
            . Documents you will need to submit (if applicable): any engineering
            reports related to your projects; DEQ notices of violation or consent
            orders related to your projects; project proposals/bids with the
            total project costs listed.
          </p>
          <p className="text-red-600 text-xs md:text-sm text-left py-2 md:py-5">
            Fields marked with * are required
          </p>
        </div>
        <div className="flex-shrink-0 w-full md:w-auto order-1 md:order-2">
          <img
            src="./rig.webp"
            alt="RIG Logo"
            className="w-60 h-auto md:w-40 md:ml-6 object-contain mx-auto md:mx-0 mb-5"
          />
        </div>
      </div>

      <FormSection title="System Information">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TextInput
            name="legal_entity_name"
            label="Public Water System Legal Name"
            required
          />
          <TextInput
            name="facility_id"
            label="DEQ Facility ID #"
            required
            helperText="PWSID (e.g. OK1234567 or facility id S123456)"
            requiredMessage="is required (e.g. OK1234567 or facility id S123456)"
          />
          <NumberInput
            name="population_served"
            label="Population Served"
            required
            wholeNumber
            max={10000}
            helperText="Population served by the public water system."
          />
          <SelectInput
            source="county"
            label="County"
            options={countyOptions}
            required
            helperText="Principal county served by the public water system. (select from dropdown)"
          />
        </div>
      </FormSection>

      <FormSection title="Physical Address">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TextInput name="physical_address_street" label="Street" required />
          <TextInput name="physical_address_line_two" label="Line Two" />
          <TextInput name="physical_address_city" label="City" required />
          <SelectInput
            source="physical_address_state"
            label="State"
            options={stateOptions}
            required
            helperText="Choose from dropdown"
          />
          <ZipCodeInput source="physical_address_zip" />
        </div>
        <CheckboxInput
          name="physical_same_as_mailing"
          label="Physical address same as mailing address"
          onChange={handlePhysicalSameAsMailingChange}
        />
      </FormSection>

      {!physical_same_as_mailing && (
        <FormSection title="Mailing Address">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TextInput name="mailing_address_street" label="Street/PoBox" required />
            <TextInput name="mailing_address_line_two" label="Line Two" />
            <TextInput name="mailing_address_city" label="City" required />
            <SelectInput
              source="mailing_address_state"
              label="State"
              options={stateOptions}
              helperText="Choose from dropdown"
              required
            />
            <ZipCodeInput source="mailing_address_zip" />
          </div>
        </FormSection>
      )}

      <FormSection title="Contacts">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ContactArray 
          source="point_of_contact" 
          label="Point Of Contact" 
          helperText="The person to contact for follow-up on the grant application and project oversight."
          />
          <ContactArray 
          source="chairman" 
          label="Chairman of the Board" 
          helperText="The chairman of the board of the public water system."
          />
          <div>
            <CheckboxInput
              name="has_engineer"
              label="Do you have an Engineer?"
            />
            {has_engineer && (
              <ContactArray 
              source="engineer" 
              label="Engineer" 
              helperText="The engineer for the public water system."
              />
            )}
          </div>
        </div>
      </FormSection>
    </div>
  );
};

export default SystemAndContactStep;
