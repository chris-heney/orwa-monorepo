import React from 'react'
// import ActionButtons from './EventAction'
import { SimpleForm } from 'react-admin'
import TrainingEventFormFields from './EventFormFields'
import { EventCreateValidate, EventEditValidate } from '../TrainingEventValidate'


interface PanelEventDetailsModifyProps {
  context: 'edit' | 'create'
  eventLength?: number
}

const EventPanelDetailsModify = ({ context }: PanelEventDetailsModifyProps) => {
  return (
    <>      
      <SimpleForm
        warnWhenUnsavedChanges
        sanitizeEmptyValues
        shouldUnregister
        validate={context === 'edit' ? EventEditValidate : EventCreateValidate}
        sx={{ bgcolor: 'background.default' }}
      >
        <TrainingEventFormFields  />
      </SimpleForm>
    </>
  )
}

export default EventPanelDetailsModify