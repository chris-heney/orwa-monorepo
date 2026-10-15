import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  TextField,
} from "@mui/material";

interface SubmittedDateRangeFieldsProps {
  /** Section label in the Filters drawer (default "Submitted"). */
  label?: string;
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  /** Accessible prefix for the two inputs, e.g. "nominations". */
  ariaPrefix: string;
}

/**
 * Filters-drawer "Submitted from / to" pair shared by the Awards and ORWEF
 * sidebars. Values are `YYYY-MM-DD` strings (native date inputs) stored in
 * each module's RaStore keys; the manifest turns them into a
 * `submission_date` `$gte` / `$lte` filter.
 */
const SubmittedDateRangeFields = ({
  label = "Submitted",
  from,
  to,
  onFromChange,
  onToChange,
  ariaPrefix,
}: SubmittedDateRangeFieldsProps) => {
  const hasValue = Boolean(from || to);
  return (
    <FormControl fullWidth>
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <FormLabel>{label}</FormLabel>
        {hasValue ? (
          <Button
            size="small"
            onClick={() => {
              onFromChange("");
              onToChange("");
            }}
            sx={{ minWidth: 0, py: 0, textTransform: "none" }}
          >
            Clear
          </Button>
        ) : null}
      </Box>
      <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
        <TextField
          type="date"
          size="small"
          margin="none"
          label="From"
          value={from}
          onChange={(event) => onFromChange(event.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{
            "aria-label": `${ariaPrefix} submitted from`,
            max: to || undefined,
          }}
          // Native date pickers follow the page colour scheme only when told to.
          sx={{ flex: 1, "& input": { colorScheme: (theme) => theme.palette.mode } }}
        />
        <TextField
          type="date"
          size="small"
          margin="none"
          label="To"
          value={to}
          onChange={(event) => onToChange(event.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{
            "aria-label": `${ariaPrefix} submitted to`,
            min: from || undefined,
          }}
          sx={{ flex: 1, "& input": { colorScheme: (theme) => theme.palette.mode } }}
        />
      </Box>
    </FormControl>
  );
};

export default SubmittedDateRangeFields;
