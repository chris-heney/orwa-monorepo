import React from 'react'
import {
  Create,
} from 'react-admin'
import Event from './components/Event'
import EventHeader from './components/EventHeader'


const TrainingEventEdit = () => {
  
  return (
    <Create title={'Training Events'} >
      <EventHeader context='create' title={'New Event'}/>
      <Event context="create" />
    </Create >
  )
}

export default TrainingEventEdit