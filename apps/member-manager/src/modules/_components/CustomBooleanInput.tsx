import React from 'react'
import { FormControlLabel, Switch, FormControlLabelProps } from '@mui/material'

interface BooleanInputProps extends Omit<FormControlLabelProps, 'control' | 'onChange'> {
    value: boolean | undefined
    onChange: (value: boolean) => void
}

const CustomBooleanInput: React.FC<BooleanInputProps> = ({ label, value, onChange, ...props }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked)
  }

  return (
    <FormControlLabel
      {...props}
      sx={{width: '100%'}}
      control={<Switch checked={value} onChange={handleChange} />}
      label={label}
    />
  )
}

export default CustomBooleanInput
