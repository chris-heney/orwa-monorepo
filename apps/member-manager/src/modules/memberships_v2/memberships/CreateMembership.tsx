import React from 'react'
import { Create } from 'react-admin'
import MembershipForm from './components/MembershipForm'
import { formResourceShellSx } from '../../../css/formLayout'

const CreateMembership = () => {
  return (
    <Create title="Memberships" redirect={() => 'membership-management'} component="div" sx={formResourceShellSx}>
      <MembershipForm />
    </Create>
  )
}

export default CreateMembership
