import React from "react";
import { FilterList, FilterListItem, useGetList } from "react-admin";
import GroupIcon from "@mui/icons-material/Group";
import BaseFilter from "./BaseFilter";
import { IConference } from "../types";
import IConferenceTicket from "../types/IConferenceTicket";
import { toggleFilter } from "../helpers/selectFilters";
import { isSelected } from "../helpers/selectFilters";

interface AttendeesFilterProps {
  filterValues: any;
  conferences: IConference[];
  tickets: IConferenceTicket[];
  selectedTab: string;
}

const AttendeesFilter: React.FC<AttendeesFilterProps> = ({
  filterValues,
  conferences,
  tickets,
  selectedTab,
}) => {
  // Check if we're in the edit tab where deselection should be disabled
  const disableDeselect = selectedTab === "edit";


  const { data: extras } = useGetList<IConferenceTicket>("conference-extras", {
    filter: filterValues.conference  ? {
      conferences: filterValues.conference,
    } : {},
    meta: {
      populate: true,
    },
  });

  return (
    <>
      <BaseFilter
        filterValues={filterValues}
        conferences={conferences}
        selectedTab={selectedTab}
        multipleConferenceSelection={false}
        disableDeselect={disableDeselect}
      />

      {/* Ticket Type Filter */}
      <FilterList label="Ticket Type" icon={<GroupIcon />}>
        {tickets
          ?.filter((ticket) =>
            filterValues?.conference
              ? (ticket.conferences as IConference[]).some(
                  (c) => c.id === filterValues.conference
                ) &&
                ticket.name !== "Golfer" &&
                ticket.name !== "Fisher"
              : true
          )
          .map((ticket) => {
            return (
              <FilterListItem
                key={`ticket-${ticket.id}`}
                label={`${ticket.name} ${
                  !filterValues?.conference
                    ? (ticket.conferences[0] as IConference).name
                    : ""
                }`}
                value={{ conference_ticket: ticket.id }}
                isSelected={isSelected}
                toggleFilter={(val, filters) =>
                  toggleFilter(val, filters, undefined, disableDeselect)
                }
              />
            );
          })}
      </FilterList>

      {/* Attendee Options Filter */}
      <FilterList label="Attendee Options" icon={<GroupIcon />}>
        <FilterListItem
          label="Speaker"
          value={{ speaker: true }}
          isSelected={isSelected}
          toggleFilter={(val, filters) =>
            toggleFilter(val, filters, undefined, disableDeselect)
          }
        />
        <FilterListItem
          label="Promotional Emails"
          value={{ promotional_emails: true }}
          isSelected={isSelected}
          toggleFilter={(val, filters) =>
            toggleFilter(val, filters, undefined, disableDeselect)
          }
        />
      </FilterList>

      <FilterList label="Ticket Extras" icon={<GroupIcon />}>
        {extras
          ?.filter(
            (extra) =>
              extra.context === "Attendee" || extra.context === "Vendor"
          )
          .map((extra) => {
            return (
              <FilterListItem
                key={`extra-${extra.id}`}
                label={extra.name}
                value={{ "items][item": extra.id }}
                isSelected={isSelected}
                toggleFilter={toggleFilter}
              />
            );
          })}
      </FilterList>
    </>
  );
};

export default AttendeesFilter;
