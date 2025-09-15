import {Create} from 'react-admin'
import AssetForm from './components/AssetForm'
import React from 'react'
const AssetCreateForm = () => {
  return (
    <Create title={'Assets'} redirect='list' component="div">
      <AssetForm/>
    </Create>
  )
}

export default AssetCreateForm
