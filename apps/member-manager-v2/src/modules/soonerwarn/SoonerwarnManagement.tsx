import React from 'react'
import SoonerwarnDashboard from './SoonerwarnDashboard'
import SoonerwarnContextProvider from './SoonerwarnContextProvider'

const SoonerwarnManagement = () => {
  return (
    <SoonerwarnContextProvider>
        <SoonerwarnDashboard/>
    </SoonerwarnContextProvider>
  )
}

export default SoonerwarnManagement
