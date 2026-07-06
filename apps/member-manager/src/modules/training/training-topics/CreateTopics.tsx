import { Create } from 'react-admin'
import SessionForm from './components/TopicsForm'
import React from 'react'
const SessionCreateForm = () => {

  return (
    <Create title='Traning Topics'  redirect='list'>
      <SessionForm />
    </Create>
  )
}


export default SessionCreateForm