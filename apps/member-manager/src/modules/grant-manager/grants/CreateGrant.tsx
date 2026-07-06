import { Create } from 'react-admin'
import GrantForm from './components/GrantForm'
import React from 'react'
const GrantCreateForm = () => {

  return (
    <Create title=' '  redirect='list'>
      <GrantForm />
    </Create>
  )
}


export default GrantCreateForm