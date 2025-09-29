import React from 'react'
import { AutocompleteInput, useGetList } from 'react-admin'
import { YearMonthDay } from '../../../helpers/Data'
interface TrainingBlockAutocompleteInputProps {
    source: string
  }

export const TrainingBlockAutocompleteInput: React.FC<TrainingBlockAutocompleteInputProps> = ({ source }) => {

  // const { data, isLoading, error, refetch } =  useGetMany('training-instructors')
  const { data, isLoading, error } = useGetList('training-schedule-blocks', {
    meta: {
      raw: true
    },
    pagination :{ page: 1, perPage: 1000},
  })

  if (isLoading) return <>Loading...</>
  if (error) return <>Error</>
  if (typeof data === 'undefined') return <>No Data</>
  const options = data?.map( (block) => {
    const fromattedCreatedAt = new Date(block.createdAt)
    const name = block?.id
        + ' '
        + block?.am_pm
        + ' Created:  '
        + fromattedCreatedAt.toLocaleString('en-US', YearMonthDay)
        
    return {
      id: block.id,
      name 
    }
  })

  // return <SelectInput source="training_instructor" choices={options} />
  return <AutocompleteInput source={source} choices={options} />
}