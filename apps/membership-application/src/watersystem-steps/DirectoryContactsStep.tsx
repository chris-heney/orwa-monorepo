import { useEffect } from "react";
import {
  CheckboxInput,
  MaskedPhoneInput,
  SelectInput,
  TextInput,
} from "mj-react-form-builder";
import FormSection from "../components/FormSection";
import { useFieldArray, useFormContext } from "react-hook-form";
import { stateOptions } from "../data/stateOptions";
import {
  WatersystemDirectoryContactRow,
  WatersystemDirectoryTitle,
} from "../types/WatersystemMebership";
import { ValidationHighlight } from "../helpers/validationHighlight";

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
  directory_opt_out: false,
});

const DirectoryContactsStep = () => {
  const { control, watch } = useFormContext();
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
    return !!watch(`contacts.${index}.first`) || !!watch(`contacts.${index}.last`);
  };

  const firstNameEntered = (index: number) => {
    return !!watch(`contacts.${index}.first`);
  };

  return (
    <div className="container mx-auto max-w-6xl px-4">
      <aside className="mb-5 overflow-hidden rounded-xl border border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-sky-50/70 text-left shadow-sm">
        <div className="flex gap-4 p-4 md:p-5">
          <div
            className="mt-1 hidden h-12 w-1 shrink-0 rounded-full bg-sky-700 sm:block"
            aria-hidden
          />
          <div className="min-w-0 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-900/75">
              ORWA Membership Directory
            </p>
            <p className="text-sm leading-relaxed text-slate-700 [text-wrap:pretty]">
              System and contact information entered on this page will be
              published in the ORWA directory.
            </p>
            <p className="text-sm leading-relaxed text-slate-600 [text-wrap:pretty]">
              If you do not want a system contact to appear, choose{" "}
              <span className="font-semibold text-slate-800">
                Opt out of directory
              </span>{" "}
              on that contact below.
            </p>
            <p className="text-xs leading-relaxed text-slate-500">
              Questions or updates? Notify ORWA in writing at{" "}
              <a
                href="mailto:office@orwa.org"
                className="font-medium text-sky-900 underline decoration-sky-300 underline-offset-2 transition hover:text-sky-950"
              >
                office@orwa.org
              </a>
              .
            </p>
          </div>
        </div>
      </aside>

      <ValidationHighlight field="directory_contacts">
        <FormSection title="System Contacts">
          <div className="space-y-8 mb-2">
            {fields.map((field, index) => {
              const optedOut = !!watch(`contacts.${index}.directory_opt_out`);
              return (
                <div
                  key={field.id}
                  className={`rounded-lg border p-4 text-left transition md:p-6 ${
                    optedOut
                      ? "border-slate-300 bg-slate-100/70"
                      : "border-slate-200 bg-slate-50/50"
                  }`}
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <h3 className="text-base font-semibold text-slate-900">
                        Contact {index + 1}
                      </h3>
                      {optedOut && (
                        <span className="rounded-md border border-slate-300 bg-white px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                          Not published
                        </span>
                      )}
                    </div>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        className="text-sm font-semibold text-red-600 transition hover:text-red-700 hover:underline"
                        onClick={() => remove(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div
                    className={`mb-5 rounded-lg border px-3 py-3 transition ${
                      optedOut
                        ? "border-slate-400 bg-white shadow-sm"
                        : "border-slate-200 bg-white/80 hover:border-slate-300 hover:bg-white"
                    }`}
                  >
                    <CheckboxInput
                      source={`contacts.${index}.directory_opt_out`}
                      label="Opt out of directory"
                      helperText="Keep this contact on file for ORWA, but do not publish them in the membership directory."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectInput
                      options={TITLE_OPTIONS}
                      source={`contacts.${index}.title`}
                      label="Title"
                      helperText="Required if you enter any information for this contact"
                      required={firstNameEntered(index)}
                    />
                    <TextInput
                      source={`contacts.${index}.first`}
                      label="First name"
                    />
                    <TextInput
                      source={`contacts.${index}.last`}
                      label="Last name"
                      required={firstNameEntered(index)}
                    />
                    <MaskedPhoneInput
                      source={`contacts.${index}.phone`}
                      required={firstNameEntered(index)}
                    />
                    <TextInput
                      source={`contacts.${index}.email`}
                      label="Email"
                      required={firstNameEntered(index)}
                    />
                  </div>
                  <div className="mt-6">
                    <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Mailing address
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <TextInput
                        source={`contacts.${index}.address_mailing_line1`}
                        label="Street / PO Box"
                        required={contactInfoEntered(index)}
                      />
                      <TextInput
                        source={`contacts.${index}.address_mailing_city`}
                        label="City"
                        required={contactInfoEntered(index)}
                      />
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
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200 w-full min-w-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 min-w-0">
              <p className="order-2 sm:order-1 text-sm text-slate-600 text-left m-0 leading-normal [text-wrap:pretty] min-w-0 flex-1 sm:pr-2">
                List each office role separately. You can add more rows if needed.
              </p>
              <button
                type="button"
                className="order-1 sm:order-2 inline-flex w-full shrink-0 items-center justify-center whitespace-nowrap rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:w-auto"
                onClick={() => append(emptyDirectoryContactRow())}
              >
                + Add another contact
              </button>
            </div>
          </div>
        </FormSection>
      </ValidationHighlight>
    </div>
  );
};

export default DirectoryContactsStep;
