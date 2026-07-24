import { useFormContext } from "react-hook-form";
import { TextInput } from "./_components/TextInput";
import { CheckboxInput } from "./_components/CheckboxInput";
import { ContactArray } from "./_components/ContactArrayInput";
import { SelectInput } from "./_components/SelectInput";
import { NumberInput } from "./_components/NumberInput";
import { countyOptions } from "../data/countyOptions";
import FormSection from "./_components/FormSection";
import StepShell from "./_components/StepShell";
import { stateOptions } from "../data/stateOptions";
import ZipCodeInput from "./_components/ZipCodeInput";
import { ValidationHighlight } from "../helpers/validationHighlight";

const SystemAndContactStep = () => {
  const { watch, setValue } = useFormContext();
  const physical_same_as_mailing = watch("physical_same_as_mailing");
  const has_engineer = watch("has_engineer");
  const additionalContacts = watch("additional_contacts") || [];

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
    <StepShell
      title="System & Contacts"
      description={
        <>
          <p>
            Maximum of $100,000 award to each recipient, with an 80/20 match
            requirement. For more information, contact{" "}
            <a
              href="mailto:rig@orwa.org"
              className="font-medium text-blue-600 hover:underline"
            >
              rig@orwa.org
            </a>
            .
          </p>
          <p className="mt-2 text-xs text-slate-500">
            You may need engineering reports, DEQ notices/consent orders, and
            project proposals/bids. Fields marked with{" "}
            <span className="font-semibold text-red-600">*</span> are required.
          </p>
        </>
      }
      aside={
        <img
          src="./rig.webp"
          alt="RIG Logo"
          className="mx-auto h-auto w-36 object-contain sm:mx-0 sm:w-40"
        />
      }
    >
      <ValidationHighlight
        field="system"
        clearWhen={Boolean(
          watch("legal_entity_name") &&
            watch("facility_id") &&
            watch("population_served") &&
            watch("county")
        )}
      >
        <FormSection
          title="System information"
          description="Identify the public water system applying for this grant."
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              helperText="Principal county served (select from dropdown)"
            />
          </div>
        </FormSection>
      </ValidationHighlight>

      <ValidationHighlight
        field="physical_address"
        clearWhen={Boolean(
          watch("physical_address_street") &&
            watch("physical_address_city") &&
            watch("physical_address_state") &&
            watch("physical_address_zip")
        )}
      >
        <FormSection title="Physical address">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
      </ValidationHighlight>

      {!physical_same_as_mailing && (
        <ValidationHighlight
          field="mailing_address"
          clearWhen={Boolean(
            watch("mailing_address_street") &&
              watch("mailing_address_city") &&
              watch("mailing_address_state") &&
              watch("mailing_address_zip")
          )}
        >
          <FormSection title="Mailing address">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextInput
                name="mailing_address_street"
                label="Street/PoBox"
                required
              />
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
        </ValidationHighlight>
      )}

      <ValidationHighlight
        field="contacts"
        clearWhen={Boolean(
          watch("point_of_contact.first") &&
            watch("point_of_contact.last") &&
            watch("point_of_contact.email") &&
            watch("chairman.first") &&
            watch("chairman.last")
        )}
      >
        <FormSection
          title="Primary contacts"
          description="Point of contact and board chair are required. Engineer is optional."
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ContactArray
              source="point_of_contact"
              label="Point of contact"
              helperText="Person for follow-up on the grant application and project oversight."
            />
            <ContactArray
              source="chairman"
              label="Chairman of the board"
              helperText="Chairman of the board of the public water system."
            />
          </div>
          <div className="mt-4">
            <CheckboxInput
              name="has_engineer"
              label="Do you have an engineer?"
            />
            {has_engineer && (
              <ContactArray
                source="engineer"
                label="Engineer"
                helperText="Engineer for the public water system."
              />
            )}
          </div>
        </FormSection>
      </ValidationHighlight>

      <ValidationHighlight
        field="additional_contacts"
        clearWhen={true}
      >
        <FormSection
          title="Additional contacts"
          description="Optional — add as many people as needed who should be able to follow up on this application (they can also request an edit link by email)."
        >
          <ContactArray
            source="additional_contacts"
            isArray
            label={`Additional contacts${
              additionalContacts.length
                ? ` (${additionalContacts.length})`
                : ""
            }`}
            helperText="Include title, phone, and email for each person."
          />
        </FormSection>
      </ValidationHighlight>
    </StepShell>
  );
};

export default SystemAndContactStep;
