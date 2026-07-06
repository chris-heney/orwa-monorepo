import React from 'react'
import { AutocompleteInput, Identifier, useGetList } from 'react-admin'

interface TrainingInstructorAutocompleteInputProps {
  source: string
  filter?: string
  disabled?: boolean
  defaultValue?: Identifier
}

export const TrainingInstructorAutocompleteInput: React.FC<TrainingInstructorAutocompleteInputProps> = ({ source, filter, disabled, defaultValue }) => {
  const { data, isLoading, error } = useGetList('training-instructors', {
    meta: {
      populate: true,
      raw: true
    },
    sort: { field: 'instructor.first', order: 'ASC' },
    pagination: { page: 1, perPage: 1000 },
  })

  if (isLoading) return <>Loading...</>
  if (error) return <>Error</>
  if (typeof data === 'undefined') return <>No Data</>

  const filteredInstructors = data.filter((instructor) => {
    if (!filter) {
      
      return true
    }

    switch (filter) {
    case 'Class A Water':
      return !instructor.training_instructor_certification ? false
        : instructor?.training_instructor_certification.water_certification === 'Class A Water'
    case 'Class B Water':
      return !instructor.training_instructor_certification ? false
        : instructor?.training_instructor_certification.water_certification === 'Class A Water' ||
          instructor?.training_instructor_certification.water_certification === 'Class B Water'
    case 'Class C Water':
      return !instructor.training_instructor_certification ? false
        : instructor?.training_instructor_certification.water_certification === 'Class A Water' ||
          instructor?.training_instructor_certification.water_certification === 'Class B Water' ||
          instructor?.training_instructor_certification.water_certification === 'Class C Water'
    case 'Class D Water':
      return !instructor.training_instructor_certification ? false
        : instructor?.training_instructor_certification.water_certification === 'Class A Water' ||
          instructor?.training_instructor_certification.water_certification === 'Class B Water' ||
          instructor?.training_instructor_certification.water_certification === 'Class C Water' ||
          instructor?.training_instructor_certification.water_certification === 'Class D Water'
    case 'Class A Wastewater':
      return !instructor.training_instructor_certification ? false
        : instructor?.training_instructor_certification.waste_water_certification === 'Class A Wastewater'
    case 'Class B Wastewater':
      return !instructor.training_instructor_certification ? false
        : instructor?.training_instructor_certification.waste_water_certification === 'Class A Wastewater' ||
          instructor?.training_instructor_certification.waste_water_certification === 'Class B Wastewater'
    case 'Class C Wastewater':
      return !instructor.training_instructor_certification ? false
        : instructor?.training_instructor_certification.waste_water_certification === 'Class A Wastewater' ||
          instructor?.training_instructor_certification.waste_water_certification === 'Class B Wastewater' ||
          instructor?.training_instructor_certification.waste_water_certification === 'Class C Wastewater'
    case 'Class D Wastewater':
      return !instructor.training_instructor_certification ? false
        : instructor?.training_instructor_certification.waste_water_certification === 'Class A Wastewater' ||
          instructor?.training_instructor_certification.waste_water_certification === 'Class B Wastewater' ||
          instructor?.training_instructor_certification.waste_water_certification === 'Class C Wastewater' ||
          instructor?.training_instructor_certification.waste_water_certification === 'Class D Wastewater'
    case 'Class A Water Lab':
      return !instructor.training_instructor_certification ? false : instructor?.training_instructor_certification.water_lab_certification === 'Class A Water Lab'
    case 'Class B Water Lab':
      return !instructor.training_instructor_certification ? false : instructor?.training_instructor_certification.water_lab_certification === 'Class A Water Lab' ||
          instructor?.training_instructor_certification.water_lab_certification === 'Class B Water Lab'
    case 'Class C Water Lab':
      return !instructor.training_instructor_certification ? false : instructor?.training_instructor_certification.water_lab_certification === 'Class A Water Lab' ||
          instructor?.training_instructor_certification.water_lab_certification === 'Class B Water Lab' ||
          instructor?.training_instructor_certification.water_lab_certification === 'Class C Water Lab'
    case 'Class A Wastewater Lab':
      return !instructor.training_instructor_certification ? false : instructor?.training_instructor_certification.waste_water_lab_certification === 'Class A Wastewater Lab'
    case 'Class B Wastewater Lab':
      return !instructor.training_instructor_certification ? false : instructor?.training_instructor_certification.waste_water_lab_certification === 'Class A Wastewater Lab' ||
          instructor?.training_instructor_certification.waste_water_lab_certification === 'Class B Wastewater Lab'
    case 'Class C Wastewater Lab':
      return !instructor.training_instructor_certification ? false : instructor?.training_instructor_certification.waste_water_lab_certification === 'Class A Wastewater Lab' ||
          instructor?.training_instructor_certification.waste_water_lab_certification === 'Class B Wastewater Lab' ||
          instructor?.training_instructor_certification.waste_water_lab_certification === 'Class C Wastewater Lab'
    default:
      return true
    }
  })

  const options = filteredInstructors?.map((instructor) => {
    const name = instructor?.instructor?.first + ' ' + instructor?.instructor?.last
    return {
      id: instructor.id,
      name
    }
  })

  return <AutocompleteInput defaultValue={defaultValue} disabled={disabled} helperText={false} source={source} choices={options} />
}
