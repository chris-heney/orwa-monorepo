import { Edit } from 'react-admin'
import SessionForm from './components/TopicsForm'
import React from 'react'
const SessionEditForm = () => {

  return (
    <Edit title='Training Topics'  redirect='list'>
      <SessionForm />
    </Edit>
  )
}


export default SessionEditForm