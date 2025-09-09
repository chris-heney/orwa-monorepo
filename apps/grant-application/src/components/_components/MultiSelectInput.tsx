import { useState, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';

interface MultiSelectProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  required?: boolean;
  helperText?: string;
}

const MultiSelect = ({ name, label, options, required = false, helperText }: MultiSelectProps) => {
  const { setValue, watch, formState: { errors }, register } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const formValues: string[] = watch(name) ?? [];

  const toggleDropdown = () => setIsOpen(prevState => !prevState);

  const handleOptionClick = (value: string) => {
    const selectedOptions = formValues.includes(value)
      ? formValues.filter(item => item !== value)
      : [...formValues, value];
    setValue(name, selectedOptions);
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

  // Trigger re-render when options change
  useEffect(() => {
    // Only filter out invalid options if we have options loaded and form values
    if (options.length > 0 && formValues.length > 0) {
      // Ensure the selected values are still valid when options change
      const validSelectedOptions = formValues.filter(value => options.some(option => option.value === value));
      if (validSelectedOptions.length !== formValues.length) {
        setValue(name, validSelectedOptions);
      }
    }
  }, [options, formValues, name, setValue]);

  return (
    <div className="mb-6 relative" ref={dropdownRef}>
      <label className="block mb-1 text-left text-sm font-bold">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <div
        {...register(name, { required: required ? `${label} is required` : false })}
          className={`block w-full px-3 py-2 border rounded-md shadow-sm bg-white text-gray-900 cursor-pointer focus:outline-none focus:ring-2 ${
            errors[name]
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
          onClick={toggleDropdown}
          aria-expanded={isOpen}
        >
          <div className="flex items-center flex-wrap min-h-8">
            {formValues.length === 0 ? (
              <span className="text-gray-400">None Selected</span>
            ) : (
              formValues.map(value => {
                const option = options.find(opt => opt.value === value);
                return option ? (
                  <div key={value} className="flex items-center bg-blue-200 text-blue-800 px-3 py-1 rounded-full mr-2 mb-2">
                    <span>{option.label}</span>
                  </div>
                ) : null;
              })
            )}
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
            {options.map(option => (
              <div
                key={option.value}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center ${
                  hoveredValue === option.value && formValues.includes(option.value)
                    ? 'text-red-500'
                    : ''
                } ${
                  formValues.includes(option.value)
                    ? 'bg-blue-200 text-blue-800'
                    : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptionClick(option.value);
                }}
                onMouseEnter={() => setHoveredValue(option.value)}
                onMouseLeave={() => setHoveredValue(null)}
              >
                <span>{option.label}</span>
                {formValues.includes(option.value) && (
                  <span className="ml-2">
                    {hoveredValue === option.value ? 'x' : '✓'}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {helperText &&  (
        <p className="text-gray-500 text-sm mt-1 text-left">{helperText}</p>
      )}
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1 text-left">{`${errors[name]?.message}*`}</p>
      )}
    </div>
  );
};

export { MultiSelect };