import React, { ChangeEvent } from 'react'
import { TextField, TextFieldProps } from '@mui/material'

interface TextInputProps extends Omit<TextFieldProps, 'onChange'> {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const CustomTextInput: React.FC<TextInputProps> = ({ label, value, onChange, ...rest }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event)
  }

  return (
    <TextField
      value={value}
      label={label}
      fullWidth
      onChange={handleChange}
      {...rest}
    />
  )
}

export default CustomTextInput
