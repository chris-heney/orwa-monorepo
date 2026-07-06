import React from 'react'
import {
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  required
} from 'react-admin'
import CustomFormHeader from '../_components/CustomFormHeader'
import FileUploadField from '../_components/FileUploadField'
import { Grid } from '@mui/material'

const CorporateSponsorEdit = () => {
  return (
    <Edit title={"Edit Corporate Sponsor"}>
        <CustomFormHeader
            displayField="name"
            redirectTo="/corporate-sponsors"
            hasShow={false}
        />
      <SimpleForm>
            <TextInput source="name" validate={required()} fullWidth />
            <BooleanInput source="active" />
            <FileUploadField fullWidth source="logo" label="Logo" />
      </SimpleForm>
    </Edit>
  )
}

export default CorporateSponsorEdit 