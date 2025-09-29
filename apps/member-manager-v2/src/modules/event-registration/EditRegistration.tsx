import React from 'react'
import { Edit, } from 'react-admin'
import ClassRegistrationForm from './EventRegistrationForm'
const EditRegistration = () => {
  return (
    <Edit redirect='list' title='Edit Event Register'>
      <ClassRegistrationForm/>
    </Edit>
  )
}

export default EditRegistration
