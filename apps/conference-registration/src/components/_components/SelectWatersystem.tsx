import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useRegistrationOptions } from "../../AppContextProvider";

const SelectWatersystem = () => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();
  const { WatersystemOptions } = useRegistrationOptions();

  const [filteredOptions, setFilteredOptions] = useState(WatersystemOptions);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("organization", value);
    setDropdownOpen(true);

    const filtered = WatersystemOptions.filter((option) =>
      option.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleSelect = (value: string) => {
    setValue("organization", value);
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
    setDropdownOpen(false);
  };

  const handleFocus = () => {
    setDropdownOpen(true);
    setFilteredOptions(WatersystemOptions);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
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
          {...register("organization", {
            required: "Watersystem is required",
            onChange: (value) => handleSelect(value.target.value),
            validate: (value) => {
              if (!WatersystemOptions.find((option) => option.name === value)) {
                return "Watersystem not found make sure to select from the dropdown";
              }
            }
          })}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="input-field text-left p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
          placeholder="Type to search..."
        />
         {errors.organization && (
        <span className="block text-red-500 text-left text-sm">
          *{errors.organization.message as string}
        </span>
      )}

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
    </div>
  );
};

export default SelectWatersystem;
