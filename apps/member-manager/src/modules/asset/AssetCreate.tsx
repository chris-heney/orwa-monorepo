import {Create} from 'react-admin'
import AssetForm from './components/AssetForm'
import React from 'react'
import { formResourceShellSx } from '../../css/formLayout'
const AssetCreateForm = () => {
  return (
    <Create title={'Assets'} redirect='list' component="div" sx={formResourceShellSx}>
      <AssetForm/>
    </Create>
  )
}

export default AssetCreateForm
