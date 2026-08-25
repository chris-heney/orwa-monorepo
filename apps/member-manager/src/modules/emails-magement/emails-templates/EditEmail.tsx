import React from 'react'
import { Edit, EditBase, Identifier, SimpleForm, Title } from 'react-admin'
  import EmailFormFields from './EmailFormFields';
import CustomFormHeader from '../../_components/CustomFormHeader';
import CustomToolBar from '../../_components/CustomToolbar';
import { Card } from '@mui/material';

interface EmailInterfaceProps {
  id: Identifier;
  module: string; 
}

const EditEmail = ({ id, module}: EmailInterfaceProps) => {
  // to, cc, bcc, subject, body, module
  return (
    <EditBase redirect={false} title={' '} id={id}>
      <Title title="Email Management" />  
      <Card sx={{ p: 0, m: 0, borderRadius: 0, boxShadow: 'none' }}>
        <CustomFormHeader displayField="email_name" redirectTo="/email-management" hasShow={false} />
        <SimpleForm toolbar={<CustomToolBar/>}>
          <EmailFormFields module={module}/>
        </SimpleForm>
      </Card>
    </EditBase>
  )
}

export default EditEmail
