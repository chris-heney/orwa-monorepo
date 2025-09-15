import { Create } from 'react-admin'
import AssociateForm from './components/AssociateForm'
import React from'react'
import MembershipsContextProvider from '../MembershipsContextProvider'
const CreateAssociateForm = () => {
  return (
    <MembershipsContextProvider>
      <Create title='Memberships' redirect={() => 'membership-management'} component='div'>
        <AssociateForm />
      </Create>
    </MembershipsContextProvider>
  )
}
export default CreateAssociateForm
