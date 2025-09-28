import { TextField, TextFieldProps } from "@mui/material";
import { formatPhoneNumber } from "../modules/organizations/form-sections/organization-contact/utils";
import React, { useState, useEffect } from "react";
import { useInput } from "react-admin";

interface PhoneInputProps extends Omit<TextFieldProps, 'onChange' | 'value'> {
  source: string;
  label?: string;
  helperText?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  source,
  label = "Phone Number",
  helperText = "",
  defaultValue = "",
  onChange,
  ...rest
}) => {
  const {
    field: { onChange: fieldOnChange, value },
    fieldState: { error },
    formState: { isSubmitted }
  } = useInput({
    source,
    defaultValue
  });

  const [inputValue, setInputValue] = useState<string>("");
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Initialize the component with the current value
  useEffect(() => {
    if (value) {
      setInputValue(formatPhoneNumber(value));
    }
  }, [value]);

  // Handle cursor position after formatting
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [inputValue, cursorPosition]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const curPos = e.target.selectionStart || 0;
    
    // Extract only digits
    const digitsOnly = input.replace(/\D/g, "");
    
    // Limit to 10 digits
    const limitedDigits = digitsOnly.slice(0, 10);
    
    // Format the phone number
    const formattedValue = formatPhoneNumber(limitedDigits);
    
    // Calculate new cursor position
    const newCursorPos = calculateCursorPosition(input, formattedValue, curPos);
    
    // Update state
    setInputValue(formattedValue);
    setCursorPosition(newCursorPos);
    
    // Update form value (store only digits)
    fieldOnChange(limitedDigits);
    
    // Call external onChange if provided
    if (onChange) {
      onChange(limitedDigits);
    }
  };

  // Helper function to calculate cursor position after formatting
  const calculateCursorPosition = (
    prevValue: string,
    newValue: string,
    prevCursorPos: number
  ): number => {
    // If deleting, try to maintain same position
    if (prevValue.length > newValue.length) {
      return Math.max(0, prevCursorPos - 1);
    }
    
    // If at specific positions, adjust for the added formatting characters
    if (prevCursorPos === 4) return 5; // After area code
    if (prevCursorPos === 8) return 10; // After prefix
    
    // If typing, advance cursor past any formatting characters
    const formattingCharsBeforeCursor = (newValue.slice(0, prevCursorPos).match(/\D/g) || []).length;
    const digitsBeforeCursor = prevCursorPos - formattingCharsBeforeCursor;
    
    // Count formatting chars in the new value up to the same number of digits
    const newFormattingCharsBeforeCursor = (newValue.replace(/\d/g, 'x').slice(0, digitsBeforeCursor + formattingCharsBeforeCursor).match(/\D/g) || []).length;
    
    return digitsBeforeCursor + newFormattingCharsBeforeCursor;
  };

  return (
    <TextField
      label={label}
      fullWidth
      placeholder="(___) ___-____"
      value={inputValue}
      onChange={handleChange}
      error={!!(isSubmitted && error)}
      helperText={isSubmitted && error ? error.message : helperText}
      inputRef={inputRef}
      inputProps={{
        inputMode: 'tel'
      }}
      {...rest}
    />
  );
};
