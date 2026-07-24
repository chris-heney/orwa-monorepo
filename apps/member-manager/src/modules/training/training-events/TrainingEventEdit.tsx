import React from 'react'
import { Edit } from 'react-admin'
import Event from './components/Event'
import EventPipelineHeader from '../_components/EventPipelineHeader'

const TrainingEventEdit = () => (
  <Edit
    title="Training Events"
    sx={{
      '& .RaEdit-card': {
        bgcolor: 'background.paper',
        color: 'text.primary',
      },
    }}
  >
    <EventPipelineHeader context="edit" />
    <Event context="edit" />
  </Edit>
)

export default TrainingEventEdit
