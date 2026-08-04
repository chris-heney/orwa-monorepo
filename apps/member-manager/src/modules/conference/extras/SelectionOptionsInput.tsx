import React from "react";
import { useInput } from "react-admin";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

/**
 * Editor for `selection_options` — a plain JSON array of option strings
 * (e.g. shirt sizes: SM, MD, LG…). Admins can add/remove as many options
 * as they need. Uses MUI inputs only so it inherits light/dark theming.
 */
const SelectionOptionsInput = ({
  source,
  label = "Options",
  disabled = false,
}: {
  source: string;
  label?: string;
  disabled?: boolean;
}) => {
  const {
    field,
    fieldState: { error },
  } = useInput({
    source,
    defaultValue: [],
    validate: (value: unknown) => {
      const options = Array.isArray(value) ? value : [];
      if (options.length === 0 || options.every((o) => !String(o ?? "").trim())) {
        return "Add at least one option";
      }
      return undefined;
    },
  });

  const options: string[] = Array.isArray(field.value) ? field.value : [];

  const setOptions = (next: string[]) => field.onChange(next);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {options.map((option, index) => (
          <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              size="small"
              fullWidth
              value={option ?? ""}
              disabled={disabled}
              placeholder={`Option ${index + 1}`}
              onChange={(e) => {
                const next = [...options];
                next[index] = e.target.value;
                setOptions(next);
              }}
              onBlur={field.onBlur}
            />
            <IconButton
              aria-label={`Remove option ${index + 1}`}
              size="small"
              disabled={disabled}
              onClick={() => setOptions(options.filter((_, i) => i !== index))}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>
      <Button
        startIcon={<AddIcon />}
        size="small"
        disabled={disabled}
        onClick={() => setOptions([...options, ""])}
        sx={{ mt: 1 }}
      >
        Add Option
      </Button>
      {error?.message && (
        <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5 }}>
          {error.message}
        </Typography>
      )}
    </Box>
  );
};

export default SelectionOptionsInput;
