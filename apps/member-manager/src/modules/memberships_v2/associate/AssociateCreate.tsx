import { Create } from 'react-admin'
import AssociateForm from './components/AssociateForm'
import React from 'react'
import MembershipsContextProvider from '../MembershipsContextProvider'
import { formResourceShellSx } from '../../../css/formLayout'

const CreateAssociateForm = () => {
  return (
    <MembershipsContextProvider>
      <Create
        title="Memberships"
        redirect={() => 'membership-management'}
        component="div"
        sx={formResourceShellSx}
      >
        <AssociateForm />
      </Create>
    </MembershipsContextProvider>
  )
}
export default CreateAssociateForm
