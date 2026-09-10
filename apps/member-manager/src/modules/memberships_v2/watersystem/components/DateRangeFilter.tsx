import React, { useEffect, useState } from "react";
import {
  Box,
  Collapse,
  FormControl,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useListFilterContext, useStore } from "react-admin";
import { DateRangeIcon } from "@mui/x-date-pickers";
import {
  getActiveDateField,
  getDateRange,
  withDateRange,
  withoutDateFields,
} from "./dateRangeFilterState";

type TDateRangeFilterProps = {
  /** Date fields the user can filter by; the first is the default. */
  fields: string[];
  label?: string;
};

const DATE_FORMAT = "YYYY-MM-DD";

/**
 * `<input type="date">` yields "" (or a partial value in Firefox) mid-edit.
 * Checked with a pattern rather than dayjs strict parsing, which needs the
 * customParseFormat plugin this app does not load.
 */
const isCompleteDate = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) && dayjs(value).isValid();

const toLabel = (field: string) =>
  field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

/**
 * Date range filter section for the membership filter drawers.
 *
 * Renders its own section header (matching react-admin's `FilterListSection`
 * markup) so the switch can sit beside the label. The switch is the single
 * source of truth for "is a date range applied": it is derived from the list's
 * filter values, so a saved filter or another control that writes a range
 * turns it on, and turning it off removes only this section's keys.
 */
const DateRangeFilter: React.FC<TDateRangeFilterProps> = ({
  fields,
  label = "Date",
}) => {
  const { filterValues, displayedFilters, setFilters, resource } =
    useListFilterContext();

  const activeField = getActiveDateField(fields, filterValues);
  const appliedRange = getDateRange(activeField, filterValues);
  const enabled = Boolean(activeField);

  // Which field the user has picked while the filter is off; once a range is
  // applied the applied field wins so the header can never disagree with the query.
  const [storedField, setStoredField] = useStore<string>(
    `${resource}-selected-date-field`,
    fields[0]
  );
  const selectedField =
    activeField ?? (fields.includes(storedField) ? storedField : fields[0]);

  // The inputs render from `range`, never straight from the query, so a pick
  // shows instantly instead of waiting for the list to come back. A range
  // starting today would match almost nothing the moment the switch flips, so
  // the untouched default reaches a year back.
  // Lazy init so a reload with a range already in the URL renders the applied
  // dates on the first frame instead of flashing the defaults.
  const [range, setRange] = useState(
    () =>
      appliedRange ?? {
        start: dayjs().subtract(1, "year").format(DATE_FORMAT),
        end: dayjs().format(DATE_FORMAT),
      }
  );

  // Follow a range applied from outside this section — a saved filter, or
  // Member Status › "Expiring in 1 month". Writes from the inputs below land
  // here already equal, so this is a no-op for them.
  const appliedStart = appliedRange?.start;
  const appliedEnd = appliedRange?.end;
  useEffect(() => {
    if (!appliedStart || !appliedEnd) return;
    setRange((prev) =>
      prev.start === appliedStart && prev.end === appliedEnd
        ? prev
        : { start: appliedStart, end: appliedEnd }
    );
  }, [appliedStart, appliedEnd]);

  // Never debounced: a date input fires once per complete date, and a pending
  // write would clobber a Region/Title choice made inside the debounce window
  // with this section's stale copy of the filters.
  const apply = (field: string, start: string, end: string) => {
    setFilters(
      withDateRange(fields, filterValues, field, start, end),
      displayedFilters,
      false
    );
  };

  const handleToggle = (_e: React.ChangeEvent, checked: boolean) => {
    if (checked) {
      apply(selectedField, range.start, range.end);
      return;
    }
    // `range` is kept as-is, so flipping back on restores what was there.
    setFilters(withoutDateFields(fields, filterValues), displayedFilters, false);
  };

  const handleFieldChange = (field: string) => {
    setStoredField(field);
    if (enabled) apply(field, range.start, range.end);
  };

  const handleDateChange = (key: "start" | "end", value: string) => {
    // `type="date"` fires mid-edit with a partial (or empty) value; ignore
    // those so a half-typed year never reaches the query.
    if (!isCompleteDate(value)) return;
    const next = { ...range, [key]: value };
    setRange(next);
    if (enabled) apply(selectedField, next.start, next.end);
  };

  return (
    <Box>
      <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
        <Box sx={{ mr: 1, lineHeight: "initial" }}>
          <DateRangeIcon />
        </Box>
        <Typography variant="overline">{label}</Typography>
        <Tooltip
          title={
            enabled ? "Date range applied — click to remove" : "Filter by date range"
          }
          arrow
        >
          {/* Switch forwards its props to the inner SwitchBase, so the tooltip
              needs a wrapper to cover the whole control rather than the thumb. */}
          <span style={{ marginLeft: "auto", display: "inline-flex" }}>
            <Switch
              size="small"
              edge="end"
              checked={enabled}
              onChange={handleToggle}
              inputProps={{
                "aria-label": `Filter by ${label.toLowerCase()} range`,
              }}
            />
          </span>
        </Tooltip>
      </Box>

      <Collapse in={enabled} timeout={300}>
        <Box sx={{ pb: 1 }}>
          <FormControl fullWidth>
            <Select
              value={selectedField}
              onChange={(e) => handleFieldChange(e.target.value as string)}
              label="Field"
              variant="standard"
            >
              {fields.map((field) => (
                <MenuItem key={field} value={field}>
                  {toLabel(field)}
                </MenuItem>
              ))}
            </Select>
            <Typography variant="caption" color="textSecondary">
              Select the date to filter by
            </Typography>
          </FormControl>

          <TextField
            label="Start Date"
            type="date"
            variant="standard"
            value={range.start}
            onChange={(e) => handleDateChange("start", e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            InputProps={{
              inputProps: { max: dayjs().format(DATE_FORMAT) },
            }}
          />

          <TextField
            label="End Date"
            type="date"
            variant="standard"
            value={range.end}
            onChange={(e) => handleDateChange("end", e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mt: 2 }}
            InputProps={{
              inputProps: { max: dayjs().format(DATE_FORMAT) },
            }}
          />
        </Box>
      </Collapse>
    </Box>
  );
};

export default DateRangeFilter;
