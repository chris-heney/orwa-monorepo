import React from 'react'
import { Create, } from 'react-admin'
import ClassRegistrationForm from './EventRegistrationForm'
const CreateRegister = () => {
  return (
    <Create redirect='list' title='Register For Event'>
      <ClassRegistrationForm/>
    </Create>
  )
}

export default CreateRegister
