import React from 'react'
import GrantDashboard from './GrantDashboard'
import GrantContextProvider from './GrantContextProvider'

const GrantManagement = () => {
  return (
    <GrantContextProvider>
      <GrantDashboard/>
    </GrantContextProvider>
  )
}

export default GrantManagement
