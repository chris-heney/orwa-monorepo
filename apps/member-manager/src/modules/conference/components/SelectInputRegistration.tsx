import React from "react";

import { Loading, SelectInput, useGetList } from "react-admin";
import { useFormContext } from "react-hook-form";
import { useConferenceContext } from "../ConferenceContext";

interface SelectInputRegistrationProps {
  type: "Vendor" | "Attendee" | null;
}

const SelectInputRegistration = ({
  type = "Attendee",
}: SelectInputRegistrationProps) => {
  const { setValue } = useFormContext();
  const { currentFilter } = useConferenceContext();
  // Registrations
  const { data: registrations, isLoading: registrationsLoading } = useGetList(
    "conference-registrations",
    {
      filter:
          currentFilter.conference && currentFilter.year
          ? {
              conference: currentFilter.conference,
              year: currentFilter.year,
              type,
            }
          : currentFilter.conference
          ? {
              conference: currentFilter.conference,
              type,
            }
          : currentFilter.year
          ? {
              year: currentFilter.year,
              type,
            }
          : {
              type,
            },
      sort: { field: "organization", order: "ASC" },
      pagination: { page: 1, perPage: 10000 },
    }
  );

  return registrationsLoading ? (
    <Loading />
  ) : (
    <SelectInput
      source="registration"
      label="Registration/Organization"
      // Filter choices for null organization values
      choices={
        registrationsLoading
          ? []
          : registrations?.map((registration) => ({
              id: registration.id,
              name: `${registration.organization} (${registration.registration_date})`,
              organization: registration.organization,
            }))
      }
      onChange={(e) => {
        const org = registrations?.find(
          (registration) => registration.id === e.target.value
        );
        setValue("organization", org?.organization);
      }}
      optionText="name"
      optionValue="id"
      helperText="Link this to a registration (optional)"
      fullWidth
    />
  );
};

export default SelectInputRegistration;
