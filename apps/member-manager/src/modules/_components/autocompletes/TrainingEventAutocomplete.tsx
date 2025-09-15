import React from 'react'
import { AutocompleteInput, useGetList } from 'react-admin'
import { YearMonthDay } from '../../../helpers/Data'
interface TrainingEventAutocompleteInputProps {
    source: string
  }

export const TrainingEventAutocompleteInput: React.FC<TrainingEventAutocompleteInputProps> = ({ source }) => {

  // const { data, isLoading, error, refetch } =  useGetMany('training-instructors')
  const { data, isLoading, error } = useGetList('training-events', {
    meta: {
      populate: true
    },
    pagination :{ page: 1, perPage: 1000},
  })

  if (isLoading) return <>Loading...</>
  if (error) return <>Error</>
  if (typeof data === 'undefined') return <>No Data</>
  const filteredOptions = data.filter((src) => src.deq_class_number != null)
  const options = filteredOptions?.map( (event) => {
    const start = new Date(event.start)
    const end = new Date(event.end)
    const name = 
        event?.training_type
        + ''
        + start.toLocaleString('en-US', YearMonthDay) 
        + ' '
        +  end.toLocaleString('en-US', YearMonthDay) 
    return {
      id: event.id,
      name 
    }
  })

  // return <SelectInput source="training_instructor" choices={options} />
  return <AutocompleteInput source={source} choices={options} />
}