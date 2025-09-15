import React from 'react'
import { SimpleForm } from 'react-admin'
import AssociateFields from './AssociateFields'
import { Card } from '@mui/material'
import CustomEditHeader from '../../../_components/CustomFormHeader'
import CustomToolBar from '../../../_components/CustomToolbar'


const AssociateForm = () => {

  return (
    <SimpleForm toolbar={<CustomToolBar redirect='/membership-management'/>} sx={{ p: 0 }}>
      <CustomEditHeader/>
      <Card sx={{
        borderRadius: 0
      }}>
        <AssociateFields />
      </Card>
    </SimpleForm>
  )
}

export default AssociateForm
