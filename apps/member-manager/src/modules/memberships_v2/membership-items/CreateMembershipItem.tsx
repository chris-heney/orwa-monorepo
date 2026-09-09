import React from 'react'
import { Create } from 'react-admin'
import MembershipItemsForm from './components/MembershipItemsForm'
import MembershipsContextProvider from '../MembershipsContextProvider'
import { formResourceShellSx } from '../../../css/formLayout'

const CreateMembershipItem = () => {
  return (
    <MembershipsContextProvider>
      <Create
        title="Create Membership Item"
        redirect={() => 'membership-management'}
        component="div"
        sx={formResourceShellSx}
      >
        <MembershipItemsForm />
      </Create>
    </MembershipsContextProvider>
  )
}

export default CreateMembershipItem
