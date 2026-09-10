import React from "react";
import { FilterList, FilterListItem } from "react-admin";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { WATERSYSTEM_DIRECTORY_TITLE_CHOICES } from "../../../human-resources/contacts/constants/watersystemDirectoryTitles";

/**
 * Filter water systems by the directory title of their contacts.
 *
 * `contact.title` is a free-text string, not an enumeration: only the
 * watersystem contact form offers the title dropdown, and imported/legacy rows
 * predate it. Live data holds "DISTRICT MANAGER", "Town Manager/Clerk-Treasurer"
 * and "water & wastewater operator" alongside the clean "Manager"/"Operator"
 * values, so an exact match silently drops systems an operator expects to see.
 * Each selected title is therefore matched as a case-insensitive substring.
 *
 * Emits `{ contacts: { $or: [{ title: { $containsi: … } }, …] } }`, which the
 * Strapi serializer renders as
 * `filters[contacts][$or][0][title][$containsi]=…`. A oneToMany relation filter
 * in Strapi is existential, so selecting several titles keeps every system
 * where ANY contact's title contains ANY of them (OR), not systems holding all.
 *
 * The shared `selectFilters` toggle helpers only understand flat scalar filter
 * values, so this filter carries its own nested-aware select/toggle pair.
 */

type TitleValue = { title: string };

type Filters = Record<string, unknown>;

const asString = (v: unknown): string | undefined =>
  typeof v === "string" && v !== "" ? v : undefined;

/**
 * Currently selected titles.
 *
 * Tolerates every shape this filter has emitted so a saved filter created
 * before the substring change still renders its chips as selected: the current
 * `$or` list, and the legacy `title.$in` / bare-string forms.
 */
export const readContactTitleFilter = (
  filters: Filters | undefined
): string[] => {
  const contacts = filters?.contacts as
    | { $or?: unknown; title?: unknown }
    | undefined;
  if (!contacts) return [];

  // Current shape: { $or: [{ title: { $containsi: "Manager" } }, …] }
  if (Array.isArray(contacts.$or)) {
    return contacts.$or
      .map((clause) => {
        const title = (clause as { title?: unknown } | null)?.title;
        return (
          asString(
            (title as { $containsi?: unknown } | undefined)?.$containsi
          ) ?? asString(title)
        );
      })
      .filter((t): t is string => t !== undefined);
  }

  // Legacy shapes: { title: { $in: [...] } } and { title: "Manager" }.
  const title = contacts.title;
  const inList = (title as { $in?: unknown } | undefined)?.$in;
  if (Array.isArray(inList))
    return inList.filter((v): v is string => typeof v === "string");
  const scalar = asString(title);
  return scalar ? [scalar] : [];
};

export const isContactTitleSelected = (
  value: TitleValue,
  filters: Filters
): boolean => readContactTitleFilter(filters).includes(value.title);

/** Build the `contacts` clause matching any contact whose title contains a selected title. */
const buildContactTitleFilter = (titles: string[]) => ({
  $or: titles.map((title) => ({ title: { $containsi: title } })),
});

export const toggleContactTitle = (
  value: TitleValue,
  filters: Filters
): Filters => {
  const current = readContactTitleFilter(filters);
  const next = current.includes(value.title)
    ? current.filter((t) => t !== value.title)
    : [...current, value.title];

  // Drop the key entirely when nothing is selected — an empty `$or` would
  // serialize to nothing but still linger in the saved-filter payload.
  const rest = { ...(filters ?? {}) };
  delete rest.contacts;
  if (next.length === 0) return rest;
  return { ...rest, contacts: buildContactTitleFilter(next) };
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
