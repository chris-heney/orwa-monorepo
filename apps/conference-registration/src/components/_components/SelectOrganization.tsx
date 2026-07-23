import { useContext, useEffect, useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { RegistrationOptions } from "../../AppContextProvider";
import { formatBackendFile } from "../../helpers/formatBackendFile";

const SelectOrganization = ({ updateLogo, required = true }: { updateLogo?: boolean, required?: boolean}) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const { AssociateOptions } = useContext(RegistrationOptions);

  const organizationValue = watch("organization") ?? "";
  const [filteredOptions, setFilteredOptions] = useState(AssociateOptions);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredOptions(AssociateOptions);
  }, [AssociateOptions]);

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

  const { ref: organizationRef, ...organizationRegister } = register("organization", {
    required: required ? "Organization is required" : false,
    validate: required
      ? (value) =>
          AssociateOptions.some((option) => option.name === value) ||
          "Invalid organization selected"
      : undefined,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("organization", value, { shouldDirty: true, shouldValidate: true });

    const filtered = AssociateOptions.filter((option) =>
      option.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);
    setDropdownOpen(true);

    const selectedAssociate = AssociateOptions.find(
      (option) => option.name === value
    );
    if (!selectedAssociate) {
      setValue("logo", null);
    }
  };

  const handleFocus = () => {
    // Show the full list so a prior selection can be replaced without clearing first
    setFilteredOptions(AssociateOptions);
    setDropdownOpen(true);
  };

  const handleSelect = (value: string) => {
    setValue("organization", value, { shouldDirty: true, shouldValidate: true });

    const selectedAssociate = AssociateOptions.find(
      (option) => option.name === value
    );

    if (selectedAssociate && updateLogo) {
      const logos = Array.isArray(selectedAssociate?.logo)
        ? selectedAssociate.logo
        : selectedAssociate?.logo?.data ?? null;
      const formattedLogo = logos
        ? logos.map((logo) => formatBackendFile(logo))
        : null;

      setValue("logo", formattedLogo);
    }

    setFilteredOptions(AssociateOptions);
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
          id="organization"
          {...organizationRegister}
          ref={organizationRef}
          value={organizationValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          autoComplete="off"
          className="input-field text-left p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
          placeholder="Type to search..."
        />
        {isDropdownOpen && filteredOptions.length > 0 && (
          <ul className="absolute left-0 top-full z-10 mt-0.5 max-h-40 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                className="p-2 hover:bg-blue-100 cursor-pointer text-left"
                onMouseDown={(e) => {
                  // Prevent input blur from unmounting the list before selection applies
                  e.preventDefault();
                  handleSelect(option.name);
                }}
              >
                {option.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="text-sm text-gray-500 text-left mt-1">
        (Active Associate Members)
      </p>
      {errors.organization && (
        <span className="text-red-500 text-sm">{typeof errors.organization?.message === "string" ? errors.organization.message : ""}</span>
      )}
    </div>
  );
};

export default SelectOrganization;
