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
        className={`w-full rounded-md border bg-white px-3 py-2.5 text-left text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
          getError(name)
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
        }`}
      />
      {helperText && !getError(name) && (
        <p className="mt-1 text-left text-xs text-slate-500">{helperText}</p>
      )}
      {getError(name) && (
        <p className="mt-1 text-left text-sm text-red-500">{`${getError(name)}*`}</p>
      )}
    </div>
  );
};