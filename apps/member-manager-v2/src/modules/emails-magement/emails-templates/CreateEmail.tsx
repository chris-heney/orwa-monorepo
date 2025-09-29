import { Box, Button, Card } from '@mui/material'
import React from 'react'
import { CreateBase, SimpleForm, Title, useCreate, useNotify, useRedirect } from 'react-admin'
import { FieldValues } from 'react-hook-form'
import EmailFormFields from './EmailFormFields'
import CustomFormHeader from '../../_components/CustomFormHeader'

interface CreateEmailProps {
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
  isCreating: boolean
  module: string
}
const CreateEmail = ({isCreating, setIsCreating, module}: CreateEmailProps) => {
  const [create] = useCreate()
  const notify = useNotify()
  const redirect = useRedirect()
  const createEmail = (data: FieldValues) => {
    create('email-templates', { data })
    notify('Email Template Was Created', { type: 'success' })
    setIsCreating(false)
    redirect('/email-management')
  }
  return (
      <CreateBase redirect={false} resource='email-templates'>
        <Title title="Email Management" />  
        <Card sx={{ p: 0, my: 2, mx: 1 }}>
        <CustomFormHeader displayField="email_name" redirectTo="/email-management" hasShow={false} />

        <SimpleForm onSubmit={createEmail}>
          <EmailFormFields module={module}/>
        </SimpleForm>
        </Card>
      </CreateBase>
  )
}

export default CreateEmail
