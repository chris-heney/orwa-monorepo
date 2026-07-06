import React from 'react'
import { AutocompleteInput, useGetList } from 'react-admin'
import { YearMonthDay } from '../../../helpers/Data'
interface TrainingSessionAutocompleteInputProps {
    source: string
  }

export const TrainingSessionAutocompleteInput: React.FC<TrainingSessionAutocompleteInputProps> = ({ source }) => {

  // const { data, isLoading, error, refetch } =  useGetMany('training-instructors')
  const { data, isLoading, error } = useGetList('training-sessions', {
    meta: {
      raw: true,
      populate: true
    },
    pagination :{ page: 1, perPage: 1000},
  })

  if (isLoading) return <>Loading...</>
  if (error) return <>Error</>
  if (typeof data === 'undefined') return <>No Data</>
  const options = data?.map( (session) => {
    const fromattedCreatedAt = new Date(session.createdAt)
    const name = session?.id
        + ' '
        + session?.category
        + ' '
        + fromattedCreatedAt.toLocaleString('en-US', YearMonthDay)
        
    return {
      id: session.id,
      name 
    }
  })

  // return <SelectInput source="training_instructor" choices={options} />
  return <AutocompleteInput source={source} choices={options} />
}