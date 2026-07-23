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
        className="mb-1.5 block text-left text-sm font-medium text-slate-700"
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
                  return organization.type === "Vendor" && ((organization.booths as any)?.length ?? 0) > 0;
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
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-left text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          placeholder="Type to search..."
        />
        {errors.organization && (
          <span className="mt-1.5 block text-left text-sm text-red-500">
            *
            {errors.organization &&
              typeof errors.organization.message === "string" &&
              errors.organization.message}
          </span>
        )}

        {isDropdownOpen && (registrations?.length ?? 0) > 0 && (
          <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
            {registrations
              ?.filter((organization) => {
                return organization.type === "Vendor" && ((organization.booths as any)?.length ?? 0) > 0;
              })
              ?.filter((reg) => {
                return reg.organization
                  .toLowerCase()
                  .includes(watch("organization").toLowerCase());
              })
              .map((registration, index) => (
                <li
                  key={index}
                  className="cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-800"
                  onClick={() => handleSelect(registration)}
                >
                  {registration.organization}
                </li>
              ))}
          </ul>
        )}

        <p className="mt-2 text-left text-sm text-slate-500">
          Select your organization from the list of previous registrations
        </p>
      </div>
    </div>
  );
};

export default SelectPreviousRegistration;
