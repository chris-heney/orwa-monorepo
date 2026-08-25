import React from 'react'
import {
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  required
} from 'react-admin'
import CustomFormHeader from '../_components/CustomFormHeader'
import FileUploadField from '../_components/FileUploadField'
import { formResourceShellSx } from '../../css/formLayout'

const CorporateSponsorCreate = () => {
  return (
    <Create title="Create Corporate Sponsor" redirect="/corporate-sponsors" component="div" sx={formResourceShellSx}>
        <CustomFormHeader
            displayField="name"
            redirectTo="/corporate-sponsors"
        />
      <SimpleForm>
        <TextInput source="name" validate={required()} fullWidth />
        <BooleanInput source="active" defaultChecked />
        <FileUploadField source="logo" label="Logo" />
      </SimpleForm>
    </Create>
  )
}

export default CorporateSponsorCreate 