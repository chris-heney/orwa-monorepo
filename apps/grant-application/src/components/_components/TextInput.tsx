import { useFormContext } from "react-hook-form";
import { ChangeEvent } from "react";
import { getError } from "../../helpers/getError";

interface InputProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  helperText?: string;
  requiredMessage?: string;
  transformInput?: (value: string) => string;
  maxLength?: number;
  validation?: any;
}

export const TextInput = ({
  name,
  label,
  type = "text",
  required = false,
  helperText,
  requiredMessage,
  transformInput, // very reusable
  maxLength,
  validation,
}: InputProps) => {
  const { register, setValue} = useFormContext();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;

    if (maxLength && value.length > maxLength) {
      value = value.slice(0, maxLength);
    }

    if (transformInput) {
      value = transformInput(value);
    }

    setValue(name, value);
  };

  return (
    <div className="mb-4">
      <label className="block mb-1 text-left text-sm font-semibold">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        {...register(name, {
          required: required ? `${label} ${requiredMessage ? requiredMessage : 'is required'}` : false,
          maxLength: maxLength ? { value: maxLength, message: `${label} cannot exceed ${maxLength} characters` } : undefined,
          ...validation,
        })}
        onChange={handleChange}
        className={`input-field text-left p-2 w-full border rounded-md focus:outline-none ${
          getError(name)
            ? "border-red-500 focus:ring-2 focus:ring-red-500"
            : "border-gray-300 focus:ring-2 focus:ring-blue-800"
        }`}
      />
      {helperText && !getError(name) && (
        <p className="text-gray-500 text-sm mt-1 text-left">{helperText}</p>
      )}
      {getError(name) && (
        <p className="text-red-500 text-sm mt-1 text-left">{`${getError(name)}*`}</p>
      )}
    </div>
  );
};