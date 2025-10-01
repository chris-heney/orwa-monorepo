import React from 'react'
import {
  List,
} from 'react-admin'
import InstructorListCardGird from './components/TrainingInstructorCardGrid'
import { useHumanResourcesContext } from '../HumanResourcesContext'

interface InstructorListProps {
  title?: string
}

const InstructorsList = ({title= 'Training Instructors'}: InstructorListProps) => {
  const { instructorFilters } = useHumanResourcesContext();
  
  return (
    <List 
      disableSyncWithLocation
      component='div' 
      resource='training-instructors'
      title={title} 
      actions={false}
      filter={instructorFilters || {}}
      filterDefaultValues={instructorFilters || {}}
      exporter={false}
      sx={{
        '& .RaList-noActions': {
          mt: '0',
        },
      }}>
      <InstructorListCardGird source='instructor'/>
    </List>

  )
}


export default InstructorsList