import React from 'react'
import { Create } from 'react-admin'
import Event from './components/Event'
import EventPipelineHeader from '../_components/EventPipelineHeader'
import { formResourceShellSx } from '../../../css/formLayout'

const TrainingEventCreate = () => (
  <Create title="Training Events" component="div" sx={formResourceShellSx}>
    <EventPipelineHeader context="create" />
    <Event context="create" />
  </Create>
)

export default TrainingEventCreate
