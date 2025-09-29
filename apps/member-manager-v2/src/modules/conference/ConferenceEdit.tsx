import React from 'react'
import { Edit, SimpleForm, useListContext } from 'react-admin'
import ConferenceForm from './components/ConferenceForm'
import CustomToolBar from '../_components/CustomToolbar'

const ConferenceEdit = () => {

  const { filterValues } = useListContext();

  return (
    <Edit
      title={''}
      resource="conferences"
      id={filterValues?.conference ?? 1}
      actions={false}
      redirect={false}
    >
      <SimpleForm
        toolbar={<CustomToolBar />}
        warnWhenUnsavedChanges
        sanitizeEmptyValues
        sx={{  m: 0, p: 0 }}    
      >
        <ConferenceForm />
      </SimpleForm>
    </Edit>
  )
}

export default ConferenceEdit
