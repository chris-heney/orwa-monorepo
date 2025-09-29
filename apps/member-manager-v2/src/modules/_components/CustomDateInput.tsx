import React from 'react'
import { TextField } from '@mui/material'

interface DateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const CustomDateInput: React.FC<DateInputProps> = ({ label, value, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  return (
    <TextField
      label={label}
      fullWidth
      type="date"
      value={value}
      onChange={handleChange}
    />
  )
}

export default CustomDateInput
