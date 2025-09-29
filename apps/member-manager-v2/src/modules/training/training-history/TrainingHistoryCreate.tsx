import { Create } from 'react-admin'
import React from 'react'
import TrainingHistoryForm from './components/TrainingHistoryForm'
const TrainingHistoryCreateForm = () => {
  return (
    <Create title="Training History"  redirect='list' >
      <TrainingHistoryForm />
    </Create>
  )
}

export default TrainingHistoryCreateForm
