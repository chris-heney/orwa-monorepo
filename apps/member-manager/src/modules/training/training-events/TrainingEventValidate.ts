import { ITrainingEvent } from '../_types'

export const EventEditValidate  = (values: ITrainingEvent): { [key: string]: string } => {
  const errors: { [key: string]: string } = {}

  if (!values.instructor) {
    errors.instructor = 'Instructor is required'
  }

  if (!values.training_type) {
    errors.training_type = 'Training Type is required'
  }
  
  if (values.training_type && values.training_type.startsWith('Class') && !values.location) {
    errors.location = 'Location Code is required'
  }

  if (!values.start) {
    errors.start = 'Start Date is required'
  }
  if (!values.end) {
    errors.end = 'End Date is required'
  }
  if (!values.audience) {
    errors.audience = 'Audience type is required'
  }
  if (!values.program_billed) {
    errors.program_billed = 'Program name is required'
  }
  if (!values.address?.city) {
    errors['address.city'] = 'City is required'
  }
  if (!values.address?.state) {
    errors['address.state'] = 'State is required'
  }
  if (!values.address?.street) {
    errors['address.street'] = 'Street is required'
  }
  if (!values.address?.zip) {
    errors['address.zip'] = 'Zip is required'
  }
  return errors
}

export const EventCreateValidate = (values: ITrainingEvent): { [key: string]: string } => {
  const errors: { [key: string]: string } = {}

  if (!values.instructor) {
    errors.instructor = 'Instructor is required'
  }

  if (!values.training_type) {
    errors.training_type = 'Training Type is required'
  }
  
  if (values.training_type && values.training_type.startsWith('Class') && !values.location) {
    errors.location = 'Location is required'
  }

  if (!values.start) {
    errors.start = 'Start Date is required'
  }
  if (!values.end) {
    errors.end = 'End Date is required'
  }
  if (!values.audience) {
    errors.audience = 'Audience type is required'
  }
  if (!values.program_billed) {
    errors.program_billed = 'Program name is required'
  }
  if (!values.address?.city) {
    errors['address.city'] = 'City is required'
  }
  if (!values.address?.state) {
    errors['address.state'] = 'State is required'
  }
  if (!values.address?.street) {
    errors['address.street'] = 'Street is required'
  }
  if (!values.address?.zip) {
    errors['address.zip'] = 'Zip is required'
  }
  return errors
}