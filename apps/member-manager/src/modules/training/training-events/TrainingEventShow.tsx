import React from 'react'
import { Show } from 'react-admin'
import Event from './components/Event'
import EventPipelineHeader from '../_components/EventPipelineHeader'

const TrainingEventShow = () => (
  <Show
    title="Training Events"
    sx={{
      '& .RaShow-card': {
        bgcolor: 'background.paper',
        color: 'text.primary',
      },
    }}
  >
    <EventPipelineHeader context="show" />
    <Event context="show" />
  </Show>
)

export default TrainingEventShow
