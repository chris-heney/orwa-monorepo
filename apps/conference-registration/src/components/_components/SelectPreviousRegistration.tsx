import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useConferenceId } from "../../AppContextProvider";
import { useGetRegistrations } from "../../data/API";
import { IRegistrationPayload } from "../../types/types";

const SelectPreviousRegistration = () => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const conference_id = useConferenceId();

  if (!conference_id) {
    return null;
  }

  const { data: registrations } = useGetRegistrations(
    conference_id,
    new Date().getFullYear()
  );

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleSelect = (registration: any) => {
    setValue("organization", registration.organization);
    setDropdownOpen(false);
  };

  const handleFocus = () => {
    setDropdownOpen(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };

  return (
    <div>
      <label
        htmlFor="organization"
        className="block text-sm font-semibold text-left"
      >
        Organization/Company <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          type="text"
          {...register("organization", {
            required: "Organization is required",
            validate: (value) => {
              if (!registrations
                ?.filter((organization) => {
                  return organization.type === "Vendor" && (organization.booths as any).data.length > 0;
                })
                ?.filter((reg) => {
                  return reg.organization
                    .toLowerCase()
                    .includes(watch("organization").toLowerCase());
                })?.some(
                (option: IRegistrationPayload) =>
                  option.organization === value
              )) {
                return "Organization does not match any previous registrations"
              }
            },
          })}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="input-field text-left p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
          placeholder="Type to search..."
        />
        {errors.organization && (
          <span className="block text-red-500 text-left text-sm">
            *
            {errors.organization &&
              typeof errors.organization.message === "string" &&
              errors.organization.message}
          </span>
        )}

        {isDropdownOpen && (registrations?.length ?? 0) > 0 && (
          <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full max-h-40 overflow-y-auto mt-1 shadow-lg">
            {registrations
              ?.filter((organization) => {
                return organization.type === "Vendor" && (organization.booths as any).data.length > 0;
              })
              ?.filter((reg) => {
                return reg.organization
                  .toLowerCase()
                  .includes(watch("organization").toLowerCase());
              })
              .map((registration, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-blue-100 cursor-pointer text-left"
                  onClick={() => handleSelect(registration)}
                >
                  {registration.organization}
                </li>
              ))}
          </ul>
        )}

        <p className="text-sm text-gray-500 text-left mt-2">
          Select your organization from the list of previous registrations
        </p>
      </div>
    </div>
  );
};

export default SelectPreviousRegistration;
