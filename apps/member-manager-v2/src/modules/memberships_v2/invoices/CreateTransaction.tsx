import React from 'react'
import { CreateBase, Title, SimpleForm } from 'react-admin'
import { Card } from '@mui/material'
import InvoiceForm from './components/InvoiceForm'

const CreateTransaction = () => {
  return (
    <CreateBase hasShow={false} redirect={() => 'membership-management'}>
      
      <Title title='Create Invoice Item' />
      <Card>
      <SimpleForm sx={{ p: 0 }}>
        <InvoiceForm />
        </SimpleForm>
      </Card>
    </CreateBase>
  )
}

export default CreateTransaction