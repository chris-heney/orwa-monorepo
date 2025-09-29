import React from 'react'
import {  AutocompleteInput, useGetList } from 'react-admin'

interface StaffInstructorAutocompleteInputProps {
    source: string
  }
export const ContactAutocompleteInput: React.FC<StaffInstructorAutocompleteInputProps> = ({ source }) => {
  const { data, isLoading, error } = useGetList('contacts', {
    meta: {
      populate: true,
      raw: true
    },
    pagination :{ page: 1, perPage: 100000},
    sort: { field: 'first', order: 'ASC' }
  })
  
  if (isLoading) return <>Loading...</>
  if (error) return <>Error</>
  if (typeof data === 'undefined') return <>No Data</>
  const options = data?.map( (contact) => {
    const name = contact?.first
        + ' '
        + contact?.last 
    return {
      id: contact.id,
      name 
    }
  })
  return <AutocompleteInput source={source} choices={options} />
}



