import { Edit, SimpleForm } from 'react-admin'
import GrantForm from './components/GrantForm'
import React from 'react'
import CustomHeader from '../../_components/CustomHeader'
const EditGrantForm = () => {

  return (
    <Edit title='Edit Grant' redirect='list'>
      <CustomHeader title='Grant Form' />
      <SimpleForm>
        <GrantForm />
      </SimpleForm>
    </Edit>
  )
}


export default EditGrantForm