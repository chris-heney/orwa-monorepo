import React from 'react'
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { grantFields } from '../../helpers/Data'

interface Contact {
  id: number;
  // Other properties of Contact
}

interface CustomArrayAutocompleteInputProps extends Omit<AutocompleteProps<Contact[], true, true, true>, 'onChange' | 'value'> {
  onChange: (contacts: Contact[]) => void;
  value: Contact[];
  label?: string;
}

const CustomArrayAutocompleteInput: React.FC<CustomArrayAutocompleteInputProps> = ({ onChange, value, label, ...rest }) => {

  return (
    <Autocomplete
      options={grantFields || []}
      getOptionLabel={(option) => option.name.toString()}
      fullWidth
      renderInput={(params) => <TextField {...params} label={label} fullWidth />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      multiple
    />
  )
}

export default CustomArrayAutocompleteInput
