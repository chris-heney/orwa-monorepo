import React from 'react'
import Event from './components/Event'
import { EventPipelineStepper } from '../_components/EventPipeline'

/**
 * Body of the `training.eventShow` page. The framework wraps it in `ShowBase`
 * and renders the pipeline heading bar (title, next step, Edit, ⋮, Back);
 * the stage stepper sits first so it lands flush under that bar.
 */
const TrainingEventShow = () => (
  <>
    <EventPipelineStepper />
    <Event context="show" />
  </>
)

export default TrainingEventShow
