import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, SxProps } from '@mui/material'
import { Filter } from '../../types/Filter'

interface Option {
  label: string
  value: string
  sx?: SxProps
}

interface CustomSelectProps {
  options: Option[]
  label: string
  handleSelectFilter: (key: string, value: string, filters: Filter[], setFilters: Dispatch<SetStateAction<Filter[]>>) => void
  sx?: SxProps
  source: string
  filters: Filter[]
  setFilters: React.Dispatch<React.SetStateAction<Filter[]>>
}

const CustomSelectInput: React.FC<CustomSelectProps> = ({ 
  options, 
  label, 
  handleSelectFilter ,
  sx,
  source,
  filters,
  setFilters
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('')

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedOption(event.target.value)
    handleSelectFilter(source, event.target.value.toString(), filters, setFilters)
  }

  useEffect(() => {
    if (filters.length === 0) {
        return setSelectedOption('')
    }
}, [filters])


  return (
    <FormControl>      
      <InputLabel>{label}</InputLabel>
      <Select
        sx={{
          borderRadius: 4,
          backgroundColor: 'white',
          "&:hover": {
            backgroundColor: '#f0f0f0',
          },
          ...sx,
        }}
        MenuProps={{
          MenuListProps: {
            disablePadding: true,
            disabledItemsFocusable: false,
          }
        }}
        SelectDisplayProps={{
          style: {
            marginBottom: 2,
            padding: 5,
            paddingLeft: 10,
            paddingRight: 10,
          }
        }}
        disableInjectingGlobalStyles
        disableUnderline 
        variant='filled'
        value={selectedOption} onChange={handleChange}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelectInput
