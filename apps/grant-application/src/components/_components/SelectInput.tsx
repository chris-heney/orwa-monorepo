import { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";

interface SelectInputProps {
  source: string;
  label: string;
  options: { value: string; label: string }[];
  required?: boolean;
  helperText?: string;
  requiredMessage?: string;
  onChange?: (value: string) => void;
}

export const SelectInput = ({
  source,
  label,
  options,
  required = false,
  helperText,
  requiredMessage,
  onChange,
}: SelectInputProps) => {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Register the input with react-hook-form
  useEffect(() => {
    register(source, {
      required: required ? `${label} ${requiredMessage ? requiredMessage : 'is required'}` : false,
    });
  }, [register, source, required, requiredMessage, label]);

  const selectedValue = getValues(source);

  const handleSelectClick = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (value: string) => {
    setValue(source, value);
    if (onChange) {
      onChange(value);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="mb-6 relative" ref={dropdownRef}>
      <label className="block mb-1 text-left text-sm font-bold">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <div
          className={`block w-full px-3 py-2 border rounded-md shadow-sm bg-white text-gray-900 cursor-pointer focus:outline-none focus:ring-2 ${
            errors[source]
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
          onClick={handleSelectClick}
        >
          <div className="flex items-center">
            <div className="flex-1">
              {selectedValue
                ? options.find((option) => option.value === selectedValue)?.label
                : <span className="text-gray-400">Select {label}</span>}
            </div>
          </div>
          <svg
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-transform duration-150 ease-in-out ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {options.map((option, index) => (
              <div
                key={option.value + index}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleOptionClick(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      {helperText && !errors[source] && (
        <p className="text-gray-500 text-sm mt-1 text-left">{helperText}</p>
      )}
      {errors[source] && (
        <p className="text-red-500 text-sm mt-1 text-left">{`${errors[source]?.message}*`}</p>
      )}
    </div>
  );
};