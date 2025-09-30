import React, { useState, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';

interface AutocompleteInputProps {
  name: string;
  label: string;
  required?: boolean;
  helperText?: string;
}

const ApplicationAutocompleteInput: React.FC<AutocompleteInputProps> = ({
  name,
  label,
  required = false,
  helperText,
}) => {
  const { formState: { errors }, setValue, watch } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedValue = watch(name);

  console.log(selectedValue);

  const handleOptionClick = (value: string) => {
    setValue(name, value);
    setIsOpen(false);
    setQuery(value); // Update the query to reflect the selected option
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    if (value.length > 0) {
      fetchOptions(value);
    } else {
      setOptions([]);
      setIsOpen(false);
    }
  };

  const fetchOptions = async (query: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/grant-application-finals?filters[$or][0][id][$contains]=${query}&filters[$or][1][application_id][$contains]=${query}&pagination[limit]=10`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
      });
      const data = await response.json();
      const transformedOptions = data.data.map((item: any) => ({
        value: item.id,
        label: `Application ID: ${item.id} (${item.application_id})`,
      }));
      setOptions(transformedOptions);
      setIsOpen(true); // Open the dropdown when options are fetched
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="mb-6 relative" ref={dropdownRef}>
      <label className="block mb-1 text-left text-sm font-bold">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onClick={() => setIsOpen(true)}
        className={`block w-full px-3 py-2 border rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 ${
          errors[name]
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:ring-blue-500'
        }`}
      />
      {isOpen && options.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
      {helperText && !errors[name] && (
        <p className="text-gray-500 text-sm mt-1 text-left">{helperText}</p>
      )}
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1 text-left">{`${errors[name]?.message}`}</p>
      )}
    </div>
  );
};

export default ApplicationAutocompleteInput;