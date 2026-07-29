import React from 'react'
import { TextField } from '@mui/material'

interface NumberInputProps {
  label: string
  value: number
  onChange: (value: number) => void
}

const CustomNumberInput: React.FC<NumberInputProps> = ({ label, value, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value)
    onChange(isNaN(newValue) ? 0 : newValue)
  }

  return (
    <TextField
      label={label}
      fullWidth
      type="number"
      value={value.toString()} 
      onChange={handleChange}
    />
  )
}
export default CustomNumberInput
