import React from 'react'
import { CreateBase } from 'react-admin'
import Event from './components/Event'

/**
 * Body of the `training.eventCreate` page (heading bar = framework TitleBar
 * with Back far right). `CreateBase` supplies the save context for the form.
 */
const TrainingEventCreate = () => (
  <CreateBase redirect="edit">
    <Event context="create" />
  </CreateBase>
)

export default TrainingEventCreate
