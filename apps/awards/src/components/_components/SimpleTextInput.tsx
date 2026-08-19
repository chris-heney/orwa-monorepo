import React from "react";
import { TextField } from "@mui/material";

interface SimpleTextInputProps {
  name: string;
  label: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
}

export const SimpleTextInput: React.FC<SimpleTextInputProps> = ({
  name,
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
  helperText,
  fullWidth = true,
  multiline = false,
  rows,
}) => {
  return (
    <TextField
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      type={type}
      required={required}
      placeholder={placeholder}
      helperText={helperText}
      fullWidth={fullWidth}
      variant="outlined"
      multiline={multiline}
      rows={rows}
    />
  );
};

export default SimpleTextInput;
