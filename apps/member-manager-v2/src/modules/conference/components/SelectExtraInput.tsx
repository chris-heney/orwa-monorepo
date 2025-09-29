import React from 'react'
import { MenuItem, Select, InputLabel, FormControl, FormControlProps, SelectChangeEvent } from '@mui/material'
import { Loading, useGetList } from 'react-admin'
import { IExtra } from '../types/IConference'
import IConferenceTicket from '../types/IConferenceTicket'

interface SelectInputProps {
  label: string
  value: IExtra
  onChange: (value: IExtra) => void
  formControlProps?: FormControlProps
  context: string
  ticketType: string
  conference: number
}

const ExtraSelectInput: React.FC<SelectInputProps> = ({
  label,
  value,
  onChange,
  formControlProps,
  context,
  ticketType,
  conference,
}) => {
  const { data: extras, isLoading } = useGetList('conference-extras', {
    pagination: { page: 1, perPage: 100 },
    sort: { field: 'id', order: 'ASC' },
    meta: {
      raw: true
    },
    filter: { conferences: [conference] }
  })

  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value as unknown as IExtra)
  }

  // Filter out-of-context, excluded, and tickets that already have it included
  const filteredExtras = extras?.filter((extra) => (
    extra.context === context && extra.excluded.findIndex(
      (ticket: IConferenceTicket) => ticket.name === ticketType
    ) === -1 && extra.included.findIndex(
      (ticket: IConferenceTicket) => ticket.name === ticketType
    ) === -1
  ))

  return isLoading ? <Loading /> : (
    <FormControl fullWidth {...formControlProps}>
      <InputLabel>{label}</InputLabel>
      <Select value={value as IExtra} onChange={handleChange} label={label}>
        {filteredExtras?.map((choice, index) => {
          return (
            <MenuItem key={`filtered extra choice-${choice.id} ${index}`} value={choice}>
              {choice.name}
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}

export default ExtraSelectInput
