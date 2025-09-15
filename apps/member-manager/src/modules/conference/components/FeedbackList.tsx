import React from 'react'
import {
  TextField,
  DatagridConfigurable,
} from 'react-admin'
import { customDatagridStyle } from '../../../css'
import CustomPagination from '../../_components/CustomPagination'

const FeedbackList = () => {

  return (
    <>  
      <DatagridConfigurable
        sx={customDatagridStyle}
        rowClick="false"
        bulkActionButtons={false}
      >
        <TextField source="name" label='Name' noWrap />
        <TextField source="email" label='Email' noWrap />
        <TextField source="feedback" label='Feedback' />
      </DatagridConfigurable>
      <CustomPagination />
    </>
  )
}

export default FeedbackList