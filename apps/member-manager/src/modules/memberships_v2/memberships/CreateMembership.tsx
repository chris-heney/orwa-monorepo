import React from 'react'
import { Create } from 'react-admin'
import MembershipsContextProvider from '../MembershipsContextProvider'
import MembershipForm from './components/MembershipForm'
import { formResourceShellSx } from '../../../css/formLayout'

const CreateMembership = () => {
  return (
    <MembershipsContextProvider>
      <Create title="Memberships" redirect={() => 'membership-management'} component="div" sx={formResourceShellSx}>
        <MembershipForm />
      </Create>
    </MembershipsContextProvider>
  )
}

export default CreateMembership