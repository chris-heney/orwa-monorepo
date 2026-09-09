import { Create, SimpleForm, useCreate, useNotify } from 'react-admin'
import GrantApplicationFormFields from './components/ApplicationFormFields'
import React from 'react'
import PageHeadingBar from '../../_components/PageHeadingBar'
import { FieldValues } from 'react-hook-form'
import { useGrantContext } from '../GrantContextProvider'

interface GrantApplicationCreateFormProps {
  isCreating: boolean
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
}
const GrantApplicationCreateForm = ({isCreating, setIsCreating} : GrantApplicationCreateFormProps) => {

  const [create] = useCreate()
  const notify = useNotify()
  const {
    grants,
    grantIndex
  } = useGrantContext()  
  
  const createApplication = (data: FieldValues) => {
    try {
      create('grant-application-finals', { data: data })  
      notify(`Grant Application was Submitted For ${grants[grantIndex].name}`, { type: 'success' })
      setIsCreating(false)
    } catch (error) {
      console.error('Error Submitting Grant Application', error)
      notify('Error Submitting Grant Application', { type: 'error' })
    }
  }


  return (
    <Create resource='grant-application-finals' title='Grant Application' redirect={false}>
      {/* Back (right-most) cancels the inline create and returns to the list. */}
      <PageHeadingBar
        title='New Grant Application Form'
        onBack={() => setIsCreating(!isCreating)}
        backLabel='Cancel'
      />
      <SimpleForm onSubmit={createApplication}>
        <GrantApplicationFormFields />
      </SimpleForm>
    </Create>
     
  )
}

export default GrantApplicationCreateForm
