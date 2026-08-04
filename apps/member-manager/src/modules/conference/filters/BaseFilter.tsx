import React, { useEffect, useState } from "react";
import {
  FilterList,
  FilterListItem,
  FilterLiveSearch,
  useListFilterContext,
} from "react-admin";
import EventIcon from "@mui/icons-material/Event";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { IConference } from "../types";
import { useConferenceContext } from "../ConferenceContext";
import {
  ensureConferenceInFilters,
  getConferenceFilterId,
  getPrimaryConferenceId,
} from "../helpers/mergeConferenceAcrossTabFilters";

interface BaseFilterProps {
  filterValues?: any;
  conferences: IConference[];
  selectedTab: string;
  includeSearch?: boolean;
  includeYear?: boolean;
  /** Kept for API compat; conference is always single-select (radio). */
  multipleConferenceSelection?: boolean;
  /** Kept for API compat; conference never allows empty selection. */
  disableDeselect?: boolean;
  includeSavedQueries?: boolean;
}

const sameConferenceId = (a: unknown, b: unknown) => {
  if (a == null || b == null || a === "" || b === "") return false;
  const na = Number(a);
  const nb = Number(b);
  return !Number.isNaN(na) && !Number.isNaN(nb) && na === nb;
};

const BaseFilter: React.FC<BaseFilterProps> = ({
  includeSearch = true,
  includeYear = true,
  multipleConferenceSelection = false,
}) => {
  const currentYear = new Date().getFullYear();
  const conferenceYears = Array.from(
    { length: currentYear - 2023 + 2 },
    (_, i) => currentYear + 1 - i
  );

  const { selectedTab, conferences } = useConferenceContext();
  const { filterValues, setFilters } = useListFilterContext();

  const [searchKey, setSearchKey] = useState(`search-${selectedTab}`);

  useEffect(() => {
    setSearchKey(`search-${selectedTab}-${Date.now()}`);
  }, [selectedTab]);

  // Conference is radio: never allow an empty selection in the list filter context.
  useEffect(() => {
    if (getPrimaryConferenceId(filterValues) != null) return;
    const restored = ensureConferenceInFilters(
      filterValues,
      multipleConferenceSelection ? "tickets" : selectedTab
    );
    setFilters(restored, filterValues, false);
  }, [filterValues, selectedTab, multipleConferenceSelection, setFilters]);

  const conferenceIsSelected = (val: any, filters: any) => {
    const current = getPrimaryConferenceId(filters);
    if (multipleConferenceSelection) {
      const id = typeof val === "object" ? val?.conferences?.[0] : val;
      return sameConferenceId(current, id);
    }
    const id =
      typeof val === "object" && val != null ? val.conference : val;
    return sameConferenceId(current, id);
  };

  /** Radio: switch conference, never clear to none. X / re-click is a no-op. */
  const conferenceToggleFilter = (val: any, filters: any) => {
    const conferenceId = multipleConferenceSelection
      ? typeof val === "object"
        ? Number(val?.conferences?.[0] ?? val)
        : Number(val)
      : typeof val === "object"
        ? Number(val.conference)
        : Number(val);

    if (conferenceId == null || Number.isNaN(conferenceId)) {
      return ensureConferenceInFilters(
        filters,
        multipleConferenceSelection ? "tickets" : selectedTab
      );
    }

    if (sameConferenceId(getPrimaryConferenceId(filters), conferenceId)) {
      // Already selected — keep it (blocks X / toggle-off).
      return filters;
    }

    if (multipleConferenceSelection) {
      const { conference, ...rest } = filters;
      return { ...rest, conferences: [conferenceId] };
    }

    const { conferences: _c, ...rest } = filters;
    return { ...rest, conference: conferenceId };
  };

  return (
    <>
      {includeSearch && (
        <FilterLiveSearch
          key={searchKey}
          defaultValue={filterValues?.q || ""}
          source="q"
          fullWidth
        />
      )}

      <FilterList label="Conference" icon={<EventIcon />}>
        {conferences?.map((conference: IConference & { entityId?: number }) => {
          const conferenceId = getConferenceFilterId(conference);
          if (conferenceId == null) return null;

          const value = multipleConferenceSelection
            ? { conferences: [conferenceId] }
            : { conference: conferenceId };

          return (
            <FilterListItem
              key={`conference-${conferenceId}`}
              label={conference.name}
              value={value}
              isSelected={conferenceIsSelected}
              toggleFilter={conferenceToggleFilter}
            />
          );
        })}
      </FilterList>

      {includeYear && (
        <FilterList label="Year" icon={<CalendarTodayIcon />}>
          {conferenceYears.map((y) => (
            <FilterListItem
              key={`year-${y}`}
              label={y.toString()}
              value={{ year: y }}
            />
          ))}
        </FilterList>
      )}
    </>
  );
};

export default BaseFilter;
