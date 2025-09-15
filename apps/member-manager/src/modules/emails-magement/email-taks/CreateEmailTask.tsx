import {Box, Button, Card, Grid} from "@mui/material"
import React from 'react'
import { CreateBase, Title, SimpleForm, useCreate, useNotify, useRedirect } from 'react-admin'
import { FieldValues } from 'react-hook-form'
import ScheduledEmailTaskFormFields from './EmailTaskFormFields'
import CustomFormHeader from '../../_components/CustomFormHeader'
import FormConnectedRecipientList from './components/FormConnectedRecipientList'

interface CreateEmailProps {
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
  isCreating: boolean
}
const CreateEmailTask = ({isCreating, setIsCreating}: CreateEmailProps) => {
  const [create] = useCreate()
  const notify = useNotify()
  const redirect = useRedirect()
  const createEmail = (data: FieldValues) => {
    create('scheduled-email-tasks', { data })
    notify('Email Template Was Created', { type: 'success' })
    setIsCreating(false)
    redirect('/email-management')
  }
  return (
    <CreateBase redirect={false} resource='scheduled-email-tasks'>
      <Title title="Email Management" />
      <Card sx={{ p: 0, my: 2, mx: 1 }}>
        <CustomFormHeader displayField="name" redirectTo="/email-management" hasShow={false} />
        <SimpleForm onSubmit={createEmail}>
          <Grid container spacing={2}>
            <Grid xs={12} md={8}>
              <ScheduledEmailTaskFormFields/>
            </Grid>
            <Grid xs={12} md={4}>
              <FormConnectedRecipientList maxHeight={600} />
            </Grid>
          </Grid>
        </SimpleForm>
      </Card>
    </CreateBase>
  )
}

export default CreateEmailTask
