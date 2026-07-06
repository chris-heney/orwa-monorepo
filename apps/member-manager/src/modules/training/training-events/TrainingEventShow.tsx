import React from 'react'
import {
  Show,
  useShowController,
} from 'react-admin'
import Event from './components/Event'
import EventHeader from './components/EventHeader'
import { Theme, useMediaQuery } from '@mui/material'


const TrainingEventShow = () => {

  const { record } = useShowController()
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'))
  const isMedium = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'))
  
  if (typeof record === 'undefined' || !record) return null

  const title = (isSmall || isMedium) ? record.training_type : (record.training_type + ' | DEQ Number  :  ' + (record.deq_class_number != null ? record.deq_class_number : 'NONE'))
  
  return (
    <Show title={'Training Events'} >
      <EventHeader context='show' title={title}/>
      <Event context="show" />
    </Show >
  )
}

export default TrainingEventShow
