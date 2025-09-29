import React from 'react'
import { Create } from 'react-admin'
import MembershipItemsForm from './components/MembershipItemsForm'
import MembershipsContextProvider from '../MembershipsContextProvider'

const CreateMembershipItem = () => {
  return (
    <MembershipsContextProvider>
      <Create title="Create Membership Item" redirect={() => 'membership-management'}>
        <MembershipItemsForm />
      </Create>
    </MembershipsContextProvider>
  )
}

export default CreateMembershipItem