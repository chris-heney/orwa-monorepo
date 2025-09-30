import { useFormContext } from "react-hook-form";
import { ChangeEvent } from "react";

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
  defaultValue?: string;
  placeholder?: string;
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
  defaultValue,
  placeholder,
}: InputProps) => {
  const { register, setValue, formState: { errors } } = useFormContext();

  // Get error for this field
  const getFieldError = (fieldName: string) => {
    if (!fieldName || typeof fieldName !== 'string') {
      return null;
    }

    try {
      const errorPath = fieldName.split(".").reduce((acc, key) => {
        return acc?.[key] || acc?.[parseInt(key)] || {};
      }, errors as any);

      return errorPath?.message;
    } catch (error) {
      console.warn('Error accessing form errors for field:', fieldName, error);
      return null;
    }
  };

  const fieldError = getFieldError(name);

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
      <label className="block mb-2 text-left text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, {
          required: required ? `${label} ${requiredMessage ? requiredMessage : 'is required'}` : false,
          maxLength: maxLength ? { value: maxLength, message: `${label} cannot exceed ${maxLength} characters` } : undefined,
          ...validation,
        })}
        onChange={handleChange}
        className={`input-field text-left p-3 w-full border rounded-lg focus:outline-none bg-white transition-all duration-200 ${
          fieldError
            ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
        }`}
      />
      {helperText && !fieldError && (
        <p className="text-gray-500 text-sm mt-1 text-left">{helperText}</p>
      )}
      {fieldError && (
        <p className="text-red-500 text-sm mt-1 text-left">{`${fieldError}*`}</p>
      )}
    </div>
  );
};