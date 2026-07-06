import { useEffect } from "react";
import { FormSection, MaskedPhoneInput, SelectInput, TextInput } from "mj-react-form-builder";
import { useFieldArray, useFormContext } from "react-hook-form";
import { stateOptions } from "../data/stateOptions";
import {
  WatersystemDirectoryContactRow,
  WatersystemDirectoryTitle,
} from "../types/WatersystemMebership";

const TITLE_OPTIONS: { value: WatersystemDirectoryTitle; label: string }[] = [
  { value: "Chairman", label: "Chairman" },
  { value: "Vice-Chairman", label: "Vice-Chairman" },
  { value: "Manager", label: "Manager" },
  { value: "Operator", label: "Operator" },
  { value: "Bookkeeper", label: "Bookkeeper" },
];

export const emptyDirectoryContactRow = (): WatersystemDirectoryContactRow => ({
  first: "",
  last: "",
  title: "",
  email: "",
  phone: "",
  address_mailing_line1: "",
  address_mailing_line2: "",
  address_mailing_city: "",
  address_mailing_state: "",
  address_mailing_zip: "",
});

const DirectoryContactsStep = () => {
  const { control, watch  } = useFormContext();
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "contacts",
  });

  // Ensure at least one row (defaultValues / entryPayload sometimes omit or clear `contacts`).
  useEffect(() => {
    if (fields.length === 0) {
      replace([emptyDirectoryContactRow()]);
    }
  }, [fields.length, replace]);

  const contactInfoEntered = (index: number) => {
    return !!watch(`contacts.${index}.first`) || !!watch(`contacts.${index}.last`) 
  }
  
  const firstNameEntered = (index: number) => {
    return !!watch(`contacts.${index}.first`);
  }

  return (
    <div className="container mx-auto max-w-6xl px-4">
      <div className="bg-amber-50 border border-amber-300 rounded-md p-4 mb-4 text-sm text-amber-950 text-left">
        <strong>Directory notice:</strong> Office information only will be published in the ORWA
        directory. If there are any changes, please notify ORWA in writing at{" "}
        <a href="mailto:office@orwa.org" className="font-semibold underline">
          office@orwa.org
        </a>
        .
      </div>
      <FormSection title="System Contacts">
        <div className="space-y-8 mb-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border border-gray-200 rounded-lg p-4 md:p-6 bg-gray-50/50 text-left"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Contact {index + 1}</h3>
                {fields.length > 1 && (
                  <button
                    type="button"
                    className="text-sm text-red-600 hover:underline"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectInput
                  options={TITLE_OPTIONS}
                  source={`contacts.${index}.title`}
                  label="Title"
                  helperText="Required if you enter any information for this contact"
                  required={firstNameEntered(index)}
                />
                <TextInput source={`contacts.${index}.first`} label="First name" />
                <TextInput source={`contacts.${index}.last`} label="Last name" required={firstNameEntered(index)}/>
                <MaskedPhoneInput source={`contacts.${index}.phone`} required={firstNameEntered(index)}/>
                <TextInput source={`contacts.${index}.email`} label="Email" required={firstNameEntered(index)}/>
              </div>
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-800 mb-3">Mailing address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <TextInput
                    source={`contacts.${index}.address_mailing_line1`}
                    label="Street / PO Box"
                    // required if contact information is entered
                    required={contactInfoEntered(index)}
                  />
                  <TextInput source={`contacts.${index}.address_mailing_city`} label="City" required={contactInfoEntered(index)} />
                  <SelectInput
                    options={stateOptions}
                    source={`contacts.${index}.address_mailing_state`}
                    label="State"
                    helperText="Choose from dropdown if entering an address"
                    required={contactInfoEntered(index)}
                  />
                  <TextInput
                    source={`contacts.${index}.address_mailing_zip`}
                    label="ZIP"
                    required={contactInfoEntered(index)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 w-full min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 min-w-0">
            <p className="order-2 sm:order-1 text-sm text-gray-600 text-left m-0 leading-normal [text-wrap:pretty] min-w-0 flex-1 sm:pr-2">
              List each office role separately. You can add more rows if needed.
            </p>
            <button
              type="button"
              className="order-1 sm:order-2 shrink-0 w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-md text-sm font-medium border-2 border-slate-700 text-slate-800 bg-white hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 whitespace-nowrap"
              onClick={() => append(emptyDirectoryContactRow())}
            >
              + Add another contact
            </button>
          </div>
        </div>
      </FormSection>
    </div>
  );
};

export default DirectoryContactsStep;
