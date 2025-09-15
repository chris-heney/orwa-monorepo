import { Create, SimpleForm, useCreate, useNotify } from 'react-admin'
import GrantApplicationFormFields from './components/ApplicationFormFields'
import React from 'react'
import CustomSecondaryHeader from '../../_components/CustomSecondaryHeader'
import { Button } from '@mui/material'
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
    <Create sx={{mt: -2}} resource='grant-application-finals' title='Grant Application' redirect={false}>
      <CustomSecondaryHeader sx={{p: 0}} title='New Grant Application Form' />
      <Button onClick={() => isCreating ? setIsCreating(false) : setIsCreating(true)}>Cancel</Button>
      <SimpleForm onSubmit={createApplication}>
        <GrantApplicationFormFields />
      </SimpleForm>
    </Create>
     
  )
}

export default GrantApplicationCreateForm
