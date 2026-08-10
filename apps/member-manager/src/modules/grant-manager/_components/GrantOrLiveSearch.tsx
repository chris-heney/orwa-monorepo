import React, { useEffect, useRef, useState } from "react";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useListFilterContext } from "react-admin";
import { extractOrSearchText } from "../helpers/searchBarTabs";

type OrFilter = { $or: unknown[] };

type Props = {
  buildOr: (value: string) => OrFilter | null;
  /** Extra filter keys to strip when applying a new search (legacy dual fields). */
  legacyKeys?: readonly string[];
  placeholder?: string;
  label?: string;
};

/**
 * Single debounced search input that writes a Strapi `$or` filter (and clears
 * legacy dual-field keys). Uses a plain TextField so it does not inject `q`.
 */
const GrantOrLiveSearch = ({
  buildOr,
  legacyKeys = [],
  placeholder = "Search",
  label = "Search",
}: Props) => {
  const { filterValues, setFilters } = useListFilterContext();
  const fromFilters = extractOrSearchText(filterValues);
  const [value, setValue] = useState(fromFilters);
  const filterValuesRef = useRef(filterValues);
  filterValuesRef.current = filterValues;

  useEffect(() => {
    setValue(fromFilters);
  }, [fromFilters]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const current = filterValuesRef.current as Record<string, unknown>;
      const next: Record<string, unknown> = { ...current };
      delete next.$or;
      for (const key of legacyKeys) {
        delete next[key];
      }
      const built = buildOr(value);
      if (built) {
        Object.assign(next, built);
      }
      const prevText = extractOrSearchText(current);
      const nextText = extractOrSearchText(next);
      if (prevText === nextText && Boolean(current.$or) === Boolean(next.$or)) {
        return;
      }
      setFilters(next, null);
    }, 300);
    return () => window.clearTimeout(handle);
  }, [value, buildOr, legacyKeys, setFilters]);

  return (
    <TextField
      size="small"
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon color="disabled" />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default GrantOrLiveSearch;
