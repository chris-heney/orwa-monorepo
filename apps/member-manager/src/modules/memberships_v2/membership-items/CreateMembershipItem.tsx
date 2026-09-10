import React from 'react'
import { Create } from 'react-admin'
import MembershipItemsForm from './components/MembershipItemsForm'
import { formResourceShellSx } from '../../../css/formLayout'

const CreateMembershipItem = () => {
  return (
    <Create
      title="Create Membership Item"
      redirect={() => 'membership-management'}
      component="div"
      sx={formResourceShellSx}
    >
      <MembershipItemsForm />
    </Create>
  )
}

export default CreateMembershipItem
