import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useRegistrationOptions } from "../../AppContextProvider";

const SelectWatersystem = () => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();
  const { WatersystemOptions } = useRegistrationOptions();

  const organizationValue = watch("organization") ?? "";
  const [filteredOptions, setFilteredOptions] = useState(WatersystemOptions);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setFilteredOptions(WatersystemOptions);
  }, [WatersystemOptions]);

  const { ref: organizationRef, ...organizationRegister } = register(
    "organization",
    {
      required: "Watersystem is required",
      validate: (value) => {
        if (!WatersystemOptions.find((option) => option.name === value)) {
          return "Watersystem not found make sure to select from the dropdown";
        }
      },
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("organization", value, { shouldDirty: true, shouldValidate: true });
    setDropdownOpen(true);

    const filtered = WatersystemOptions.filter((option) =>
      option.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleSelect = (value: string) => {
    setValue("organization", value, { shouldDirty: true, shouldValidate: true });
    const selectedOption = WatersystemOptions.find(
      (option) => option.name === value
    );
    setValue("watersystem", {
      id: selectedOption?.id,
      name: selectedOption?.name,
      county: selectedOption?.county,
      address:
        selectedOption?.address_physical_line1 +
        " " +
        selectedOption?.address_physical_city +
        " " +
        selectedOption?.address_physical_state +
        " " +
        selectedOption?.address_physical_zip,
      phone: selectedOption?.phone,
      email: selectedOption?.email,
    });
    setFilteredOptions(WatersystemOptions);
    setDropdownOpen(false);
  };

  const handleFocus = () => {
    setDropdownOpen(true);
    setFilteredOptions(WatersystemOptions);
  };

  const handleBlur = () => {
    // Selection uses onMouseDown + preventDefault, so blur only runs for true focus loss
    setTimeout(() => setDropdownOpen(false), 150);
  };

  const membershipFormUrl = "https://orwa.org/membership-forms/#/watersystem";

  return (
    <div>
      <label
        htmlFor="organization"
        className="block text-sm font-semibold text-left"
      >
        Watersystem Name <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          type="text"
          id="organization"
          {...organizationRegister}
          ref={organizationRef}
          value={organizationValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
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
      {errors.organization && (
        <span className="block text-red-500 text-left text-sm">
          *{errors.organization.message as string}
        </span>
      )}
      <p className="text-sm text-gray-500 text-left mt-2">
        (Active Watersystem Members)
      </p>
      <p className="text-sm text-red-500 text-left mt-1">
        ***If you do not see your system listed, please{" "}
        <a
          href={membershipFormUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline hover:text-blue-700"
        >
          feel free to apply
        </a>
        .
      </p>
      <p className="text-sm text-blue-500 text-left mt-1">
        Or{" "}
        <a
          href={membershipFormUrl + "-renewal"}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-blue-700"
        >
          Renew
        </a>
        .
      </p>
    </div>
  );
};

export default SelectWatersystem;
