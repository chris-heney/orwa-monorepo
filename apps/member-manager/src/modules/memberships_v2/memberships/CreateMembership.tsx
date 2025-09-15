import React from 'react'
import { Create } from 'react-admin'
import MembershipsContextProvider from '../MembershipsContextProvider'
import MembershipForm from './components/MembershipForm'

const CreateMembership = () => {
  return (
    <MembershipsContextProvider>
      <Create title="Memberships"  redirect={() => 'membership-management'} >
        <MembershipForm />
      </Create>
    </MembershipsContextProvider>
  )
}

export default CreateMembership