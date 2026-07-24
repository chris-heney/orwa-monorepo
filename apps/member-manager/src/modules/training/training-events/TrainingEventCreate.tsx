import React from 'react'
import { Create } from 'react-admin'
import Event from './components/Event'
import EventPipelineHeader from '../_components/EventPipelineHeader'

const TrainingEventCreate = () => (
  <Create title="Training Events">
    <EventPipelineHeader context="create" />
    <Event context="create" />
  </Create>
)

export default TrainingEventCreate
