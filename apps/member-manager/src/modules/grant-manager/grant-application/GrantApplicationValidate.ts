import { IGrantApplication } from './GrantApplicationTypes'

export default (values: IGrantApplication): { [key: string]: string } => {
  const errors: { [key: string]: string } = {}

  if (!values.signature) {
    errors.signature = 'Applicant Signature is required'
  }

  if (!values.grant) {
    errors.grant = 'Grant Applied or is Required'
  }
  if (!values.point_of_contact) {
    errors.point_of_contact = 'Point of Contact is Required'
  }
  if (!values.signatory) {
    errors.signatory = 'Signatory is Required'
  }
  if (!values.system) {
    errors.system = 'System is Required'
  }
  if (!values.project_description) {
    errors.project_description = 'A Project Description is Required'
  }
  if (!values.project_justification) {
    errors.project_justification = 'A Project Justification is Required'
  }


  return errors
} 
