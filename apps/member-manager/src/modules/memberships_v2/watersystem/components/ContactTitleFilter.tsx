import React from "react";
import { FilterList, FilterListItem } from "react-admin";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { WATERSYSTEM_DIRECTORY_TITLE_CHOICES } from "../../../human-resources/contacts/constants/watersystemDirectoryTitles";

/**
 * Filter water systems by the directory title of their contacts.
 *
 * Emits `{ contacts: { title: { $in: [...] } } }`, which the Strapi serializer
 * renders as `filters[contacts][title][$in][]=…`. A oneToMany relation filter
 * in Strapi is existential, so selecting several titles keeps every system
 * where ANY contact holds ANY of them (OR), not systems holding all of them.
 *
 * The shared `selectFilters` toggle helpers only understand flat scalar filter
 * values, so this filter carries its own nested-aware select/toggle pair.
 */

type TitleValue = { title: string };

type Filters = Record<string, unknown>;

/** Currently selected titles, tolerating the scalar/absent shapes. */
export const readContactTitleFilter = (filters: Filters | undefined): string[] => {
  const title = (filters?.contacts as { title?: unknown } | undefined)?.title;
  const inList = (title as { $in?: unknown } | undefined)?.$in;
  if (Array.isArray(inList)) return inList.filter((v): v is string => typeof v === "string");
  if (typeof title === "string" && title !== "") return [title];
  return [];
};

export const isContactTitleSelected = (
  value: TitleValue,
  filters: Filters
): boolean => readContactTitleFilter(filters).includes(value.title);

export const toggleContactTitle = (
  value: TitleValue,
  filters: Filters
): Filters => {
  const current = readContactTitleFilter(filters);
  const next = current.includes(value.title)
    ? current.filter((t) => t !== value.title)
    : [...current, value.title];

  // Drop the key entirely when nothing is selected — an empty `$in` would
  // serialize to nothing but still linger in the saved-filter payload.
  const rest = { ...(filters ?? {}) };
  delete rest.contacts;
  if (next.length === 0) return rest;
  return { ...rest, contacts: { title: { $in: next } } };
};

/** Filter drawer section: match systems with a contact holding any of these titles. */
const ContactTitleFilter = () => (
  <FilterList label="Contact Title" icon={<AssignmentIndIcon />}>
    {WATERSYSTEM_DIRECTORY_TITLE_CHOICES.filter((choice) => choice.id).map(
      (choice) => (
        <FilterListItem
          key={choice.id}
          label={choice.name}
          value={{ title: choice.id }}
          isSelected={isContactTitleSelected}
          toggleFilter={toggleContactTitle}
        />
      )
    )}
  </FilterList>
);

export default ContactTitleFilter;
