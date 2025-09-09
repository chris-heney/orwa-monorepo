import { useContext, useEffect, useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { RegistrationOptions } from "../../AppContextProvider";
import { formatBackendFile } from "../../helpers/formatBackendFile";

const SelectOrganization = ({ updateLogo, required = true }: { updateLogo?: boolean, required?: boolean}) => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { AssociateOptions } = useContext(RegistrationOptions);

  const [filteredOptions, setFilteredOptions] = useState(AssociateOptions);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("organization", value);

    const filtered = AssociateOptions.filter((option) =>
      option.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);

    const selectedAssociate = AssociateOptions.find(
      (option) => option.name === value
    );
    if (!selectedAssociate) {
      setValue("logo", null);
    }
  };

  const handleFocus = () => {
    setDropdownOpen(true);
  };

  const handleBlur = () => {
    // Delay closing dropdown to handle click events
    setTimeout(() => {
      setDropdownOpen(false);
    }, 100);
  };

  const handleSelect = (value: string) => {
    setValue("organization", value);

    const selectedAssociate = AssociateOptions.find(
      (option) => option.name === value
    );

    if (selectedAssociate && updateLogo) {
      const formattedLogo = selectedAssociate?.logo?.data
        ? selectedAssociate.logo.data.map((logo) => formatBackendFile(logo))
        : null;

      setValue("logo", formattedLogo);
    }

    setDropdownOpen(false);
  };

  return (
    <div className="p-4">
      <label
        htmlFor="organization"
        className="block text-sm font-semibold text-left"
      >
        Associate Name {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative" ref={dropdownRef}>
        <input
          type="text"
          {...register("organization", {
            required: required ? "Organization is required" : false,
            validate: required
              ? (value) =>
                  AssociateOptions.some((option) => option.name === value) ||
                  "Invalid organization selected"
              : undefined,
          })}
          onChange={(e) => handleInputChange(e)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="input-field text-left p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
          placeholder="Type to search..."
        />
        <p className="text-sm text-gray-500 text-left">
          (Active Associate Members)
        </p>
        {isDropdownOpen && filteredOptions.length > 0 && (
          <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full max-h-40 overflow-y-auto mt-1 shadow-lg">
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                className="p-2 hover:bg-blue-100 cursor-pointer text-left"
                onClick={() => handleSelect(option.name)}
              >
                {option.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {errors.organization && (
        <span className="text-red-500 text-sm">{typeof errors.organization?.message === "string" ? errors.organization.message : ""}</span>
      )}
    </div>
  );
};

export default SelectOrganization;
