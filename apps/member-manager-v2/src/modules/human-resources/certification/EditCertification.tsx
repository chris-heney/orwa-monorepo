import React from 'react'
import { Edit } from 'react-admin'
import EditInstructorCertificationForm from './components/EditIntructorCertificationForm'

const EditCertification = () => {
  return (
    <Edit title="Instructors" redirect="edit" sx={{'& .css-1fd8x6x-MuiCardContent-root-RaSimpleForm-root' : {
      padding: 0
    }}}> 
      <EditInstructorCertificationForm/>
    </Edit>
  )
}

export default EditCertification
