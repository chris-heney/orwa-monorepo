
import { Edit } from 'react-admin'
import React from 'react'
import TrainingHistoryForm from './components/TrainingHistoryForm'
const TrainingHistoryEditForm = () => {

  return (
    <Edit title="Training History"  redirect='list'>
      <TrainingHistoryForm />
    </Edit>
  )
}


export default TrainingHistoryEditForm
