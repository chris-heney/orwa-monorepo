import React from 'react'
import { MenuItem, Select, InputLabel, FormControl, FormControlProps, SelectChangeEvent } from '@mui/material'

interface SelectInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  choices: { id: string; name: string }[]
  formControlProps?: FormControlProps
}

const CustomSelectInput: React.FC<SelectInputProps> = ({
  label,
  value,
  onChange,
  choices,
  formControlProps,
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value)
  }

  return (
    <FormControl fullWidth {...formControlProps}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} onChange={handleChange} label={label}>
        {choices.map((choice) => (
          <MenuItem key={choice.id} value={choice.id}>
            {choice.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default CustomSelectInput
