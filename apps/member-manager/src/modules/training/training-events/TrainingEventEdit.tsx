import React from 'react'
import Event from './components/Event'
import { EventPipelineStepper } from '../_components/EventPipeline'

/**
 * Body of the `training.eventEdit` page. The framework wraps it in `EditBase`
 * and renders the pipeline heading bar (title, next step, Show, ⋮, Back).
 */
const TrainingEventEdit = () => (
  <>
    <EventPipelineStepper />
    <Event context="edit" />
  </>
)

export default TrainingEventEdit
