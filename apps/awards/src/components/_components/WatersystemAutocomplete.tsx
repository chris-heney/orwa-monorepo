import React, { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useGetWatersystems } from "../../data/API";
import IWatersystemOption from "../../types/types";

interface WatersystemAutocompleteProps {
  name: string;
  label: string;
  required?: boolean;
  helperText?: string;
}

const WatersystemAutocomplete: React.FC<WatersystemAutocompleteProps> = ({
  name,
  label,
  required = false,
  helperText,
}) => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();
  const { data: watersystems, isLoading } = useGetWatersystems();
  const typedWatersystems = watersystems as IWatersystemOption[] | undefined;
  
  const [filteredOptions, setFilteredOptions] = useState<IWatersystemOption[]>([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedValue = watch(name);

  // Helper function to get the display name for a watersystem
  const getDisplayName = (watersystem: IWatersystemOption): string => {
    return watersystem.legal_entity_name && watersystem.legal_entity_name.trim() !== '' 
      ? watersystem.legal_entity_name 
      : watersystem.name;
  };

  // Initialize input value from form data
  useEffect(() => {
    if (selectedValue !== undefined && selectedValue !== null) {
      // If selectedValue is a number (ID), find the corresponding watersystem name
      if (typedWatersystems && typeof selectedValue === 'number') {
        const watersystem = typedWatersystems.find(ws => ws.id === selectedValue);
        if (watersystem) {
          setInputValue(getDisplayName(watersystem));
        }
      } else if (typeof selectedValue === 'string') {
        // If it's a string, check if it's a number string (ID)
        if (!isNaN(Number(selectedValue)) && typedWatersystems) {
          const watersystem = typedWatersystems.find(ws => ws.id === Number(selectedValue));
          if (watersystem) {
            setInputValue(getDisplayName(watersystem));
          }
        } else {
          setInputValue(selectedValue);
        }
      }
    }
  }, [selectedValue, typedWatersystems]);

  // Initialize filtered options when watersystems data loads
  useEffect(() => {
    if (typedWatersystems) {
      setFilteredOptions(typedWatersystems);
    }
  }, [typedWatersystems]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setValue(name, value);
    setDropdownOpen(true);

    if (typedWatersystems) {
      const filtered = typedWatersystems.filter((option: IWatersystemOption) => {
        const searchValue = value?.toLowerCase();
        const nameMatch = option.name?.toLowerCase().includes(searchValue);
        const legalEntityMatch = option.legal_entity_name && option.legal_entity_name.trim() !== '' 
          ? option.legal_entity_name?.toLowerCase().includes(searchValue) 
          : false;
          
        return nameMatch || legalEntityMatch;
      });
      setFilteredOptions(filtered);
    }
  };

  const handleSelect = (watersystem: IWatersystemOption) => {
    const displayName = getDisplayName(watersystem);
    setInputValue(displayName);
    setValue(name, displayName);
    setValue("watersystem", watersystem.id);
    setDropdownOpen(false);
  };

  const handleFocus = () => {
    if (typedWatersystems) {
      setDropdownOpen(true);
      setFilteredOptions(typedWatersystems);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const membershipFormUrl = "https://orwa.org/membership-forms/#/watersystem";

  return (
    <div className="mb-4" ref={dropdownRef}>
      <label className="block mb-2 text-left text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          type="text"
          {...register(name, {
            required: required ? `${label} is required` : false,
            // validate: (value) => {
            //   if (required && typedWatersystems) {
            //     const isValid = typedWatersystems.find((option: IWatersystemOption) => {
            //       const displayName = option.legal_entity_name || option.name;
            //       return displayName === value;
            //     });
            //     if (!isValid) {
            //       return "Please select a valid watersystem from the dropdown";
            //     }
            //   }
            // }
          })}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`input-field text-left p-3 w-full border rounded-lg focus:outline-none bg-white transition-all duration-200 ${
            errors[name]
              ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
          }`}
          placeholder={isLoading ? "Loading watersystems..." : "Type to search watersystems..."}
          disabled={isLoading}
        />

        {errors[name] && (
          <p className="text-red-500 text-sm mt-1 text-left">
            {errors[name]?.message as string}
          </p>
        )}

        {isDropdownOpen && filteredOptions.length > 0 && !isLoading && (
          <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full max-h-60 overflow-y-auto mt-1 shadow-lg">
            {filteredOptions.map((option) => (
              <li
                key={option.id}
                className="p-3 hover:bg-blue-50 cursor-pointer text-left border-b border-gray-100 last:border-b-0"
                onClick={() => handleSelect(option)}
              >
                <div className="font-medium text-gray-900">
                  {getDisplayName(option)}
                </div>
                {option.legal_entity_name && option.legal_entity_name.trim() !== '' && option.name !== option.legal_entity_name && (
                  <div className="text-sm text-gray-600">({option.name})</div>
                )}
                {option.county && (
                  <div className="text-sm text-gray-500">{option.county} County</div>
                )}
                {option.region && (
                  <div className="text-sm text-gray-500">{option.region}</div>
                )}
              </li>
            ))}
          </ul>
        )}

        {isDropdownOpen && filteredOptions.length === 0 && !isLoading && inputValue && (
          <div className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full mt-1 shadow-lg p-3">
            <p className="text-gray-500 text-sm">No watersystems found matching "{inputValue}"</p>
          </div>
        )}
      </div>

      {helperText && !errors[name] && (
        <p className="text-gray-500 text-sm mt-1 text-left">{helperText}</p>
      )}

      <p className="text-sm text-gray-600 text-left mt-2">
        (Active ORWA Member Systems)
      </p>
      <p className="text-sm text-red-500 text-left mt-1">
        ***If you do not see your system listed, please{" "}
        <a
          href={membershipFormUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline hover:text-blue-700"
        >
          apply for membership
        </a>
        {" "}or{" "}
        <a
          href={membershipFormUrl + "-renewal"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline hover:text-blue-700"
        >
          renew your membership
        </a>
        .
      </p>
    </div>
  );
};

export default WatersystemAutocomplete;
