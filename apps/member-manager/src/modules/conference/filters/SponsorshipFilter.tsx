import React, { useEffect } from "react";
import {
  FilterList,
  FilterListItem,
  FilterLiveSearch,
  useListFilterContext,
} from "react-admin";
import EventIcon from "@mui/icons-material/Event";
import { IConference } from "../types";
import {
  ensureConferenceInFilters,
  getConferenceFilterId,
  getPrimaryConferenceId,
} from "../helpers/mergeConferenceAcrossTabFilters";

interface SponsorshipFilterProps {
  filterValues: any;
  conferences: IConference[];
  includeSearch?: boolean;
}

const sameConferenceId = (a: unknown, b: unknown) => {
  if (a == null || b == null || a === "" || b === "") return false;
  const na = Number(a);
  const nb = Number(b);
  return !Number.isNaN(na) && !Number.isNaN(nb) && na === nb;
};

const SponsorshipFilter: React.FC<SponsorshipFilterProps> = ({
  filterValues,
  conferences,
  includeSearch = true,
}) => {
  const { setFilters } = useListFilterContext();

  useEffect(() => {
    const next = ensureConferenceInFilters(filterValues, "sponsorships");
    // Always normalize plural→singular; a stale `conferences` key 400s Strapi.
    if (
      next.conference !== filterValues?.conference ||
      filterValues?.conferences != null
    ) {
      setFilters(next, filterValues, false);
    }
  }, [filterValues, setFilters]);

  const conferenceIsSelected = (val: any, filters: any) =>
    sameConferenceId(getPrimaryConferenceId(filters), val?.conference);

  const conferenceToggleFilter = (val: any, filters: any) => {
    const conferenceId = Number(val?.conference);
    if (conferenceId == null || Number.isNaN(conferenceId)) {
      return ensureConferenceInFilters(filters, "sponsorships");
    }
    if (sameConferenceId(getPrimaryConferenceId(filters), conferenceId)) {
      return filters;
    }
    return { ...filters, conference: conferenceId };
  };

  return (
    <>
      {includeSearch && <FilterLiveSearch fullWidth />}

      <FilterList label="Conference" icon={<EventIcon />}>
        {conferences?.map((conference: IConference & { entityId?: number }) => {
          const conferenceId = getConferenceFilterId(conference);
          if (conferenceId == null) return null;
          return (
            <FilterListItem
              key={`conference-${conferenceId}`}
              label={conference.name}
              value={{ conference: conferenceId }}
              isSelected={conferenceIsSelected}
              toggleFilter={conferenceToggleFilter}
            />
          );
        })}
      </FilterList>
    </>
  );
};

export default SponsorshipFilter;
