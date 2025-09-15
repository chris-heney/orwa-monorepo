import {Edit} from 'react-admin'
import AssetForm from './components/AssetForm'
import React from 'react'


const AssetCreateForm = () => {


  return (
    <Edit title={'Assets'}  redirect="list" component="div">
      <AssetForm/>
    </Edit>
  )
}

export default AssetCreateForm
