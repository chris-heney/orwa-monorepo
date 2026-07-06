import React from 'react'
import {  AutocompleteInput, useGetList } from 'react-admin'

interface StaffInstructorAutocompleteInputProps {
    source: string
  }
export const StaffAutocompleteInput: React.FC<StaffInstructorAutocompleteInputProps> = ({ source }) => {
  const { data, isLoading, error } = useGetList('staff', {
    meta: {
      populate: true,
      raw: true
    },
    pagination :{ page: 1, perPage: 1000},
    sort: { field: 'contact.first', order: 'ASC' }
  })
  
  if (isLoading) return <>Loading...</>
  if (error) return <>Error</>
  if (typeof data === 'undefined') return <>No Data</>
  const options = data?.map( (staff) => {
    const name = staff?.contact?.first
        + ' '
        + staff?.contact?.last 
    return {
      id: staff.id,
      name 
    }
  })
  return <AutocompleteInput source={source} choices={options} />
}



