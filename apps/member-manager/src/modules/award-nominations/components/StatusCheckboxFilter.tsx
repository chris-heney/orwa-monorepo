import React from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@mui/material";

interface StatusCheckboxFilterProps {
  /** Section label in the Filters drawer (default "Status"). */
  label?: string;
  /** Enum values in schema order — the only source of the checkbox list. */
  options: readonly string[];
  /** Currently selected values ([] = no status filter). */
  value: readonly string[];
  onChange: (next: string[]) => void;
  /** Accessible prefix for the checkboxes, e.g. "Nominations". */
  ariaPrefix: string;
}

/**
 * Filters-drawer Status multi-select shared by the Awards and ORWEF sidebars
 * (same FormControl / FormLabel chrome as their Region radio lists, but
 * checkboxes because several statuses may be ORed). Selection lives in each
 * module's RaStore key; the manifest turns it into a `<status>: { $in }`
 * filter. "Clear" mirrors the Submitted range section.
 */
const StatusCheckboxFilter = ({
  label = "Status",
  options,
  value,
  onChange,
  ariaPrefix,
}: StatusCheckboxFilterProps) => {
  const toggle = (status: string, checked: boolean) => {
    const without = value.filter((item) => item !== status);
    // Keep schema order so the request / saved pref are stable.
    onChange(
      checked
        ? options.filter((item) => item === status || without.includes(item))
        : without
    );
  };

  return (
    <FormControl component="fieldset" fullWidth>
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <FormLabel component="legend">{label}</FormLabel>
        {value.length > 0 ? (
          <Button
            size="small"
            onClick={() => onChange([])}
            sx={{ minWidth: 0, py: 0, textTransform: "none" }}
          >
            Clear
          </Button>
        ) : null}
      </Box>
      <FormGroup>
        {options.map((status) => (
          <FormControlLabel
            key={status}
            label={status}
            control={
              <Checkbox
                size="small"
                checked={value.includes(status)}
                onChange={(event) => toggle(status, event.target.checked)}
                inputProps={{ "aria-label": `${ariaPrefix} status ${status}` }}
              />
            }
          />
        ))}
      </FormGroup>
    </FormControl>
  );
};

export default StatusCheckboxFilter;
