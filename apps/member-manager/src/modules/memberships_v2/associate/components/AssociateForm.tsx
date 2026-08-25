import React from 'react'
import { SimpleForm } from 'react-admin'
import AssociateFields from './AssociateFields'
import CustomEditHeader from '../../../_components/CustomFormHeader'
import CustomToolBar from '../../../_components/CustomToolbar'


const AssociateForm = () => {

  return (
    <SimpleForm toolbar={<CustomToolBar redirect='/membership-management'/>} sx={{ p: 0, m: 0 }}>
      <CustomEditHeader/>
      <AssociateFields />
    </SimpleForm>
  )
}

export default AssociateForm
