import { useFieldArray, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { TextInput } from "./TextInput";
import MaskedPhoneInput from "./MaskedPhoneInput";

interface ContactArrayProps {
  source: string;
  isArray?: boolean;
  label: string;
  helperText?: string;
  /** When set on an array field, Next/Submit fail until at least this many contacts exist. */
  minItems?: number;
}

const AnonymousEmailToggle = ({
  id,
  checked,
  onChange,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <label
    htmlFor={id}
    className="mb-3 flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
  >
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
    />
    <span>I do not have an email</span>
  </label>
);

export const ContactArray = ({
  source,
  isArray = false,
  label,
  helperText,
  minItems = 0,
}: ContactArrayProps) => {
  const {
    control,
    setValue,
    watch,
    getValues,
    register,
    formState: { errors },
  } = useFormContext();
  const [anonymousEmails, setAnonymousEmails] = useState<{
    [key: string]: boolean;
  }>({});

  // useFieldArray owns `source`, so min-length must register on a sibling field
  // (same pattern as SelectInput's register-only validation).
  const minCheckField = `${source}__min`;
  useEffect(() => {
    if (!isArray || minItems < 1) return;
    register(minCheckField, {
      validate: () => {
        const value = getValues(source);
        return (
          (Array.isArray(value) && value.length >= minItems) ||
          (minItems === 1
            ? "At least one additional contact is required"
            : `At least ${minItems} additional contacts are required`)
        );
      },
    });
  }, [getValues, isArray, minCheckField, minItems, register, source]);

  const handleAnonymousEmail = (path: string, isChecked: boolean) => {
    const firstName = watch(`${path}.first`) || "";
    const lastName = watch(`${path}.last`) || "";

    setAnonymousEmails((prev) => ({
      ...prev,
      [path]: isChecked,
    }));

    if (isChecked) {
      setValue(
        `${path}.email`,
        `anonymous+${String(firstName).trim()}${String(lastName).trim()}@orwa.org`
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
    const minCheckError = errors[minCheckField] as
      | { message?: string }
      | undefined;
    const arrayErrorMessage = minCheckError?.message;
    const canRemove = fields.length > Math.max(minItems, 0);

    return (
      <div className="text-left">
        <p className="text-sm font-semibold text-slate-800">
          {label}
          {minItems > 0 && <span className="ml-0.5 text-red-500">*</span>}
        </p>
        {helperText && (
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            {helperText}
          </p>
        )}

        <div className="mt-4 space-y-4">
          {fields.length === 0 && (
            <div
              className={`rounded-lg border border-dashed px-4 py-8 text-center ${
                arrayErrorMessage
                  ? "border-red-400 bg-red-50"
                  : "border-slate-300 bg-slate-50"
              }`}
            >
              <p className="text-sm font-medium text-slate-600">
                No additional contacts yet
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {minItems > 0
                  ? "Add at least one contact who should receive updates."
                  : "Optional — add anyone else who should receive updates."}
              </p>
            </div>
          )}

          {arrayErrorMessage && fields.length === 0 && (
            <p className="text-left text-sm text-red-500">{`${arrayErrorMessage}*`}</p>
          )}

          {fields.map((field, index) => {
            const path = `${source}[${index}]`;
            const isAnonymous = Boolean(anonymousEmails[path]);

            return (
              <div
                key={field.id}
                className="rounded-lg border border-slate-200 bg-slate-50/60 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-800">
                    Contact {index + 1}
                  </p>
                  {canRemove && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-sm font-medium text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                  <TextInput name={`${path}.first`} label="First Name" required />
                  <TextInput name={`${path}.last`} label="Last Name" required />
                  <TextInput name={`${path}.title`} label="Title" required />
                  <MaskedPhoneInput source={`${path}.phone`} />
                </div>

                <AnonymousEmailToggle
                  id={`anonymous-email-${index}`}
                  checked={isAnonymous}
                  onChange={(checked) => handleAnonymousEmail(path, checked)}
                />

                {!isAnonymous && (
                  <TextInput
                    name={`${path}.email`}
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
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() =>
            append({
              first: "",
              last: "",
              email: "",
              phone: "",
              title: "",
            })
          }
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Contact
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-4 text-left">
      <p className="text-sm font-semibold text-slate-800">{label}</p>
      {helperText && (
        <p className="mt-1 mb-3 text-xs leading-relaxed text-slate-500">
          {helperText}
        </p>
      )}
      {!helperText && <div className="mb-3" />}

      <TextInput
        name={`${source}.first`}
        label="First Name"
        required
        validation={{
          pattern: {
            value: /^[a-zA-Z]+$/,
            message: "First name cannot contain special characters or spaces",
          },
        }}
      />
      <TextInput
        name={`${source}.last`}
        label="Last Name"
        required
        validation={{
          pattern: {
            value: /^[a-zA-Z]+$/,
            message: "Last name cannot contain special characters or spaces",
          },
        }}
      />

      <AnonymousEmailToggle
        id={`anonymous-email-${source}`}
        checked={Boolean(anonymousEmails[source])}
        onChange={(checked) => handleAnonymousEmail(source, checked)}
      />

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
    </div>
  );
};
