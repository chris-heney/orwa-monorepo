import React from "react";
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";

interface SimpleSelectInputProps {
  name: string;
  label: string;
  value: any;
  onChange: (e: any) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  helperText?: string;
  fullWidth?: boolean;
}

export const SimpleSelectInput: React.FC<SimpleSelectInputProps> = ({
  name,
  label,
  value,
  onChange,
  options,
  required = false,
  helperText,
  fullWidth = true,
}) => {
  return (
    <FormControl fullWidth={fullWidth} required={required} variant="outlined">
      <InputLabel>{label}</InputLabel>
      <Select
        name={name}
        value={value}
        onChange={onChange}
        label={label}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default SimpleSelectInput;
