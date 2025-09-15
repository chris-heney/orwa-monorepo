import React from 'react';
import Form from './components/InstructorFormFields';
import CreateRecordForm from '../../_components/CreateRecordForm';

const TrainerCreateForm = () => {
  return (
    <CreateRecordForm redirectPath='/human-resources/dashboard'>
      <Form/> 
    </CreateRecordForm>
  );
}

export default TrainerCreateForm;