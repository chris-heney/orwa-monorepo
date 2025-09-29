import {  TextField } from '@mui/material'
import React from 'react'
import { Form } from 'react-admin'


interface EventModalEmailDeqFormProps {
    handleSendToDeq: () => void
    toValue: string, 
    setToValue:  React.Dispatch<React.SetStateAction<string>>,
    subjectValue: string, 
    loading: boolean, 
    setSubjectValue:  React.Dispatch<React.SetStateAction<string>>
}

const EventModalEmailDeqForm = ({
  handleSendToDeq,
  toValue, 
  setToValue,
  subjectValue, 
  setSubjectValue,
}:EventModalEmailDeqFormProps ) => {

  return (
    <>
      <Form onSubmit={handleSendToDeq}>
        <TextField
          sx={{ marginTop: 3 }}
          label="To"
          placeholder="e.g. youremail@gmail.com"
          fullWidth
          value={toValue}
          onChange={(e) => setToValue(e.target.value)}
        />
        <TextField
          label="Subject"
          placeholder="Marcos | Class A Water "
          fullWidth
          value={subjectValue}
          onChange={(e) => setSubjectValue(e.target.value)}
        />
      </Form>
    </>
  )
}


export default EventModalEmailDeqForm
