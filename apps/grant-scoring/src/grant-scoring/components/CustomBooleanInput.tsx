import React, { useContext, useEffect, useState } from 'react'
import { FormControlLabel, Switch, FormControlLabelProps } from '@mui/material'
import { ApplicationScoringContext } from '../AppContextProvider'

interface BooleanInputProps extends Omit<FormControlLabelProps, 'control' | 'onChange'> {
  value: boolean | undefined;
  onChange: (value: boolean) => void
}

const CustomBooleanInput: React.FC<BooleanInputProps> = ({ label, value, onChange, ...props }) => {
  const [isChecked, setChecked] = useState(value || false)
  
  const {
    applications,
    applicationIndex,
  } = useContext(ApplicationScoringContext)


  useEffect(() => {
    if (applications[applicationIndex]) {
      isChecked !== value && setChecked(value || false)
    }
  }, [applications[applicationIndex]])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setChecked(newValue)
    onChange(newValue)
  };

  return (
    <FormControlLabel
      {...props}
      sx={{ width: '100%', m: 0 }}
      control={<Switch checked={isChecked} onChange={handleChange} />}
      label={label}
    />
  )
}

export default CustomBooleanInput
