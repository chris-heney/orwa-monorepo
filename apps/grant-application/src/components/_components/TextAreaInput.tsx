import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

interface TextAreaProps {
  name: string;
  label: string;
  rows?: number;
  required?: boolean;
  helperText?: string;
  maxCharCount?: number;
  maxRows?: number; // New prop for maximum rows
}

const TextAreaInput = ({
  name,
  label,
  rows = 4,
  required = false,
  helperText,
  maxCharCount,
  maxRows = 10,
}: TextAreaProps) => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  const [charCount, setCharCount] = useState(0);
  const [rowCount, setRowCount] = useState(0);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;

    const newRowCount = value.split("\n").length;

    if (newRowCount <= maxRows || newRowCount === rowCount) {
      setRowCount(newRowCount);
      setValue(name, value);
      setCharCount(value.length);
    } else {
      // Prevent adding more lines by preventing the default behavior of the event
      event.preventDefault();

      const trimmedValue = value.slice(0, value.lastIndexOf("\n"));
      setValue(name, trimmedValue);
      setCharCount(trimmedValue.length);
    }
  };

  // Determine the color based on how close the charCount is to the maxCharCount
  const getCharCountColor = () => {
    if (!maxCharCount) return "text-gray-500";
    const ratio = charCount / maxCharCount;
    if (ratio > 0.9) return "text-red-500";
    if (ratio > 0.75) return "text-orange-500";
    if (ratio > 0.5) return "text-yellow-500";
    return "text-gray-500";
  };

  return (
    <div className="mb-4">
      <label className="block mb-1 text-left text-sm font-semibold">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <textarea
        {...register(name, {
          required: required ? `${label} is required` : false,
          maxLength: maxCharCount
            ? {
                value: maxCharCount,
                message: `Maximum character count is ${maxCharCount}`,
              }
            : undefined,
        })}
        rows={rows}
        className={`input-field block w-full border rounded-md p-2 focus:outline-none ${
          errors[name]
            ? "border-red-500 focus:ring-2 focus:ring-red-500"
            : "border-gray-300 focus:ring-2 focus:ring-blue-800"
        }`}
        onChange={handleInputChange}
      />
      {maxCharCount && (
        <p className={`text-sm mt-1 text-left ${getCharCountColor()}`}>
          {charCount}/{maxCharCount} characters
        </p>
      )}
      <p className="text-sm mt-1 text-left text-gray-500">
        {rowCount}/{maxRows} rows
      </p>
      {helperText && !errors[name] && (
        <p className="text-gray-500 text-sm mt-1 text-left">{helperText}</p>
      )}
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1 text-left">{`${errors[name]?.message}*`}</p>
      )}
    </div>
  );
};

export { TextAreaInput };
