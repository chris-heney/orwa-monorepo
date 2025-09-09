import { useFieldArray, useFormContext } from "react-hook-form";
import { useState } from "react";
import { TextInput } from "./TextInput";
import MaskedPhoneInput from "./MaskedPhoneInput";

interface ContactArrayProps {
  source: string;
  isArray?: boolean;
  label: string;
  helperText?: string;
}

export const ContactArray = ({
  source,
  isArray = false,
  label,
  helperText,
}: ContactArrayProps) => {
  const { control, setValue, watch } = useFormContext();
  const [anonymousEmails, setAnonymousEmails] = useState<{ [key: string]: boolean }>({});

  const handleAnonymousEmail = (path: string, isChecked: boolean) => {
    const firstName = watch(`${path}.first`);
    const lastName = watch(`${path}.last`);

    setAnonymousEmails((prev) => ({
      ...prev,
      [path]: isChecked,
    }));

    if (isChecked) {
      setValue(
        `${path}.email`,
        `anonymous+${firstName.trim()}${lastName.trim()}@orwa.org`
      );
    } else {
      setValue(`${path}.email`, "");
    }
  };

  if (isArray) {
    const { fields, append, remove } = useFieldArray({
      control,
      name: source,
    });

    return (
      <div>
        <p className="text-left text-lg font-semibold">{label}</p>
        <hr className="my-4 text-black bg-black" />
        {fields.map((field, index) => (
          <div key={field.id} className="border p-4 mb-4 rounded-md">
            <TextInput
              name={`${source}[${index}].first`}
              label="First Name"
              required
            />
            <TextInput
              name={`${source}[${index}].last`}
              label="Last Name"
              required
            />
            <div className="flex just">
              <input
                type="checkbox"
                id={`anonymous-email-${index}`}
                onChange={(e) => handleAnonymousEmail(`${source}[${index}]`, e.target.checked)}
              />
              <label htmlFor={`anonymous-email-${index}`} className="ml-2">
                Don't have an email
              </label>
            </div>
            {!anonymousEmails[`${source}[${index}]`] && (
              <TextInput
                name={`${source}[${index}].email`}
                label="Email"
                type="email"
                required
              />
            )}
            <MaskedPhoneInput source={`${source}[${index}].phone`} />
            <button
              type="button"
              onClick={() => remove(index)}
              className="mt-2 bg-red-500 text-white p-2 rounded-md"
            >
              Remove Contact
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ first: "", last: "", email: "", phone: "" })}
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          Add Contact
        </button>
        <p className="text-sm text-gray-500 text-left">{helperText}</p>
      </div>
    );
  } else {
    return (
      <div className="p-4 mb-4 rounded-md">
        <p className="text-left text-lg font-semibold">{label}</p>
        <hr className="my-2" />
        {/* They cannot enter any special characters in the first or last name or a space at the beginning or end */}
        <TextInput name={`${source}.first`} label="First Name" required validation={{
          pattern: {
            value: /^[a-zA-Z]+$/,
            message: "First name cannot contain special characters or spaces",
          },
        }}/>
        <TextInput name={`${source}.last`} label="Last Name" required validation={{
          pattern: {
            value: /^[a-zA-Z]+$/,
            message: "Last name cannot contain special characters or spaces",
          },
        }}/>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="anonymous-email"
            onChange={(e) =>
              handleAnonymousEmail(source, e.target.checked)
            }
          />
          <label htmlFor="anonymous-email" className="ml-2">
            Don't have an email
          </label>
        </div>
        {!anonymousEmails[source] && (
          <TextInput
            name={`${source}.email`}
            label="Email"
            type="email"
            required
            validation={{
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            }}
          />
        )}
        <MaskedPhoneInput source={`${source}.phone`} />
        <TextInput name={`${source}.title`} label="Title" required />
        <p className="text-sm text-gray-500 text-left">{helperText}</p>
      </div>
    );
  }
};